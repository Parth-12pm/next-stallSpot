"use client";

import React, { useState, FormEvent } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

interface StallInfo {
  stallNo: string;
  type: string;
  category: string;
  price: string;
  size: string;
}

interface VendorDetails {
  name: string;
  email: string;
  address: string;
}

interface ProductData {
  productName: string;
  productDetails: string;
}

interface Errors {
  [key: string]: {
    productName?: string;
    productDetails?: string;
  };
}

// Mock data (replace with actual API calls)
const mockStallInfo: StallInfo = {
  stallNo: "A-123",
  type: "Premium Corner",
  category: "Artisan Crafts",
  price: "$1,500",
  size: "10' x 12'"
};

const mockVendorDetails: VendorDetails = {
  name: "John Doe Artworks",
  email: "john.doe@example.com",
  address: "123 Artist Avenue, Creative District, CD 12345"
};

const emptyProduct: ProductData = {
  productName: "",
  productDetails: ""
};

export default function VendorApplicationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductData[]>([{ ...emptyProduct }]);
  const [errors, setErrors] = useState<Errors>({});

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    let isValid = true;

    products.forEach((product, index) => {
      newErrors[index] = {};
      
      if (!product.productName || product.productName.length < 2) {
        newErrors[index].productName = "Product name must be at least 2 characters.";
        isValid = false;
      }
      if (!product.productDetails || product.productDetails.length < 10) {
        newErrors[index].productDetails = "Product details must be at least 10 characters.";
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/vendor-applications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            products,
            vendorId: '123' // Replace with actual vendor ID
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit application');
        }

        const result = await response.json();
        router.push(`/applications/${result.id}`);
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : 'Failed to submit application');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const addProduct = () => {
    setProducts([...products, { ...emptyProduct }]);
  };

  const removeProduct = (index: number) => {
    if (products.length > 1) {
      const newProducts = products.filter((_, i) => i !== index);
      setProducts(newProducts);
      
      // Clean up errors for removed product
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    }
  };

  const updateProduct = (index: number, field: keyof ProductData, value: string) => {
    const newProducts = [...products];
    newProducts[index] = {
      ...newProducts[index],
      [field]: value
    };
    setProducts(newProducts);
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <div className="min-h-screen bg-background py-8 px-2">
        <div className="max-w-[1200px] mx-auto bg-card rounded-xl shadow-lg p-6 sm:p-8">
          <div className="mb-10">
            <div className="text-center mb-6">
            </div>
            
            {submitError && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Stall Information Card */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Store className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Stall Information</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <Label className="text-muted-foreground">Stall Number</Label>
                  <p className="font-medium mt-1">{mockStallInfo.stallNo}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="font-medium mt-1">{mockStallInfo.type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Category</Label>
                  <p className="font-medium mt-1">{mockStallInfo.category}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Price</Label>
                  <p className="font-medium mt-1">{mockStallInfo.price}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Size</Label>
                  <p className="font-medium mt-1">{mockStallInfo.size}</p>
                </div>
              </div>
            </Card>

            {/* Vendor Details and Products Card */}
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Vendor Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-muted-foreground">Vendor Name</Label>
                    <p className="font-medium mt-1">{mockVendorDetails.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium mt-1">{mockVendorDetails.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Address</Label>
                    <p className="font-medium mt-1">{mockVendorDetails.address}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

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
                            onClick={() => removeProduct(index)}
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
                            onChange={(e) => updateProduct(index, 'productName', e.target.value)}
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
                            onChange={(e) => updateProduct(index, 'productDetails', e.target.value)}
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

                  {/* Add Product Card */}
                  <Card 
                    className="p-4 flex items-center justify-center border-2 border-dashed cursor-pointer hover:border-primary/50 transition-colors bg-background"
                    onClick={addProduct}
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

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <Button 
                type="submit" 
                className="w-full md:w-auto h-12 px-12 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ThemeProvider>
  );
}