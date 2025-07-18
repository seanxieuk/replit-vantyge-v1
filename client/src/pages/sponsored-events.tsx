import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Users, DollarSign, Target, TrendingUp } from "lucide-react";

export default function SponsoredEvents() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const events = [
    {
      name: "TechCon 2024",
      type: "Conference",
      date: "2024-03-15",
      location: "San Francisco, CA",
      sponsorshipLevel: "Gold",
      investment: "$25,000",
      expectedAttendees: "5,000",
      leadGoal: "150",
      status: "Confirmed",
    },
    {
      name: "Industry Summit",
      type: "Summit",
      date: "2024-04-22",
      location: "New York, NY",
      sponsorshipLevel: "Silver",
      investment: "$15,000",
      expectedAttendees: "2,500",
      leadGoal: "80",
      status: "Confirmed",
    },
    {
      name: "Innovation Workshop",
      type: "Workshop",
      date: "2024-05-10",
      location: "Austin, TX",
      sponsorshipLevel: "Bronze",
      investment: "$8,000",
      expectedAttendees: "500",
      leadGoal: "30",
      status: "Pending",
    },
    {
      name: "Digital Marketing Expo",
      type: "Expo",
      date: "2024-06-18",
      location: "Chicago, IL",
      sponsorshipLevel: "Platinum",
      investment: "$50,000",
      expectedAttendees: "8,000",
      leadGoal: "250",
      status: "Negotiating",
    },
  ];

  const metrics = [
    { label: "Total Investment", value: "$98K", change: "+15%", icon: DollarSign },
    { label: "Events Sponsored", value: "12", change: "+3", icon: Star },
    { label: "Total Attendees", value: "45K", change: "+28%", icon: Users },
    { label: "Leads Generated", value: "890", change: "+42%", icon: Target },
  ];

  const eventTypes = [
    { type: "Conferences", count: 4, investment: "$85K", leads: "420" },
    { type: "Trade Shows", count: 3, investment: "$45K", leads: "280" },
    { type: "Workshops", count: 3, investment: "$18K", leads: "120" },
    { type: "Webinars", count: 2, investment: "$8K", leads: "70" },
  ];

  const upcomingDeadlines = [
    { event: "TechCon 2024", deadline: "2024-02-01", task: "Final payment due" },
    { event: "Industry Summit", deadline: "2024-02-15", task: "Booth design submission" },
    { event: "Innovation Workshop", deadline: "2024-03-01", task: "Speaker bio submission" },
    { event: "Digital Marketing Expo", deadline: "2024-03-15", task: "Contract signature" },
  ];

  const roi = [
    { event: "Business Expo 2023", investment: "$20K", leads: "125", revenue: "$89K", roi: "345%" },
    { event: "Tech Summit 2023", investment: "$35K", leads: "200", revenue: "$156K", roi: "346%" },
    { event: "Innovation Days", investment: "$12K", leads: "80", revenue: "$45K", roi: "275%" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sponsored Events</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage event sponsorships and track their impact on brand awareness and lead generation
        </p>
      </div>

      {/* Event Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.label}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-sm text-green-600 dark:text-green-400">{metric.change}</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sponsored Events */}
      <Card>
        <CardHeader>
          <CardTitle>Current & Upcoming Events</CardTitle>
          <CardDescription>
            Manage your event sponsorship portfolio and track performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Event</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Location</th>
                  <th className="text-left py-3 px-4">Level</th>
                  <th className="text-left py-3 px-4">Investment</th>
                  <th className="text-left py-3 px-4">Attendees</th>
                  <th className="text-left py-3 px-4">Lead Goal</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.name} className="border-b">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{event.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{event.type}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{event.date}</td>
                    <td className="py-3 px-4">{event.location}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={event.sponsorshipLevel === "Platinum" || event.sponsorshipLevel === "Gold" ? "default" : "secondary"}
                      >
                        {event.sponsorshipLevel}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{event.investment}</td>
                    <td className="py-3 px-4">{event.expectedAttendees}</td>
                    <td className="py-3 px-4">{event.leadGoal}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={event.status === "Confirmed" ? "default" : 
                               event.status === "Pending" ? "secondary" : "outline"}
                      >
                        {event.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Event Categories & ROI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Event Categories</CardTitle>
            <CardDescription>
              Performance breakdown by event type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {eventTypes.map((category) => (
                <div key={category.type} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h4 className="font-medium">{category.type}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{category.count} events</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{category.investment}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{category.leads} leads</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event ROI Analysis</CardTitle>
            <CardDescription>
              Return on investment from recent sponsored events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roi.map((event) => (
                <div key={event.event} className="border-l-2 border-green-500 pl-4">
                  <h4 className="font-medium">{event.event}</h4>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Investment: {event.investment}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Leads: {event.leads}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Revenue: {event.revenue}</p>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">ROI: {event.roi}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Deadlines</CardTitle>
          <CardDescription>
            Important dates and tasks for your sponsored events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{deadline.event}</h4>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    {deadline.deadline}
                  </div>
                  <p className="text-sm">{deadline.task}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Management Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Event Discovery</CardTitle>
            <CardDescription>
              Find and evaluate new sponsorship opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full" style={{ backgroundColor: '#409452' }}>
                Find Events
              </Button>
              <Button variant="outline" className="w-full">
                Industry Calendar
              </Button>
              <Button variant="outline" className="w-full">
                Competitor Analysis
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proposal Management</CardTitle>
            <CardDescription>
              Create and track sponsorship proposals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full" style={{ backgroundColor: '#409452' }}>
                Create Proposal
              </Button>
              <Button variant="outline" className="w-full">
                Track Applications
              </Button>
              <Button variant="outline" className="w-full">
                Contract Templates
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Tracking</CardTitle>
            <CardDescription>
              Monitor and analyze event sponsorship results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full" style={{ backgroundColor: '#409452' }}>
                Performance Report
              </Button>
              <Button variant="outline" className="w-full">
                Lead Attribution
              </Button>
              <Button variant="outline" className="w-full">
                ROI Calculator
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}