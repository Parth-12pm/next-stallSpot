// components/applications/ConfirmationDialog.tsx
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  import { Card } from "@/components/ui/card";
  import { Separator } from "@/components/ui/separator";
  import { ScrollArea } from "@/components/ui/scroll-area";
  import { Label } from "@/components/ui/label";
  
  interface ConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isSubmitting: boolean;
    data: {
      stall: {
        displayId: string;
        type: string;
        size: string;
        category: string;
      };
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
    };
  }
  
  export function ConfirmationDialog({
    open,
    onOpenChange,
    onConfirm,
    isSubmitting,
    data
  }: ConfirmationDialogProps) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Application Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Please review your application details before submitting.
            </AlertDialogDescription>
          </AlertDialogHeader>
  
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-6 py-4">
              {/* Stall Details */}
              <div>
                <h3 className="font-semibold mb-2">Selected Stall</h3>
                <Card className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Stall Number</Label>
                      <p className="font-medium">{data.stall.displayId}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Type</Label>
                      <p className="font-medium capitalize">{data.stall.type}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Size</Label>
                      <p className="font-medium">{data.stall.size}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Category</Label>
                      <p className="font-medium">{data.stall.category}</p>
                    </div>
                  </div>
                </Card>
              </div>
  
              {/* Products */}
              <div>
                <h3 className="font-semibold mb-2">Products</h3>
                <div className="space-y-3">
                  {data.products.map((product, index) => (
                    <Card key={index} className="p-4">
                      <p className="font-medium">{product.productName}</p>
                      <p className="text-muted-foreground text-sm mt-1">
                        {product.productDetails}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
  
              {/* Fee Breakdown */}
              <div>
                <h3 className="font-semibold mb-2">Fee Breakdown</h3>
                <Card className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span>₹{data.fees.stallPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Platform Fee (5%):</span>
                      <span>₹{data.fees.platformFee.toLocaleString()}</span>
                    </div>
                    {data.fees.entryFee > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Entry Fee:</span>
                        <span>₹{data.fees.entryFee.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted-foreground">
                      <span>GST (18%):</span>
                      <span>₹{data.fees.gst.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold pt-2">
                      <span>Total Amount:</span>
                      <span>₹{data.fees.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </ScrollArea>
  
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }