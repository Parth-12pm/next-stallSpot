import React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StallSpot",
  description: "Platform for managing exhibitions and events",
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold">
                StallSpot
              </Link>

              <Sheet>
                <SheetTrigger className="md:hidden">
                  <Menu className="h-6 w-6" />
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <div className="flex flex-col gap-4">
                    <Link href="/exhibitions" className="block py-2">Exhibitions</Link>
                    <Link href="/about" className="block py-2">About</Link>
                    <Link href="/contact" className="block py-2">Contact</Link>
                    <Link href="/playground" className="block py-2">Playground</Link>
                    <div className="flex flex-col gap-2 mt-4">
                      <Link href="/auth/login">
                        <Button variant="outline" className="w-full">Login</Button>
                      </Link>
                      <Link href="/auth/signup">
                        <Button className="w-full">Sign Up</Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <NavigationMenu className="hidden md:block">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Discover</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        <ListItem href="/exhibitions" title="Exhibitions">
                          Browse upcoming and ongoing exhibitions
                        </ListItem>
                        <ListItem href="/vendors" title="Vendors">
                          Connect with exhibition vendors
                        </ListItem>
                        <ListItem href="/organizers" title="Organizers">
                          Find exhibition organizers
                        </ListItem>
                        <ListItem href="/playground" title="Playground">
                          Test our features
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/about" legacyBehavior passHref>
                      <NavigationMenuLink className="px-4 py-2">
                        About
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/contact" legacyBehavior passHref>
                      <NavigationMenuLink className="px-4 py-2">
                        Contact
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <div className="hidden md:flex items-center gap-4">
                <Link href="/auth/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            </nav>
          </div>
        </header>

        <main className="min-h-screen">
          {children}
        </main>

        <footer className="border-t bg-muted/50">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold mb-4">StallSpot</h3>
                <p className="text-sm text-muted-foreground">
                  Making exhibition management simple and efficient.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <div className="space-y-2">
                  <Link href="/exhibitions" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Exhibitions
                  </Link>
                  <Link href="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                    About Us
                  </Link>
                  <Link href="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">For Businesses</h4>
                <div className="space-y-2">
                  <Link href="/organizer/dashboard" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Organizers
                  </Link>
                  <Link href="/vendor/dashboard" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Vendors
                  </Link>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <div className="space-y-2">
                  <Link href="/privacy" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} StallSpot. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}