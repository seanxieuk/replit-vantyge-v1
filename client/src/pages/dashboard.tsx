import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Megaphone, 
  FileText, 
  Heart, 
  Bot, 
  Search, 
  PenTool, 
  Target, 
  TrendingUp, 
  TrendingDown,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
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

  const { data: company } = useQuery({
    queryKey: ["/api/company"],
    enabled: isAuthenticated,
  });

  const { data: contentItems } = useQuery({
    queryKey: ["/api/content"],
    enabled: isAuthenticated,
  });

  // Mock metrics - in a real app these would come from analytics APIs
  const metrics = {
    totalCampaigns: 24,
    contentPublished: contentItems?.length || 0,
    engagementRate: "4.2%",
    aiSuggestions: 89,
  };

  const quickActions = [
    {
      title: "Run Competitive Analysis",
      description: "Analyze competitor strategies",
      icon: Search,
      href: "/competitive-analysis",
      bgColor: "bg-blue-50 group-hover:bg-blue-500",
      iconColor: "text-blue-600 group-hover:text-white",
    },
    {
      title: "Generate Content",
      description: "Create AI-powered content",
      icon: PenTool,
      href: "/content-creation",
      bgColor: "bg-green-50 group-hover:bg-green-500",
      iconColor: "text-green-600 group-hover:text-white",
    },
    {
      title: "Update Positioning",
      description: "Refine brand positioning",
      icon: Target,
      href: "/positioning",
      bgColor: "bg-purple-50 group-hover:bg-purple-500",
      iconColor: "text-purple-600 group-hover:text-white",
    },
  ];

  const recentActivities = [
    {
      title: "Blog post \"5 Marketing Trends\" was published",
      time: "2 hours ago",
      icon: FileText,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Competitive analysis completed for Q4",
      time: "4 hours ago",
      icon: Search,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "AI generated 12 new content ideas",
      time: "1 day ago",
      icon: Bot,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Content calendar updated for December",
      time: "2 days ago",
      icon: FileText,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <>
      <Header 
        title="Dashboard" 
        subtitle="Get insights into your marketing performance" 
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {metrics.totalCampaigns}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Megaphone className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+12%</span>
                  <span className="text-gray-600 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Content Published</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {metrics.contentPublished}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+8%</span>
                  <span className="text-gray-600 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {metrics.engagementRate}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  <span className="text-red-600 font-medium">-2%</span>
                  <span className="text-gray-600 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">AI Suggestions</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {metrics.aiSuggestions}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+24%</span>
                  <span className="text-gray-600 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action) => (
                  <Link key={action.title} href={action.href}>
                    <a className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors group">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center mr-4 transition-colors`}>
                          <action.icon className={`w-5 h-5 ${action.iconColor} transition-colors`} />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{action.title}</p>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                    </a>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 ${activity.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <activity.icon className={`w-4 h-4 ${activity.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Content Performance Chart Placeholder */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Content Performance</CardTitle>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-2">
                <option>Last 30 days</option>
                <option>Last 60 days</option>
                <option>Last 90 days</option>
              </select>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Content performance chart</p>
                  <p className="text-sm text-gray-500">Charts will be implemented with a charting library</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
