import React from 'react';
import { Layout, Users, Map } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <div className="group">
      <Card className="h-full border-border bg-background transition-all duration-300 hover:border-primary/20">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2">
              <Icon className="w-6 h-6 text-foreground group-hover:text-foreground/90" />
            </div>
            <CardTitle className="text-lg font-medium">
              {title}
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                <div className="h-1 w-1 rounded-full bg-muted-foreground group-hover:bg-foreground/80" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Features() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="space-y-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl font-medium text-foreground">
              Why Choose StallSpot?
            </h2>
            <p className="text-base text-muted-foreground">
              Empowering exhibitions with innovative solutions
            </p>
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