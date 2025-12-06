import axios, { type AxiosResponse } from 'axios'
import type {
  CreateCouponParams,
  CreateCouponResponse,
  DeleteCouponResponse,
  EditCouponParams,
  EditCouponResponse,
  GetCoupounResponse,
} from '@/types/coupon'

const BASE_URL = import.meta.env.VITE_BASE_URL
const API_PATH = import.meta.env.VITE_API_PATH

const couponApi = axios.create({ baseURL: BASE_URL })

couponApi.interceptors.request.use((request) => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
  if (token) request.headers['Authorization'] = token
  return request
})

couponApi.interceptors.response.use(
  (response) => Promise.resolve(response),
  (error) => Promise.reject(error.response.data),
)

export const apiGetCoupons = (params?: {
  page?: string
}): Promise<AxiosResponse<GetCoupounResponse>> =>
  couponApi.get(`/v2/api/${API_PATH}/admin/coupons`, { params })

export const apiCreateCoupon = (
  data: CreateCouponParams,
): Promise<AxiosResponse<CreateCouponResponse>> =>
  couponApi.post(`/v2/api/${API_PATH}/admin/coupon`, { data })

export const apiEditCoupon = (
  params: EditCouponParams,
): Promise<AxiosResponse<EditCouponResponse>> => {
  const { id, data } = params
  return couponApi.put(`/v2/api/${API_PATH}/admin/coupon/${id}`, { data })
}

export const apiDeleteCoupon = (
  couponId: string,
): Promise<AxiosResponse<DeleteCouponResponse>> =>
  couponApi.delete(`/v2/api/${API_PATH}/admin/coupon/${couponId}`)