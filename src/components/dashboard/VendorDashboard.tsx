"use client"

import { useEffect, useState } from "react"
import { CircleDollarSign, Clock, Store, CheckCircle2 } from "lucide-react"
import type { DashboardProps } from "./types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { ApplicationsTable } from "@/components/applications/ApplicationsTable"
import Link from "next/link"
import { BookingsTable } from "@/components/bookings/BookingsTable"
import { PaymentsTable } from "@/components/payments/PaymentsTable"

interface VendorStats {
  activeBookings: number
  pendingApplications: number
  totalSpent: number
  successRate: number
  recentApplications: Array<{
    _id: string
    eventId: {
      title: string
    }
    status: string
    fees: {
      totalAmount: number
    }
  }>
}

export function VendorDashboard({ user }: DashboardProps) {
  const [stats, setStats] = useState<VendorStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/vendor/stats")
        if (!response.ok) throw new Error("Failed to fetch vendor stats")
        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stats")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user.name || "Vendor"}</h2>
        <div className="flex items-center space-x-2">
          <Link href="/exhibitions">
            <Button>Browse Events</Button>
          </Link>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              [...Array(4)].map((_, i) => <Skeleton key={i} className="h-[120px]" />)
            ) : (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                    <Store className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.activeBookings}</div>
                    <p className="text-xs text-muted-foreground">Current active stalls</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.pendingApplications}</div>
                    <p className="text-xs text-muted-foreground">Awaiting response</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                    <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹{stats?.totalSpent.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Lifetime spending</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.successRate}%</div>
                    <p className="text-xs text-muted-foreground">Application success rate</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Your latest event applications</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[220px]">
                <div className="space-y-4">
                  {isLoading ? (
                    [...Array(3)].map((_, i) => <Skeleton key={i} className="h-[60px]" />)
                  ) : stats?.recentApplications.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No applications yet</p>
                  ) : (
                    stats?.recentApplications.map((application) => (
                      <div key={application._id} className="flex items-center justify-between space-x-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{application.eventId.title}</p>
                          <p className="text-sm text-muted-foreground">
                            ₹{application.fees.totalAmount.toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="secondary">{application.status.replace("_", " ").toUpperCase()}</Badge>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
              <CardDescription>View your active and upcoming event bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <BookingsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Your Applications</CardTitle>
              <CardDescription>View and manage your event applications</CardDescription>
            </CardHeader>
            <CardContent>
              <ApplicationsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View your payment history and transaction details</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentsTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

