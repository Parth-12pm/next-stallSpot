"use client"

import { Bar, BarChart, ResponsiveContainer } from "recharts"
import { CircleDollarSign, Clock, Store, CheckCircle2 } from 'lucide-react'
import { DashboardProps } from "./types"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

// Mock data - Replace with real data from your API
const applicationData = [
  { name: "Jan", total: 4 },
  { name: "Feb", total: 6 },
  { name: "Mar", total: 4 },
  { name: "Apr", total: 8 },
  { name: "May", total: 10 },
  { name: "Jun", total: 12 },
]

export function VendorDashboard({ user }: DashboardProps) {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {user.name || "Vendor"}
        </h2>
        <div className="flex items-center space-x-2">
          <Link href="/exhibitions">
          <Button>Browse Events</Button>
          </Link>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">2 upcoming this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">5 new this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,400</div>
                <p className="text-xs text-muted-foreground">+$840 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89%</div>
                <p className="text-xs text-muted-foreground">+2% from last month</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Application History</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={applicationData}>
                    <Bar
                      dataKey="total"
                      style={{
                        fill: "hsl(var(--primary))",
                        opacity: 0.9,
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>You have 3 pending applications</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[220px]">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between space-x-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Tech Expo 2024</p>
                        <p className="text-sm text-muted-foreground">Premium Stall • $500</p>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between space-x-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Food Festival</p>
                        <p className="text-sm text-muted-foreground">Corner Stall • $300</p>
                      </div>
                      <Badge variant="default" className="bg-green-500 text-white">Approved</Badge>
                    </div>
                    <div className="flex items-center justify-between space-x-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Craft Fair</p>
                        <p className="text-sm text-muted-foreground">Standard Stall • $200</p>
                      </div>
                      <Badge variant="destructive">Rejected</Badge>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

