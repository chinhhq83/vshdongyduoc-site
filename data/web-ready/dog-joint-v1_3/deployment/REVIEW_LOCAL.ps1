param(
  [Parameter(Mandatory=$true)][string]$SitePath,
  [Parameter(Mandatory=$true)][string]$HandoffPath
)
$ErrorActionPreference = "Stop"

function Assert-Exists([string]$Path, [string]$Label) {
  if (!(Test-Path $Path)) { throw "$Label not found: $Path" }
}

$handoff = (Resolve-Path $HandoffPath).Path
$site = (Resolve-Path $SitePath).Path

Assert-Exists $site "SitePath"
Assert-Exists (Join-Path $handoff "web_data\WEB_READY_PRODUCTS.json") "WEB_READY_PRODUCTS.json"
Assert-Exists (Join-Path $handoff "web_data\PRICE_TIER_DEFINITION.json") "PRICE_TIER_DEFINITION.json"
Assert-Exists (Join-Path $handoff "web_data\POPULARITY_RANKING.json") "POPULARITY_RANKING.json"
Assert-Exists (Join-Path $handoff "authority\articles\DOG_JOINT_POPULARITY_BRAND_SCIENCE.md") "Authority article"

$data = Get-Content (Join-Path $handoff "web_data\WEB_READY_PRODUCTS.json") -Raw | ConvertFrom-Json
$ready = @($data | Where-Object { $_.content_status -eq "PUBLISHABLE_DATA_READY" })
$blocked = @($data | Where-Object { $_.content_status -ne "PUBLISHABLE_DATA_READY" })

$required = @(
  "asin","product_name","brand","ingredient_display","form_display",
  "product_focus","price_tier_display","customer_popularity_display",
  "scientific_evidence_status","scientific_evidence_brief","amazon_url"
)

foreach ($row in $ready) {
  foreach ($f in $required) {
    if ([string]::IsNullOrWhiteSpace([string]$row.$f)) {
      throw "Required public field '$f' missing for ASIN $($row.asin)"
    }
  }
}

Write-Host "PUBLIC DATA PASS"
Write-Host "  Ready rows  : $($ready.Count)"
Write-Host "  Blocked rows: $($blocked.Count)"

$publicFiles = @(
  (Join-Path $handoff "web_data\WEB_READY_PRODUCTS.json"),
  (Join-Path $handoff "web_data\WEB_READY_PRODUCTS.csv"),
  (Join-Path $handoff "web_data\POPULARITY_RANKING.json")
)
$forbidden = @(
  '"rating_value"',
  '"review_count"',
  '"bought_past_month',
  '"customer_popularity_score"'
)
foreach ($file in $publicFiles) {
  $txt = Get-Content $file -Raw
  foreach ($pat in $forbidden) {
    if ($txt -match [regex]::Escape($pat)) {
      throw "Restricted field token '$pat' found in public file $file"
    }
  }
}
Write-Host "PUBLIC HANDOFF LEAKAGE PASS"

$buildDirs = @("dist","build","out",".next")
foreach ($d in $buildDirs) {
  $p = Join-Path $site $d
  if (Test-Path $p) {
    Write-Host "Scanning local build output: $p"
    $matches = Get-ChildItem $p -Recurse -File -ErrorAction SilentlyContinue |
      Select-String -Pattern 'rating_value|review_count|bought_past_month|customer_popularity_score' -ErrorAction SilentlyContinue
    if ($matches) {
      Write-Warning "Potential restricted-data tokens found in $d. Review before PASS."
      $matches | Select-Object -First 20 Path,LineNumber,Line
    } else {
      Write-Host "  No restricted-data tokens found."
    }
  }
}

Write-Host ""
Write-Host "STATIC PRECHECK COMPLETE"
Write-Host "NEXT: build/start the existing site and follow LOCAL_WEB_REVIEW.md."
