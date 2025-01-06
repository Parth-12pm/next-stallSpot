"use client";

import React, { useState } from 'react';
import { Building2, Menu, User, X } from 'lucide-react';


export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gray-900/70 border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Building2 className="w-8 h-8 text-blue-500" />
            <span className="ml-2 text-xl font-bold text-white">StallSpot</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-300 hover:text-blue-500 transition-colors">Exhibitions</a>
            <a href="#" className="text-gray-300 hover:text-blue-500 transition-colors">Venues</a>
            <a href="#" className="text-gray-300 hover:text-blue-500 transition-colors">Organizers</a>
            <a href="#" className="text-gray-300 hover:text-blue-500 transition-colors">About</a>
            <button className="bg-blue-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center shadow-lg shadow-blue-500/20">
              <User className="w-4 h-4 mr-2" />
              Sign In
            </button>
          </div>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden backdrop-blur-md bg-gray-900/95 border-b border-gray-800/50">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <a href="#" className="block px-3 py-2 text-gray-300 hover:text-blue-500 transition-colors">Exhibitions</a>
            <a href="#" className="block px-3 py-2 text-gray-300 hover:text-blue-500 transition-colors">Venues</a>
            <a href="#" className="block px-3 py-2 text-gray-300 hover:text-blue-500 transition-colors">Organizers</a>
            <a href="#" className="block px-3 py-2 text-gray-300 hover:text-blue-500 transition-colors">About</a>
            <button className="w-full mt-2 bg-blue-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <User className="w-4 h-4 mr-2" />
              Sign In
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}