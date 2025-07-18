import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Users, TrendingUp, Eye, FileText, Calendar } from "lucide-react";

export default function PR() {
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

  const pressReleases = [
    {
      title: "Company Announces Major Product Update",
      date: "2024-01-15",
      status: "Published",
      outlets: 12,
      reach: "45K",
      sentiment: "Positive",
    },
    {
      title: "Partnership with Industry Leader Announced",
      date: "2024-01-10",
      status: "Published",
      outlets: 8,
      reach: "32K",
      sentiment: "Very Positive",
    },
    {
      title: "Q1 Financial Results and Growth Milestones",
      date: "2024-01-05",
      status: "Draft",
      outlets: 0,
      reach: "0",
      sentiment: "N/A",
    },
    {
      title: "New Executive Team Member Announcement",
      date: "2023-12-28",
      status: "Published",
      outlets: 6,
      reach: "18K",
      sentiment: "Neutral",
    },
  ];

  const mediaContacts = [
    {
      name: "Sarah Johnson",
      outlet: "TechCrunch",
      type: "Technology Reporter",
      relationship: "Strong",
      lastContact: "2024-01-12",
    },
    {
      name: "Mike Chen",
      outlet: "Forbes",
      type: "Business Journalist",
      relationship: "Good",
      lastContact: "2024-01-08",
    },
    {
      name: "Emily Rodriguez",
      outlet: "Industry Weekly",
      type: "Senior Editor",
      relationship: "New",
      lastContact: "2023-12-20",
    },
    {
      name: "David Kim",
      outlet: "Business Journal",
      type: "Staff Writer",
      relationship: "Good",
      lastContact: "2024-01-03",
    },
  ];

  const metrics = [
    { label: "Media Mentions", value: "86", change: "+24%", icon: Newspaper },
    { label: "Total Reach", value: "125K", change: "+18%", icon: Eye },
    { label: "Positive Sentiment", value: "78%", change: "+12%", icon: TrendingUp },
    { label: "Media Contacts", value: "34", change: "+3", icon: Users },
  ];

  const upcomingEvents = [
    { event: "Industry Conference Keynote", date: "2024-02-15", type: "Speaking" },
    { event: "Product Launch Event", date: "2024-02-22", type: "Hosting" },
    { event: "Podcast Interview", date: "2024-02-28", type: "Interview" },
    { event: "Panel Discussion", date: "2024-03-05", type: "Speaking" },
  ];

  const mediaCoverage = [
    {
      headline: "Innovation Leader Announces Breakthrough Technology",
      outlet: "TechCrunch",
      date: "2024-01-14",
      sentiment: "Positive",
      reach: "15K",
    },
    {
      headline: "Strategic Partnership Drives Market Expansion",
      outlet: "Forbes",
      date: "2024-01-11",
      sentiment: "Very Positive",
      reach: "22K",
    },
    {
      headline: "Company Culture Focus Attracts Top Talent",
      outlet: "Business Journal",
      date: "2024-01-09",
      sentiment: "Positive",
      reach: "8K",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Public Relations</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage media relationships, press coverage, and public communications
        </p>
      </div>

      {/* PR Metrics */}
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

      {/* Press Releases */}
      <Card>
        <CardHeader>
          <CardTitle>Press Releases</CardTitle>
          <CardDescription>
            Manage and track your press release distribution and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Media Outlets</th>
                  <th className="text-left py-3 px-4">Reach</th>
                  <th className="text-left py-3 px-4">Sentiment</th>
                </tr>
              </thead>
              <tbody>
                {pressReleases.map((release) => (
                  <tr key={release.title} className="border-b">
                    <td className="py-3 px-4 font-medium">{release.title}</td>
                    <td className="py-3 px-4">{release.date}</td>
                    <td className="py-3 px-4">
                      <Badge variant={release.status === "Published" ? "default" : "secondary"}>
                        {release.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{release.outlets}</td>
                    <td className="py-3 px-4">{release.reach}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={release.sentiment === "Very Positive" || release.sentiment === "Positive" ? "default" : "outline"}
                      >
                        {release.sentiment}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Media Coverage & Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Media Coverage</CardTitle>
            <CardDescription>
              Track mentions and coverage across media outlets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mediaCoverage.map((coverage, index) => (
                <div key={index} className="border-l-2 border-primary pl-4">
                  <h4 className="font-medium">{coverage.headline}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{coverage.outlet}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{coverage.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{coverage.sentiment}</Badge>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{coverage.reach}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media Contacts</CardTitle>
            <CardDescription>
              Manage relationships with journalists and media professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mediaContacts.map((contact) => (
                <div key={contact.name} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h4 className="font-medium">{contact.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {contact.type} at {contact.outlet}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Last contact: {contact.lastContact}
                    </p>
                  </div>
                  <Badge 
                    variant={contact.relationship === "Strong" ? "default" : 
                           contact.relationship === "Good" ? "secondary" : "outline"}
                  >
                    {contact.relationship}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming PR Events</CardTitle>
          <CardDescription>
            Schedule and manage your PR and media events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{event.event}</h4>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    {event.date}
                  </div>
                  <Badge variant="outline">{event.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PR Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Press Kit</CardTitle>
            <CardDescription>
              Manage your digital press kit and media assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full" style={{ backgroundColor: '#409452' }}>
                Update Press Kit
              </Button>
              <Button variant="outline" className="w-full">
                Download Assets
              </Button>
              <Button variant="outline" className="w-full">
                Share Press Kit
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media Outreach</CardTitle>
            <CardDescription>
              Plan and execute targeted media campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full" style={{ backgroundColor: '#409452' }}>
                Create Campaign
              </Button>
              <Button variant="outline" className="w-full">
                Media List Builder
              </Button>
              <Button variant="outline" className="w-full">
                Follow-up Tracker
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>PR Analytics</CardTitle>
            <CardDescription>
              Measure and analyze your PR performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full" style={{ backgroundColor: '#409452' }}>
                Generate Report
              </Button>
              <Button variant="outline" className="w-full">
                Sentiment Analysis
              </Button>
              <Button variant="outline" className="w-full">
                Coverage Tracking
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}