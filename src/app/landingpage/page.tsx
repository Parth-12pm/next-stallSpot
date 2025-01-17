"use client";

import React from 'react';
import { Search, Calendar,Camera,Tag,DollarSign, MapPin, ArrowRight, Building2, Users2, Trophy, ArrowUpRight, Globe2, Users, TrendingUp, UserPlus, Compass, BookCheck, Clock, Bell, Shield, LayoutGrid, Users2Icon, LineChart, Palette, Target, BarChart3, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


const SwirlyBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="w-full h-full opacity-20"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g>
          <path
            d="M200,300 Q400,100 600,400 T1000,300"
            fill="none"
            stroke="url(#gradient1)"
            strokeWidth="2"
            className="animate-[dash_10s_linear_infinite]"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="
                M200,300 Q400,100 600,400 T1000,300;
                M200,400 Q400,200 600,300 T1000,400;
                M200,300 Q400,100 600,400 T1000,300
              "
            />
          </path>
          <path
            d="M0,400 Q200,200 400,500 T800,400"
            fill="none"
            stroke="url(#gradient2)"
            strokeWidth="2"
            className="animate-[dash_12s_linear_infinite]"
          >
            <animate
              attributeName="d"
              dur="12s"
              repeatCount="indefinite"
              values="
                M0,400 Q200,200 400,500 T800,400;
                M0,500 Q200,300 400,400 T800,500;
                M0,400 Q200,200 400,500 T800,400
              "
            />
          </path>
        </g>
        <circle cx="200" cy="300" r="3" fill="hsl(var(--primary))" className="animate-pulse">
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="600" cy="400" r="3" fill="hsl(var(--secondary))" className="animate-pulse">
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};

export default function App() {
  const stats = [
    { icon: Globe2, label: "Global Events", value: "1,000+" },
    { icon: Users, label: "Monthly Visitors", value: "500K+" },
    { icon: TrendingUp, label: "Success Rate", value: "98%" },
  ];

  const upcomingEvents = [
    {
      title: "Modern Art Exhibition",
      location: "New York City",
      date: "Mar 15-20, 2024",
      image: "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&q=80"
    },
    {
      title: "Tech Innovation Summit",
      location: "San Francisco",
      date: "Apr 5-8, 2024",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80"
    }
  ];

  const howItWorks = [
    {
      icon: UserPlus,
      title: "Create an Account",
      description: "Choose your role as Exhibitor or Vendor"
    },
    {
      icon: Compass,
      title: "Explore Options",
      description: "Browse events or available stalls"
    },
    {
      icon: BookCheck,
      title: "Book and Manage",
      description: "Real-time stall booking and management"
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Time-saving System",
      description: "Streamlined booking process saves hours of manual work"
    },
    {
      icon: Bell,
      title: "Real-time Updates",
      description: "Instant notifications on stall availability and changes"
    },
    {
      icon: Shield,
      title: "Intuitive Experience",
      description: "User-friendly interface for seamless navigation"
    }
  ];

  const userTypes = [
    {
      icon: Building2,
      title: "For Organizers",
      description: "Powerful tools to manage your exhibitions",
      features: [
        { icon: LayoutGrid, text: "Interactive floor plan editor" },
        { icon: Users2Icon, text: "Vendor management system" },
        { icon: LineChart, text: "Real-time analytics" }
      ]
    },
    {
      icon: Users2,
      title: "For Vendors",
      description: "Everything you need to succeed",
      features: [
        { icon: Palette, text: "Booth customization" },
        { icon: Target, text: "Lead capture tools" },
        { icon: BarChart3, text: "Performance metrics" }
      ]
    }
  ];

  const faqs = [
    {
      question: "What is StallSpot?",
      answer: "StallSpot is a comprehensive exhibition management platform that connects event organizers with vendors. We streamline the process of booking and managing exhibition spaces, making it easier for both parties to focus on what matters most - creating successful events."
    },
    {
      question: "How does booking work?",
      answer: "Booking is simple! Browse available events, select your preferred stall location, and complete the booking with our secure payment system. Real-time updates ensure you're always viewing current availability, and our automated confirmation system keeps you informed every step of the way."
    },
    {
      question: "Is pricing transparent?",
      answer: "Absolutely! We believe in complete transparency. All costs, including booking fees and any additional services, are clearly displayed before you commit. No hidden charges, no surprises - just straightforward pricing that helps you make informed decisions."
    },
    {
      question: "What if I need help?",
      answer: "Our dedicated support team is available 24/7 to assist you. Whether you need help with booking, have technical questions, or need to make changes to your reservation, we're here to help. Contact us through live chat, email, or phone support."
    },
    {
      question: "Can I manage multiple events?",
      answer: "Yes! Our platform is designed to handle multiple events efficiently. Organizers can manage various exhibitions simultaneously, while vendors can book and track multiple stalls across different events. Our dashboard provides a clear overview of all your activities."
    },
    {
      question: "Is it user-friendly?",
      answer: "StallSpot is designed with user experience in mind. Our intuitive interface, step-by-step guidance, and helpful tooltips make it easy for anyone to use the platform, regardless of their technical expertise. We regularly update our features based on user feedback."
    }
  ];


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&q=80"
            alt="Exhibition Hall"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
          <div className="text-center max-w-5xl mx-auto p-28">
            <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
              Discover World-Class Exhibitions
            </h1>
            
            <p className="text-xl mb-12 text-muted-foreground max-w-2xl mx-auto">
              Find and book your spot at the most innovative exhibitions worldwide. Join the community of passionate event-goers.
            </p>

            <Button size="lg" className="h-12 px-8">
              Explore Events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            </div>
            </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-12">
            Upcoming Events
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.slice(0, 2).map((event) => (
              <Card key={event.title} className="overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {event.title}
                  </h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {event.date}
                    </span>
                    <Button variant="ghost" size="sm">
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

             <Card className="overflow-hidden group flex items-center justify-center hover:bg-accent transition-colors cursor-pointer">
              <div className="p-6 text-center flex flex-col items-center">
                <h3 className="text-3xl font-extrabold text-foreground mb-4">
                  View All Events
                </h3>
                <ArrowUpRight className="h-12 w-12 text-muted-foreground group-hover:text-foreground transition-colors transform group-hover:scale-110 duration-200" />
              </div>
            </Card>
          </div>
        </div>
      </section>


      {/* How It Works Section */}
      <section className="py-20 bg-card relative overflow-hidden">
        <SwirlyBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              Get started with our platform in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <Card key={step.title} className="p-8 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all group min-h-[320px] flex flex-col">
                <div className="relative flex-1">
                  <div className="flex items-center justify-center mb-8">
                    <div className="p-6 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                      <step.icon className="h-8 w-8 text-foreground" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{step.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

{/* FAQ Section */}
<section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Got Questions?</h2>
              <p className="text-lg text-muted-foreground">
                We've got answers! Check out our FAQs to clear up any confusion and get the most out of StallSpot.
              </p>
            </div>

            <div className="bg-background rounded-xl p-6 shadow-lg">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-lg font-medium hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Plus className="h-5 w-5 text-primary group-data-[state=open]:rotate-45 transition-transform duration-200" />
                        </div>
                        {faq.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base leading-relaxed pt-2 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                Still have questions? We're here to help!
              </p>
              <Button size="lg" variant="outline">
                Contact Support
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>


      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-lg text-muted-foreground">
              Experience the advantages of our centralized exhibition platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="p-8 hover:shadow-lg transition-all group min-h-[320px] flex flex-col">
                <div className="flex-1">
                  <div className="p-6 rounded-full bg-muted w-fit mb-8 group-hover:bg-primary/10 transition-colors">
                    <benefit.icon className="h-8 w-8 text-foreground" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{benefit.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{benefit.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Become an Exhibitor Section */}

<section className="relative overflow-hidden bg-card"> 
  <SwirlyBackground /> <div className="container mx-auto px-4 py-24">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"> 
      <div className="relative z-10"> 
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground"> How it
          <br /> <span className="text-muted-foreground">Works.
            </span> </h2> <p className="text-xl mb-8 text-muted-foreground">
            Get started with our platform in three simple steps </p> 
            <div className="space-y-6"> <div className="flex items-center gap-4"> 
              <div className="p-3 rounded-full bg-muted"> 
                <UserPlus className="h-6 w-6 text-foreground" /> </div> 
                <div> 
                  <h3 className="text-lg font-semibold text-foreground">Create an Account</h3> 
                <p className="text-muted-foreground">Choose your role as Exhibitor or Vendor</p> 
                </div> 
                </div> 
                <div className="flex items-center gap-4"> 
                  <div className="p-3 rounded-full bg-muted"> 
                  <Compass className="h-6 w-6 text-foreground" /> 
                  </div> 
                  <div> 
                    <h3 className="text-lg font-semibold text-foreground">Explore Options</h3> 
                  <p className="text-muted-foreground">Browse events or available stalls</p> </div> 
                  </div> 
                  <div className="flex items-center gap-4"> 
                    <div className="p-3 rounded-full bg-muted"> 
                    <BookCheck className="h-6 w-6 text-foreground" /> </div> 
                    <div> 
                      <h3 className="text-lg font-semibold text-foreground">Book and Manage</h3> 
                    <p className="text-muted-foreground">Real-time stall booking and management</p> 
                    </div> 
                    </div> 
                    </div> 
                    <Button size="lg" className="mt-10"> Become an Exhibitor 
                      <ArrowRight className="ml-2 h-5 w-5" /> </Button> </div>

<div className="relative hidden md:block">
  <div className="aspect-[4/3] rounded-2xl overflow-hidden">
    <img
      src="/api/placeholder/800/600"
      alt="Exhibition Space"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-card/20 to-transparent"></div>
  </div>
</div>
</div>
</div>
</section>

        {/* User Types Section - Updated with background glow effect */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Choose a Role.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {userTypes.map((type) => (
              <div key={type.title} className="relative group">
                {/* Background glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-500 group-hover:duration-200" />
                
                <Card 
                  className="relative bg-zinc-900/50 border-zinc-800 p-8 backdrop-blur-sm 
                    transition-all duration-300 ease-in-out
                    hover:bg-zinc-900/80 hover:scale-[1.02]
                    group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg" />
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-zinc-800/50 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                      <type.icon className="h-8 w-8 transition-transform duration-300 group-hover:rotate-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold transition-colors duration-300 group-hover:text-white">
                        {type.title}
                      </h3>
                      <p className="text-zinc-400 transition-colors duration-300 group-hover:text-zinc-300">
                        {type.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6 mb-8">
                    {type.features.map((feature, index) => (
                      <div 
                        key={feature.text} 
                        className="flex items-center gap-4 text-zinc-300 group-hover:text-white transition-all duration-300"
                        style={{
                          transitionDelay: `${index * 50}ms`
                        }}
                      >
                        <div className="p-2 rounded-md bg-zinc-800/50 group-hover:bg-primary/10 transition-all duration-300">
                          <feature.icon className="h-5 w-5" />
                        </div>
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full bg-white text-black hover:bg-zinc-200 transition-all duration-300
                      group-hover:translate-y-[-2px] group-hover:shadow-lg"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}