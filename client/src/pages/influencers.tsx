import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Star, TrendingUp, Eye, Heart, MessageCircle } from "lucide-react";

export default function Influencers() {
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

  const influencers = [
    {
      name: "Sarah Marketing",
      handle: "@sarahmarketing",
      platform: "Instagram",
      followers: "125K",
      engagement: "4.2%",
      niche: "Digital Marketing",
      status: "Active",
      reach: "89K",
      cost: "$2,500",
    },
    {
      name: "Tech Guru Mike",
      handle: "@techgurumike",
      platform: "YouTube",
      followers: "280K",
      engagement: "3.8%",
      niche: "Technology",
      status: "Negotiating",
      reach: "156K",
      cost: "$5,200",
    },
    {
      name: "Business Leader Jane",
      handle: "@bizleaderjane",
      platform: "LinkedIn",
      followers: "95K",
      engagement: "5.1%",
      niche: "Business Strategy",
      status: "Completed",
      reach: "67K",
      cost: "$1,800",
    },
    {
      name: "Content Creator Alex",
      handle: "@contentcreatoralex",
      platform: "TikTok",
      followers: "340K",
      engagement: "6.3%",
      niche: "Creative Content",
      status: "Pending",
      reach: "198K",
      cost: "$3,100",
    },
  ];

  const campaigns = [
    {
      name: "Product Launch Campaign",
      influencers: 3,
      reach: "450K",
      engagement: "24.5K",
      conversions: "1,234",
      roi: "340%",
      status: "Active",
    },
    {
      name: "Brand Awareness Drive",
      influencers: 5,
      reach: "680K",
      engagement: "31.2K",
      conversions: "2,156",
      roi: "280%",
      status: "Completed",
    },
    {
      name: "Holiday Promotion",
      influencers: 2,
      reach: "220K",
      engagement: "12.8K",
      conversions: "567",
      roi: "190%",
      status: "Planning",
    },
  ];

  const metrics = [
    { label: "Total Reach", value: "1.2M", icon: Eye },
    { label: "Engagement Rate", value: "4.8%", icon: Heart },
    { label: "Active Campaigns", value: "6", icon: TrendingUp },
    { label: "ROI", value: "285%", icon: Star },
  ];

  const platformStats = [
    { platform: "Instagram", influencers: 8, avgReach: "95K", avgCost: "$2,200" },
    { platform: "YouTube", influencers: 4, avgReach: "180K", avgCost: "$4,800" },
    { platform: "TikTok", influencers: 6, avgReach: "220K", avgCost: "$3,500" },
    { platform: "LinkedIn", influencers: 3, avgReach: "65K", avgCost: "$1,600" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Influencer Marketing</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage influencer partnerships and track campaign performance across social platforms
        </p>
      </div>

      {/* Influencer Metrics */}
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

      {/* Platform Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
          <CardDescription>
            Compare influencer marketing performance across social platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {platformStats.map((platform) => (
              <div key={platform.platform} className="border rounded-lg p-4">
                <h3 className="font-medium text-lg mb-3">{platform.platform}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Influencers:</span>
                    <span className="font-medium">{platform.influencers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg Reach:</span>
                    <span className="font-medium">{platform.avgReach}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg Cost:</span>
                    <span className="font-medium">{platform.avgCost}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Influencers */}
      <Card>
        <CardHeader>
          <CardTitle>Influencer Partners</CardTitle>
          <CardDescription>
            Manage relationships with your influencer network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Influencer</th>
                  <th className="text-left py-3 px-4">Platform</th>
                  <th className="text-left py-3 px-4">Followers</th>
                  <th className="text-left py-3 px-4">Engagement</th>
                  <th className="text-left py-3 px-4">Niche</th>
                  <th className="text-left py-3 px-4">Cost</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {influencers.map((influencer) => (
                  <tr key={influencer.name} className="border-b">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{influencer.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{influencer.handle}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{influencer.platform}</td>
                    <td className="py-3 px-4">{influencer.followers}</td>
                    <td className="py-3 px-4">{influencer.engagement}</td>
                    <td className="py-3 px-4">{influencer.niche}</td>
                    <td className="py-3 px-4">{influencer.cost}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={influencer.status === "Active" ? "default" : 
                               influencer.status === "Completed" ? "secondary" : "outline"}
                      >
                        {influencer.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Influencer Campaigns</CardTitle>
          <CardDescription>
            Track performance of your influencer marketing campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{campaign.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {campaign.influencers} influencers • {campaign.reach} reach
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Engagement</p>
                      <p className="font-medium">{campaign.engagement}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">ROI</p>
                      <p className="font-medium text-green-600 dark:text-green-400">{campaign.roi}</p>
                    </div>
                    <Badge 
                      variant={campaign.status === "Active" ? "default" : 
                             campaign.status === "Completed" ? "secondary" : "outline"}
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Management Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Influencer Discovery</CardTitle>
            <CardDescription>
              Find and connect with new influencers in your industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full" style={{ backgroundColor: '#409452' }}>
                Discover Influencers
              </Button>
              <Button variant="outline" className="w-full">
                Analyze Competitors
              </Button>
              <Button variant="outline" className="w-full">
                Filter by Niche
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Management</CardTitle>
            <CardDescription>
              Create and manage influencer marketing campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full" style={{ backgroundColor: '#409452' }}>
                Create Campaign
              </Button>
              <Button variant="outline" className="w-full">
                Track Performance
              </Button>
              <Button variant="outline" className="w-full">
                Generate Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}