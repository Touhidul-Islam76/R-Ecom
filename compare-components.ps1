$orig = "C:\Users\user\Documents\GitHub\R-Ecom\frontend\rFrontend"
$new  = "C:\Users\user\Documents\GitHub\R-Ecom\_frontend\rFrontend"

$components = @(
  "components\layout\TheHeader.vue",
  "components\layout\headers\SiteHeaderHome.vue",
  "components\layout\headers\SiteHeaderStandard.vue",
  "components\layout\headers\SiteHeaderMobile.vue",
  "components\layout\headers\SiteHeaderMobileNuxt.vue",
  "components\layout\footers\SiteFooterHome.vue",
  "components\layout\footers\SiteFooterStandard.vue",
  "components\layout\footers\SiteFooterNuxt.vue",
  "components\layout\shared\PageLoader.vue",
  "components\home\HeroBanner.vue",
  "components\home\ProductsSection.vue",
  "components\home\CategorySection.vue",
  "components\home\BlogSection.vue",
  "components\home\AboutSection.vue",
  "components\home\NewsletterSection.vue",
  "components\ui\ShopCard.vue",
  "components\ui\QuickViewModal.vue",
  "composables\useAuth.ts",
  "stores\authStore.ts",
  "stores\cartStore.ts",
  "stores\wishlistStore.ts",
  "stores\shopCatalogStore.ts",
  "stores\adminCatalogStore.ts",
  "plugins\plantzone.client.ts",
  "plugins\auth.client.ts",
  "layouts\default.vue",
  "layouts\admin.vue"
)

foreach ($f in $components) {
  $a = "$orig\$f"
  $b = "$new\$f"
  if (-not (Test-Path $a)) { Write-Host "MISSING ORIG: $f"; continue }
  if (-not (Test-Path $b)) { Write-Host "MISSING NEW:  $f"; continue }
  $diff = Compare-Object (Get-Content $a) (Get-Content $b)
  $cnt = $diff.Count
  if ($cnt -gt 0) {
    Write-Host ""
    Write-Host "=== DIFF: $f ($cnt lines) ==="
    $diff | ForEach-Object { Write-Host "  $($_.SideIndicator) $($_.InputObject)" }
  } else {
    Write-Host "SAME: $f"
  }
}
