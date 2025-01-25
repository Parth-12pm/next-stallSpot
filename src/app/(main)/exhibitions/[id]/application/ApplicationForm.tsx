// app/(main)/exhibitions/[id]/application/ApplicationForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, Plus, Trash2, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import type { Event, Stall } from '@/components/events/types/types';
import type { ProfileFormData } from '@/components/profile/types/profile';

interface ProductData {
  productName: string;
  productDetails: string;
}

interface ApplicationFormProps {
  event: Event;
  stall: Stall;
  vendorProfile: ProfileFormData;
}

interface Errors {
  [key: string]: {
    productName?: string;
    productDetails?: string;
  };
}

export function ApplicationForm({ event, stall, vendorProfile }: ApplicationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<ProductData[]>([{ productName: '', productDetails: '' }]);
  const [errors, setErrors] = useState<Errors>({});

  // Calculate fees
  const stallPrice = Number(stall.price);
  const platformFee = Math.ceil(stallPrice * 0.05);
  const entryFee = event.entryFee ? Number(event.entryFee) : 0;
  const subtotal = stallPrice + platformFee + entryFee;
  const gst = Math.ceil(subtotal * 0.18);
  const totalAmount = subtotal + gst;

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    let isValid = true;

    products.forEach((product, index) => {
      newErrors[index] = {};
      
      if (!product.productName || product.productName.length < 2) {
        newErrors[index].productName = "Product name must be at least 2 characters";
        isValid = false;
      }
      if (!product.productDetails || product.productDetails.length < 10) {
        newErrors[index].productDetails = "Product details must be at least 10 characters";
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;
      
      setIsSubmitting(true);
      
      const response = await fetch(`/api/exhibitions/${event._id}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stallId: stall.stallId,
          products,
          fees: {
            stallPrice,
            platformFee,
            entryFee,
            gst,
            totalAmount
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully.",
      });

      router.push('/dashboard/applications');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit application",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-[1200px] mx-auto space-y-8">
        {/* Stall Information */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Store className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Selected Stall Information</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Label className="text-muted-foreground">Stall Number</Label>
              <p className="font-medium mt-1">{stall.displayId}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Type</Label>
              <p className="font-medium mt-1 capitalize">{stall.type}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Size</Label>
              <p className="font-medium mt-1">{stall.size}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Category</Label>
              <p className="font-medium mt-1">{stall.category}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Base Price</Label>
              <p className="font-medium mt-1">₹{stallPrice.toLocaleString()}</p>
            </div>
            {event.entryFee && (
              <div>
                <Label className="text-muted-foreground">Entry Fee</Label>
                <p className="font-medium mt-1">₹{event.entryFee}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Vendor Details */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Vendor Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="font-medium mt-1">{vendorProfile.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium mt-1">{vendorProfile.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Contact</Label>
                <p className="font-medium mt-1">{vendorProfile.contact}</p>
              </div>
              <div className="col-span-full">
                <Label className="text-muted-foreground">Address</Label>
                <p className="font-medium mt-1">{vendorProfile.address}</p>
              </div>
              {vendorProfile.companyDetails && (
                <>
                  <div>
                    <Label className="text-muted-foreground">Company Name</Label>
                    <p className="font-medium mt-1">{vendorProfile.companyDetails.companyName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Registration Type</Label>
                    <p className="font-medium mt-1">{vendorProfile.companyDetails.registrationType}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Registration Number</Label>
                    <p className="font-medium mt-1">{vendorProfile.companyDetails.registrationNumber}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Products Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <Card key={index} className="p-4 bg-background">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Product {index + 1}</h3>
                    {products.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90"
                        onClick={() => {
                          const newProducts = products.filter((_, i) => i !== index);
                          setProducts(newProducts);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`productName-${index}`}>Product Name</Label>
                      <Input
                        id={`productName-${index}`}
                        value={product.productName}
                        onChange={(e) => {
                          const newProducts = [...products];
                          newProducts[index].productName = e.target.value;
                          setProducts(newProducts);
                        }}
                        placeholder="Enter product name"
                        className="mt-1"
                      />
                      {errors[index]?.productName && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertDescription>{errors[index].productName}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`productDetails-${index}`}>Product Details</Label>
                      <Textarea
                        id={`productDetails-${index}`}
                        value={product.productDetails}
                        onChange={(e) => {
                          const newProducts = [...products];
                          newProducts[index].productDetails = e.target.value;
                          setProducts(newProducts);
                        }}
                        placeholder="Describe your product..."
                        className="mt-1 resize-none h-24"
                      />
                      {errors[index]?.productDetails && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertDescription>{errors[index].productDetails}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </Card>
              ))}

              <Card 
                className="p-4 flex items-center justify-center border-2 border-dashed cursor-pointer hover:border-primary/50 transition-colors bg-background"
                onClick={() => setProducts([...products, { productName: '', productDetails: '' }])}
                role="button"
                tabIndex={0}
              >
                <div className="text-center">
                  <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground font-medium">Add Product</p>
                </div>
              </Card>
            </div>
          </div>
        </Card>

        {/* Fee Breakdown */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Fee Breakdown</h2>
          <div className="space-y-4 max-w-md">
            <div className="flex justify-between">
              <span>Base Price:</span>
              <span>₹{stallPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Platform Fee (5%):</span>
              <span>₹{platformFee.toLocaleString()}</span>
            </div>
            {event.entryFee && (
              <div className="flex justify-between text-muted-foreground">
                <span>Entry Fee:</span>
                <span>₹{entryFee.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>GST (18%):</span>
              <span>₹{gst.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total Amount:</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit}
            className="w-full md:w-auto h-12 px-12 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </div>
      </div>
    </div>
  );
}