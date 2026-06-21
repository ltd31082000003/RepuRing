$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$env:GOTELEMETRY = "off"

function Invoke-Checked {
    param(
        [Parameter(Mandatory = $true)][string]$Command,
        [Parameter(ValueFromRemainingArguments = $true)][string[]]$Arguments
    )

    & $Command @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "$Command failed with exit code $LASTEXITCODE."
    }
}

foreach ($command in @("go", "node", "npm")) {
    if (-not (Get-Command $command -ErrorAction SilentlyContinue)) {
        throw "Required command '$command' was not found in PATH."
    }
}

$nodeVersionText = (node --version).TrimStart("v")
$nodeVersion = [version]$nodeVersionText
$nodeSupported = (
    ($nodeVersion.Major -eq 20 -and $nodeVersion -ge [version]"20.19.0") -or
    ($nodeVersion.Major -ge 22 -and $nodeVersion -ge [version]"22.12.0")
)
if (-not $nodeSupported) {
    throw "Node.js $nodeVersionText is unsupported by the embedded Explorer build. Install Node.js 20.19+ or 22.12+ (Node 22 LTS recommended)."
}

Write-Host "[1/4] Building RepuRing TypeScript plugin"
Push-Location (Join-Path $repoRoot "plugin\typescript")
try {
    Invoke-Checked npm install
    Invoke-Checked npm run build:all
} finally {
    Pop-Location
}

Write-Host "[2/4] Building RepuRing wallet frontend"
Push-Location (Join-Path $repoRoot "cmd\rpc\web\wallet")
try {
    Invoke-Checked npm install
    Invoke-Checked npm run build
} finally {
    Pop-Location
}

Write-Host "[3/4] Building embedded Canopy explorer"
Push-Location (Join-Path $repoRoot "cmd\rpc\web\explorer")
try {
    Invoke-Checked npm install
    Invoke-Checked npm run build
} finally {
    Pop-Location
}

Write-Host "[4/4] Building native Canopy node"
Push-Location $repoRoot
try {
    Invoke-Checked go build -o .\canopy.exe .\cmd\main
} finally {
    Pop-Location
}

Write-Host "Native build complete: $repoRoot\canopy.exe"

