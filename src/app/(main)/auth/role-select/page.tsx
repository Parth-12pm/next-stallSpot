// app/auth/role-select/page.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Building2 } from "lucide-react";

export default function RoleSelect() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Choose Your Role</h1>
          <p className="text-muted-foreground mt-2">Select how you want to use StallSpot</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="relative cursor-pointer hover:border-primary transition-colors">
            <Link href="/auth/signup?role=organizer" className="absolute inset-0" />
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Exhibition Organizer</CardTitle>
              <CardDescription>
                Create and manage exhibitions, handle vendor applications, and oversee event operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Create and manage multiple exhibitions</li>
                <li>• Handle vendor applications</li>
                <li>• Access detailed analytics</li>
                <li>• Manage floor plans and layouts</li>
              </ul>
              <Button className="w-full mt-6">Continue as Organizer</Button>
            </CardContent>
          </Card>

          <Card className="relative cursor-pointer hover:border-primary transition-colors">
            <Link href="/auth/signup?role=vendor" className="absolute inset-0" />
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Vendor</CardTitle>
              <CardDescription>
                Book stalls, manage your presence, and connect with exhibition organizers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Browse available exhibitions</li>
                <li>• Book and manage stalls</li>
                <li>• Track performance metrics</li>
                <li>• Connect with organizers</li>
              </ul>
              <Button className="w-full mt-6">Continue as Vendor</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}