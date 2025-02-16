// src/types/razorpay.d.ts
declare module "razorpay" {
  interface RazorpayPayoutOptions {
    account_number: string
    fund_account_id: string
    amount: number
    currency: string
    mode: string
    purpose: string
    queue_if_low_balance: boolean
    reference_id: string
    narration: string
  }

  interface RazorpayPayout {
    id: string
    entity: string
    fund_account_id: string
    amount: number
    currency: string
    status: string
    mode: string
    purpose: string
    reference_id: string
    narration: string
    created_at: number
  }

  interface RazorpayPayouts {
    create(options: RazorpayPayoutOptions): Promise<RazorpayPayout>
  }

  interface RazorpayOrders {
    create(options: any): Promise<any>
    fetch(orderId: string): Promise<any>
  }

  export default class Razorpay {
    constructor(options: { key_id: string; key_secret: string })
    orders: RazorpayOrders
    payouts: RazorpayPayouts
  }
}

