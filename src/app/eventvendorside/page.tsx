'use client';

import React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { CalendarIcon, Clock, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Image from 'next/image';


const eventData = {
  title: "Art Exhibition 2024",
  thumbnail: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&q=80",
  description: "Join us for an extraordinary showcase of contemporary art featuring works from emerging and established artists. Experience a diverse collection of paintings, sculptures, and digital art installations.",
  startDate: "2024-04-15",
  endDate: "2024-04-20",
  startTime: "10:00",
  endTime: "18:00",
  venue: "Metropolitan Art Gallery",
  category: "Art",
  charges: "500",
  totalStalls: 16,
  facilities: [
    "Air Conditioning",
    "Parking",
    "Security",
    "Refreshments",
    "WiFi"
  ]
};

export default function EventDetails() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Section - Image Only */}
            <div className="sticky top-8 h-fit">
              <div className="aspect-[4/3] overflow-hidden rounded-xl">
                <Image 
                  src={eventData.thumbnail} 
                  alt={eventData.title}
                  className="w-full h-full object-cover"
                  width={800}
                  height={600}
                />
              </div>
            </div>

            {/* Right Section - All Details */}
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{eventData.title}</h1>
                <div className="mt-2 flex gap-2">
                  <Badge variant="secondary">{eventData.category}</Badge>
                  <Badge variant="outline">₹{eventData.charges} Entry Fee</Badge>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <span>{new Date(eventData.startDate).toLocaleDateString()} - {new Date(eventData.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{eventData.startTime} - {eventData.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{eventData.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>{eventData.totalStalls} Stalls Available</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h2 className="text-xl font-semibold mb-3">About Event</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {eventData.description}
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h2 className="text-xl font-semibold mb-3">Facilities</h2>
                <div className="grid grid-cols-2 gap-4">
                  {eventData.facilities.map((facility, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {facility}
                    </div>
                  ))}












                </div>
              </div>
              <div className="left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t">
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-center">
                  <Button 
                    size="lg" 
                    className="w-full md:w-auto font-semibold text-lg"
                    onClick={() => alert('Booking functionality coming soon!')}
                  >
                    Book A Stall
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Book A Stall Button */}

      </div>
    </ThemeProvider>
  );
}