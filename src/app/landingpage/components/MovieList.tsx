import React from 'react';
import { MovieCard } from './MovieCard';

export function MovieList() {
  const movies = [
    {
      title: "The Dark Knight",
      imageUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=600",
      rating: 9.0,
      language: "English",
      duration: "2h 32m"
    },
    {
      title: "Inception",
      imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600",
      rating: 8.8,
      language: "English",
      duration: "2h 28m"
    },
    {
      title: "Interstellar",
      imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600",
      rating: 8.6,
      language: "English",
      duration: "2h 49m"
    }
  ];

  return (
    <div className="bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-white">Now Showing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {movies.map((movie, index) => (
            <MovieCard key={index} {...movie} />
          ))}
        </div>
      </div>
    </div>
  );
}