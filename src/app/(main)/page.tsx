"use client";

import mockupImage from "@/assets/mockup2.png";
import Image from "next/image";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import {
  MapPin,
  ArrowRight,
  Building2,
  ArrowUpRight,
  Users,
  UserPlus,
  Compass,
  BookCheck,
  Clock,
  Bell,
  Shield,

  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from "react"


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
            <stop
              offset="0%"
              stopColor="hsl(var(--primary))"
              stopOpacity="0.3"
            />
            <stop
              offset="100%"
              stopColor="hsl(var(--primary))"
              stopOpacity="0"
            />
          </linearGradient>
          <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              stopColor="hsl(var(--secondary))"
              stopOpacity="0.3"
            />
            <stop
              offset="100%"
              stopColor="hsl(var(--secondary))"
              stopOpacity="0"
            />
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
        <circle
          cx="200"
          cy="300"
          r="3"
          fill="hsl(var(--primary))"
          className="animate-pulse"
        >
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx="600"
          cy="400"
          r="3"
          fill="hsl(var(--secondary))"
          className="animate-pulse"
        >
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

  const upcomingEvents = [
    {
      title: "Modern Art Exhibition",
      location: "New York City",
      date: "Mar 15-20, 2024",
      image:
        "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&q=80",
    },
    {
      title: "Tech Innovation Summit",
      location: "San Francisco",
      date: "Apr 5-8, 2024",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
    },
  ];



  const benefits = [
    {
      icon: Clock,
      title: "Time-saving System",
      description: "Streamlined booking process saves hours of manual work",
    },
    {
      icon: Bell,
      title: "Real-time Updates",
      description: "Instant notifications on stall availability and changes",
    },
    {
      icon: Shield,
      title: "Intuitive Experience",
      description: "User-friendly interface for seamless navigation",
    },
  ];



  const faqs = [
    {
      question: "What is StallSpot?",
      answer:
        "StallSpot is a comprehensive exhibition management platform that connects event organizers with vendors. We streamline the process of booking and managing exhibition spaces, making it easier for both parties to focus on what matters most - creating successful events.",
    },
    {
      question: "How does booking work?",
      answer:
        "Booking is simple! Browse available events, select your preferred stall location, and complete the booking with our secure payment system. Real-time updates ensure you're always viewing current availability, and our automated confirmation system keeps you informed every step of the way.",
    },
    {
      question: "Is pricing transparent?",
      answer:
        "Absolutely! We believe in complete transparency. All costs, including booking fees and any additional services, are clearly displayed before you commit. No hidden charges, no surprises - just straightforward pricing that helps you make informed decisions.",
    },
    {
      question: "What if I need help?",
      answer:
        "Our dedicated support team is available 24/7 to assist you. Whether you need help with booking, have technical questions, or need to make changes to your reservation, we're here to help. Contact us through live chat, email, or phone support.",
    },
    {
      question: "Can I manage multiple events?",
      answer:
        "Yes! Our platform is designed to handle multiple events efficiently. Organizers can manage various exhibitions simultaneously, while vendors can book and track multiple stalls across different events. Our dashboard provides a clear overview of all your activities.",
    },
    {
      question: "Is it user-friendly?",
      answer:
        "StallSpot is designed with user experience in mind. Our intuitive interface, step-by-step guidance, and helpful tooltips make it easy for anyone to use the platform, regardless of their technical expertise. We regularly update our features based on user feedback.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Reduced spacing */}
      <section className="relative min-h-[80vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
        <Image
  src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&q=80"
  alt="Exhibition Hall"
  fill
  className="object-cover opacity-20"
  sizes="100vw"
/>
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-24 pb-0">
          <div className="text-center max-w-5xl mx-auto p-20">
            <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
              Discover World-Class Exhibitions
            </h1>
            <p className="text-xl mb-12 text-muted-foreground max-w-2xl mx-auto">
              Find and book your spot at the most innovative exhibitions worldwide. Join the community of passionate event-goers.
            </p>
            <Link href="/exhibitions">
            <Button size="lg" className="h-12 px-8" >
              Explore Events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button></Link>
          </div>
        </div>
      </section>


      {/* Upcoming Events Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-12">
            Upcoming Events
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.slice(0, 2).map((event) => (
              <Card key={event.title} className="overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                <Image
  src={event.image}
  alt={event.title}
  fill
  className="object-cover transition-transform group-hover:scale-105"
  sizes="100vw"
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
              <Link href={"/exhibitions"}>
              <div className="p-6 text-center flex flex-col items-center">
                <h3 className="text-3xl font-extrabold text-foreground mb-4">
                  View All Events
                </h3>
                <ArrowUpRight className="h-12 w-12 text-muted-foreground group-hover:text-foreground transition-colors transform group-hover:scale-110 duration-200" />
              </div>
              </Link>
            </Card>
            
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-36">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-muted-foreground">
              Experience the advantages of our centralized exhibition platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <Card
                key={benefit.title}
                className="p-8 hover:shadow-lg transition-all group min-h-[320px] flex flex-col"
              >
                <div className="flex-1">
                  <div className="p-6 rounded-full bg-muted w-fit mb-8 group-hover:bg-primary/10 transition-colors">
                    <benefit.icon className="h-8 w-8 text-foreground" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Become an Exhibitor Section */}

      <section className="relative overflow-hidden bg-card py-24 ">
        <SwirlyBackground />
        <div className="container mx-auto px-10 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center ">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground ">
                {" "}
                How it
                <br /> <span className="text-muted-foreground">
                  Works.
                </span>{" "}
              </h2>{" "}
              <p className="text-xl mb-8 text-muted-foreground">
                Get started with our platform in three simple steps{" "}
              </p>
              <div className="space-y-6">
                {" "}
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-muted">
                    <UserPlus className="h-6 w-6 text-foreground" />{" "}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Create an Account
                    </h3>
                    <p className="text-muted-foreground">
                      Choose your role as Exhibitor or Vendor
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-muted">
                    <Compass className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Explore Options
                    </h3>
                    <p className="text-muted-foreground">
                      Browse events or available stalls
                    </p>{" "}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-muted">
                    <BookCheck className="h-6 w-6 text-foreground" />{" "}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Book and Manage
                    </h3>
                    <p className="text-muted-foreground">
                      Real-time stall booking and management
                    </p>
                  </div>
                </div>
              </div>
              <Link href={"/auth/signup?role=organizer"}>
              <Button size="lg" className="mt-10">
                {" "}
                Become an Exhibitor
                <ArrowRight className="ml-2 h-5 w-5" />{" "}
              </Button>{" "}
              </Link>
            </div>

           <div className="relative hidden md:block">
  <div className="rounded-2xl overflow-hidden">
    <div className="relative w-[780px] h-[650px]"> {/* Fixed dimensions */}
      <Image
        src={mockupImage}
        alt="Exhibition Space"
        fill
        priority
        className="object-contain"
        sizes="(min-width: 1024px) 800px, 100vw"
        quality={100}
      />
    </div>
  </div>
</div>
        </div>
          </div>
       
      </section>

      {/* FAQ Section */}
      <section className="py-36 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Got Questions?
              </h2>
              <p className="text-lg text-muted-foreground">
                We&apos;ve got answers! Check out our FAQs to clear up any confusion
                and get the most out of StallSpot.
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
                Still have questions? We&apos;re here to help!
              </p>
              <Link href={"/contact"}>
              <Button size="lg" variant="outline">
                Contact Support
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="py-24 flex items-center justify-center p-6">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight">
              Choose Your Role
            </h1>
            <p className="text-muted-foreground mt-3 text-base">
              Select how you want to use StallSpot
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="relative cursor-pointer hover:border-primary transition-colors p-5">
              <Link
                href="/auth/signup?role=organizer"
                className="absolute inset-0"
              />
              <CardHeader className="pb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl mb-2">
                  Exhibition Organizer
                </CardTitle>
                <CardDescription className="text-sm">
                  Create and manage exhibitions, handle vendor applications, and
                  oversee event operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                  <li>• Create and manage multiple exhibitions</li>
                  <li>• Handle vendor applications</li>
                  <li>• Access detailed analytics</li>
                  <li>• Manage floor plans and layouts</li>
                </ul>
                <Button className="w-full mt-4 py-4 text-base">
                  Continue as Organizer
                </Button>
              </CardContent>
            </Card>

            <Card className="relative cursor-pointer hover:border-primary transition-colors p-5">
              <Link
                href="/auth/signup?role=vendor"
                className="absolute inset-0"
              />
              <CardHeader className="pb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl mb-2">
                  Vendor
                </CardTitle>
                <CardDescription className="text-sm">
                  Book stalls, manage your presence, and connect with exhibition
                  organizers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                  <li>• Browse available exhibitions</li>
                  <li>• Book and manage stalls</li>
                  <li>• Track performance metrics</li>
                  <li>• Connect with organizers</li>
                </ul>
                <Button className="w-full mt-4 py-4 text-base">
                  Continue as Vendor
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
