export type CouponData = {
    id:string,
    code:string,
    discount:number,
    is_enabled:boolean
    start_at?:number,
    end_at?:number
}

export type CreateCouponParams = Omit<CouponData, 'id'>

export type EditCouponParams = {
    id:string,
    data:CreateCouponParams,
}

export type GetCoupounResponse = {
    success:boolean,
    coupons:CouponData[],
    pagination:{
        total_pages:number,
        current_page:number,
        has_pre:boolean,
        has_next:boolean
    }

}

export type MessageResponse = {
    success:boolean,
    message:string,
}

export type CreateCouponResponse = MessageResponse
export type EditCouponResponse = MessageResponse
export type DeleteCouponResponse = MessageResponse