import Link from "next/link";
import { memo } from "react";

const sections = [
  {
    title: "Quick Links",
    links: [
      { name: "Exhibitions", href: "/exhibitions" },
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "For Businesses",
    links: [
      { name: "Organizers", href: "/organizer/dashboard" },
      { name: "Vendors", href: "/vendor/dashboard" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/policy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  },
];

export const Footer = memo(function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border/40 shadow-[0_-1px_3px_rgba(0,0,0,0.05)] mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 gap-x-12 gap-y-8 lg:grid-cols-5">
          <div className="col-span-2 lg:pr-12">
            <h3 className="font-bold mb-3">StallSpot</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Making exhibition management simple and efficient.
            </p>
          </div>
          
          {sections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <h3 className="mb-3 font-semibold text-sm">{section.title}</h3>
              <ul className="space-y-2.5 text-muted-foreground">
                {section.links.map((link, linkIdx) => (
                  <li
                    key={linkIdx}
                    className="text-sm font-medium hover:text-primary transition-colors duration-200"
                  >
                    <Link href={link.href}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col justify-between gap-4 border-t pt-6 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} StallSpot. All rights reserved.</p>
          <ul className="flex gap-6">
            <li className="hover:text-primary transition-colors duration-200">
              <Link href="/terms">Terms and Conditions</Link>
            </li>
            <li className="hover:text-primary transition-colors duration-200">
              <Link href="/policy">Privacy Policy</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
});