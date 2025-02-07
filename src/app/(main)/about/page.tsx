import { Building2, Users, Globe2, UserCheck, Lightbulb, Users2, Award, Shield } from 'lucide-react';
import { Hero } from '@/components/HeroAbout';
import { StatCard } from '@/components/StatCard';
import { ValueCard } from '@/components/ValueCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Hero Section with parallax effect */}
      <Hero 
        title="Revolutionizing Exhibition Management"
        subtitle="Transforming the exhibition industry through innovative technology and seamless management solutions"
      >
      </Hero>

      {/* Enhanced Story Section */}
      <div className="container mx-auto px-4 py-32">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-block">
              <h2 className="text-sm font-semibold text-primary tracking-wider uppercase mb-2">Our Journey</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
            </div>
            <h3 className="text-4xl font-bold text-foreground">A Vision for Modern Exhibition Management</h3>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p className="leading-relaxed">
                Founded in 2024, StallSpot emerged from a simple observation: exhibition management needed a digital transformation. Our founders, experienced in both technology and event management, saw the opportunity to bridge this gap.
              </p>
              <p className="leading-relaxed">
                What started as a simple floor plan tool has evolved into a comprehensive platform that serves exhibition organizers, vendors, and visitors alike. Today, we&apos;re proud to be partnering with leading exhibition centers and event organizers worldwide.
              </p>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 -translate-x-8 -translate-y-8 bg-gradient-to-br from-primary to-primary/50 rounded-lg opacity-75" />
              <Image
                src="https://cdn2.allevents.in/transup/5e/af1438207b46cbb10ca8a89a50218f/Designer-5-.jpg"
                alt="Exhibition hall"
                width={800}
                height={400}
                className="relative rounded-lg shadow-xl w-full h-[400px] object-cover transition-transform hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section using existing StatCard */}
      <div className="bg-muted/50 py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard icon={Building2} number="50+" label="Active Exhibitions" />
            <StatCard icon={Users} number="1000+" label="Vendors Served" />
            <StatCard icon={Globe2} number="25+" label="Countries" />
            <StatCard icon={UserCheck} number="10k+" label="Visitors" />
          </div>
        </div>
      </div>

      {/* Values Section using existing ValueCard */}
      <div className="container mx-auto px-4 py-32">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold text-primary tracking-wider uppercase mb-2">Our Values</h2>
          <h3 className="text-4xl font-bold text-foreground mb-4">What Drives Us Forward</h3>
          <p className="text-lg text-muted-foreground">
            Our core values shape everything we do, from product development to customer service.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ValueCard
            icon={Lightbulb}
            title="Innovation"
            description="Continuously pushing boundaries to deliver cutting-edge solutions"
          />
          <ValueCard
            icon={Users2}
            title="Community"
            description="Building strong relationships with our Organizers and Vendors"
          />
          <ValueCard
            icon={Award}
            title="Excellence"
            description="Committed to delivering the highest quality in everything we do"
          />
          <ValueCard
            icon={Shield}
            title="Trust"
            description="Maintaining security and reliability across all our services"
          />
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-primary">
          <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] mix-blend-overlay opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-4xl font-bold mb-6 text-primary-foreground">Join Us in Shaping the Future of Exhibitions</h2>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-10">
            Whether you&apos;re an organizer, vendor, or visitor, we&apos;re here to make your exhibition experience better. Our team is constantly working on new features and improvements based on your feedback.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="font-semibold">
              Get Started Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}