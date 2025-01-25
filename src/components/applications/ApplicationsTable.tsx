// components/applications/ApplicationsTable.tsx
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CreditCard } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

interface Application {
  _id: string;
  eventId: {
    title: string;
    venue: string;
    startDate: string;
  };
  stallId: number;
  status: 'pending' | 'approved' | 'rejected' | 'payment_pending' | 'payment_completed' | 'expired';
  applicationDate: string;
  products: Array<{
    productName: string;
    productDetails: string;
  }>;
  fees: {
    stallPrice: number;
    platformFee: number;
    entryFee: number;
    gst: number;
    totalAmount: number;
  };
}

export function ApplicationsTable() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    approved: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    payment_pending: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    payment_completed: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
    expired: "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300"
  };

  const handlePayment = async (applicationId: string) => {
    // Will implement Razorpay integration here
  };

  const handlePreview = (application: Application) => {
    setSelectedApplication(application);
    setShowPreview(true);
  };

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
          {applications.map((application) => (
            <TableRow key={application._id}>
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
          ))}
        </TableBody>
      </Table>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              {/* Application preview content */}
              <div className="grid gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Event Details</h3>
                  <p className="text-lg font-medium">{selectedApplication.eventId.title}</p>
                  <p className="text-muted-foreground">{selectedApplication.eventId.venue}</p>
                  <p className="text-muted-foreground">
                    Starting {format(new Date(selectedApplication.eventId.startDate), "MMMM d, yyyy")}
                  </p>
                </div>

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
  );
}