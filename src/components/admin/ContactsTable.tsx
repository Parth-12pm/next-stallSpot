"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { IContact } from "@/models/Contact"

export function ContactsTable() {
  const [contacts, setContacts] = useState<IContact[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("/api/admin/contacts")
        if (!response.ok) throw new Error("Failed to fetch contacts")
        const data = await response.json()
        setContacts(data)
      } catch (error) {
        console.error("Error fetching contacts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContacts()
  }, [])

  if (isLoading) {
    return <div>Loading contacts...</div>
  }

  return (
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
        {contacts.map((contact) => (
          <TableRow key={contact._id}>
            <TableCell>{contact.name}</TableCell>
            <TableCell>{contact.email}</TableCell>
            <TableCell>{contact.phone || "N/A"}</TableCell>
            <TableCell>{contact.status}</TableCell>
            <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
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

