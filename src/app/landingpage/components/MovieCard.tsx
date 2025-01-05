import React from 'react';
import { Clock, Star } from 'lucide-react';

interface MovieCardProps {
  title: string;
  imageUrl: string;
  rating: number;
  language: string;
  duration: string;
}

export function MovieCard({ title, imageUrl, rating, language, duration }: MovieCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
      <img src={imageUrl} alt={title} className="w-full h-64 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-white">{title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span>{rating}/10</span>
        </div>
        <div className="flex justify-between text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <span className="px-2 py-1 bg-gray-700 rounded">{language}</span>
        </div>
      </div>
    </div>
  );
}