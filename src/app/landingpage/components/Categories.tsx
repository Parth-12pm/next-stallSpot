import React from 'react';
import { Briefcase, Cpu, Palette, Leaf, Building2, Microscope } from 'lucide-react';
import { Card } from "@/components/ui/card";

interface CategoryCardProps {
  icon: React.ReactNode;
  name: string;
  count: string;
}

function CategoryCard({ icon, name, count }: CategoryCardProps) {
  return (
    <Card className="group cursor-pointer bg-background hover:bg-primary/5 border-border hover:border-primary/20 transition-all duration-300">
      <div className="p-6 text-center">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 bg-background border border-border group-hover:border-primary/20 transition-colors">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-1 text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground">{count}</p>
      </div>
    </Card>
  );
}

export function Categories() {
  const categories = [
    {
      icon: <Cpu className="w-8 h-8 text-primary" />,
      name: "Technology",
      count: "45 Events"
    },
    {
      icon: <Briefcase className="w-8 h-8 text-primary" />,
      name: "Business",
      count: "32 Events"
    },
    {
      icon: <Palette className="w-8 h-8 text-primary" />,
      name: "Art & Design",
      count: "28 Events"
    },
    {
      icon: <Leaf className="w-8 h-8 text-primary" />,
      name: "Agriculture",
      count: "20 Events"
    },
    {
      icon: <Building2 className="w-8 h-8 text-primary" />,
      name: "Real Estate",
      count: "15 Events"
    },
    {
      icon: <Microscope className="w-8 h-8 text-primary" />,
      name: "Science",
      count: "25 Events"
    }
  ];

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
}