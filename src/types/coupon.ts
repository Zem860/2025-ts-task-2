export type CouponData = {
  id: string
  code: string
  title: string
  percent: number
  is_enabled: number
  due_date: number
  num: number
}

export type Pagination = {
  total_pages: number
  current_page: number
  has_pre: boolean
  has_next: boolean
  category: string
}

export type CreateCouponParams = Omit<CouponData, 'id' | 'num'>

export type EditCouponParams = {
  id: string
  data: CreateCouponParams
}

export type GetCoupounResponse = {
  success: boolean
  coupons: CouponData[]
  pagination: Pagination
  messages: unknown[]
}

export type MessageResponse = {
  success: boolean
  message: string
}

export type CreateCouponResponse = MessageResponse
export type EditCouponResponse = MessageResponse
export type DeleteCouponResponse = MessageResponse