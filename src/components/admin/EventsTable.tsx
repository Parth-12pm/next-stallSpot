"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { IEvent } from "@/models/Event"

export function EventsTable() {
  const [events, setEvents] = useState<IEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/admin/events")
        if (!response.ok) throw new Error("Failed to fetch events")
        const data = await response.json()
        setEvents(data)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (isLoading) {
    return <div>Loading events...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Organizer</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event._id}>
            <TableCell>{event.title}</TableCell>
            <TableCell>{(event.organizerId as any).name}</TableCell>
            <TableCell>{new Date(event.startDate).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(event.endDate).toLocaleDateString()}</TableCell>
            <TableCell>{event.status}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm">
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

