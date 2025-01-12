export interface Exhibition {
  id: number;
  name: string;
  image: string;
  date: string;
  venue: string;
  time: string;
  rate: string;
  availableStalls: number;
  category: string;
}

export const categories = [
  "All Events",
  "Trade Shows",
  "Art Exhibitions",
  "Food Festivals",
  "Tech Conferences",
  "Fashion Shows",
];

export const tags = [
  "Popular",
  "This Week",
  "Free Entry",
  "Premium",
  "Featured",
];

export const exhibitions: Exhibition[] = [
  {
    id: 1,
    name: "International Trade Expo 2024",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60",
    date: "Apr 15-17, 2024",
    venue: "Convention Center, Mumbai",
    time: "10:00 AM - 6:00 PM",
    rate: "₹15,000/stall",
    availableStalls: 45,
    category: "Trade Shows",
  },
  {
    id: 2,
    name: "Art & Culture Festival",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop&q=60",
    date: "Apr 20-22, 2024",
    venue: "Gallery Plaza, Delhi",
    time: "11:00 AM - 8:00 PM",
    rate: "₹8,000/stall",
    availableStalls: 25,
    category: "Art Exhibitions",
  },
];