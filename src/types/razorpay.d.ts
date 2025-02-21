declare module "razorpay" {
  interface RazorpayOptions {
    key: string
    amount: number
    currency: string
    name: string
    description: string
    order_id: string
    handler: (response: RazorpayResponse) => void
    prefill?: {
      name?: string
      email?: string
      contact?: string
    }
    notes?: {
      [key: string]: string
    }
    theme?: {
      color: string
    }
  }

  interface RazorpayResponse {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
  }

  interface RazorpayOrder {
    id: string
    entity: string
    amount: number
    amount_paid: number
    amount_due: number
    currency: string
    receipt: string
    status: string
    attempts: number
    notes: any
    created_at: number
  }

  interface RazorpayPayment {
    id: string
    entity: string
    amount: number
    currency: string
    status: string
    order_id: string
    invoice_id: string | null
    international: boolean
    method: string
    amount_refunded: number
    refund_status: string | null
    captured: boolean
    description: string | null
    card_id: string | null
    bank: string | null
    wallet: string | null
    vpa: string | null
    email: string
    contact: string
    notes: any[]
    fee: number
    tax: number
    error_code: string | null
    error_description: string | null
    created_at: number
  }

  interface RazorpayInstance {
    on(event: string, handler: (response: RazorpayResponse) => void): void
    open(): void
  }

  type RazorpayStatic = (options: RazorpayOptions) => RazorpayInstance

  interface RazorpayOrders {
    create(options: any): Promise<RazorpayOrder>
    fetch(orderId: string): Promise<RazorpayOrder>
  }

  interface RazorpayPayments {
    fetch(paymentId: string): Promise<RazorpayPayment>
    capture(paymentId: string, amount: number): Promise<RazorpayPayment>
  }

  export default class Razorpay {
    constructor(options: { key_id: string; key_secret: string })
    orders: RazorpayOrders
    payments: RazorpayPayments
  }
}

