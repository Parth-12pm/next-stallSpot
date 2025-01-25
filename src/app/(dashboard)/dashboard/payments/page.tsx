import React from 'react'
import { PaymentsTable } from '@/components/payments/PaymentsTable'

function PaymentPage() {
  return (
    <div className="p-6">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Payments</h1>
        </div>
      <div className="rounded-md border">
        <PaymentsTable />
      </div>
    </div> 
     )
}

export default PaymentPage