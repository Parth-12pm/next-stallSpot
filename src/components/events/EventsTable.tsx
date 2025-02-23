"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Edit, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { IEvent } from "@/models/Event"

export function EventsTable() {
  const router = useRouter()
  const [events, setEvents] = useState<IEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch("/api/events")
      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }
      const data = await response.json()
      setEvents(data.data.events)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents()

    // Refresh events every minute
    const intervalId = setInterval(fetchEvents, 60000)

    return () => clearInterval(intervalId)
  }, [fetchEvents])

  const getStatusBadge = (status: IEvent["status"]) => {
    const variants: { [key in IEvent["status"]]: "default" | "secondary" | "outline" | "destructive" } = {
      draft: "secondary",
      pending_review: "secondary",
      approved: "default",
      published: "default",
      ongoing: "default",
      completed: "outline",
      cancelled: "destructive",
    }

    return <Badge variant={variants[status]}>{status.replace("_", " ")}</Badge>
  }

  if (error) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} className="text-center text-red-500">
              {error}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Title</TableHead>
            <TableHead>Date Range</TableHead>
            <TableHead>Total Stalls</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[60px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="h-4 w-[200px] animate-pulse rounded-md bg-gray-200" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-[150px] animate-pulse rounded-md bg-gray-200" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-[80px] animate-pulse rounded-md bg-gray-200" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-[100px] animate-pulse rounded-md bg-gray-200" />
              </TableCell>
              <TableCell>
                <div className="h-8 w-8 animate-pulse rounded-md bg-gray-200" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event Title</TableHead>
          <TableHead>Date Range</TableHead>
          <TableHead>Total Stalls</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[60px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No events found
            </TableCell>
          </TableRow>
        ) : (
          events.map((event) => (
            <TableRow key={event._id.toString()}>
              <TableCell>{event.title}</TableCell>
              <TableCell>
                {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
              </TableCell>
              <TableCell>{event.numberOfStalls}</TableCell>
              <TableCell>{getStatusBadge(event.status)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/events/${event._id}/preview`)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    {event.status === "draft" && (
                      <>
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/events/${event._id}/edit`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/events/${event._id}/stalls`)}>
                          <Settings className="mr-2 h-4 w-4" />
                          Configure Stalls
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

