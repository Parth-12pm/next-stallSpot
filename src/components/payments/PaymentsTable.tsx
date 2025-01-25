"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface Payment {
  _id: string
  eventId: {
    title: string
  }
  applicationId: string
  amount: number
  status: "completed" | "failed" | "refunded"
  paymentDate: string
  paymentMethod: string
  transactionId: string
}

export function PaymentsTable() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("/api/vendor/payments")
        if (!response.ok) throw new Error("Failed to fetch payments")
        const data = await response.json()
        setPayments(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load payments")
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  const getStatusBadgeVariant = (status: Payment["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white"
      case "failed":
        return "bg-red-500 text-white"
      case "refunded":
        return "bg-yellow-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction ID</TableHead>
          <TableHead>Event</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Payment Method</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              No payments found
            </TableCell>
          </TableRow>
        ) : (
          payments.map((payment) => (
            <TableRow key={payment._id}>
              <TableCell className="font-mono">{payment.transactionId}</TableCell>
              <TableCell>{payment.eventId.title}</TableCell>
              <TableCell>{format(new Date(payment.paymentDate), "MMM d, yyyy")}</TableCell>
              <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
              <TableCell className="capitalize">{payment.paymentMethod}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={getStatusBadgeVariant(payment.status)}>
                  {payment.status.toUpperCase()}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

