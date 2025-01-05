import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';

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
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
      <img src={imageUrl} alt={title} className="w-full h-64 object-cover" />
      <div className="p-4">
        <span className="px-2 py-1 bg-blue-500 text-white text-sm rounded-full">{category}</span>
        <h3 className="font-bold text-lg my-2 text-white">{title}</h3>
        <div className="space-y-2 text-gray-300">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-blue-400" />
            <span>{exhibitors} Exhibitors</span>
          </div>
        </div>
      </div>
    </div>
  );
}