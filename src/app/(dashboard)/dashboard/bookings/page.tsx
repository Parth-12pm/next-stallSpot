import React from 'react'
import { BookingsTable } from '@/components/bookings/BookingsTable'
function BookingsPage() {
  return (
    <div className="p-6">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Bookings</h1>
        </div>
      <div className="rounded-md border">
        <BookingsTable />
      </div>
    </div>   )
}

export default BookingsPage