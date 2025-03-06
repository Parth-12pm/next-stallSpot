"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react"

interface Event {
  _id: string
  title: string
  venue: string
  startDate: string
  endDate: string
  thumbnail?: string
  status: string
  organizerId?: {
    name: string
    _id: string
  }
  // Add other fields as needed
}

interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    pages: number
    page: number
    limit: number
  }
}

interface UseEventsOptions {
  limit?: number
  page?: number
  status?: "published" | "draft" | "completed" | "cancelled"
  organizerId?: string
}

export function useEvents(options: UseEventsOptions = {}) {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    page: 1,
    limit: 10,
  })

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true)

        // Build query string from options
        const queryParams = new URLSearchParams()
        if (options.limit) queryParams.append("limit", options.limit.toString())
        if (options.page) queryParams.append("page", options.page.toString())
        if (options.status) queryParams.append("status", options.status)
        if (options.organizerId) queryParams.append("organizerId", options.organizerId)

        const url = `/api/events?${queryParams.toString()}`
        const response = await fetch(url)

        // Handle different status codes
        if (response.status === 401) {
          // For unauthorized requests, fetch only public events
          const publicResponse = await fetch(`/api/events/public?${queryParams.toString()}`)
          if (!publicResponse.ok) {
            throw new Error('Failed to fetch public events')
          }
          const publicData = await publicResponse.json()
          setEvents(publicData.data.events || [])
          if (publicData.data.pagination) {
            setPagination(publicData.data.pagination)
          }
          return
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`)
        }

        const result = await response.json()

        if (result && result.success) {
          setEvents(result.data.events || [])
          if (result.data.pagination) {
            setPagination(result.data.pagination)
          }
        } else {
          setEvents([])
        }

        setError(null)
      } catch (err) {
        console.error("Error fetching events:", err)
        setError(err instanceof Error ? err.message : "Failed to load events")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [options.limit, options.page, options.status, options.organizerId])

  return { events, isLoading, error, pagination }
}

