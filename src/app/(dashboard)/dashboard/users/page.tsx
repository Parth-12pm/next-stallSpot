import React from 'react'
import { UsersTable } from '@/components/admin/UsersTable'
function UserPage() {
  return (
    <div className="p-6">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Users</h1>
        </div>
      <div className="rounded-md border">
        <UsersTable />
      </div>
    </div>   )
}

export default UserPage