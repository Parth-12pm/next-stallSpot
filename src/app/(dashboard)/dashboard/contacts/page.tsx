import React from 'react'
import { ContactsTable } from '@/components/admin/ContactsTable'
function ContactsPage() {
  return (
    <div className="p-6">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Contacts</h1>
        </div>
      <div className="rounded-md border">
        <ContactsTable />
      </div>
    </div>   )
}

export default ContactsPage