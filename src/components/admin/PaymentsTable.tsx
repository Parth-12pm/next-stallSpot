"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface Payment {
  _id: string
  eventId: { title: string }
  vendorId: { name: string }
  amount: number
  status: string
  createdAt: string
}

export function PaymentsTable() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("/api/admin/payments")
        if (!response.ok) throw new Error("Failed to fetch payments")
        const data = await response.json()
        setPayments(data)
      } catch (error) {
        console.error("Error fetching payments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayments()
  }, [])

  if (isLoading) {
    return <div>Loading payments...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>Vendor</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment._id}>
            <TableCell>{payment.eventId.title}</TableCell>
            <TableCell>{payment.vendorId.name}</TableCell>
            <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
            <TableCell>{payment.status}</TableCell>
            <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm">
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

