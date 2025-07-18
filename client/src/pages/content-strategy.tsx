import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Target, Users, TrendingUp, Lightbulb, Calendar } from "lucide-react";

export default function ContentStrategy() {
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

  const contentPillars = [
    {
      title: "Educational Content",
      description: "Teach your audience about industry trends and best practices",
      percentage: 40,
      color: "bg-blue-500",
    },
    {
      title: "Product-Focused",
      description: "Showcase features, benefits, and use cases",
      percentage: 30,
      color: "bg-green-500",
    },
    {
      title: "Thought Leadership",
      description: "Share insights and opinions on industry developments",
      percentage: 20,
      color: "bg-purple-500",
    },
    {
      title: "Company Culture",
      description: "Behind-the-scenes content and team highlights",
      percentage: 10,
      color: "bg-orange-500",
    },
  ];

  const contentTypes = [
    { type: "Blog Posts", icon: FileText, count: 24, performance: "+15%" },
    { type: "Social Media", icon: Users, count: 156, performance: "+23%" },
    { type: "Video Content", icon: TrendingUp, count: 8, performance: "+45%" },
    { type: "Case Studies", icon: Target, count: 6, performance: "+32%" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Strategy</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Plan and execute content that drives engagement and converts your audience
        </p>
      </div>

      {/* Content Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contentTypes.map((content) => {
          const Icon = content.icon;
          return (
            <Card key={content.type}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{content.type}</p>
                    <p className="text-2xl font-bold">{content.count}</p>
                    <p className="text-sm text-green-600 dark:text-green-400">{content.performance}</p>
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

      {/* Content Pillars */}
      <Card>
        <CardHeader>
          <CardTitle>Content Pillars</CardTitle>
          <CardDescription>
            Strategic themes that guide your content creation and ensure balanced messaging
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {contentPillars.map((pillar) => (
              <div key={pillar.title} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{pillar.title}</h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{pillar.percentage}%</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{pillar.description}</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${pillar.color}`}
                    style={{ width: `${pillar.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategy Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-6 w-6" />
              <span>Content Ideation</span>
            </CardTitle>
            <CardDescription>
              Generate fresh content ideas based on your audience and industry trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full" style={{ backgroundColor: '#409452' }}>
                Generate Content Ideas
              </Button>
              <Button variant="outline" className="w-full">
                Analyze Trending Topics
              </Button>
              <Button variant="outline" className="w-full">
                Competitor Content Analysis
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-6 w-6" />
              <span>Content Planning</span>
            </CardTitle>
            <CardDescription>
              Plan and schedule your content for maximum impact and consistency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full" style={{ backgroundColor: '#409452' }}>
                Create Content Calendar
              </Button>
              <Button variant="outline" className="w-full">
                Set Publishing Schedule
              </Button>
              <Button variant="outline" className="w-full">
                Plan Content Campaigns
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Audit */}
      <Card>
        <CardHeader>
          <CardTitle>Content Audit & Optimization</CardTitle>
          <CardDescription>
            Analyze your existing content performance and identify optimization opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium">Top Performing</h4>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">12</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">pieces of content</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium">Needs Optimization</h4>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">8</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">pieces of content</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium">Archive/Update</h4>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">5</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">pieces of content</p>
            </div>
          </div>
          <Button className="w-full mt-4" style={{ backgroundColor: '#409452' }}>
            Start Content Audit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}