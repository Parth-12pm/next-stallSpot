"use client"

/* eslint-disable @typescript-eslint/no-unused-vars */


import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"
import { handleApiError } from "@/lib/error-handling"
import { Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { format } from "date-fns"

interface Payment {
  _id: string
  eventId: {
    title: string
    _id: string
  }
  vendorId: {
    name: string
    _id: string
  }
  amount: number
  status: string
  createdAt: string
}

export function PaymentsTable() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchPayments = async (page = 1) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/payments?page=${page}&limit=10`)

      if (!response.ok) {
        throw new Error(`Failed to fetch payments: ${response.status}`)
      }

      const { payments, pagination } = await response.json()

      // Check if payments exists and is an array
      if (!payments || !Array.isArray(payments)) {
        setPayments([])
        setError("Invalid data format received from server")
        toast({
          title: "Error",
          description: "Invalid data format received from server",
          variant: "destructive",
        })
        return
      }

      setPayments(payments)

      // If pagination data is available
      if (pagination) {
        setTotalPages(pagination.pages || 1)
      }

      setError(null)
    } catch (error) {
      const apiError = handleApiError(error)
      setError(apiError.message)
      toast({
        title: "Error",
        description: apiError.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments(currentPage)
  }, [currentPage])

  const handleShowDetails = (payment: Payment) => {
    setSelectedPayment(payment)
    setShowDetails(true)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      return "Invalid date"
    }
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
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
            {isLoading ? (
              // Show skeleton loaders while loading
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-12 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : payments.length === 0 ? (
              // Show message when no payments are found
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              // Map through payments when available
              payments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell>{payment.eventId?.title || "Unknown Event"}</TableCell>
                  <TableCell>{payment.vendorId?.name || "Unknown Vendor"}</TableCell>
                  <TableCell>₹{payment.amount?.toFixed(2) || "0.00"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : payment.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {payment.status || "Unknown"}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(payment.createdAt)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleShowDetails(payment)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {!isLoading && payments.length > 0 && (
          <div className="flex justify-center mt-4 space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
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
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>

      {/* Payment Details Dialog */}
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
                <p className="text-lg">{selectedPayment.eventId?.title || "Unknown Event"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Vendor</p>
                <p className="text-lg">{selectedPayment.vendorId?.name || "Unknown Vendor"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Amount</p>
                <p className="text-lg">₹{selectedPayment.amount?.toFixed(2) || "0.00"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedPayment.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : selectedPayment.status === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {selectedPayment.status || "Unknown"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">Payment Date</p>
                <p className="text-lg">{formatDate(selectedPayment.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Payment ID</p>
                <p className="text-lg">{selectedPayment._id}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

