import React from 'react';
import { Search, Calendar, MapPin } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative bg-black">
      <img
        src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1920"
        alt="Exhibition Hall"
        className="w-full h-[600px] object-cover opacity-30"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white max-w-4xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Discover World-Class Exhibitions</h1>
          <p className="text-xl mb-8">Find and book your spot at the most innovative exhibitions worldwide</p>
          <div className="bg-gray-800/90 p-6 rounded-lg backdrop-blur">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search exhibitions..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Select dates"
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <button className="mt-4 w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Search Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}