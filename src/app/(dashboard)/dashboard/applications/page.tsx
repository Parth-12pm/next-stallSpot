import React from 'react'
import { ApplicationsTable } from '@/components/applications/ApplicationsTable'
function ApplicationPage() {
  return (
    <div className="p-6">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Bookings</h1>
        </div>
      <div className="rounded-md border">
        <ApplicationsTable />
      </div>
    </div>   )
}

export default ApplicationPage