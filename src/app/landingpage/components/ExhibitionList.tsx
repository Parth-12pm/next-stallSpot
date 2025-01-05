import React from 'react';
import { ExhibitionCard } from './ExhibitionCard';

export function ExhibitionList() {
  const exhibitions = [
    {
      title: "Tech Innovation Expo 2024",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600",
      date: "Mar 15-20, 2024",
      location: "Silicon Valley Convention Center",
      exhibitors: 250,
      category: "Technology"
    },
    {
      title: "Global Trade Fair",
      imageUrl: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=600",
      date: "Apr 5-10, 2024",
      location: "World Trade Center",
      exhibitors: 500,
      category: "Business"
    },
    {
      title: "Art & Design Exhibition",
      imageUrl: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=600",
      date: "May 1-7, 2024",
      location: "Metropolitan Gallery",
      exhibitors: 150,
      category: "Art"
    }
  ];

  return (
    <div className="bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-white">Featured Exhibitions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exhibitions.map((exhibition, index) => (
            <ExhibitionCard key={index} {...exhibition} />
          ))}
        </div>
      </div>
    </div>
  );
}