import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";

// Sample data
const events = [
  {
    id: 1,
    title: "Summer Playlist Party",
    description:
      "Join us for a night of collaborative playlist making and dancing",
    imageUrl: "/placeholder.svg?height=150&width=150",
    date: "2024-07-15",
    location: "Harmony Club, Downtown",
    attendees: 24,
    host: {
      name: "Alex",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    dateAdded: "2024-06-01",
  },
  {
    id: 2,
    title: "Indie Music Showcase",
    description: "Discover new indie artists and create playlists together",
    imageUrl: "/placeholder.svg?height=150&width=150",
    date: "2024-08-05",
    location: "The Sound Garden",
    attendees: 42,
    host: {
      name: "Jamie",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    dateAdded: "2024-06-15",
  },
  {
    id: 3,
    title: "DJ Workshop & Playlist Exchange",
    description: "Learn DJ skills and exchange your favorite playlists",
    imageUrl: "/placeholder.svg?height=150&width=150",
    date: "2024-07-28",
    location: "Beat Lab Studio",
    attendees: 18,
    host: {
      name: "You",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    dateAdded: "2024-06-20",
  },
  {
    id: 4,
    title: "Vinyl Night & Digital Conversion",
    description:
      "Bring your vinyl records and we'll help digitize them for playlists",
    imageUrl: "/placeholder.svg?height=150&width=150",
    date: "2024-08-12",
    location: "Retro Records Shop",
    attendees: 30,
    host: {
      name: "Taylor",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    dateAdded: "2024-05-25",
  },
  {
    id: 5,
    title: "Music Production Meetup",
    description: "Connect with other producers and share playlist techniques",
    imageUrl: "/placeholder.svg?height=150&width=150",
    date: "2024-09-03",
    location: "Creator Space",
    attendees: 22,
    host: {
      name: "Jordan",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    dateAdded: "2024-06-10",
  },
  {
    id: 6,
    title: "Genre Fusion Challenge",
    description: "Create playlists that blend multiple genres in creative ways",
    imageUrl: "/placeholder.svg?height=150&width=150",
    date: "2024-08-25",
    location: "Fusion Lounge",
    attendees: 36,
    host: {
      name: "You",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    dateAdded: "2024-07-01",
  },
  {
    id: 7,
    title: "Local Artist Spotlight",
    description:
      "Discover and support local musicians with collaborative playlists",
    imageUrl: "/placeholder.svg?height=150&width=150",
    date: "2024-07-20",
    location: "Community Arts Center",
    attendees: 28,
    host: {
      name: "Riley",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    dateAdded: "2024-06-25",
  },
  {
    id: 8,
    title: "Harmony Music Festival",
    description: "A day of live music and collaborative playlist creation",
    imageUrl: "/placeholder.svg?height=150&width=150",
    date: "2024-08-15",
    location: "Riverside Park",
    attendees: 120,
    host: {
      name: "Event Committee",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    dateAdded: "2024-05-15",
  },
  // Add more events as needed
];

interface EventGridProps {
  filter: string;
  searchQuery?: string;
  sortOrder?: string;
  dateFilter?: Date;
  locationFilter?: string;
  page?: number;
  itemsPerPage?: number;
}

export function EventGrid({
  filter,
  searchQuery = "",
  sortOrder = "upcoming",
  dateFilter,
  locationFilter = "",
  page = 1,
  itemsPerPage = 8,
}: EventGridProps) {
  // Filter by type (all, attending, hosting)
  let filteredEvents = events.filter((event) => {
    if (filter === "all") return true;
    if (filter === "hosting") return event.host.name === "You";
    // In a real app, you'd have an "attending" property to filter by
    if (filter === "attending") return true; // Simplified for demo
    return true;
  });

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredEvents = filteredEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query)
    );
  }

  // Filter by date
  if (dateFilter) {
    const filterDate = dateFilter.toISOString().split("T")[0];
    filteredEvents = filteredEvents.filter(
      (event) => event.date === filterDate
    );
  }

  // Filter by location
  if (locationFilter) {
    filteredEvents = filteredEvents.filter((event) =>
      event.location.toLowerCase().includes(locationFilter.toLowerCase())
    );
  }

  // Sort events
  filteredEvents = [...filteredEvents].sort((a, b) => {
    if (sortOrder === "upcoming") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortOrder === "popular") {
      return b.attendees - a.attendees;
    } else if (sortOrder === "recent") {
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    }
    return 0;
  });

  // Paginate
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {paginatedEvents.length > 0 ? (
        paginatedEvents.map((event) => (
          <Card
            key={event.id}
            className="overflow-hidden transition-all hover:shadow-md"
          >
            <CardHeader className="p-0 relative group">
              <div className="aspect-video overflow-hidden bg-muted">
                <img
                  src={event.imageUrl || "/placeholder.svg"}
                  alt={event.title}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-purple-500 hover:bg-purple-600">
                    Event
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-base line-clamp-1">
                {event.title}
              </CardTitle>
              <CardDescription className="line-clamp-2 text-xs mt-1">
                {event.description}
              </CardDescription>
              <div className="flex flex-col gap-1 mt-3">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-2" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-2" />
                  {event.location}
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={event.host.avatar || "/placeholder.svg"}
                    alt={event.host.name}
                  />
                  <AvatarFallback>{event.host.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  Hosted by {event.host.name}
                </span>
              </div>
              <Badge
                variant="outline"
                className="gap-1 text-xs border-purple-200 text-purple-500"
              >
                <Users className="h-3 w-3" />
                {event.attendees}
              </Badge>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="col-span-4 py-8 text-center text-muted-foreground">
          No events found. Try adjusting your search or filters.
        </div>
      )}
    </div>
  );
}
