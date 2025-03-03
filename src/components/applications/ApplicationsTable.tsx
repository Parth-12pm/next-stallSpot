"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, CreditCard, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type { IApplication } from "@/models/Application"
import type { IEvent } from "@/models/Event"
import type { Types } from "mongoose"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill: {
    name: string
    email: string
  }
  theme: {
    color: string
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

interface RazorpayInstance {
  open: () => void
  on: (event: string, handler: () => void) => void
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

interface ExtendedApplication extends Omit<IApplication, "_id"> {
  _id: Types.ObjectId
  eventId: IEvent
}

export function ApplicationsTable() {
  const [applications, setApplications] = useState<ExtendedApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<ExtendedApplication | null>(null)

  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/vendor/applications")
      if (!response.ok) {
        throw new Error("Failed to fetch applications")
      }
      const data = await response.json()
      setApplications(data as ExtendedApplication[])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load applications")
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async (applicationId: Types.ObjectId) => {
    try {
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ applicationId: applicationId.toString() }),
      })

      if (!response.ok) {
        throw new Error("Failed to create order")
      }

      const orderData = await response.json()

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "StallSpot",
        description: `Payment for ${orderData.eventTitle}`,
        order_id: orderData.orderId,
        handler: async (response: RazorpayResponse) => {
          let verifyData
          try {
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            verifyData = await verifyResponse.json()

            if (verifyResponse.ok && verifyData.success) {
              toast({
                title: "Payment Successful",
                description: "Your payment has been processed successfully.",
              })
              router.push(verifyData.redirectUrl)
            } else {
              throw new Error(verifyData.error || "Payment verification failed")
            }




          } catch (error) {
            console.error("Error verifying payment:", error)
            toast({
              title: "Payment Failed",
              description:
                error instanceof Error
                  ? error.message
                  : "There was an issue with your payment. Please try again or contact support.",
              variant: "destructive",
            })
            if (verifyData && verifyData.redirectUrl) {
              router.push(verifyData.redirectUrl)
            }
          }
        },
        prefill: {
          name: orderData.vendorName,
          email: orderData.vendorEmail,
        },
        theme: {
          color: "#F37254",
        },
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.on('modal:close', () => {
        toast({
          title: "Payment Cancelled",
          description: "You closed the payment window. Please try again if you wish to complete the payment.",
        })
      })
      
      paymentObject.open()
    } catch (error) {
      console.error("Error initiating payment:", error)
      toast({
        title: "Payment Initiation Failed",
        description: "There was an issue starting the payment process. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePreview = (application: ExtendedApplication) => {
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
  if (loading) { return(
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-[150px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[100px]" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-[150px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[100px]" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-[150px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[100px]" />
          </CardContent>
        </Card>
      </div>
      <div className="rounded-lg border">
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
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-3 w-[200px]" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[60px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[100px] rounded-full" />
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Skeleton className="h-9 w-[90px] rounded-md" />
                    <Skeleton className="h-9 w-[90px] rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
              <TableRow key={application._id.toString()}>
                <TableCell className="font-medium">
                  <div>
                    <p className="font-semibold">{application.eventId.title}</p>
                    <p className="text-sm text-muted-foreground">{application.eventId.venue}</p>
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
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handlePreview(application)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    {application.status === "payment_pending" && (
                      <Button size="sm" onClick={() => handlePayment(application._id)}>
                        <CreditCard className="h-4 w-4 mr-1" />
                        Pay Now
                      </Button>
                    )}
                    {application.status === "payment_failed" && (
                      <Button size="sm" variant="destructive" onClick={() => handlePayment(application._id)}>
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Retry Payment
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
            <DialogDescription>Review your application information</DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Event Title</Label>
                      <p className="font-medium">{selectedApplication.eventId.title}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Venue</Label>
                      <p className="font-medium">{selectedApplication.eventId.venue}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Event Date</Label>
                    <p className="font-medium">
                      {format(new Date(selectedApplication.eventId.startDate), "MMMM d, yyyy")}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stall Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Stall ID</Label>
                      <p className="font-medium">#{selectedApplication.stallId}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Status</Label>
                      <Badge className={statusStyles[selectedApplication.status]} variant="secondary">
                        {selectedApplication.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fee Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 p-4 rounded-lg bg-muted">
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Stall Price</Label>
                        <p className="text-lg font-semibold">₹{selectedApplication.fees.stallPrice.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Platform Fee</Label>
                        <p className="text-lg font-semibold">
                          ₹{selectedApplication.fees.platformFee.toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Entry Fee</Label>
                        <p className="text-lg font-semibold">₹{selectedApplication.fees.entryFee.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">GST (18%)</Label>
                        <p className="text-lg font-semibold">₹{selectedApplication.fees.gst.toLocaleString()}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center p-4">
                      <span className="text-lg font-semibold">Total Amount</span>
                      <span className="text-2xl font-bold">
                        ₹{selectedApplication.fees.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedApplication.status === "payment_pending" && (
                <Card>
                  <CardContent className="pt-6">
                    <Button className="w-full" size="lg" onClick={() => handlePayment(selectedApplication._id)}>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Proceed to Payment
                    </Button>
                  </CardContent>
                </Card>
              )}

              {selectedApplication.status === "payment_failed" && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Your last payment attempt failed. Please try again or contact support if the issue persists.
                  </AlertDescription>
                </Alert>
              )}

              {selectedApplication.status === "payment_completed" && selectedApplication.paymentDetails && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Transaction ID</Label>
                        <p className="font-mono text-sm">
                          {selectedApplication.paymentDetails.razorpayPaymentId || "N/A"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Amount Paid</Label>
                        <p className="font-semibold">
                          ₹{(selectedApplication.paymentDetails.amount || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Payment Date</Label>
                      <p className="font-medium">
                        {selectedApplication.paymentDetails.paidAt
                          ? format(new Date(selectedApplication.paymentDetails.paidAt), "MMMM d, yyyy 'at' h:mm a")
                          : "N/A"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  approved: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  payment_pending: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  payment_completed: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
  payment_failed: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  expired: "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300",
}

