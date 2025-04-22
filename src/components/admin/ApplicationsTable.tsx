"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"
import { handleApiError } from "@/lib/error-handling"
import type { IApplication } from "@/models/Application"



interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    pages: number
    page: number
    limit: number
  }
}



type ApplicationWithId = IApplication & { _id: string }

export function ApplicationsTable() {
  const [applications, setApplications] = useState<ApplicationWithId[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithId | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchApplications = async (page = 1) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/applications?page=${page}&limit=10`)

      if (!response.ok) {
        throw new Error(`Failed to fetch applications: ${response.status}`)
      }

      const result = await response.json()

      // Check if the response has the expected structure
      if (!result) {
        setApplications([])
        setError("Invalid data format received from server")
        toast({
          title: "Error",
          description: "Invalid data format received from server",
          variant: "destructive",
        })
        return
      }



      // Handle both array responses and paginated responses
      if (Array.isArray(result)) {
        setApplications(result)
        setTotalPages(1) // Default to 1 page if no pagination info
      } else if (result.data && Array.isArray(result.data)) {
        setApplications(result.data)
        setTotalPages(result.pagination?.pages || 1)
      } else {
        setApplications([])
        setError("Invalid data format received from server")
        toast({
          title: "Error",
          description: "Invalid data format received from server",
          variant: "destructive",
        })
        return
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
    fetchApplications(currentPage)
  }, [currentPage])

  const handleViewApplication = (application: ApplicationWithId) => {
    setSelectedApplication(application)
    setShowDetails(true)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const formatDate = (dateString: string | Date) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      return "Invalid date"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Rejected</Badge>
      case "payment_pending":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Payment Pending</Badge>
      case "payment_completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Payment Completed</Badge>
      case "expired":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Expired</Badge>
      case "payment_failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Payment Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
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
        <CardTitle>All Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Application Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Show skeleton loaders while loading
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-12 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : applications.length === 0 ? (
              // Show message when no applications are found
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No applications found
                </TableCell>
              </TableRow>
            ) : (
              // Map through applications when available
              applications.map((application) => (
                <TableRow key={application._id}>
                  <TableCell>
                    {application.eventId && typeof application.eventId === "object" && "title" in application.eventId
                      ? application.eventId.title
                      : "Unknown Event"}
                  </TableCell>
                  <TableCell>
                    {application.vendorId && typeof application.vendorId === "object" && "name" in application.vendorId
                      ? application.vendorId.name
                      : "Unknown Vendor"}
                  </TableCell>
                  <TableCell>{getStatusBadge(application.status)}</TableCell>
                  <TableCell>{formatDate(application.applicationDate)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleViewApplication(application)}>
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
        {!isLoading && applications.length > 0 && (
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

      {/* Application Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>Detailed information about the application</DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Event</p>
                  <p className="text-lg">
                    {selectedApplication.eventId &&
                    typeof selectedApplication.eventId === "object" &&
                    "title" in selectedApplication.eventId
                      ? selectedApplication.eventId.title
                      : "Unknown Event"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Vendor</p>
                  <p className="text-lg">
                    {selectedApplication.vendorId &&
                    typeof selectedApplication.vendorId === "object" &&
                    "name" in selectedApplication.vendorId
                      ? selectedApplication.vendorId.name
                      : "Unknown Vendor"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <div>{getStatusBadge(selectedApplication.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium">Stall ID</p>
                  <p className="text-lg">#{selectedApplication.stallId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Application Date</p>
                  <p className="text-lg">{formatDate(selectedApplication.applicationDate)}</p>
                </div>
                {selectedApplication.approvalDate && (
                  <div>
                    <p className="text-sm font-medium">Approval Date</p>
                    <p className="text-lg">{formatDate(selectedApplication.approvalDate)}</p>
                  </div>
                )}
                {selectedApplication.rejectionReason && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium">Rejection Reason</p>
                    <p className="text-lg">{selectedApplication.rejectionReason}</p>
                  </div>
                )}
              </div>

              {/* Products Section */}
              <div>
                <p className="text-sm font-medium mb-2">Products</p>
                {selectedApplication.products && selectedApplication.products.length > 0 ? (
                  <div className="space-y-3">
                    {selectedApplication.products.map((product, index) => (
                      <div key={index} className="border p-3 rounded-md">
                        <p className="font-medium">{product.productName}</p>
                        <p className="text-sm text-muted-foreground">{product.productDetails}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No products listed</p>
                )}
              </div>

              {/* Fees Section */}
              {selectedApplication.fees && (
                <div>
                  <p className="text-sm font-medium mb-2">Fees</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm">Stall Price</p>
                      <p className="font-medium">₹{selectedApplication.fees.stallPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm">Platform Fee</p>
                      <p className="font-medium">₹{selectedApplication.fees.platformFee.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm">Entry Fee</p>
                      <p className="font-medium">₹{selectedApplication.fees.entryFee.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm">GST</p>
                      <p className="font-medium">₹{selectedApplication.fees.gst.toLocaleString()}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium">Total Amount</p>
                      <p className="text-lg font-bold">₹{selectedApplication.fees.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Details Section */}
              {selectedApplication.paymentDetails && (
                <div>
                  <p className="text-sm font-medium mb-2">Payment Details</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedApplication.paymentDetails.razorpayOrderId && (
                      <div>
                        <p className="text-sm">Razorpay Order ID</p>
                        <p className="font-medium">{selectedApplication.paymentDetails.razorpayOrderId}</p>
                      </div>
                    )}
                    {selectedApplication.paymentDetails.razorpayPaymentId && (
                      <div>
                        <p className="text-sm">Razorpay Payment ID</p>
                        <p className="font-medium">{selectedApplication.paymentDetails.razorpayPaymentId}</p>
                      </div>
                    )}
                    {selectedApplication.paymentDetails.amount && (
                      <div>
                        <p className="text-sm">Amount Paid</p>
                        <p className="font-medium">₹{selectedApplication.paymentDetails.amount.toLocaleString()}</p>
                      </div>
                    )}
                    {selectedApplication.paymentDetails.paidAt && (
                      <div>
                        <p className="text-sm">Paid At</p>
                        <p className="font-medium">{formatDate(selectedApplication.paymentDetails.paidAt)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

