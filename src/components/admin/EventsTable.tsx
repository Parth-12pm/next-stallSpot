"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"
import { handleApiError } from "@/lib/error-handling"
import type { IEvent } from "@/models/Event"

interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    pages: number
    page: number
    limit: number
  }
}

type EventWithId = IEvent & { _id: string }

export function EventsTable() {
  const [events, setEvents] = useState<EventWithId[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<EventWithId | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchEvents = async (page = 1) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/events?page=${page}&limit=10`)

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`)
      }

      const result = await response.json()

      // Check if the response has the expected structure
      if (!result) {
        setEvents([])
        setError("Invalid data format received from server")
        toast({
          title: "Error",
          description: "Invalid data format received from server",
          variant: "destructive",
        })
        return
      }

      // Handle both array responses and paginated responses
      if (Array.isArray(result)) {
        setEvents(result)
        setTotalPages(1) // Default to 1 page if no pagination info
      } else if (result.data && Array.isArray(result.data)) {
        setEvents(result.data)
        setTotalPages(result.pagination?.pages || 1)
      } else {
        setEvents([])
        setError("Invalid data format received from server")
        toast({
          title: "Error",
          description: "Invalid data format received from server",
          variant: "destructive",
        })
        return
      }

      setError(null)
    } catch (error) {
      const apiError = handleApiError(error)
      setError(apiError.message)
      toast({
        title: "Error",
        description: apiError.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents(currentPage)
  }, [currentPage])

  const handleViewEvent = (event: EventWithId) => {
    setSelectedEvent(event)
    setShowDetails(true)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const formatDate = (dateString: string | Date) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      return "Invalid date"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Published</Badge>
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Draft</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Events</CardTitle>
      </CardHeader>
      <CardContent>
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
            {isLoading ? (
              // Show skeleton loaders while loading
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-12 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : events.length === 0 ? (
              // Show message when no events are found
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No events found
                </TableCell>
              </TableRow>
            ) : (
              // Map through events when available
              events.map((event) => (
                <TableRow key={event._id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>
                    {event.organizerId && typeof event.organizerId === "object" && "name" in event.organizerId
                      ? event.organizerId.name
                      : "Unknown"}
                  </TableCell>
                  <TableCell>{formatDate(event.startDate)}</TableCell>
                  <TableCell>{formatDate(event.endDate)}</TableCell>
                  <TableCell>{getStatusBadge(event.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewEvent(event)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {!isLoading && events.length > 0 && (
          <div className="flex justify-center mt-4 space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            <span className="py-2 px-3 bg-secondary rounded-md">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>

      {/* Event Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
            <DialogDescription>Detailed information about the event</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Title</p>
                  <p className="text-lg">{selectedEvent.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <div>{getStatusBadge(selectedEvent.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-lg">{formatDate(selectedEvent.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">End Date</p>
                  <p className="text-lg">{formatDate(selectedEvent.endDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Start Time</p>
                  <p className="text-lg">{selectedEvent.startTime}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">End Time</p>
                  <p className="text-lg">{selectedEvent.endTime}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Venue</p>
                  <p className="text-lg">{selectedEvent.venue}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Number of Stalls</p>
                  <p className="text-lg">{selectedEvent.numberOfStalls}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-lg">{selectedEvent.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Entry Fee</p>
                  <p className="text-lg">{selectedEvent.entryFee || "Free"}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Description</p>
                <p className="text-md mt-1">{selectedEvent.description}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Facilities</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedEvent.facilities && selectedEvent.facilities.length > 0 ? (
                    selectedEvent.facilities.map((facility, index) => (
                      <Badge key={index} variant="outline">
                        {facility}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No facilities listed</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

