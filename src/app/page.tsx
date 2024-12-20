// page.tsx

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">
              Transform Your Exhibition Management Experience
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Streamline your exhibition planning, management, and execution with our comprehensive platform.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/exhibitions">
                <Button variant="outline" size="lg">
                  Browse Exhibitions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose ExhibitFlow?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>For Organizers</CardTitle>
                <CardDescription>
                  Powerful tools to manage your exhibitions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>Interactive floor plan editor</li>
                  <li>Vendor management system</li>
                  <li>Real-time analytics</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>For Vendors</CardTitle>
                <CardDescription>
                  Everything you need to succeed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>Booth customization</li>
                  <li>Lead capture tools</li>
                  <li>Performance metrics</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>For Visitors</CardTitle>
                <CardDescription>
                  Enhanced exhibition experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>Interactive maps</li>
                  <li>Event schedules</li>
                  <li>Networking opportunities</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Exhibitions?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of successful exhibition organizers and vendors.
          </p>
          <Link href="/auth/signup">
            <Button size="lg">Start Free Trial</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}