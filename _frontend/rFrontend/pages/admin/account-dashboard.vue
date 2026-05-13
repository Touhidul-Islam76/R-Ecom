<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdminCatalogStore } from '~/stores/adminCatalogStore'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Dashboard | FasionAble Admin' })

const catalogStore = useAdminCatalogStore()
const { brandMeta, categoryMeta, productMeta, products } = storeToRefs(catalogStore)

const isLoadingCatalogStats = ref(false)
const catalogStatsError = ref('')
const pageVariantCount = computed(() =>
  products.value.reduce((sum, product) => sum + (product.variants?.length || 0), 0),
)

const loadCatalogStats = async () => {
  isLoadingCatalogStats.value = true
  catalogStatsError.value = ''

  try {
    await Promise.all([
      catalogStore.fetchBrands(1),
      catalogStore.fetchCategories(1),
      catalogStore.fetchProducts(1, {
        search: '',
        category_id: '',
        brand_id: '',
        size: '',
        color: '',
        min_price: '',
        max_price: '',
        sort: '',
      }),
    ])
  } catch (error) {
    catalogStatsError.value = (error as Error).message || 'Failed to load dashboard stats.'
  } finally {
    isLoadingCatalogStats.value = false
  }
}

// ── Chart helpers ──────────────────────────────────────────────
const loadScript = (src: string) => new Promise<void>((resolve) => {
  if (document.querySelector(`script[data-chart="${src}"]`)) { resolve(); return }
  const s = document.createElement('script')
  s.src = src
  s.dataset.chart = src
  s.onload = () => resolve()
  s.onerror = () => resolve()
  document.body.appendChild(s)
})

const initCharts = () => {
  const ApexCharts = (window as any).ApexCharts
  if (!ApexCharts) return

  // Weekly Sales
  if (document.getElementById('revenue-chart')) {
    new ApexCharts(document.getElementById('revenue-chart'), {
      chart: { height: 250, type: 'bar', toolbar: { show: false } },
      plotOptions: { bar: { columnWidth: '40%', borderRadius: 4 } },
      dataLabels: { enabled: false },
      series: [
        { name: 'This Week',   data: [31, 40, 28, 51, 42, 85, 77] },
        { name: 'Last Week',   data: [11, 32, 45, 32, 34, 52, 41] },
      ],
      colors: ['#3bc0c3', '#1a2942'],
      xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      legend: { position: 'top' },
      grid: { row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 } },
    }).render()
  }

  // Yearly Sales
  if (document.getElementById('yearly-sales-chart')) {
    new ApexCharts(document.getElementById('yearly-sales-chart'), {
      chart: { height: 200, type: 'donut', toolbar: { show: false } },
      series: [44, 55, 41],
      labels: ['Q1', 'Q2', 'Q3-Q4'],
      colors: ['#3bc0c3', '#1a2942', '#d1d7d9'],
      legend: { position: 'bottom' },
      dataLabels: { enabled: false },
    }).render()
  }
}

onMounted(async () => {
  await loadScript('/velonic/vendor/apexcharts/apexcharts.min.js')
  initCharts()
  await loadCatalogStats()
})
</script>

<template>
  <!-- Page Title -->
  <div class="row">
    <div class="col-12">
      <div class="page-title-box">
        <div class="page-title-right">
          <ol class="breadcrumb m-0">
            <li class="breadcrumb-item"><a href="javascript:void(0)">Admin</a></li>
            <li class="breadcrumb-item active">Dashboard</li>
          </ol>
        </div>
        <h4 class="page-title">Welcome!</h4>
      </div>
    </div>
  </div>

  <!-- Stat Cards -->
  <div class="row">
    <div v-if="catalogStatsError" class="col-12">
      <div class="alert alert-danger mb-3" role="alert">
        {{ catalogStatsError }}
      </div>
    </div>

    <div class="col-xxl-3 col-sm-6">
      <div class="card widget-flat text-bg-pink">
        <div class="card-body">
          <div class="float-end"><i class="ri-award-line widget-icon"></i></div>
          <h6 class="text-uppercase mt-0">Total Brands</h6>
          <h2 class="my-2">{{ isLoadingCatalogStats ? '...' : brandMeta.total }}</h2>
          <p class="mb-0">
            <span class="badge bg-white bg-opacity-10 me-1">Live</span>
            <span class="text-nowrap">Catalog data</span>
          </p>
        </div>
      </div>
    </div>

    <div class="col-xxl-3 col-sm-6">
      <div class="card widget-flat text-bg-purple">
        <div class="card-body">
          <div class="float-end"><i class="ri-list-check-3 widget-icon"></i></div>
          <h6 class="text-uppercase mt-0">Total Categories</h6>
          <h2 class="my-2">{{ isLoadingCatalogStats ? '...' : categoryMeta.total }}</h2>
          <p class="mb-0">
            <span class="badge bg-white bg-opacity-10 me-1">Live</span>
            <span class="text-nowrap">Catalog data</span>
          </p>
        </div>
      </div>
    </div>

    <div class="col-xxl-3 col-sm-6">
      <div class="card widget-flat text-bg-info">
        <div class="card-body">
          <div class="float-end"><i class="ri-shopping-basket-line widget-icon"></i></div>
          <h6 class="text-uppercase mt-0">Total Products</h6>
          <h2 class="my-2">{{ isLoadingCatalogStats ? '...' : productMeta.total }}</h2>
          <p class="mb-0">
            <span class="badge bg-white bg-opacity-25 me-1">Live</span>
            <span class="text-nowrap">Catalog data</span>
          </p>
        </div>
      </div>
    </div>

    <div class="col-xxl-3 col-sm-6">
      <div class="card widget-flat text-bg-primary">
        <div class="card-body">
          <div class="float-end"><i class="ri-t-shirt-2-line widget-icon"></i></div>
          <h6 class="text-uppercase mt-0">Variants (Page 1)</h6>
          <h2 class="my-2">{{ isLoadingCatalogStats ? '...' : pageVariantCount }}</h2>
          <p class="mb-0">
            <span class="badge bg-white bg-opacity-10 me-1">Live</span>
            <span class="text-nowrap">From product list</span>
          </p>
        </div>
      </div>
    </div>
  </div>
  <!-- end stat cards -->

  <!-- Charts Row -->
  <div class="row">
    <div class="col-lg-8">
      <div class="card">
        <div class="card-body">
          <h5 class="header-title mb-0">Weekly Sales Report</h5>
          <div class="pt-3">
            <div id="revenue-chart" class="apex-charts"></div>
            <div class="row text-center mt-2">
              <div class="col">
                <p class="text-muted mt-3">Current Week</p>
                <h3 class="mb-0">$506.54</h3>
              </div>
              <div class="col">
                <p class="text-muted mt-3">Previous Week</p>
                <h3 class="mb-0">$305.25</h3>
              </div>
              <div class="col">
                <p class="text-muted mt-3">Conversion</p>
                <h3 class="mb-0">3.27%</h3>
              </div>
              <div class="col">
                <p class="text-muted mt-3">Customers</p>
                <h3 class="mb-0">3k</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-lg-4">
      <div class="card">
        <div class="card-body">
          <h5 class="header-title mb-0">Yearly Sales Report</h5>
          <div class="pt-3">
            <div id="yearly-sales-chart" class="apex-charts"></div>
            <div class="row text-center mt-2">
              <div class="col">
                <p class="text-muted mt-2 mb-1">Quarter 1</p>
                <h4 class="mb-0">$56.2k</h4>
              </div>
              <div class="col">
                <p class="text-muted mt-2 mb-1">Quarter 2</p>
                <h4 class="mb-0">$42.5k</h4>
              </div>
              <div class="col">
                <p class="text-muted mt-2 mb-1">All Time</p>
                <h4 class="mb-0">$102k</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="header-title mb-0">Quick Stats</h5>
          </div>
          <div class="d-flex align-items-center mb-2">
            <div class="flex-shrink-0 me-2">
              <div class="avatar-xs rounded bg-primary-subtle d-flex align-items-center justify-content-center">
                <i class="ri-shopping-cart-line text-primary"></i>
              </div>
            </div>
            <div class="flex-grow-1">
              <p class="mb-0 text-muted">Pending Orders</p>
            </div>
            <div class="flex-shrink-0">
              <span class="badge bg-warning-subtle text-warning fs-12">42</span>
            </div>
          </div>
          <div class="d-flex align-items-center mb-2">
            <div class="flex-shrink-0 me-2">
              <div class="avatar-xs rounded bg-success-subtle d-flex align-items-center justify-content-center">
                <i class="ri-check-line text-success"></i>
              </div>
            </div>
            <div class="flex-grow-1">
              <p class="mb-0 text-muted">Delivered Today</p>
            </div>
            <div class="flex-shrink-0">
              <span class="badge bg-success-subtle text-success fs-12">127</span>
            </div>
          </div>
          <div class="d-flex align-items-center">
            <div class="flex-shrink-0 me-2">
              <div class="avatar-xs rounded bg-danger-subtle d-flex align-items-center justify-content-center">
                <i class="ri-arrow-go-back-line text-danger"></i>
              </div>
            </div>
            <div class="flex-grow-1">
              <p class="mb-0 text-muted">Return Requests</p>
            </div>
            <div class="flex-shrink-0">
              <span class="badge bg-danger-subtle text-danger fs-12">8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- end charts row -->

  <!-- Recent Orders Table -->
  <div class="row">
    <div class="col-12" style="overflow: visible !important; padding: 0 !important;">
      <div class="card" style="overflow: visible !important;">
        <div class="card-body p-0" style="overflow: visible !important; padding: 0 !important;">
          <div class="p-3">
            <h5 class="header-title mb-0">Recent Orders</h5>
          </div>
          <div class="table-scroll-wrapper">
            <table class="table table-nowrap table-hover mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>#ORD-1042</td>
                  <td>Rashed Ahmed</td>
                  <td>13/04/2026</td>
                  <td>৳ 2,400</td>
                  <td><span class="badge bg-warning-subtle text-warning">Pending</span></td>
                  <td><a href="javascript:void(0);" class="btn btn-sm btn-primary-subtle">View</a></td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>#ORD-1041</td>
                  <td>Sadia Islam</td>
                  <td>13/04/2026</td>
                  <td>৳ 5,150</td>
                  <td><span class="badge bg-success-subtle text-success">Delivered</span></td>
                  <td><a href="javascript:void(0);" class="btn btn-sm btn-primary-subtle">View</a></td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>#ORD-1040</td>
                  <td>Karim Hossain</td>
                  <td>12/04/2026</td>
                  <td>৳ 1,800</td>
                  <td><span class="badge bg-info-subtle text-info">Processing</span></td>
                  <td><a href="javascript:void(0);" class="btn btn-sm btn-primary-subtle">View</a></td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>#ORD-1039</td>
                  <td>Nusrat Jahan</td>
                  <td>12/04/2026</td>
                  <td>৳ 3,600</td>
                  <td><span class="badge bg-danger-subtle text-danger">Cancelled</span></td>
                  <td><a href="javascript:void(0);" class="btn btn-sm btn-primary-subtle">View</a></td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>#ORD-1038</td>
                  <td>Farhan Chowdhury</td>
                  <td>11/04/2026</td>
                  <td>৳ 7,200</td>
                  <td><span class="badge bg-success-subtle text-success">Delivered</span></td>
                  <td><a href="javascript:void(0);" class="btn btn-sm btn-primary-subtle">View</a></td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>#ORD-1037</td>
                  <td>Tania Begum</td>
                  <td>11/04/2026</td>
                  <td>৳ 990</td>
                  <td><span class="badge bg-purple-subtle text-purple">Shipped</span></td>
                  <td><a href="javascript:void(0);" class="btn btn-sm btn-primary-subtle">View</a></td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>#ORD-1036</td>
                  <td>Mahbub Alam</td>
                  <td>10/04/2026</td>
                  <td>৳ 4,300</td>
                  <td><span class="badge bg-pink-subtle text-pink">Return Req.</span></td>
                  <td><a href="javascript:void(0);" class="btn btn-sm btn-primary-subtle">View</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- end table row -->
</template>

<style scoped>
/* Table scroll wrapper - allows horizontal scroll on mobile */
.table-scroll-wrapper {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  display: block !important;
}

.table {
  width: 100% !important;
  margin-bottom: 0 !important;
  display: table;
}

.table thead {
  background-color: #f8f9fa;
  position: relative;
}

.table th {
  white-space: nowrap !important;
  border-bottom: 1px solid #dee2e6;
  vertical-align: middle;
  padding: 12px 8px !important;
}

.table td {
  white-space: nowrap !important;
  padding: 10px 8px !important;
  vertical-align: middle;
}

.table tbody tr:hover {
  background-color: #f5f5f5;
}

/* Mobile specific optimizations */
@media (max-width: 768px) {
  .table-scroll-wrapper {
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
  }

  .table {
    min-width: 750px !important;
    font-size: 13px !important;
  }

  .table th,
  .table td {
    padding: 8px 6px !important;
    font-size: 12px !important;
  }

  .btn-sm {
    white-space: nowrap !important;
    padding: 3px 6px !important;
    font-size: 11px !important;
  }

  .badge {
    white-space: nowrap !important;
    font-size: 10px !important;
    padding: 3px 5px !important;
  }
}
</style>
