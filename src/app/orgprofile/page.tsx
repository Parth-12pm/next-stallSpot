import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, Phone, Calendar, Users, Star, BadgeCheck } from 'lucide-react';

const OrganizerProfile = () => {
  const organizer = {
    name: "Santosh Shirishkar",
    location: "Mumbai , Maharashtra",
    email: "ankitadesigns2015@gmail.com",
    phone: "+91 9870723435",
    stats: {
      eventsDone: 45,
      totalVisitors: 25000,
      popularityRank: 8
    },
    about: "Passionate event organizer with over 8 years of experience in creating memorable corporate and social events. Specializing in tech conferences and sustainable event planning.",
    expertise: ["Corporate Events", "Tech Conferences", "Sustainable Planning", "Wedding Planning"],
    bestEvents: [
      {
        id: 1,
        title: "TechCon 2024",
        date: "March 2024",
        attendees: 1500,
        rating: 4.9,
        description: "Annual technology conference featuring industry leaders and innovative workshops.",
        highlights: ["20+ Speakers", "5 Workshop Tracks", "Virtual Attendance Option"],
        images: [{ alt: "Main stage keynote", width: 400, height: 300 }]
      },
      {
        id: 2,
        title: "Green Earth Gala",
        date: "January 2024",
        attendees: 800,
        rating: 4.8,
        description: "Sustainable fundraising event that raised $2M for environmental causes.",
        highlights: ["Zero-waste Event", "Celebrity Appearances", "Live Auction"],
        images: [{ alt: "Gala dinner setup", width: 400, height: 300 }]
      },
      {
        id: 3,
        title: "StartupConnect Summit",
        date: "November 2023",
        attendees: 1200,
        rating: 4.7,
        description: "Networking event connecting startups with investors and mentors.",
        highlights: ["50+ Investor Meetings", "Pitch Competition", "Networking Sessions"],
        images: [{ alt: "Pitch competition", width: 400, height: 300 }]
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Profile Section */}
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden">
              <img
                src="/api/placeholder/128/128"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{organizer.name}</h1>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500 hover:bg-blue-600">
                    <BadgeCheck className="w-4 h-4 mr-1" />
                    Verified
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-center gap-2 text-gray-50">
                  <MapPin className="w-4 h-4" />
                  <span>{organizer.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{organizer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{organizer.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <Card>
        <CardContent className="py-3">
          <div className="flex justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-blue-600">{organizer.stats.eventsDone}</div>
              <p className="text-sm text-gray-600">Events Done</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-blue-600">{organizer.stats.totalVisitors.toLocaleString()}</div>
              <p className="text-sm text-gray-600">Visitors</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-blue-600">Top {organizer.stats.popularityRank}%</div>
              <p className="text-sm text-gray-600">Popularity Rank</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{organizer.about}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {organizer.expertise.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Best Events Section */}
      <Card>
        <CardHeader>
          <CardTitle>Best Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
            {organizer.bestEvents.map((event) => (
              <div key={event.id} className="border rounded-lg overflow-hidden">
                <img
                  src={`/api/placeholder/${event.images[0].width}/${event.images[0].height}`}
                  alt={event.images[0].alt}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>{event.rating}/5.0</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{event.attendees.toLocaleString()} attendees</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{event.description}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {event.highlights.map((highlight, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizerProfile;