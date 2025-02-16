// src/components/bookings/BookingsTable.tsx
"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface Booking {
  _id: string
  eventId: {
    _id: string
    title: string
    venue: string
    startDate: string
    endDate: string
  }
  stallId: number
  status: "payment_completed"
  applicationDate: string
  fees: {
    totalAmount: number
  }
}

export function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/vendor/bookings")
        if (!response.ok) throw new Error("Failed to fetch bookings")
        const data = await response.json()
        setBookings(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load bookings")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>Stall ID</TableHead>
          <TableHead>Dates</TableHead>
          <TableHead>Amount Paid</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              No bookings found
            </TableCell>
          </TableRow>
        ) : (
          bookings.map((booking) => (
            <TableRow key={booking._id}>
              <TableCell>
                <div>
                  <p className="font-semibold">{booking.eventId.title}</p>
                  <p className="text-sm text-muted-foreground">{booking.eventId.venue}</p>
                </div>
              </TableCell>
              <TableCell>#{booking.stallId}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <p>From: {format(new Date(booking.eventId.startDate), "MMM d, yyyy")}</p>
                  <p>To: {format(new Date(booking.eventId.endDate), "MMM d, yyyy")}</p>
                </div>
              </TableCell>
              <TableCell>₹{booking.fees.totalAmount.toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant="default" className="bg-green-500 text-white">
                  Active
                </Badge>
              </TableCell>
              <TableCell>
                <Link href={`/exhibitions/${booking.eventId._id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View Event
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

