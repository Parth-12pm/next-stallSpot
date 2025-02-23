import cron from "node-cron"
import dbConnect from "@/lib/mongodb"
import Event from "@/models/Event"

async function updateAllEventStatuses() {
  await dbConnect()
  const events = await Event.find({})
  for (const event of events) {
    event.updateStatus()
    await event.save()
  }
  console.log("Updated all event statuses")
}

// Run the job every hour
cron.schedule("0 * * * *", updateAllEventStatuses)

export default updateAllEventStatuses

