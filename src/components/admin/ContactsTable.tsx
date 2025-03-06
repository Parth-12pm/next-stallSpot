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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyMessage, setReplyMessage] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [actionLoading, setActionLoading] = useState(false)

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

  const handleViewContact = async (contact: ContactWithId) => {
    setSelectedContact(contact)
    setShowDetails(true)

    // If the contact is new, mark it as read
    if (contact.status === "new") {
      try {
        const response = await fetch(`/api/admin/contacts/${contact._id}/mark-read`, {
          method: "POST",
        })

        if (response.ok) {
          // Update the contact status locally
          setContacts(contacts.map((c) => (c._id === contact._id ? { ...c, status: "read" } : c)))
        }
      } catch (error) {
        // Silently fail - not critical
        console.error("Failed to mark contact as read:", error)
      }
    }
  }

  const handleReplyToContact = () => {
    if (!selectedContact) return
    setShowReplyForm(true)
  }

  const handleSendReply = async () => {
    if (!selectedContact || !replyMessage.trim()) return

    setActionLoading(true)
    try {
      const response = await fetch(`/api/admin/contacts/${selectedContact._id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: replyMessage }),
      })

      if (!response.ok) {
        throw new Error("Failed to send reply")
      }

      toast({
        title: "Success",
        description: "Reply sent successfully",
      })

      // Update the contact status locally
      setContacts(contacts.map((c) => (c._id === selectedContact._id ? { ...c, status: "responded" } : c)))

      setShowReplyForm(false)
      setReplyMessage("")
    } catch (error) {
      const apiError = handleApiError(error)
      toast({
        title: "Error",
        description: apiError.message,
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
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
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">New</Badge>
      case "read":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Read</Badge>
      case "responded":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Responded</Badge>
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
                <TableRow key={contact._id} className={contact.status === "new" ? "bg-blue-50" : ""}>
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
                <div className="mt-2 p-4 bg-muted rounded-md">
                  <p className="whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleReplyToContact}
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 px-6"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Reply
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Form Dialog */}
      <Dialog open={showReplyForm} onOpenChange={setShowReplyForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to {selectedContact?.name}</DialogTitle>
            <DialogDescription>Send an email response to this inquiry</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label htmlFor="reply-message" className="text-base">
                Your Reply
              </Label>
              <Textarea
                id="reply-message"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply here..."
                className="min-h-[180px] mt-2"
              />
            </div>

            <DialogFooter className="gap-3">
              <Button
                variant="outline"
                onClick={() => setShowReplyForm(false)}
                disabled={actionLoading}
                className="px-6"
              >
                Cancel
              </Button>
              <Button onClick={handleSendReply} disabled={actionLoading || !replyMessage.trim()} className="px-6">
                {actionLoading ? "Sending..." : "Send Reply"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

