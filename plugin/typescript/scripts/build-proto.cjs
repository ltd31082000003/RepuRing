const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");
const { EventEmitter } = require("events");
const { PassThrough } = require("stream");

const root = path.resolve(__dirname, "..");
const protoOut = path.join(root, "src", "proto", "index.js");
const protoDts = path.join(root, "src", "proto", "index.d.ts");
const protoCjs = path.join(root, "src", "proto", "index.cjs");

function runNode(script, args) {
  const result = childProcess.spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${path.basename(script)} failed with exit code ${result.status}`);
  }
}

function splitQuotedCommand(command) {
  const matches = command.match(/"[^"]*"|\S+/g) || [];
  return matches.map((part) => (part.startsWith('"') && part.endsWith('"') ? part.slice(1, -1) : part));
}

function runJsdocInProcess(jsdocPath, args, options) {
  const child = new EventEmitter();
  child.stdout = new PassThrough();
  child.stderr = new PassThrough();

  process.nextTick(() => {
    const previousArgv = process.argv;
    const previousCwd = process.cwd();
    const previousExit = process.exit;
    const previousStdoutWrite = process.stdout.write;
    const previousStderrWrite = process.stderr.write;
    let exitCode = 0;

    process.argv = [process.execPath, jsdocPath, ...args];
    if (options?.cwd) {
      process.chdir(options.cwd);
    }
    process.exit = (code = 0) => {
      exitCode = Number(code) || 0;
      throw Object.assign(new Error(`jsdoc exited with ${exitCode}`), { jsdocExit: true });
    };
    process.stdout.write = function patchedStdoutWrite(chunk, encoding, callback) {
      child.stdout.write(chunk, encoding, callback);
      return true;
    };
    process.stderr.write = function patchedStderrWrite(chunk, encoding, callback) {
      child.stderr.write(chunk, encoding, callback);
      return true;
    };

    try {
      delete require.cache[require.resolve(jsdocPath)];
      require(jsdocPath);
    } catch (error) {
      if (!error?.jsdocExit) {
        exitCode = 1;
        child.stderr.write(`${error.stack || error.message || error}\n`);
      }
    } finally {
      process.argv = previousArgv;
      if (process.cwd() !== previousCwd) {
        process.chdir(previousCwd);
      }
      process.exit = previousExit;
      process.stdout.write = previousStdoutWrite;
      process.stderr.write = previousStderrWrite;
      child.stdout.end();
      child.stderr.end();
      child.emit("close", exitCode);
    }
  });

  return child;
}

const originalExec = childProcess.exec;
childProcess.exec = function patchedExec(command, options, callback) {
  const parts = splitQuotedCommand(command);

  if (parts[0] === process.execPath && parts[1] && parts[1].endsWith(path.join("jsdoc", "jsdoc.js"))) {
    const child = runJsdocInProcess(parts[1], parts.slice(2), options);

    if (callback) {
      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (chunk) => {
        stdout += chunk;
      });
      child.stderr.on("data", (chunk) => {
        stderr += chunk;
      });
      child.on("close", (code) => {
        callback(code ? new Error(`code ${code}`) : null, stdout, stderr);
      });
    }

    return child;
  }

  return originalExec.call(childProcess, command, options, callback);
};

runNode(path.join(root, "node_modules", "protobufjs-cli", "bin", "pbjs"), [
  "-t",
  "static-module",
  "-w",
  "commonjs",
  "-o",
  protoOut,
  "proto/*.proto",
]);

const pbts = require("protobufjs-cli/pbts");
const code = pbts.main(["-o", protoDts, protoOut]);
if (code && code !== 0) {
  throw new Error(`pbts failed with exit code ${code}`);
}

fs.copyFileSync(protoOut, protoCjs);