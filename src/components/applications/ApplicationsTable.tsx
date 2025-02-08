"use client";

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, CreditCard } from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format } from "date-fns"

interface Application {
  _id: string;
  eventId: {    
    _id: string;
    title: string;
    venue: string;
    startDate: string;
  };
  vendorId: {   
    name: string;
    email: string;
    contact: string;
  };
  stallId: number;
  status: 'pending' | 'approved' | 'rejected' | 'payment_pending' | 'payment_completed' | 'expired';
  products: Array<{
    productName: string;
    productDetails: string;
  }>;
  applicationDate: string;
  approvalDate?: string;
  rejectionReason?: string;
  paymentDeadline?: string;
  fees: {
    stallPrice: number;
    platformFee: number;
    entryFee: number;
    gst: number;
    totalAmount: number;
  };
  createdAt: string;
  updatedAt: string;
}

export function ApplicationsTable() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("/api/vendor/applications")
        if (!response.ok) {
          throw new Error("Failed to fetch applications")
        }
        const data = await response.json()
        setApplications(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load applications")
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    approved: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    payment_pending: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    payment_completed: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
    expired: "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300"
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePayment = async (applicationId: string) => {
    // Will implement Razorpay integration here
  }

  const handlePreview = (application: Application) => {
    setSelectedApplication(application)
    setShowPreview(true)
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Stall ID</TableHead>
            <TableHead>Applied On</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                No applications found
              </TableCell>
            </TableRow>
          ) : (
            applications.map((application) => (
              <TableRow key={application._id}>
                <TableCell className="font-medium">
                  <div>
                    <p className="font-semibold">{application.eventId.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {application.eventId.venue}
                    </p>
                  </div>
                </TableCell>
                <TableCell>#{application.stallId}</TableCell>
                <TableCell>
                  {format(new Date(application.applicationDate), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  ₹{application.fees.totalAmount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge 
                    className={statusStyles[application.status]}
                    variant="secondary"
                  >
                    {application.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(application)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    {application.status === 'payment_pending' && (
                      <Button
                        size="sm"
                        onClick={() => handlePayment(application._id)}
                      >
                        <CreditCard className="h-4 w-4 mr-1" />
                        Pay Now
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
      <DialogContent className="max-w-3xl">
  <DialogHeader>
    <DialogTitle>Application Details</DialogTitle>
  </DialogHeader>
  {selectedApplication && (
    <div className="space-y-6">
      <div className="grid gap-4">
        {/* Event Details */}
        <div>
          <h3 className="font-semibold mb-2">Event Details</h3>
          <p className="text-lg font-medium">{selectedApplication.eventId.title}</p>
          <p className="text-muted-foreground">{selectedApplication.eventId.venue}</p>
          <p className="text-muted-foreground">
            Starting {format(new Date(selectedApplication.eventId.startDate), "MMMM d, yyyy")}
          </p>
        </div>

        {/* Application Status Information */}
        <div>
          <h3 className="font-semibold mb-2">Application Status</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={statusStyles[selectedApplication.status]} variant="secondary">
                {selectedApplication.status.replace('_', ' ').toUpperCase()}
              </Badge>
              {selectedApplication.paymentDeadline && selectedApplication.status === 'payment_pending' && (
                <p className="text-sm text-muted-foreground">
                  Payment due by: {format(new Date(selectedApplication.paymentDeadline), "MMM d, yyyy h:mm a")}
                </p>
              )}
            </div>
            {selectedApplication.status === 'rejected' && selectedApplication.rejectionReason && (
              <div className="mt-2">
                <p className="text-sm font-medium text-destructive">Rejection Reason:</p>
                <div className="mt-1 p-3 bg-destructive/10 rounded-md">
                  <p className="text-sm text-destructive">{selectedApplication.rejectionReason}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div>
          <h3 className="font-semibold mb-2">Products</h3>
          <div className="space-y-4">
            {selectedApplication.products.map((product, index) => (
              <div key={index} className="bg-muted p-4 rounded-lg">
                <p className="font-medium">{product.productName}</p>
                <p className="text-muted-foreground">{product.productDetails}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Breakdown */}
        <div>
          <h3 className="font-semibold mb-2">Fee Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Stall Price:</span>
              <span>₹{selectedApplication.fees.stallPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Platform Fee (5%):</span>
              <span>₹{selectedApplication.fees.platformFee.toLocaleString()}</span>
            </div>
            {selectedApplication.fees.entryFee > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>Entry Fee:</span>
                <span>₹{selectedApplication.fees.entryFee.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>GST (18%):</span>
              <span>₹{selectedApplication.fees.gst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total Amount:</span>
              <span>₹{selectedApplication.fees.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
</DialogContent>
      </Dialog>
    </div>
  )
}