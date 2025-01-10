import React from 'react';
import { Search, Calendar, MapPin } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function Hero() {
  return (
    <div className="relative bg-background p-20">
      <img
        src="@/src/assets/bgexhi.jpg"
        alt="Exhibition Hall"
        className="w-full h-[600px] object-cover opacity-30"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-foreground max-w-4xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Discover World-Class Exhibitions</h1>
          <p className="text-xl mb-8 text-muted-foreground">Find and book your spot at the most innovative exhibitions worldwide</p>
          
          <Card className="bg-background/80 backdrop-blur-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9 bg-background border-border"
                  placeholder="Search exhibitions..."
                />
              </div>
              
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9 bg-background border-border"
                  placeholder="Select dates"
                />
              </div>
              
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9 bg-background border-border"
                  placeholder="Location"
                />
              </div>
            </div>
            
            <Button className="mt-4 w-full md:w-auto" size="lg">
              Search Events
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}