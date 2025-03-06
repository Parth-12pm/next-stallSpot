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
import { Eye, UserCog, Ban, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"
import { handleApiError } from "@/lib/error-handling"
import type { IUser } from "@/models/User"

interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    pages: number
    page: number
    limit: number
  }
}

type UserWithId = IUser & { _id: string }

export function UsersTable() {
  const [users, setUsers] = useState<UserWithId[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserWithId | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchUsers = async (page = 1) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/users?page=${page}&limit=10`)

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`)
      }

      const result = await response.json()

      // Check if the response has the expected structure
      if (!result) {
        setUsers([])
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
        setUsers(result)
        setTotalPages(1) // Default to 1 page if no pagination info
      } else if (result.data && Array.isArray(result.data)) {
        setUsers(result.data)
        setTotalPages(result.pagination?.pages || 1)
      } else {
        setUsers([])
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
    fetchUsers(currentPage)
  }, [currentPage])

  const handleViewUser = (user: UserWithId) => {
    setSelectedUser(user)
    setShowDetails(true)
  }

  const handleSuspendUser = async () => {
    if (!selectedUser) return

    setActionLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${selectedUser._id}/suspend`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to suspend user")
      }

      toast({
        title: "Success",
        description: "User suspended successfully",
      })

      // Refresh the users list
      fetchUsers(currentPage)
      setShowSuspendConfirm(false)
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

  const confirmSuspend = (user: UserWithId) => {
    setSelectedUser(user)
    setShowSuspendConfirm(true)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "N/A"
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      return "Invalid date"
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Admin</Badge>
      case "organizer":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Organizer</Badge>
      case "vendor":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Vendor</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
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
        <CardTitle>All Users</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Profile Complete</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Show skeleton loaders while loading
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-12 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              // Show message when no users are found
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              // Map through users when available
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <Badge variant={user.profileComplete ? "default" : "outline"}>
                      {user.profileComplete ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewUser(user)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => confirmSuspend(user)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Ban className="h-4 w-4" />
                        <span className="sr-only">Suspend</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {!isLoading && users.length > 0 && (
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

      {/* User Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Detailed information about the user</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-lg">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-lg">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <div>{getRoleBadge(selectedUser.role)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium">Profile Complete</p>
                  <Badge variant={selectedUser.profileComplete ? "default" : "outline"}>
                    {selectedUser.profileComplete ? "Yes" : "No"}
                  </Badge>
                </div>
                {selectedUser.dateOfBirth && (
                  <div>
                    <p className="text-sm font-medium">Date of Birth</p>
                    <p className="text-lg">{formatDate(selectedUser.dateOfBirth)}</p>
                  </div>
                )}
                {selectedUser.contact && (
                  <div>
                    <p className="text-sm font-medium">Contact</p>
                    <p className="text-lg">{selectedUser.contact}</p>
                  </div>
                )}
              </div>

              {selectedUser.address && (
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-lg">{selectedUser.address}</p>
                </div>
              )}

              {selectedUser.selfDescription && (
                <div>
                  <p className="text-sm font-medium">Self Description</p>
                  <p className="text-md mt-1">{selectedUser.selfDescription}</p>
                </div>
              )}

              {/* Company Details Section */}
              {selectedUser.companyDetails && (
                <div>
                  <p className="text-sm font-medium mb-2">Company Details</p>
                  <div className="grid grid-cols-2 gap-2 border p-3 rounded-md">
                    {selectedUser.companyDetails.companyName && (
                      <div>
                        <p className="text-sm">Company Name</p>
                        <p className="font-medium">{selectedUser.companyDetails.companyName}</p>
                      </div>
                    )}
                    {selectedUser.companyDetails.registrationType && (
                      <div>
                        <p className="text-sm">Registration Type</p>
                        <p className="font-medium">{selectedUser.companyDetails.registrationType}</p>
                      </div>
                    )}
                    {selectedUser.companyDetails.registrationNumber && (
                      <div>
                        <p className="text-sm">Registration Number</p>
                        <p className="font-medium">{selectedUser.companyDetails.registrationNumber}</p>
                      </div>
                    )}
                    {selectedUser.companyDetails.website && (
                      <div>
                        <p className="text-sm">Website</p>
                        <p className="font-medium">{selectedUser.companyDetails.website}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Account Details Section */}
              {selectedUser.accountDetails && (
                <div>
                  <p className="text-sm font-medium mb-2">Account Details</p>
                  <div className="grid grid-cols-2 gap-2 border p-3 rounded-md">
                    {selectedUser.accountDetails.bankName && (
                      <div>
                        <p className="text-sm">Bank Name</p>
                        <p className="font-medium">{selectedUser.accountDetails.bankName}</p>
                      </div>
                    )}
                    {selectedUser.accountDetails.accountNumber && (
                      <div>
                        <p className="text-sm">Account Number</p>
                        <p className="font-medium">{selectedUser.accountDetails.accountNumber}</p>
                      </div>
                    )}
                    {selectedUser.accountDetails.ifscCode && (
                      <div>
                        <p className="text-sm">IFSC Code</p>
                        <p className="font-medium">{selectedUser.accountDetails.ifscCode}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = `/admin/users/edit/${selectedUser._id}`)}
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                >
                  <UserCog className="h-4 w-4 mr-2" />
                  Edit User
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDetails(false)
                    confirmSuspend(selectedUser)
                  }}
                  className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Suspend User
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Suspend Confirmation Dialog */}
      <Dialog open={showSuspendConfirm} onOpenChange={setShowSuspendConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Suspension</DialogTitle>
            <DialogDescription>
              Are you sure you want to suspend this user? They will no longer be able to access the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-4">
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuspendConfirm(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSuspendUser} disabled={actionLoading}>
              {actionLoading ? "Processing..." : "Suspend User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

