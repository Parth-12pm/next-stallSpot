"use client"

import { Calendar, Store, PlusCircle, CheckCircle2, Edit, CheckCircle, AlertCircle } from 'lucide-react'
import { DashboardProps } from "./types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { useEffect, useState } from "react"
import { EventsTable } from "@/components/events/EventsTable"
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Event } from "@/components/events/types/types"

interface DashboardStats {
  activeEvents: number
  draftEvents: number
  completedEvents: number
  totalStalls: number
  bookedStalls: number
  recentEvents: Event[]
}

export function OrganizerDashboard({ user }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/events/stats')
        if (!response.ok) throw new Error('Failed to fetch dashboard stats')
        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="flex-1 space-y-4 p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {user.name || "Organizer"}
        </h2>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/events/create">
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Events</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.activeEvents || 0}</div>
                    <p className="text-xs text-muted-foreground">Live and upcoming events</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Draft Events</CardTitle>
                    <Edit className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.draftEvents || 0}</div>
                    <p className="text-xs text-muted-foreground">Events in preparation</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Stalls</CardTitle>
                    <Store className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalStalls || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats?.bookedStalls || 0} booked
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed Events</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.completedEvents || 0}</div>
                    <p className="text-xs text-muted-foreground">Past events</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Events</CardTitle>
                    <CardDescription>Your latest events and their status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-8">
                        {stats?.recentEvents.map((event) => (
                          <div key={event._id} className="flex items-center">
                            <div className="space-y-1 flex-1">
                              <p className="text-sm font-medium leading-none">{event.title}</p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-1 h-3 w-3" />
                                {new Date(event.startDate).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="ml-4">
                              <Badge variant={event.status === 'published' ? 'default' : 'secondary'}>
                                {event.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Stall Overview</CardTitle>
                    <CardDescription>Booking status across all events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Store className="h-4 w-4 text-muted-foreground" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Total Stalls</p>
                            <p className="text-sm text-muted-foreground">Across all events</p>
                          </div>
                        </div>
                        <div className="font-medium">{stats?.totalStalls || 0}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Booked Stalls</p>
                            <p className="text-sm text-muted-foreground">Currently occupied</p>
                          </div>
                        </div>
                        <div className="font-medium">{stats?.bookedStalls || 0}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-primary/10" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Available Stalls</p>
                            <p className="text-sm text-muted-foreground">Ready to book</p>
                          </div>
                        </div>
                        <div className="font-medium">
                          {(stats?.totalStalls || 0) - (stats?.bookedStalls || 0)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>All Events</CardTitle>
              <CardDescription>Manage your events</CardDescription>
            </CardHeader>
            <CardContent>
              <EventsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Applications</CardTitle>
              <CardDescription>Review and manage vendor applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                No pending applications to review
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

