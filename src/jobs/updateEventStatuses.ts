import cron from "node-cron"
import dbConnect from "@/lib/mongodb"
import IEvent from "@/models/Event"


async function updateAllEventStatuses() {
  try {
    await dbConnect()
    console.log("Starting event status updates...")
    
    const events = await IEvent.find({})
    let updatedCount = 0
    
    for (const event of events) {
      const currentStatus = event.status
      const newStatus = event.updateStatus() // calls the method from Event model
      
      if (currentStatus !== newStatus) {
        await event.save()
        updatedCount++
        console.log(`Event ${event._id}: ${currentStatus} -> ${newStatus}`)
      }
    }
    
    console.log(`Completed updates. Changed ${updatedCount} event statuses out of ${events.length} total events`)
  } catch (error) {
    console.error("Error updating event statuses:", error)
  }
}

// Run the job every hour
cron.schedule("0 * * * *", async () => {
  console.log(`Running scheduled event status update at ${new Date().toISOString()}`)
  await updateAllEventStatuses()
})

export default updateAllEventStatuses