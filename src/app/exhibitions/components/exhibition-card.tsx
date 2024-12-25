"use client";

import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, IndianRupee } from "lucide-react";
import Image from "next/image";
import type { Exhibition } from "../data/mock";
import { Card } from "@/components/ui/card";

interface ExhibitionCardProps {
  exhibition: Exhibition;
}

export function ExhibitionCard({ exhibition }: ExhibitionCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group border border-border">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 relative h-[200px] md:h-auto overflow-hidden">
          <Image
            src={exhibition.image}
            alt={exhibition.name}
            fill
            className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-6 md:w-2/3">
          <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
            {exhibition.name}
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Calendar className="h-4 w-4" />
              <span>{exhibition.date}</span>
            </div>
            <div className="flex items-center gap-2 hover:text-foreground transition-colors">
              <MapPin className="h-4 w-4" />
              <span>{exhibition.venue}</span>
            </div>
            <div className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Clock className="h-4 w-4" />
              <span>{exhibition.time}</span>
            </div>
            <div className="flex items-center gap-2 hover:text-foreground transition-colors">
              <IndianRupee className="h-4 w-4" />
              <span>{exhibition.rate.replace('₹', '')}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              {exhibition.availableStalls} stalls available
            </Badge>
            <Badge className="group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
              {exhibition.category}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}