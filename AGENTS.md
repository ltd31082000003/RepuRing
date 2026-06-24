# RepuRing Agent Notes

## Required Local Runtime

RepuRing uses Windows + Go native Canopy for local development and demos.

- Build the node as canopy.exe.
- Run the chain with canopy.exe start.
- Use RPC port 50002 for queries and transactions.
- Use admin RPC port 50003 for keystore operations.
- Configure the Canopy data directory with plugin set to typescript.
- Let the native Canopy controller start the TypeScript plugin.

Do not propose Docker, Ubuntu, or WSL as the RepuRing chain runtime. Docker files inherited from the upstream Canopy template have been removed from the RepuRing run path and should not be reintroduced in setup instructions.

Use plugin/typescript/AGENTS.md as the technical reference for the plugin interface.

## Commands

~~~powershell
powershell -ExecutionPolicy Bypass -File .\scripts\windows-native\build.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\windows-native\start.ps1
~~~
