$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$canopyExe = Join-Path $repoRoot "canopy.exe"
$dataDir = Join-Path $env:USERPROFILE ".canopy"
$configPath = Join-Path $dataDir "config.json"

if (-not (Test-Path $canopyExe)) {
    throw "canopy.exe was not found. Run scripts\windows-native\build.ps1 first."
}

foreach ($port in @(50002, 50003)) {
    $listener = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($listener) {
        throw "Port $port is already in use by process $($listener.OwningProcess). Stop that process before starting Canopy."
    }

    $probe = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
    try {
        $probe.Start()
    } catch {
        throw "Windows cannot bind port $port. Check excluded TCP port ranges and release the reservation before starting Canopy. Details: $($_.Exception.Message)"
    } finally {
        $probe.Stop()
    }
}

if (-not (Test-Path $configPath)) {
    Write-Host "Initializing the Canopy data directory. Enter the requested validator key password and nickname."
    Push-Location $repoRoot
    try {
        & $canopyExe version
        if ($LASTEXITCODE -ne 0) {
            throw "Canopy data-directory initialization failed with exit code $LASTEXITCODE."
        }
    } finally {
        Pop-Location
    }
}

$config = Get-Content -Raw $configPath | ConvertFrom-Json
if ($config.PSObject.Properties.Name -contains "plugin") {
    $config.plugin = "typescript"
} else {
    $config | Add-Member -NotePropertyName plugin -NotePropertyValue "typescript"
}
$configJson = $config | ConvertTo-Json -Depth 20
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[IO.File]::WriteAllText($configPath, $configJson + [Environment]::NewLine, $utf8NoBom)

Write-Host "Starting native Canopy with the RepuRing TypeScript plugin"
Write-Host "Query/transaction RPC: http://localhost:50002"
Write-Host "Admin/keystore RPC:   http://localhost:50003"
Push-Location $repoRoot
try {
    & $canopyExe start
    exit $LASTEXITCODE
} finally {
    Pop-Location
}
