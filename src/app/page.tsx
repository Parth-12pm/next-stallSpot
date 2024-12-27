import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import { ArrowRight, Layout, Users, Map } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <section className="py-16 lg:py-20 bg-gradient-to-b from-background to-muted">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Transform Your Exhibition Management Experience
            </h1>
            <p className="text-xl text-muted-foreground">
              Streamline your exhibition planning, management, and execution with our comprehensive platform.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="auth/signup">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/exhibitions">Browse Exhibitions</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="space-y-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight">Why Choose StallSpot?</h2>
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
        </Container>
      </section>

      <section className="py-16 bg-muted/50">
        <Container>
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to Transform Your Exhibitions?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of successful exhibition organizers and vendors.
            </p>
            <Button size="lg" asChild>
              <Link href="/auth/signup">Start Free Trial</Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  features
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <div className="mb-2">
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center text-sm">
              <ArrowRight className="mr-2 h-4 w-4 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}