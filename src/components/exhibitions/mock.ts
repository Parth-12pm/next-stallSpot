import { Event } from "@/components/events/types/types"

export const categories = [
  "Trade Shows",
  "Art Exhibitions",
  "Food Festivals",
  "Tech Conferences",
  "Fashion Shows",
  "Business Expos",
  "Cultural Events",
  "Education Fairs",
]

export const facilities = [
  "Wi-Fi",
  "Power Backup",
  "Security",
  "Parking",
  "Food Court",
  "Air Conditioning",
  "Loading/Unloading",
  "Storage Space",
]

export const venues = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Ahmedabad",
]

export const statusFilters = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Upcoming" },
  { value: "completed", label: "Past Events" },
  { value: "cancelled", label: "Cancelled" },
]

export const stallTypes = [
  { value: "standard", label: "Standard Stalls" },
  { value: "premium", label: "Premium Stalls" },
  { value: "corner", label: "Corner Stalls" },
]

export const tags = [
  { id: "popular", label: "Popular" },
  { id: "featured", label: "Featured" },
  { id: "early-bird", label: "Early Bird Discount" },
  { id: "last-minute", label: "Last Minute Deals" },
  { id: "free-entry", label: "Free Entry" },
  { id: "weekend", label: "Weekend Events" },
  { id: "family", label: "Family Friendly" },
  { id: "international", label: "International" },
]

export const exhibitions: Event[] = [
  {
    _id: "1",
    title: "International Trade Expo 2024",
    description: "Join us for the largest trade expo in Asia",
    thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60",
    venue: "Convention Center, Mumbai",
    numberOfStalls: 100,
    startDate: new Date("2024-04-15"),
    endDate: new Date("2024-04-17"),
    startTime: "10:00",
    endTime: "18:00",
    entryFee: "₹500",
    facilities: ["Wi-Fi", "Power Backup", "Security", "Parking"],
    category: "Trade Shows",
    status: "published",
    stallConfiguration: [
      {
        stallId: 1,
        displayId: "A1",
        type: "premium",
        category: "Trade Shows",
        name: "Premium Corner",
        price: "₹15000",
        size: "3x3",
        status: "available"
      }
    ],
    configurationComplete: true,
    organizerId: "",
    createdAt: "",
    updatedAt: ""
  },
  {
    _id: "2",
    title: "Art & Culture Festival",
    description: "Experience the finest art and culture",
    thumbnail: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop&q=60",
    venue: "Gallery Plaza, Delhi",
    numberOfStalls: 50,
    startDate: new Date("2024-04-20"),
    endDate: new Date("2024-04-22"),
    startTime: "11:00",
    endTime: "20:00",
    entryFee: "₹300",
    facilities: ["Air Conditioning", "Security", "Parking"],
    category: "Art Exhibitions",
    status: "published",
    stallConfiguration: [
      {
        stallId: 1,
        displayId: "B1",
        type: "standard",
        category: "Art Exhibitions",
        name: "Standard Booth",
        price: "₹8000",
        size: "2x2",
        status: "available"
      }
    ],
    configurationComplete: true,
    organizerId: "",
    createdAt: "",
    updatedAt: ""
  }
]

