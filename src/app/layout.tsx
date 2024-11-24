// layout.tsx
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
} from "@/components/ui/navigation-menu"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StallSpot",
  description: "Platform for managing exhibitions and events",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold">
                StallSpot
              </Link>
              
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link href="/exhibitions" legacyBehavior passHref>
                      <NavigationMenuLink className="px-4 py-2">
                        Exhibitions
                      </NavigationMenuLink>
                    </Link>
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

              <div className="flex items-center gap-4">
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

        <footer className="border-t">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold mb-4">StallSpot</h3>
                <p className="text-sm text-gray-600">
                  Making exhibition management simple and efficient.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <div className="space-y-2">
                  <Link href="/exhibitions" className="block text-sm text-gray-600 hover:text-gray-900">
                    Exhibitions
                  </Link>
                  <Link href="/about" className="block text-sm text-gray-600 hover:text-gray-900">
                    About Us
                  </Link>
                  <Link href="/contact" className="block text-sm text-gray-600 hover:text-gray-900">
                    Contact
                  </Link>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">For Businesses</h4>
                <div className="space-y-2">
                  <Link href="/organizer/dashboard" className="block text-sm text-gray-600 hover:text-gray-900">
                    Organizers
                  </Link>
                  <Link href="/vendor/dashboard" className="block text-sm text-gray-600 hover:text-gray-900">
                    Vendors
                  </Link>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <div className="space-y-2">
                  <Link href="/privacy" className="block text-sm text-gray-600 hover:text-gray-900">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="block text-sm text-gray-600 hover:text-gray-900">
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
              © {new Date().getFullYear()} StallSpot. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}