param(
  [string]$RpcUrl = $env:REPURING_QUERY_RPC,
  [string]$AdminRpcUrl = $env:REPURING_ADMIN_RPC
)

if (-not $RpcUrl) { $RpcUrl = "http://localhost:50002" }
if (-not $AdminRpcUrl) { $AdminRpcUrl = "http://localhost:50003" }

function Test-JsonPost {
  param([string]$Url, [string]$Body)
  try {
    Invoke-RestMethod -Method Post -Uri $Url -ContentType "application/json" -Body $Body | Out-Null
    return $true
  } catch {
    Write-Warning "$Url is not ready: $($_.Exception.Message)"
    return $false
  }
}

Write-Host "RepuRing demo preflight"
Write-Host "Query RPC: $RpcUrl"
Write-Host "Admin RPC: $AdminRpcUrl"

$heightOk = Test-JsonPost "$RpcUrl/v1/query/height" "{}"
if (-not $heightOk) {
  Write-Host "Start Canopy with the TypeScript plugin and expose port 50002 before recording the demo."
  exit 1
}

$env:REPURING_QUERY_RPC = $RpcUrl
$env:REPURING_ADMIN_RPC = $AdminRpcUrl

node "$PSScriptRoot/repuring-demo.mjs"
