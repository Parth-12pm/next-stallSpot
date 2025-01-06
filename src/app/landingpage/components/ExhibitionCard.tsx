import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ExhibitionCardProps {
  title: string;
  imageUrl: string;
  date: string;
  location: string;
  exhibitors: number;
  category: string;
}

export function ExhibitionCard({ title, imageUrl, date, location, exhibitors, category }: ExhibitionCardProps) {
  return (
    <Card className="group overflow-hidden bg-background border-border hover:border-primary/20 transition-all duration-300">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </div>
      
      <CardHeader className="pb-2">
        <Badge variant="secondary" className="w-fit mb-2">
          {category}
        </Badge>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="space-y-2 text-muted-foreground">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-primary" />
            <span>{exhibitors} Exhibitors</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}