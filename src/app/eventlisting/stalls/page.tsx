"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface Stall {
  id: number;
  type: string;
  price: string;
  size: string;
  status: 'available' | 'reserved' | 'booked';
}

interface EventData {
  layout: string;
  numberOfStalls: number;
}

export default function StallManagementDemo() {
  const sampleEventData: EventData = {
    layout: "",
    numberOfStalls: 8
  };

  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [stalls, setStalls] = useState<Stall[]>(
    Array.from({ length: sampleEventData.numberOfStalls }, (_, i) => ({
      id: i + 1,
      type: 'standard',
      price: i % 2 === 0 ? '5000' : '',
      size: '3x3',
      status: 'available'
    }))
  );

  const handleStallClick = (stall: Stall) => {
    setSelectedStall(stall);
  };

  const updateStallDetails = (field: keyof Stall, value: string) => {
    if (!selectedStall) return;

    setStalls(prevStalls =>
      prevStalls.map(stall =>
        stall.id === selectedStall.id
          ? { ...stall, [field]: value }
          : stall
      )
    );

    setSelectedStall(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const applyToAllStalls = () => {
    if (!selectedStall) return;

    setStalls(prevStalls =>
      prevStalls.map(stall => ({
        ...stall,
        type: selectedStall.type,
        price: selectedStall.price,
        size: selectedStall.size,
        status: stall.status // Keep original status
      }))
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1800px] mx-auto">
        <h1 className="text-3xl font-bold mb-8">Stall Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Layout and Stalls */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Event Layout</h2>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-6">
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No layout uploaded
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {stalls.map((stall) => (
                  <button
                    key={stall.id}
                    onClick={() => handleStallClick(stall)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedStall?.id === stall.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-sm font-medium">Stall {stall.id}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {stall.type} - {stall.size}
                    </div>
                    <div className="text-xs font-semibold mt-1">
                      {stall.price ? `₹${stall.price}` : 'No price set'}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Side - Stall Details */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                {selectedStall ? `Stall ${selectedStall.id} Details` : 'Select a stall'}
              </h2>

              {selectedStall ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="stallType">Stall Type</Label>
                    <Select
                      value={selectedStall.type}
                      onValueChange={(value) => updateStallDetails('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="corner">Corner</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stallSize">Stall Size</Label>
                    <Select
                      value={selectedStall.size}
                      onValueChange={(value) => updateStallDetails('size', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2x2">2m x 2m</SelectItem>
                        <SelectItem value="3x3">3m x 3m</SelectItem>
                        <SelectItem value="4x4">4m x 4m</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stallPrice">Stall Price (₹)</Label>
                    <Input
                      id="stallPrice"
                      type="number"
                      value={selectedStall.price}
                      onChange={(e) => updateStallDetails('price', e.target.value)}
                      placeholder="Enter price"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stallStatus">Status</Label>
                    <Select
                      value={selectedStall.status}
                      onValueChange={(value: 'available' | 'reserved' | 'booked') => 
                        updateStallDetails('status', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                        <SelectItem value="booked">Booked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 space-y-4">
                    <Button
                      onClick={applyToAllStalls}
                      variant="outline"
                      className="w-full"
                    >
                      Apply to All Stalls
                    </Button>
                    
                    <Button className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Select a stall from the layout to edit its details
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}