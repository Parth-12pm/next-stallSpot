"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-6xl mx-auto">
        <CardHeader className="pb-8">
          <CardTitle className="text-4xl font-bold text-center">Terms and Conditions</CardTitle>
          <p className="text-center text-muted-foreground mt-2">Last updated: January 25, 2025</p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[700px] pr-6">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using our stall booking and management services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services. These terms constitute a legally binding agreement between you and our platform regarding your use of our stall booking and management services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Booking Services</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    Our platform facilitates stall bookings for events and venues. All bookings are subject to availability and confirmation. We reserve the right to refuse service to anyone for any reason at any time.
                  </p>
                  <h3 className="text-lg font-medium text-foreground">2.1 Booking Process</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Users must create an account to make bookings</li>
                    <li>All booking details must be accurate and complete</li>
                    <li>Confirmation will be sent via email</li>
                    <li>Booking modifications are subject to availability</li>
                  </ul>
                  <h3 className="text-lg font-medium text-foreground">2.2 Stall Usage</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Stalls must be used only for approved purposes</li>
                    <li>No subletting or transfer of bookings is allowed</li>
                    <li>Users must comply with venue-specific rules</li>
                    <li>Damage to facilities will result in additional charges</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Payment Terms</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">3.1. All payments must be made in full at the time of booking.</p>
                  <p className="leading-relaxed">3.2. Prices are subject to change without notice.</p>
                  <p className="leading-relaxed">3.3. Refunds are subject to our cancellation policy.</p>
                  <h3 className="text-lg font-medium text-foreground">3.4 Payment Methods</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Credit/Debit Cards (Visa, MasterCard, American Express)</li>
                    <li>Digital Wallets (PayPal, Google Pay, Apple Pay)</li>
                    <li>Bank Transfers (for specific booking types)</li>
                  </ul>
                  <h3 className="text-lg font-medium text-foreground">3.5 Additional Charges</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Security deposits may be required</li>
                    <li>Late payment fees will be applied</li>
                    <li>Cleaning fees may be charged if necessary</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Cancellation Policy</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">4.1. Cancellations made 48 hours or more before the event start time will receive a full refund minus processing fees.</p>
                  <p className="leading-relaxed">4.2. Cancellations made less than 48 hours before the event will not be eligible for a refund.</p>
                  <p className="leading-relaxed">4.3. Force majeure events will be handled on a case-by-case basis.</p>
                  <h3 className="text-lg font-medium text-foreground">4.4 Modification Policy</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Date changes subject to availability</li>
                    <li>Modification fees may apply</li>
                    <li>Changes must be requested at least 24 hours in advance</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. User Responsibilities</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">Users are responsible for:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Providing accurate and current information</li>
                    <li>Maintaining the confidentiality of their account</li>
                    <li>Complying with all local laws and regulations</li>
                    <li>Ensuring proper use of booked facilities</li>
                    <li>Reporting any issues or damages promptly</li>
                    <li>Following venue-specific guidelines</li>
                    <li>Maintaining appropriate insurance coverage</li>
                    <li>Respecting other users and staff</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    We are not liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services. This includes but is not limited to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Loss of profits or revenue</li>
                    <li>Loss of data or information</li>
                    <li>Business interruption</li>
        
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Dispute Resolution</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    Any disputes arising from these terms will be resolved through:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Direct negotiation between parties</li>
                    <li>Mediation if necessary</li>
                    <li>Binding arbitration as a last resort</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these terms at any time. Continued use of our services following any changes constitutes acceptance of those changes. Users will be notified of significant changes via email or through the platform.
                </p>
              </section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}