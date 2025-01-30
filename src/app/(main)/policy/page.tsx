"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-6xl mx-auto">
        <CardHeader className="pb-8">
          <CardTitle className="text-4xl font-bold text-center">Privacy Policy</CardTitle>
          <p className="text-center text-muted-foreground mt-2">Last updated: January 25, 2025</p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[700px] pr-6">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">We collect information that you provide directly to us, including:</p>
                  <h3 className="text-lg font-medium text-foreground">1.1 Personal Information</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Full name and business name</li>
                    <li>Email address and phone number</li>
                    <li>Postal address and billing address</li>
                    <li>Government-issued ID (for verification)</li>
                  </ul>
                  <h3 className="text-lg font-medium text-foreground">1.2 Booking Information</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Stall preferences and requirements</li>
                    <li>Booking history and patterns</li>
                    <li>Payment information and history</li>
                    <li>Special requests and accommodations</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">We use the collected information to:</p>
                  <h3 className="text-lg font-medium text-foreground">2.1 Essential Operations</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Process and manage your bookings</li>
                    <li>Facilitate payments and refunds</li>
                    <li>Provide customer support</li>
                    <li>Verify your identity</li>
                  </ul>
                  <h3 className="text-lg font-medium text-foreground">2.2 Service Improvement</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Analyze usage patterns and trends</li>
                    <li>Enhance user experience</li>
                    <li>Develop new features</li>
                    <li>Prevent fraud and abuse</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">We may share your information with:</p>
                  <h3 className="text-lg font-medium text-foreground">3.1 Service Providers</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Payment processors</li>
                    <li>Cloud storage providers</li>
                    <li>Analytics services</li>
                    <li>Customer support tools</li>
                  </ul>
                  <h3 className="text-lg font-medium text-foreground">3.2 Legal Requirements</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Court orders and legal processes</li>
                    <li>Government requests</li>
                    <li>Protection of rights and safety</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">We implement industry-standard security measures including:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>SSL/TLS encryption for data transmission</li>
                    <li>Regular security audits and assessments</li>
                    <li>Access controls and authentication</li>
                    <li>Data backup and recovery procedures</li>
                    <li>Employee training on data protection</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Cookies and Tracking</h2>
                <div className="space-y-4 text-muted-foreground">
                  <h3 className="text-lg font-medium text-foreground">5.1 Types of Cookies We Use</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Essential cookies for site functionality</li>
                    <li>Analytics cookies for usage data</li>
                    <li>Preference cookies for user settings</li>
                    <li>Marketing cookies (with consent)</li>
                  </ul>
                  <h3 className="text-lg font-medium text-foreground">5.2 Cookie Management</h3>
                  <p className="leading-relaxed">
                    You can manage cookie preferences through your browser settings. Disabling certain cookies may limit functionality.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">Under applicable data protection laws, you have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access your personal data</li>
                    <li>Correct inaccurate data</li>
                    <li>Request data deletion</li>
                    <li>Restrict data processing</li>
                    <li>Data portability</li>
                    <li>Object to processing</li>
                    <li>Withdraw consent</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. International Data Transfers</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may transfer your data to servers and service providers located in different countries. We ensure appropriate safeguards are in place to protect your information during such transfers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">For any privacy-related questions or concerns, please contact us at:</p>
                  <ul className="list-none space-y-2">
                    <li>Email: ankitadesigns2015@gmail.com</li>
                    <li>Phone: (+91) 9870723435</li>
                    <li>Address: E/4 BhagyaLaxmi Soc ,Ram Nagar ,Bandrekarwadi ,Jogeshwari (e) </li>
                    <li>Mumbai Maharastra 400060</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Updates to Privacy Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date at the top of this policy.
                </p>
              </section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}