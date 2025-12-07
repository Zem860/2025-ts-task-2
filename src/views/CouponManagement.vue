<script setup lang="ts">
import { apiGetCoupons, apiDeleteCoupon, apiCreateCoupon, apiEditCoupon } from '@/api/coupon'
import type { CouponData, Pagination } from '@/types/coupon'
import { onMounted, ref, useTemplateRef } from 'vue'
import CouponModal from '../components/CouponModal.vue'
import DeleteModal from '@/components/DeleteModal.vue'

const coupons = ref<CouponData[]>([])
const pagination = ref<Pagination>({
  total_pages: 0,
  current_page: 0,
  has_pre: false,
  has_next: false,
  category: '',
})

const currentPage = ref<string>('1')
const couponModalRef = useTemplateRef<InstanceType<typeof CouponModal>>('couponModalRef')
const deleteModalRef = useTemplateRef<InstanceType<typeof DeleteModal>>('deleteModalRef')

const tempCoupon = ref<CouponData>({
  id: '',
  code: '',
  title: '',
  percent: 0,
  is_enabled: 1,
  due_date: 0,
  num: 0,
})

const getCoupons = async (page: string = '1') => {
  try {
    const response = await apiGetCoupons({ page })
    coupons.value = response.data.coupons
    pagination.value = response.data.pagination
  } catch (error) {
    console.error('取得優惠券失敗:', error)
    alert('取得優惠券失敗')
  }
}

const openModal = (coupon: CouponData | null = null) => {
  if (coupon) {
    tempCoupon.value = { ...coupon }
  } else {
    tempCoupon.value = {
      id: '',
      code: '',
      title: '',
      percent: 0,
      is_enabled: 1,
      due_date: 0,
      num: 0,
    }
  }
  couponModalRef.value?.openModal()
}

const openDeleteModal = (couponId: string) => {
  deleteModalRef.value?.openModal(() => deleteCoupon(couponId))
}

const deleteCoupon = async (couponId: string) => {
  try {
    await apiDeleteCoupon(couponId)
    getCoupons(currentPage.value)
  } catch (error) {
    console.error('刪除優惠券失敗:', error)
    alert('刪除優惠券失敗')
  }
}

const handleSaveCoupon = async (couponData: CouponData) => {
  try {
    if (couponData.id) {
      // 編輯模式
      await apiEditCoupon({
        id: couponData.id,
        data: {
          code: couponData.code,
          title: couponData.title,
          percent: couponData.percent,
          is_enabled: couponData.is_enabled,
          due_date: couponData.due_date,
        },
      })
    } else {
      // 新增模式
      await apiCreateCoupon({
        code: couponData.code,
        title: couponData.title,
        percent: couponData.percent,
        is_enabled: couponData.is_enabled,
        due_date: couponData.due_date,
      })
    }
    getCoupons(currentPage.value)
  } catch (error) {
    console.error('保存優惠券失敗:', error)
    alert('保存優惠券失敗')
  }
}

onMounted(async () => {
  await getCoupons(currentPage.value)
})
</script>

<template>
  <div class="d-flex justify-content-end align-items-center mb-4">
    <button @click="openModal(null)" type="button" class="btn btn-dark rounded-lg px-4 py-2">
      <i class="fas fa-plus me-2"></i>新增優惠券
    </button>
  </div>
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
                @click="openModal(coupon)"
                class="btn btn-sm btn-outline-dark rounded-lg me-2"
              >
                編輯
              </button>
              <button
                @click="openDeleteModal(coupon.id)"
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

  <CouponModal ref="couponModalRef" :coupon="tempCoupon" @save-coupon="handleSaveCoupon" />
  <DeleteModal ref="deleteModalRef" title="刪除優惠券" content="確定要刪除該優惠券嗎？" />
</template>

<style lang="scss" scoped></style>