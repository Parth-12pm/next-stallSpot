"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Headset, MailCheck, MessagesSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from '@/components/StatCard';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

// Zod schema for form validation
const ContactFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" })
});

// Type for contact form values
type ContactFormValues = z.infer<typeof ContactFormSchema>;

interface ContactMethod {
  icon: typeof Mail | typeof Phone | typeof MapPin;
  title: string;
  content: string;
}

const contactMethods: ContactMethod[] = [
  {
    icon: Phone,
    title: "Call us",
    content: "+91 8104775730"
  },
  {
    icon: Mail,
    title: "Email us",
    content: "contact@stallspot.com"
  },
  {
    icon: MapPin,
    title: "Visit us",
    content: "Jogeshwari (E), Mumbai, Maharashtra, India"
  }
];

function InputField({ label, error, ...props }: { 
  label: string, 
  error?: string 
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.name}>{label}</Label>
      <Input id={props.name} {...props} />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormValues>({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validate form data
      const result = ContactFormSchema.safeParse(formData);

      if (!result.success) {
        // Handle validation errors
        const errorMap: Partial<Record<keyof ContactFormValues, string>> = {};
        result.error.errors.forEach(err => {
          if (err.path.length > 0) {
            errorMap[err.path[0] as keyof ContactFormValues] = err.message;
          }
        });
        setErrors(errorMap);
        setIsSubmitting(false);
        return;
      }

      // Submit to API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          message: formData.message
        })
      });

      const responseData = await response.json();

      if (response.ok) {
        // Success
        toast({
          title: 'Message Sent',
          description: 'Your message has been sent successfully!',
          variant: 'default'
        });

        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          message: ''
        });
      } else {
        // Handle server errors
        toast({
          title: 'Error',
          description: responseData.message || 'Failed to send message',
          variant: 'destructive'
        });
      }
    } catch (error: unknown) {
      // Network or unexpected errors
      console.error('Form submission error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pb-20"> 
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-14 p-20">
            <StatCard icon={Headset} number="24/7" label="Any time Service" />
            <StatCard icon={MailCheck} number="Email Us" label="Reach out to us via email" />
            <StatCard icon={MessagesSquare} number="Chat with Us" label="quick answers and real-time support" />
        </div> 
      <div className="grid lg:grid-cols-2 gap-16 p-20">
        {/* Contact Information */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">Get in Touch</h2>
          <p className="text-lg text-muted-foreground">
            Have questions about StallSpot? We&apos;re here to help. Send us a message and we&apos;ll respond as soon as possible.
          </p>
         
          <div className="space-y-6">
            {contactMethods.map((method) => (
              <div key={method.title} className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <method.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">{method.title}</h3>
                  <p className="text-muted-foreground">{method.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <Card>
          <CardContent className="p-8 ">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <InputField
                  label="First name"
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                />
                <InputField
                  label="Last name"
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                />
              </div>
              <InputField
                label="Email"
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="resize-none"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}