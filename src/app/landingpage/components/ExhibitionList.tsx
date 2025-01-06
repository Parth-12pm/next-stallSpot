import React from 'react';
import { ExhibitionCard } from './ExhibitionCard';

export function ExhibitionList() {
  const exhibitions = [
    {
      title: "Tech Innovation Expo 2024",
      imageUrl: "/api/placeholder/600/400",
      date: "Mar 15-20, 2024",
      location: "Silicon Valley Convention Center",
      exhibitors: 250,
      category: "Technology"
    },
    {
      title: "Global Trade Fair",
      imageUrl: "/api/placeholder/600/400",
      date: "Apr 5-10, 2024",
      location: "World Trade Center",
      exhibitors: 500,
      category: "Business"
    },
    {
      title: "Art & Design Exhibition",
      imageUrl: "/api/placeholder/600/400",
      date: "May 1-7, 2024",
      location: "Metropolitan Gallery",
      exhibitors: 150,
      category: "Art"
    }
  ];

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-foreground">Featured Exhibitions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exhibitions.map((exhibition, index) => (
            <ExhibitionCard key={index} {...exhibition} />
          ))}
        </div>
      </div>
    </section>
  );
}