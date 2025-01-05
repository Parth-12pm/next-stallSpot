import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About StallSpot</h3>
            <p className="text-gray-400">Your premium movie ticket booking destination</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-blue-500 cursor-pointer">Now Live</li>
              <li className="hover:text-blue-500 cursor-pointer">Coming Soon</li>
           <li className="hover:text-blue-500 cursor-pointer"></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-blue-500 cursor-pointer">About Us</li>
              <li className="hover:text-blue-500 cursor-pointer">Contact Us</li>
              <li className="hover:text-blue-500 cursor-pointer">Terms of Service</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <p className="text-gray-400">Follow us on social media for updates and offers</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 StallSpot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}