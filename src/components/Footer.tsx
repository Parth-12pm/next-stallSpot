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
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border/40 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 gap-x-12 gap-y-8 lg:grid-cols-5">
          <div className="col-span-2 lg:pr-12">
            <Link href="/">
              <h3 className="font-bold text-lg mb-3 hover:text-primary transition-colors inline-block">
                StallSpot
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Making exhibition management simple and efficient through innovative solutions 
              and seamless experiences for organizers and vendors alike.
            </p>
          </div>
          
          {sections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="flex flex-col">
              <h3 className="mb-4 font-semibold text-sm">{section.title}</h3>
              <ul className="space-y-3 text-muted-foreground">
                {section.links.map((link, linkIdx) => (
                  <li
                    key={linkIdx}
                    className="text-sm transition-transform hover:translate-x-1"
                  >
                    <Link 
                      href={link.href}
                      className="hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col justify-between gap-4 border-t pt-6 text-sm text-muted-foreground md:flex-row md:items-center">
          <p>© {currentYear} StallSpot. All rights reserved.</p>
          <ul className="flex gap-6">
            <li>
              <Link 
                href="/terms" 
                className="hover:text-primary transition-colors duration-200"
              >
                Terms
              </Link>
            </li>
            <li>
              <Link 
                href="/policy" 
                className="hover:text-primary transition-colors duration-200"
              >
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
});