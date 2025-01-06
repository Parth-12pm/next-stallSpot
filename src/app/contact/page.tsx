import { Hero } from '@/components/HeroAbout';
import { ContactForm } from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background ">
      <Hero 
        title="Contact Us"
        subtitle="We'd love to hear from you. Let's start a conversation."
      />
      <ContactForm />
    </div>
  );
}