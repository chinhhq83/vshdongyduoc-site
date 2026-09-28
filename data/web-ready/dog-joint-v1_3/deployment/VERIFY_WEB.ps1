param(
  [Parameter(Mandatory=$true)][string]$SitePath,
  [Parameter(Mandatory=$true)][string]$PublicDataPath,
  [Parameter(Mandatory=$true)][string]$ContactUrl
)
$ErrorActionPreference = "Stop"
if (!(Test-Path $SitePath)) { throw "SitePath not found: $SitePath" }
if (!(Test-Path $PublicDataPath)) { throw "PublicDataPath not found: $PublicDataPath" }
if ([string]::IsNullOrWhiteSpace($ContactUrl)) { throw "ContactUrl is required." }

$data = Get-Content $PublicDataPath -Raw | ConvertFrom-Json
if ($data.Count -lt 1) { throw "No product rows found." }

$required = @("asin","product_name","brand","ingredient_display","form_display","product_focus",
"price_tier_display","scientific_evidence_status","scientific_evidence_brief","amazon_url","content_status")
$publishable = @($data | Where-Object { $_.content_status -eq "PUBLISHABLE_DATA_READY" })

foreach ($row in $publishable) {
  foreach ($f in $required) {
    if ([string]::IsNullOrWhiteSpace([string]$row.$f)) {
      throw "Required field '$f' missing for ASIN $($row.asin)"
    }
  }
  if (($row.customer_popularity_rank -eq $null -or [string]::IsNullOrWhiteSpace([string]$row.customer_popularity_rank)) -and
      $row.customer_popularity_display -ne "Unavailable") {
      throw "Popularity unavailable state invalid for ASIN $($row.asin)"
  }
}
Write-Host "DATA PRECHECK PASS: $($publishable.Count) publishable rows."
Write-Host "NEXT: run site-specific build/render tests, verify contact route, page_view and amazon_click events, canonical/meta/sitemap, then leakage scan."
