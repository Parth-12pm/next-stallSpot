"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import { Eye } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

interface PaymentsResponse {
  payments: VendorPayment[] | OrganizerPayment[]
  pagination: {
    total: number
    pages: number
    page: number
    limit: number
  }
  earnings?: EarningsSummary
}

export function PaymentsTable() {
  const { data: session } = useSession()
  const [payments, setPayments] = useState<VendorPayment[] | OrganizerPayment[]>([])
  const [earnings, setEarnings] = useState<EarningsSummary>({ total: 0, platformFees: 0, organizerEarnings: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<VendorPayment | OrganizerPayment | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchPayments(currentPage)
  }, [currentPage])

  const fetchPayments = async (page: number) => {
    try {
      setLoading(true)
      const response = await fetch(
        `${session?.user?.role === "organizer" ? "/api/organizer/payments" : "/api/vendor/payments"}?page=${page}&limit=10`,
      )
      if (!response.ok) throw new Error("Failed to fetch payments")
      const data: PaymentsResponse = await response.json()
      setPayments(data.payments)
      setTotalPages(data.pagination.pages)
      if (session?.user?.role === "organizer" && data.earnings) {
        setEarnings(data.earnings)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load payments")
    } finally {
      setLoading(false)
    }
  }

  const handleShowDetails = (payment: VendorPayment | OrganizerPayment) => {
    setSelectedPayment(payment)
    setShowDetails(true)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
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

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={session?.user?.role === "organizer" ? 7 : 6}>
                      <Skeleton className="h-12 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={session?.user?.role === "organizer" ? 7 : 6} className="text-center py-4">
                    No payments found
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell>{"eventTitle" in payment ? payment.eventTitle : payment.eventId.title}</TableCell>
                    {session?.user?.role === "organizer" && "stallId" in payment && (
                      <TableCell>#{payment.stallId}</TableCell>
                    )}
                    <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                    {session?.user?.role === "organizer" && "organizerAmount" in payment && (
                      <TableCell>₹{payment.organizerAmount.toLocaleString()}</TableCell>
                    )}
                    <TableCell>{format(parseDate(payment.paymentDate), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{payment.transactionId}</Badge>
                    </TableCell>
                    {session?.user?.role === "vendor" && "status" in payment && (
                      <TableCell>
                        <Badge variant={payment.status === "completed" ? "default" : "destructive"}>
                          {payment.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                    )}
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleShowDetails(payment)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-center mt-4 space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </Button>
            <span className="py-2 px-3 bg-secondary rounded-md">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>Detailed information about the payment</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Event</p>
                <p className="text-lg">
                  {"eventTitle" in selectedPayment ? selectedPayment.eventTitle : selectedPayment.eventId.title}
                </p>
              </div>
              {"stallId" in selectedPayment && (
                <div>
                  <p className="text-sm font-medium">Stall ID</p>
                  <p className="text-lg">#{selectedPayment.stallId}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium">Amount</p>
                <p className="text-lg">₹{selectedPayment.amount.toLocaleString()}</p>
              </div>
              {"organizerAmount" in selectedPayment && (
                <div>
                  <p className="text-sm font-medium">Your Earnings</p>
                  <p className="text-lg">₹{selectedPayment.organizerAmount.toLocaleString()}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium">Payment Date</p>
                <p className="text-lg">{format(parseDate(selectedPayment.paymentDate), "MMM d, yyyy HH:mm:ss")}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Transaction ID</p>
                <p className="text-lg">{selectedPayment.transactionId}</p>
              </div>
              {"status" in selectedPayment && (
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={selectedPayment.status === "completed" ? "default" : "destructive"}>
                    {selectedPayment.status.toUpperCase()}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

