"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Eye, Mail } from "lucide-react"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"
import { handleApiError } from "@/lib/error-handling"
import type { IContact } from "@/models/Contact"

interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    pages: number
    page: number
    limit: number
  }
}

type ContactWithId = IContact & { _id: string }

export function ContactsTable() {
  const [contacts, setContacts] = useState<ContactWithId[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedContact, setSelectedContact] = useState<ContactWithId | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchContacts = async (page = 1) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/contacts?page=${page}&limit=10`)

      if (!response.ok) {
        throw new Error(`Failed to fetch contacts: ${response.status}`)
      }

      const result = await response.json()

      // Check if the response has the expected structure
      if (!result) {
        setContacts([])
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
        setContacts(result)
        setTotalPages(1) // Default to 1 page if no pagination info
      } else if (result.data && Array.isArray(result.data)) {
        setContacts(result.data)
        setTotalPages(result.pagination?.pages || 1)
      } else {
        setContacts([])
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
    fetchContacts(currentPage)
  }, [currentPage])

  const handleViewContact = (contact: ContactWithId) => {
    setSelectedContact(contact)
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
      case "new":
        return (
          <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800">
            New
          </Badge>
        )
      case "read":
        return (
          <Badge className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-800">
            Read
          </Badge>
        )
      case "responded":
        return (
          <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800">
            Responded
          </Badge>
        )
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
        <CardTitle>Contact Inquiries</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
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
            ) : contacts.length === 0 ? (
              // Show message when no contacts are found
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No contact inquiries found
                </TableCell>
              </TableRow>
            ) : (
              // Map through contacts when available
              contacts.map((contact) => (
                <TableRow
                  key={contact._id}
                  className={contact.status === "new" ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                >
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell className="px-4">
                    <span className="truncate max-w-[200px] block">{contact.email}</span>
                  </TableCell>
                  <TableCell className="px-4">{contact.phone || "N/A"}</TableCell>
                  <TableCell>{getStatusBadge(contact.status || "new")}</TableCell>
                  <TableCell>{formatDate(contact.createdAt)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleViewContact(contact)} className="w-20">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {!isLoading && contacts.length > 0 && (
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

      {/* Contact Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Inquiry</DialogTitle>
            <DialogDescription>Message from {selectedContact?.name}</DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-lg">{selectedContact.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Status</p>
                  <div>{getStatusBadge(selectedContact.status || "new")}</div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-lg break-all">{selectedContact.email}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-lg">{selectedContact.phone || "N/A"}</p>
                </div>
                <div className="col-span-2 space-y-2">
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-lg">{formatDate(selectedContact.createdAt)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Message</p>
                <div className="mt-2 p-4 bg-muted rounded-md dark:bg-muted/50">
                  <p className="whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>


            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Form Dialog */}

    </Card>
  )
}

