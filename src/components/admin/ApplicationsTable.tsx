"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { IApplication } from "@/models/Application"

type ApplicationWithId = IApplication & { _id: string }

export function ApplicationsTable() {
  const [applications, setApplications] = useState<ApplicationWithId[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("/api/admin/applications")
        if (!response.ok) throw new Error("Failed to fetch applications")
        const data = await response.json()
        setApplications(data)
      } catch (error) {
        console.error("Error fetching applications:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplications()
  }, [])

  if (isLoading) {
    return <div>Loading applications...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>Vendor</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Application Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((application) => (
          <TableRow key={application._id}>
            <TableCell>{(application.eventId as any).title}</TableCell>
            <TableCell>{(application.vendorId as any).name}</TableCell>
            <TableCell>{application.status}</TableCell>
            <TableCell>{new Date(application.applicationDate).toLocaleDateString()}</TableCell>
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

