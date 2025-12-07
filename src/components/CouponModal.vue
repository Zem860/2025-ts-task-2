<script setup lang="ts">
import type { CouponData } from '@/types/coupon'
import { Modal } from 'bootstrap'
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'

interface CouponModalProps {
  coupon: CouponData
}

const props = defineProps<CouponModalProps>()

const emit = defineEmits<{
  'save-coupon': [coupon: CouponData]
}>()

const modalRef = useTemplateRef<HTMLElement>('modalRef')
let modal: Modal | null = null

const form = ref<CouponData>({
  id: '',
  code: '',
  title: '',
  percent: 0,
  is_enabled: 1,
  due_date: 0,
  num: 0,
})

const isEditMode = computed(() => Boolean(props.coupon.id))
const isLoading = ref(false)

onMounted(() => {
  if (modalRef.value) {
    modal = new Modal(modalRef.value)
  }
})

onUnmounted(() => {
  if (modal) {
    modal.dispose()
  }
})

watch(
  () => props.coupon,
  (newCoupon) => {
    if (newCoupon.id) {
      form.value = { ...newCoupon }
    }
  },
  { immediate: true, deep: true },
)

const openModal = () => {
  if (modal) {
    modal.show()
  }
}

const closeModal = () => {
  if (modal) {
    modal.hide()
  }
}

const saveCoupon = async () => {
  if (!form.value.code || !form.value.title) {
    alert('請填寫優惠券代碼和名稱')
    return
  }

  if (form.value.percent < 0 || form.value.percent > 100) {
    alert('折扣必須在 0-100 之間')
    return
  }

  isLoading.value = true

  try {
    emit('save-coupon', form.value)
    closeModal()
  } catch (error) {
    alert('保存優惠券失敗')
  } finally {
    isLoading.value = false
  }
}

defineExpose({
  openModal,
  closeModal,
})
</script>

<template>
  <div
    ref="modalRef"
    class="modal fade"
    id="couponModal"
    tabindex="-1"
    aria-labelledby="couponModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-lg">
        <div class="modal-header">
          <h5 class="modal-title" id="couponModalLabel">
            {{ isEditMode ? '編輯優惠券' : '新增優惠券' }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="couponCode" class="form-label">優惠券代碼</label>
              <input
                v-model="form.code"
                type="text"
                class="form-control rounded-lg"
                id="couponCode"
                placeholder="例: SUMMER20"
              />
            </div>
            <div class="mb-3">
              <label for="couponTitle" class="form-label">優惠券名稱</label>
              <input
                v-model="form.title"
                type="text"
                class="form-control rounded-lg"
                id="couponTitle"
                placeholder="例: 暑期優惠"
              />
            </div>
            <div class="mb-3">
              <label for="couponPercent" class="form-label">折扣 (%)</label>
              <input
                v-model.number="form.percent"
                type="number"
                class="form-control rounded-lg"
                id="couponPercent"
                min="0"
                max="100"
                placeholder="例: 20"
              />
            </div>
            <div class="mb-3">
              <label for="couponDueDate" class="form-label">到期日期</label>
              <input
                v-model.number="form.due_date"
                type="number"
                class="form-control rounded-lg"
                id="couponDueDate"
                placeholder="Unix 時間戳"
              />
            </div>
            <div class="mb-3 d-flex align-items-center">
              <label class="form-label me-3 mb-0">啟用</label>
              <div class="form-check form-switch">
                <input
                  v-model="form.is_enabled"
                  class="form-check-input"
                  type="checkbox"
                  id="couponEnabled"
                  :true-value="1"
                  :false-value="0"
                />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            @click="closeModal"
            type="button"
            class="btn btn-outline-secondary rounded-lg"
          >
            取消
          </button>
          <button
            @click="saveCoupon"
            :disabled="isLoading"
            type="button"
            class="btn btn-dark rounded-lg"
          >
            {{ isLoading ? '儲存中...' : '儲存' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>