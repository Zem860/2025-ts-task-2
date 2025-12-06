<!-- filepath: c:\Users\user\Desktop\task2\2025-ts-task-2\src\views/CouponManagement.vue -->
<script setup lang="ts">
import { apiGetCoupons, apiDeleteCoupon } from '@/api/coupon'
import type { CouponData, Pagination } from '@/types/coupon'
import { onMounted, ref } from 'vue'

const coupons = ref<CouponData[]>([])
const pagination = ref<Pagination>({
  total_pages: 0,
  current_page: 0,
  has_pre: false,
  has_next: false,
  category: '',
})

const currentPage = ref<string>('1')

const getCoupons = async (page: string = '1') => {
  try {
    const response = await apiGetCoupons({ page })
    console.log('API 回應:', response.data) // 檢查資料格式
    coupons.value = response.data.coupons
    pagination.value = response.data.pagination
  } catch (error) {
    console.error('取得優惠券失敗:', error)
  }
}

const deleteCoupon = async (couponId: string) => {
  try {
    await apiDeleteCoupon(couponId)
    getCoupons(currentPage.value)
  } catch (error) {
    console.error('刪除優惠券失敗:', error)
  }
}

onMounted(async () => {
  await getCoupons(currentPage.value)
})
</script>

<template>
  <div class="card shadow-sm rounded-lg">
    <div class="card-body p-4">
      <h4 class="mb-4">優惠券管理</h4>
      <table class="table table-hover">
        <thead>
          <tr>
            <th>優惠券代碼</th>
            <th>優惠券名稱</th>
            <th>折扣</th>
            <th>到期日期</th>
            <th>啟用狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="coupon in coupons" :key="coupon.id">
            <td>{{ coupon.code }}</td>
            <td>{{ coupon.title }}</td>
            <td>{{ coupon.percent }}%</td>
            <td>{{ new Date(coupon.due_date * 1000).toLocaleDateString('zh-TW') }}</td>
            <td>
              <span
                :class="{
                  'badge bg-success': coupon.is_enabled === 1,
                  'badge bg-danger': coupon.is_enabled === 0,
                }"
              >
                {{ coupon.is_enabled === 1 ? '啟用' : '停用' }}
              </span>
            </td>
            <td>
              <button
                @click="deleteCoupon(coupon.id)"
                class="btn btn-sm btn-outline-danger rounded-lg"
              >
                刪除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>