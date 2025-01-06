import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from '@/components/StatCard';
import { Headset , MailCheck , MessagesSquare } from 'lucide-react';
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

function InputField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.name}>{label}</Label>
      <Input id={props.name} {...props} />
    </div>
  );
}

export function ContactForm() {
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
              Have questions about StallSpot? We're here to help. Send us a message and we'll respond as soon as possible.
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
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <InputField
                  label="First name"
                  type="text"
                  name="firstName"
                  placeholder="John"
                />
                <InputField
                  label="Last name"
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                />
              </div>
              <InputField
                label="Email"
                type="email"
                name="email"
                placeholder="john@example.com"
              />
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={4}
                  className="resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}