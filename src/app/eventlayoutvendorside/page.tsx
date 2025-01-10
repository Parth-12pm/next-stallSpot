"use client";

import React, { useState } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Square, CheckSquare, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Stall {
  id: number;
  number: string;
  size: string;
  price: number;
  isAvailable: boolean;
}

const layoutData = {
  image: "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&q=80",
  stalls: [
    { id: 1, number: "A1", size: "10x10", price: 5000, isAvailable: true },
    { id: 2, number: "A2", size: "10x10", price: 5000, isAvailable: false },
    { id: 3, number: "B1", size: "8x8", price: 4000, isAvailable: true },
    { id: 4, number: "B2", size: "8x8", price: 4000, isAvailable: true },
  ] as Stall[]
};

export default function VendorStallLayout() {
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleStallSelect = (stall: Stall) => {
    if (stall.isAvailable) {
      setSelectedStall(stall);
      setIsBookingOpen(true);
    }
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Exhibition Layout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Section */}
            <div className="space-y-6">
              {/* Layout Image */}
              <Card className="p-4">
                <h2 className="text-xl font-semibold mb-4">Layout View</h2>
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <img 
                    src={layoutData.image} 
                    alt="Exhibition Layout"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
              
              {/* Stall Grid */}
              <Card className="p-4">
                <h2 className="text-xl font-semibold mb-4">Available Stalls</h2>
                <div className="grid grid-cols-2 gap-4">
                  {layoutData.stalls.map((stall) => (
                    <div
                      key={stall.id}
                      onClick={() => handleStallSelect(stall)}
                      className={`p-4 rounded-lg border ${
                        stall.isAvailable 
                          ? 'border-green-500 bg-green-50 dark:bg-green-950/20 cursor-pointer hover:shadow-md transition-shadow' 
                          : 'border-red-500 bg-red-50 dark:bg-red-950/20'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-lg font-semibold">Stall {stall.number}</span>
                        {stall.isAvailable ? (
                          <CheckSquare className="h-5 w-5 text-green-500" />
                        ) : (
                          <Square className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="space-y-1 text-sm">
                        <p>Size: {stall.size} ft</p>
                        <p className="flex items-center gap-1">
                          <IndianRupee className="h-4 w-4" />
                          {stall.price}
                        </p>
                        <Badge variant={stall.isAvailable ? "secondary" : "destructive"}>
                          {stall.isAvailable ? "Available" : "Booked"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            
            {/* Right Section */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Booking Instructions</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Click on any available stall to book it for the exhibition.</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Green highlighted stalls are available for booking</li>
                    <li>Red highlighted stalls are already booked</li>
                    <li>Prices are based on stall size and location</li>
                    <li>Booking is final and cannot be changed once confirmed</li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Booking Confirmation Dialog */}
        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Stall Booking</DialogTitle>
            </DialogHeader>
            {selectedStall && (
              <div className="py-4">
                <p className="text-lg font-medium">Stall Details:</p>
                <ul className="mt-2 space-y-2">
                  <li>Number: {selectedStall.number}</li>
                  <li>Size: {selectedStall.size} ft</li>
                  <li>Price: ₹{selectedStall.price}</li>
                </ul>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
                Cancel
              </Button>
              <Button >
                Confirm Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}