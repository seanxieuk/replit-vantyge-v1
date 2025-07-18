import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Target, DollarSign, BarChart3, TrendingUp, Users } from "lucide-react";

export default function Advertising() {
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

  const adPlatforms = [
    {
      name: "Google Ads",
      description: "Search and display advertising across Google's network",
      budget: "$2,500",
      performance: "+24%",
      status: "Active",
      icon: "🔍",
    },
    {
      name: "Facebook Ads",
      description: "Social media advertising on Facebook and Instagram",
      budget: "$1,800",
      performance: "+18%",
      status: "Active",
      icon: "📱",
    },
    {
      name: "LinkedIn Ads",
      description: "Professional network advertising for B2B targeting",
      budget: "$1,200",
      performance: "+32%",
      status: "Active",
      icon: "💼",
    },
    {
      name: "YouTube Ads",
      description: "Video advertising on YouTube platform",
      budget: "$800",
      performance: "+15%",
      status: "Paused",
      icon: "🎥",
    },
  ];

  const metrics = [
    { label: "Total Ad Spend", value: "$6,300", icon: DollarSign, trend: "up" },
    { label: "Impressions", value: "1.2M", icon: BarChart3, trend: "up" },
    { label: "Click-Through Rate", value: "3.4%", icon: Target, trend: "up" },
    { label: "Conversions", value: "156", icon: TrendingUp, trend: "up" },
  ];

  const campaigns = [
    {
      name: "Q1 Product Launch",
      platform: "Google Ads",
      budget: "$1,500",
      spend: "$1,245",
      clicks: "2,340",
      conversions: "89",
      status: "Active",
    },
    {
      name: "Brand Awareness Campaign",
      platform: "Facebook Ads",
      budget: "$1,000",
      spend: "$856",
      clicks: "4,120",
      conversions: "23",
      status: "Active",
    },
    {
      name: "B2B Lead Generation",
      platform: "LinkedIn Ads",
      budget: "$800",
      spend: "$720",
      clicks: "890",
      conversions: "44",
      status: "Active",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Advertising</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage and optimize your digital advertising campaigns across multiple platforms
        </p>
      </div>

      {/* Advertising Metrics */}
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

      {/* Ad Platforms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Megaphone className="h-6 w-6" />
            <span>Advertising Platforms</span>
          </CardTitle>
          <CardDescription>
            Monitor performance across all your advertising platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adPlatforms.map((platform) => (
              <div key={platform.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{platform.icon}</span>
                    <div>
                      <h3 className="font-medium">{platform.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{platform.description}</p>
                    </div>
                  </div>
                  <Badge variant={platform.status === "Active" ? "default" : "secondary"}>
                    {platform.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Budget</p>
                    <p className="font-medium">{platform.budget}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Performance</p>
                    <p className="font-medium text-green-600 dark:text-green-400">{platform.performance}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
          <CardDescription>
            Track the performance of your current advertising campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Campaign</th>
                  <th className="text-left py-3 px-4">Platform</th>
                  <th className="text-left py-3 px-4">Budget</th>
                  <th className="text-left py-3 px-4">Spend</th>
                  <th className="text-left py-3 px-4">Clicks</th>
                  <th className="text-left py-3 px-4">Conversions</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.name} className="border-b">
                    <td className="py-3 px-4 font-medium">{campaign.name}</td>
                    <td className="py-3 px-4">{campaign.platform}</td>
                    <td className="py-3 px-4">{campaign.budget}</td>
                    <td className="py-3 px-4">{campaign.spend}</td>
                    <td className="py-3 px-4">{campaign.clicks}</td>
                    <td className="py-3 px-4">{campaign.conversions}</td>
                    <td className="py-3 px-4">
                      <Badge variant="default">{campaign.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Campaign</CardTitle>
            <CardDescription>
              Launch a new advertising campaign with AI-powered optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full" style={{ backgroundColor: '#409452' }}>
                Create Campaign
              </Button>
              <Button variant="outline" className="w-full">
                Copy Existing Campaign
              </Button>
              <Button variant="outline" className="w-full">
                Import from Template
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Optimization</CardTitle>
            <CardDescription>
              Use AI insights to improve your campaign performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full" style={{ backgroundColor: '#409452' }}>
                Analyze Performance
              </Button>
              <Button variant="outline" className="w-full">
                Optimize Bidding
              </Button>
              <Button variant="outline" className="w-full">
                A/B Test Creatives
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}