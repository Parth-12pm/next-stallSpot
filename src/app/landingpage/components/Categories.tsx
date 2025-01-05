import React from 'react';
import { Briefcase, Cpu, Palette, Leaf, Building2, Microscope } from 'lucide-react';

export function Categories() {
  const categories = [
    {
      icon: <Cpu className="w-8 h-8 text-blue-500" />,
      name: "Technology",
      count: "45 Events"
    },
    {
      icon: <Briefcase className="w-8 h-8 text-blue-500" />,
      name: "Business",
      count: "32 Events"
    },
    {
      icon: <Palette className="w-8 h-8 text-blue-500" />,
      name: "Art & Design",
      count: "28 Events"
    },
    {
      icon: <Leaf className="w-8 h-8 text-blue-500" />,
      name: "Agriculture",
      count: "20 Events"
    },
    {
      icon: <Building2 className="w-8 h-8 text-blue-500" />,
      name: "Real Estate",
      count: "15 Events"
    },
    {
      icon: <Microscope className="w-8 h-8 text-blue-500" />,
      name: "Science",
      count: "25 Events"
    }
  ];

  return (
    <div className="bg-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {categories.map((category, index) => (
            <div key={index} className="text-center group cursor-pointer">
              <div className="bg-gray-700 w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/10 transition-colors">
                {category.icon}
              </div>
              <h3 className="text-lg font-semibold mb-1 text-white">{category.name}</h3>
              <p className="text-sm text-gray-400">{category.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}