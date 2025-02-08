/* eslint-disable @typescript-eslint/no-unused-vars */
// components/applications/OrganizerApplicationsTable.tsx
"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Check, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"

interface Application {
  _id: string
  eventId: {
    _id: string
    title: string
    venue: string
    startDate: string
  }
  vendorId: {
    name: string
    email: string
    contact: string
  }
  stallId: number
  status: "pending" | "approved" | "rejected" | "payment_pending" | "payment_completed" | "expired"
  applicationDate: string
  products: Array<{
    productName: string
    productDetails: string
  }>
  fees: {
    stallPrice: number
    platformFee: number
    entryFee: number
    gst: number
    totalAmount: number
  }
}

export function OrganizerApplicationsTable() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/exhibitions/applications")
      
      if (!response.ok) {
        throw new Error("Failed to fetch applications")
      }
  
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch applications");
      }
  
      setApplications(data.applications);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load applications");
      setApplications([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, status: "approved" | "rejected") => {
    try {
      setIsSubmitting(true);
  
      // Debug log the IDs before making request
      console.log("Selected Application:", selectedApplication);
  
      // Extract eventId properly
      const eventId = selectedApplication?.eventId?._id;
      if (!eventId) {
        throw new Error("Missing event ID");
      }
  
      // Validate IDs
      if (!applicationId || !eventId) {
        throw new Error("Invalid application or event ID");
      }
  
      // Log the URL being called
      console.log(`Calling: /api/exhibitions/${eventId}/applications/${applicationId}/status`);
  
      const response = await fetch(`/api/exhibitions/${eventId}/applications/${applicationId}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status,
          rejectionReason: status === "rejected" ? rejectionReason : undefined
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to update application status");
      }
  
      toast({
        title: `Application ${status}`,
        description: `The application has been ${status} successfully.`
      });
  
      setShowPreview(false);
      setRejectionReason("");
      await fetchApplications();
    } catch (error) {
      console.error("Status update error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update application status",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    approved: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    payment_pending: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    payment_completed: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
    expired: "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300",
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
    <div className="space-y-4 w-full overflow-x-auto">
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Stall ID</TableHead>
            <TableHead>Applied On</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No applications found
              </TableCell>
            </TableRow>
          ) : (
            applications.map((application) => (
              <TableRow key={application._id}>
                <TableCell>
                  <div>
                    <p className="font-semibold">{application.eventId.title}</p>
                    <p className="text-sm text-muted-foreground">{application.eventId.venue}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{application.vendorId.name}</p>
                    <p className="text-sm text-muted-foreground">{application.vendorId.contact}</p>
                  </div>
                </TableCell>
                <TableCell>#{application.stallId}</TableCell>
                <TableCell>{format(new Date(application.applicationDate), "MMM d, yyyy")}</TableCell>
                <TableCell>₹{application.fees.totalAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={statusStyles[application.status]} variant="secondary">
                    {application.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedApplication(application)
                      setShowPreview(true)
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>Review vendor application details and update status</DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Vendor Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <p className="font-medium">{selectedApplication.vendorId.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Contact</Label>
                    <p className="font-medium">{selectedApplication.vendorId.contact}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedApplication.vendorId.email}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedApplication.products.map((product, index) => (
                    <div key={index} className="p-4 bg-muted rounded-lg">
                      <p className="font-medium">{product.productName}</p>
                      <p className="text-sm text-muted-foreground mt-1">{product.productDetails}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Fee Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Fee Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <div className="space-y-2 text-sm sm:text-base">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span>Base Price:</span>
                      <span className="font-medium">₹{selectedApplication.fees.stallPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-muted-foreground">
                      <span>Platform Fee (5%):</span>
                      <span>₹{selectedApplication.fees.platformFee.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-muted-foreground">
                      <span>Entry Fee:</span>
                      <span>₹{selectedApplication.fees.entryFee.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-muted-foreground">
                      <span>GST (18%):</span>
                      <span>₹{selectedApplication.fees.gst.toLocaleString()}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 font-bold pt-2">
                      <span>Total Amount:</span>
                      <span>₹{selectedApplication.fees.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedApplication.status === "pending" && (
                <>
                  <Textarea
                    placeholder="Enter reason for rejection (required only if rejecting)"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="min-h-[100px]"
                  />

                  <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleStatusUpdate(selectedApplication._id, "rejected")}
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(selectedApplication._id, "approved")}
                      disabled={isSubmitting}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </DialogFooter>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

