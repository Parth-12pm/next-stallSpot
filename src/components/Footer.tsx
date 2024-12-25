import Link from "next/link";
import { memo } from "react";

export const Footer = memo(function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          <div className="pr-10">
            <h3 className="font-bold mb-3">StallSpot</h3>
            <p className="text-sm text-muted-foreground">
              Making exhibition management 
              simple and efficient.
            </p>
          </div>
          <FooterLinks />
          <BusinessLinks />
          <LegalLinks />
        </div>
        <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} StallSpot. All rights reserved.
        </div>
      </div>
    </footer>
  );
});

const FooterLinks = memo(function FooterLinks() {
  return (
    <div>
      <h4 className="font-semibold mb-3">Quick Links</h4>
      <div className="space-y-1.5">
        <FooterLink href="/exhibitions">Exhibitions</FooterLink>
        <FooterLink href="/about">About Us</FooterLink>
        <FooterLink href="/contact">Contact</FooterLink>
      </div>
    </div>
  );
});

const BusinessLinks = memo(function BusinessLinks() {
  return (
    <div>
      <h4 className="font-semibold mb-3">For Businesses</h4>
      <div className="space-y-1.5">
        <FooterLink href="/organizer/dashboard">Organizers</FooterLink>
        <FooterLink href="/vendor/dashboard">Vendors</FooterLink>
      </div>
    </div>
  );
});

const LegalLinks = memo(function LegalLinks() {
  return (
    <div>
      <h4 className="font-semibold mb-3">Legal</h4>
      <div className="space-y-1.5">
        <FooterLink href="/privacy">Privacy Policy</FooterLink>
        <FooterLink href="/terms">Terms of Service</FooterLink>
      </div>
    </div>
  );
});

const FooterLink = memo(function FooterLink({ 
  href, 
  children 
}: { 
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </Link>
  );
});