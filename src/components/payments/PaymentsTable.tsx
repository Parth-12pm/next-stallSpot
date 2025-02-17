// src/components/payments/PaymentsTable.tsx
"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { useSession } from "next-auth/react"

const parseDate = (dateString: string) => {
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? new Date() : date
}

interface VendorPayment {
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

interface OrganizerPayment {
  _id: string
  eventTitle: string
  stallId: number
  amount: number
  platformFee: number
  organizerAmount: number
  paymentDate: string
  transactionId: string
}

interface EarningsSummary {
  total: number
  platformFees: number
  organizerEarnings: number
}

interface VendorPaymentsResponse {
  payments: VendorPayment[]
  pagination: {
    total: number
    pages: number
    page: number
    limit: number
  }
}

export function PaymentsTable() {
  const { data: session } = useSession()
  const [vendorPayments, setVendorPayments] = useState<VendorPayment[]>([])
  const [organizerPayments, setOrganizerPayments] = useState<OrganizerPayment[]>([])
  const [earnings, setEarnings] = useState<EarningsSummary>({ total: 0, platformFees: 0, organizerEarnings: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(
          session?.user?.role === "organizer" ? "/api/organizer/payments" : "/api/vendor/payments",
        )
        if (!response.ok) throw new Error("Failed to fetch payments")
        const data = await response.json()
        if (session?.user?.role === "organizer") {
          setOrganizerPayments(data.payments)
          setEarnings(data.earnings)
        } else {
          // Handle the vendor payments response
          const vendorData = data as VendorPaymentsResponse
          setVendorPayments(vendorData.payments)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load payments")
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.role) {
      fetchPayments()
    }
  }, [session])

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Earnings Summary Card Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>Earnings Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, index) => (
                <div key={index}>
                  <div className="h-4 w-24 animate-pulse rounded-md bg-gray-200 mb-2" />
                  <div className="h-8 w-32 animate-pulse rounded-md bg-gray-200" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Table Skeleton */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Stall ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Your Earnings</TableHead>
              <TableHead>Payment Date</TableHead>
              <TableHead>Transaction ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-4 w-[200px] animate-pulse rounded-md bg-gray-200" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-[80px] animate-pulse rounded-md bg-gray-200" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-[100px] animate-pulse rounded-md bg-gray-200" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-[100px] animate-pulse rounded-md bg-gray-200" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-[120px] animate-pulse rounded-md bg-gray-200" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-[150px] animate-pulse rounded-md bg-gray-200" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-sm font-medium text-red-800">Failed to load payments</h3>
        </div>
        <div className="mt-2 text-sm text-red-700">{error}</div>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {session?.user?.role === "organizer" && (
        <Card>
          <CardHeader>
            <CardTitle>Earnings Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium">Total Earnings</p>
                <p className="text-2xl font-bold">₹{earnings.total.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Platform Fees</p>
                <p className="text-2xl font-bold">₹{earnings.platformFees.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Your Earnings</p>
                <p className="text-2xl font-bold">₹{earnings.organizerEarnings.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            {session?.user?.role === "organizer" && <TableHead>Stall ID</TableHead>}
            <TableHead>Amount</TableHead>
            {session?.user?.role === "organizer" && <TableHead>Your Earnings</TableHead>}
            <TableHead>Payment Date</TableHead>
            <TableHead>Transaction ID</TableHead>
            {session?.user?.role === "vendor" && <TableHead>Status</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {session?.user?.role === "organizer"
            ? organizerPayments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell>{payment.eventTitle}</TableCell>
                  <TableCell>#{payment.stallId}</TableCell>
                  <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>₹{payment.organizerAmount.toLocaleString()}</TableCell>
                  <TableCell>{format(parseDate(payment.paymentDate), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.transactionId}</Badge>
                  </TableCell>
                </TableRow>
              ))
            : vendorPayments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell>{payment.eventId.title}</TableCell>
                  <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{format(parseDate(payment.paymentDate), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.transactionId}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={payment.status === "completed" ? "default" : "destructive"}>
                      {payment.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  )
}

