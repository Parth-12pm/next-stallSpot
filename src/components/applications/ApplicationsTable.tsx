// src/components/applications/ApplicationsTable.tsx
"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, CreditCard } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import type { IApplication } from "@/models/Application"
import type { IEvent } from "@/models/Event"
import type { Types } from "mongoose"

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
        name: "Your Company Name",
        description: `Payment for ${orderData.eventTitle}`,
        order_id: orderData.orderId,
        handler: async (response: RazorpayResponse) => {
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

            if (verifyResponse.ok) {
              toast({
                title: "Payment Successful",
                description: "Your payment has been processed successfully.",
              })
              fetchApplications()
            } else {
              throw new Error("Payment verification failed")
            }
          } catch (error) {
            console.error("Error verifying payment:", error)
            toast({
              title: "Payment Verification Failed",
              description: "There was an issue verifying your payment. Please contact support.",
              variant: "destructive",
            })
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

  if (loading) {
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
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="space-y-2">
                    <div className="h-5 w-[180px] animate-pulse rounded-md bg-gray-200" />
                    <div className="h-4 w-[140px] animate-pulse rounded-md bg-gray-100" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="h-4 w-[60px] animate-pulse rounded-md bg-gray-200" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-[120px] animate-pulse rounded-md bg-gray-200" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-[100px] animate-pulse rounded-md bg-gray-200" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-[100px] animate-pulse rounded-full bg-gray-200" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-[90px] animate-pulse rounded-md bg-gray-200" />
                    <div className="h-8 w-[90px] animate-pulse rounded-md bg-gray-200" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
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
          {selectedApplication && <div className="space-y-6">{/* Application details content */}</div>}
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
  expired: "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300",
}

