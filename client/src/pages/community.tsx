import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Heart, MessageCircle, Share2, TrendingUp } from "lucide-react";

export default function Community() {
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

  const communities = [
    {
      name: "Product Users Forum",
      platform: "Discord",
      members: "2,340",
      engagement: "High",
      posts: "45",
      moderators: 3,
      status: "Active",
    },
    {
      name: "Industry Professionals",
      platform: "LinkedIn Group",
      members: "5,670",
      engagement: "Medium",
      posts: "23",
      moderators: 2,
      status: "Active",
    },
    {
      name: "Customer Support",
      platform: "Facebook Group",
      members: "1,890",
      engagement: "High",
      posts: "67",
      moderators: 5,
      status: "Active",
    },
    {
      name: "Beta Testers",
      platform: "Slack",
      members: "450",
      engagement: "Very High",
      posts: "89",
      moderators: 2,
      status: "Private",
    },
  ];

  const metrics = [
    { label: "Total Members", value: "10.4K", change: "+12%", icon: Users },
    { label: "Monthly Posts", value: "234", change: "+8%", icon: MessageSquare },
    { label: "Engagement Rate", value: "76%", change: "+15%", icon: Heart },
    { label: "Community Growth", value: "18%", change: "+5%", icon: TrendingUp },
  ];

  const recentActivity = [
    {
      type: "Question",
      title: "How to integrate the new API?",
      author: "Alex Johnson",
      community: "Product Users Forum",
      replies: 12,
      time: "2 hours ago",
    },
    {
      type: "Discussion",
      title: "Best practices for implementation",
      author: "Sarah Chen",
      community: "Industry Professionals",
      replies: 8,
      time: "4 hours ago",
    },
    {
      type: "Feedback",
      title: "Feature request: Dark mode",
      author: "Mike Wilson",
      community: "Beta Testers",
      replies: 15,
      time: "6 hours ago",
    },
    {
      type: "Support",
      title: "Login issues on mobile",
      author: "Emma Davis",
      community: "Customer Support",
      replies: 3,
      time: "8 hours ago",
    },
  ];

  const moderationStats = [
    { label: "Pending Reviews", value: 8, status: "warning" },
    { label: "Resolved Issues", value: 23, status: "success" },
    { label: "Active Moderators", value: 12, status: "info" },
    { label: "Response Time", value: "2.3h", status: "success" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community Management</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Build and nurture engaged communities around your brand and products
        </p>
      </div>

      {/* Community Metrics */}
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

      {/* Communities Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Active Communities</CardTitle>
          <CardDescription>
            Manage your communities across different platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Community</th>
                  <th className="text-left py-3 px-4">Platform</th>
                  <th className="text-left py-3 px-4">Members</th>
                  <th className="text-left py-3 px-4">Engagement</th>
                  <th className="text-left py-3 px-4">Weekly Posts</th>
                  <th className="text-left py-3 px-4">Moderators</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {communities.map((community) => (
                  <tr key={community.name} className="border-b">
                    <td className="py-3 px-4 font-medium">{community.name}</td>
                    <td className="py-3 px-4">{community.platform}</td>
                    <td className="py-3 px-4">{community.members}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={community.engagement === "High" || community.engagement === "Very High" ? "default" : "secondary"}
                      >
                        {community.engagement}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{community.posts}</td>
                    <td className="py-3 px-4">{community.moderators}</td>
                    <td className="py-3 px-4">
                      <Badge variant={community.status === "Active" ? "default" : "outline"}>
                        {community.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Community Activity</CardTitle>
            <CardDescription>
              Stay updated with the latest discussions and interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="border-l-2 border-primary pl-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{activity.type}</Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{activity.time}</span>
                  </div>
                  <h4 className="font-medium mt-1">{activity.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    by {activity.author} in {activity.community}
                  </p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {activity.replies} replies
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moderation Dashboard</CardTitle>
            <CardDescription>
              Monitor community health and moderation activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {moderationStats.map((stat) => (
                <div key={stat.label} className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              <Button className="w-full" style={{ backgroundColor: '#409452' }}>
                Review Pending Items
              </Button>
              <Button variant="outline" className="w-full">
                Moderation Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Community Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Engagement Tools</CardTitle>
            <CardDescription>
              Boost community participation and interaction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full" style={{ backgroundColor: '#409452' }}>
                Create Poll
              </Button>
              <Button variant="outline" className="w-full">
                Schedule Event
              </Button>
              <Button variant="outline" className="w-full">
                Start Discussion
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>
              Manage community content and guidelines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full" style={{ backgroundColor: '#409452' }}>
                Pin Announcement
              </Button>
              <Button variant="outline" className="w-full">
                Update Guidelines
              </Button>
              <Button variant="outline" className="w-full">
                Moderate Content
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Growth & Analytics</CardTitle>
            <CardDescription>
              Track community growth and engagement metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full" style={{ backgroundColor: '#409452' }}>
                View Analytics
              </Button>
              <Button variant="outline" className="w-full">
                Growth Report
              </Button>
              <Button variant="outline" className="w-full">
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}