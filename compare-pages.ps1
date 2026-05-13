$orig = "C:\Users\user\Documents\GitHub\R-Ecom\frontend\rFrontend\pages"
$new  = "C:\Users\user\Documents\GitHub\R-Ecom\_frontend\rFrontend\pages"

$map = @(
  @{O="account-address.vue";                   N="account\address.vue"},
  @{O="account-billing-address.vue";           N="account\billing-address.vue"},
  @{O="account-cancellation-requests.vue";     N="account\cancellation-requests.vue"},
  @{O="account-downloads.vue";                 N="account\downloads.vue"},
  @{O="account-order-confirmation.vue";        N="account\order-confirmation.vue"},
  @{O="account-order-details.vue";             N="account\order-details.vue"},
  @{O="account-orders.vue";                    N="account\orders.vue"},
  @{O="account-payment-methods.vue";           N="account\payment-methods.vue"},
  @{O="account-profile.vue";                   N="account\profile.vue"},
  @{O="account-refund-requests-confirmed.vue"; N="account\refund-requests-confirmed.vue"},
  @{O="account-return-request.vue";            N="account\return-request.vue"},
  @{O="account-return-request-detail.vue";     N="account\return-request-detail.vue"},
  @{O="account-review.vue";                    N="account\review.vue"},
  @{O="account-shipping-address.vue";          N="account\shipping-address.vue"},
  @{O="account-shipping-methods.vue";          N="account\shipping-methods.vue"},
  @{O="blog-category.vue";                     N="blog\category.vue"},
  @{O="post-standard.vue";                     N="blog\post-standard.vue"},
  @{O="product-default.vue";                   N="product\default.vue"},
  @{O="shop-cart.vue";                         N="shop\cart.vue"},
  @{O="shop-checkout.vue";                     N="shop\checkout.vue"},
  @{O="shop-standard.vue";                     N="shop\standard.vue"},
  @{O="shop-wishlist.vue";                     N="shop\wishlist.vue"},
  @{O="shop-with-category.vue";                N="shop\with-category.vue"},
  @{O="index.vue";                             N="index.vue"},
  @{O="login.vue";                             N="login.vue"},
  @{O="registration.vue";                      N="registration.vue"},
  @{O="forget-password.vue";                   N="forget-password.vue"},
  @{O="about-us.vue";                          N="about-us.vue"}
)

foreach ($pair in $map) {
  $a = "$orig\$($pair.O)"
  $b = "$new\$($pair.N)"
  if (-not (Test-Path $a)) { Write-Host "MISSING ORIG: $($pair.O)"; continue }
  if (-not (Test-Path $b)) { Write-Host "MISSING NEW:  $($pair.N)"; continue }
  $diff = Compare-Object (Get-Content $a) (Get-Content $b)
  if ($diff.Count -eq 0) {
    Write-Host "SAME: $($pair.O)"
  } else {
    Write-Host ""
    Write-Host "=== DIFF: $($pair.O) ($($diff.Count) lines) ==="
    $diff | ForEach-Object { Write-Host "  $($_.SideIndicator) $($_.InputObject)" }
  }
}
