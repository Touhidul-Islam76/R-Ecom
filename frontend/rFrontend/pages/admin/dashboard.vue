<template>
  <div>
    <!-- Welcome -->
    <section class="mb-6">
      <div class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p class="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">
          Welcome Back
        </p>
        <div class="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 class="font-serif text-3xl leading-tight text-slate-900 sm:text-4xl">
              Dashboard Overview
            </h1>
            <p class="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Here’s a quick snapshot of your store performance, orders, customers,
              payments, and overall activity.
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <button
              class="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Add Product
            </button>
            <button
              class="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"
            >
              View Reports
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="card in stats"
        :key="card.title"
        class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
      >
        <p class="text-sm font-medium text-slate-500">{{ card.title }}</p>
        <h3 class="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
          {{ card.value }}
        </h3>
        <p class="mt-2 text-sm" :class="card.positive ? 'text-emerald-600' : 'text-rose-500'">
          {{ card.change }}
        </p>
      </div>
    </section>

    <!-- Content Grid -->
    <section class="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <!-- Recent orders -->
      <div class="xl:col-span-2 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div class="mb-5 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-slate-900">Recent Orders</h2>
            <p class="mt-1 text-sm text-slate-500">Latest customer purchases</p>
          </div>
          <button
            class="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-emerald-600 transition hover:bg-emerald-50"
          >
            View All
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr>
                <th class="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Order
                </th>
                <th class="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Customer
                </th>
                <th class="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Total
                </th>
                <th class="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in orders"
                :key="order.id"
                class="rounded-2xl"
              >
                <td class="rounded-l-2xl bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-900">
                  {{ order.id }}
                </td>
                <td class="bg-slate-50 px-4 py-4 text-sm text-slate-600">
                  {{ order.customer }}
                </td>
                <td class="bg-slate-50 px-4 py-4 text-sm font-medium text-slate-900">
                  {{ order.total }}
                </td>
                <td class="rounded-r-2xl bg-slate-50 px-4 py-4">
                  <span
                    class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                    :class="statusClass(order.status)"
                  >
                    {{ order.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="space-y-6">
        <div class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-semibold text-slate-900">Quick Actions</h2>
          <p class="mt-1 text-sm text-slate-500">Shortcuts for common tasks</p>

          <div class="mt-5 space-y-3">
            <button
              class="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Add New Product
            </button>
            <button
              class="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"
            >
              Create Coupon
            </button>
            <button
              class="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Manage Orders
            </button>
          </div>
        </div>

        <div class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-semibold text-slate-900">Store Summary</h2>
          <div class="mt-5 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-500">Pending Orders</span>
              <span class="text-sm font-semibold text-slate-900">18</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-500">Low Stock Products</span>
              <span class="text-sm font-semibold text-slate-900">7</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-500">New Reviews</span>
              <span class="text-sm font-semibold text-slate-900">24</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-500">Refund Requests</span>
              <span class="text-sm font-semibold text-slate-900">3</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const stats = [
  { title: 'Total Sales', value: '$24,500', change: '+12.4% this month', positive: true },
  { title: 'Orders', value: '1,248', change: '+8.1% this month', positive: true },
  { title: 'Customers', value: '892', change: '+5.7% this month', positive: true },
  { title: 'Refunds', value: '32', change: '-1.3% this month', positive: false },
]

const orders = [
  { id: '#ORD-1001', customer: 'Ava Johnson', total: '$120.00', status: 'Paid' },
  { id: '#ORD-1002', customer: 'Liam Smith', total: '$86.50', status: 'Pending' },
  { id: '#ORD-1003', customer: 'Olivia Brown', total: '$245.99', status: 'Shipped' },
  { id: '#ORD-1004', customer: 'Noah Wilson', total: '$64.00', status: 'Cancelled' },
]

const statusClass = (status: string) => {
  if (status === 'Paid') return 'bg-emerald-100 text-emerald-700'
  if (status === 'Pending') return 'bg-amber-100 text-amber-700'
  if (status === 'Shipped') return 'bg-sky-100 text-sky-700'
  return 'bg-rose-100 text-rose-700'
}
</script>

<style scoped>
.font-serif {
  font-family: 'Marcellus', serif;
}
</style>