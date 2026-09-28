param(
  [Parameter(Mandatory=$true)][string]$SitePath,
  [Parameter(Mandatory=$true)][string]$HandoffPath,
  [Parameter(Mandatory=$true)][string]$ContactUrl,
  [Parameter(Mandatory=$true)][string]$AnalyticsProvider,
  [string]$BuildCommand = "",
  [string]$DeployCommand = ""
)
$ErrorActionPreference = "Stop"
if (!(Test-Path $SitePath)) { throw "SitePath not found." }
if (!(Test-Path $HandoffPath)) { throw "HandoffPath not found." }
if ([string]::IsNullOrWhiteSpace($ContactUrl)) { throw "Approved contact route required." }
if ([string]::IsNullOrWhiteSpace($AnalyticsProvider)) { throw "Analytics provider/config required." }
if ([string]::IsNullOrWhiteSpace($BuildCommand)) { throw "BuildCommand must be supplied for the target site." }
if ([string]::IsNullOrWhiteSpace($DeployCommand)) { throw "DeployCommand must be supplied for the target environment." }

Write-Host "1/6 Precheck"
& "$PSScriptRoot\VERIFY_WEB.ps1" -SitePath $SitePath -PublicDataPath (Join-Path $HandoffPath "web_data\WEB_READY_PRODUCTS.json") -ContactUrl $ContactUrl

Write-Host "2/6 Integration must be performed by Codex/site implementation using approved assets only."
Write-Host "3/6 Build"
Push-Location $SitePath
Invoke-Expression $BuildCommand
if ($LASTEXITCODE -ne 0) { throw "Build failed." }

Write-Host "4/6 Targeted/render QA required before deploy."
Write-Host "Verify required rows/cells, evidence links, Amazon links, contact, analytics page_view + amazon_click, canonical/meta/sitemap, and leakage."
throw "MANUAL/AGENT RENDER-QA GATE: remove this stop only after target-specific QA is implemented and passing."

# Deployment intentionally unreachable until render-QA gate is implemented.
Invoke-Expression $DeployCommand
Pop-Location
