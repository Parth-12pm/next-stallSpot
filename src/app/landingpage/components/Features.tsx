import React from 'react';
import { Layout, Users, Map } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  features 
}) => {
  return (
    <div className="text-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <Icon className="w-10 h-10 text-primary mr-4" />
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <span className="mr-2">•</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Features() {
  return (
    <section className="py-16 bg-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="space-y-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">Why Choose StallSpot?</h2>
            <p className="mt-4 text-lg text-gray-600">Empowering exhibitions with innovative solutions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Layout}
              title="For Organizers"
              description="Powerful tools to manage your exhibitions"
              features={[
                "Interactive floor plan editor",
                "Vendor management system",
                "Real-time analytics"
              ]}
            />
            <FeatureCard
              icon={Users}
              title="For Vendors"
              description="Everything you need to succeed"
              features={[
                "Booth customization",
                "Lead capture tools",
                "Performance metrics"
              ]}
            />
            <FeatureCard
              icon={Map}
              title="For Visitors"
              description="Enhanced exhibition experience"
              features={[
                "Interactive maps",
                "Event schedules",
                "Networking opportunities"
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}