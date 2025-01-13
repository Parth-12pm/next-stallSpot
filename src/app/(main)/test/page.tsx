import StallForm from '@/components/events/StallForm'
import React from 'react'

const Test = () => {
  return (
    <div>
<StallForm 
  eventId={"1"}
  eventDetails={{
    category: "Food",
    numberOfStalls: 100,
  }}
  isOrganizer={true}
/>    </div>
  )
}

export default Test
