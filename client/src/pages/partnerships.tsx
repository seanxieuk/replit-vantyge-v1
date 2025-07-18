import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Handshake, Users, Target, TrendingUp, DollarSign, CheckCircle } from "lucide-react";

export default function Partnerships() {
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

  const partnerships = [
    {
      name: "TechCorp Solutions",
      type: "Technology Integration",
      status: "Active",
      value: "$45,000",
      duration: "12 months",
      performance: "+28%",
    },
    {
      name: "Marketing Hub",
      type: "Cross-Promotion",
      status: "Active",
      value: "$12,000",
      duration: "6 months",
      performance: "+15%",
    },
    {
      name: "InnovateLab",
      type: "Joint Venture",
      status: "Negotiating",
      value: "$80,000",
      duration: "24 months",
      performance: "TBD",
    },
    {
      name: "GlobalReach Co",
      type: "Distribution",
      status: "Pending",
      value: "$25,000",
      duration: "18 months",
      performance: "TBD",
    },
  ];

  const partnershipTypes = [
    {
      title: "Strategic Alliances",
      description: "Long-term partnerships for mutual growth and market expansion",
      count: 3,
      icon: Handshake,
    },
    {
      title: "Technology Integrations",
      description: "Partnerships to enhance product capabilities and user experience",
      count: 2,
      icon: Target,
    },
    {
      title: "Channel Partners",
      description: "Distribution and reseller partnerships to reach new markets",
      count: 5,
      icon: TrendingUp,
    },
    {
      title: "Content Partnerships",
      description: "Collaborations for content creation and cross-promotion",
      count: 4,
      icon: Users,
    },
  ];

  const metrics = [
    { label: "Total Partnership Value", value: "$162K", change: "+32%" },
    { label: "Active Partners", value: "14", change: "+2" },
    { label: "Revenue Generated", value: "$89K", change: "+45%" },
    { label: "New Opportunities", value: "8", change: "+3" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Partnerships</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage strategic partnerships and collaborations to drive mutual growth
        </p>
      </div>

      {/* Partnership Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-sm text-green-600 dark:text-green-400">{metric.change}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Handshake className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Partnership Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {partnershipTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card key={type.title}>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{type.title}</CardTitle>
                    <Badge variant="secondary">{type.count} active</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Partnerships */}
      <Card>
        <CardHeader>
          <CardTitle>Active Partnerships</CardTitle>
          <CardDescription>
            Monitor and manage your current partnership agreements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {partnerships.map((partnership) => (
              <div key={partnership.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {partnership.name.substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-medium">{partnership.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{partnership.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">{partnership.value}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{partnership.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600 dark:text-green-400">{partnership.performance}</p>
                      <Badge 
                        variant={partnership.status === "Active" ? "default" : 
                               partnership.status === "Negotiating" ? "secondary" : "outline"}
                      >
                        {partnership.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Partnership Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Partnership Opportunities</CardTitle>
            <CardDescription>
              Identify and pursue new partnership opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full" style={{ backgroundColor: '#409452' }}>
                Find Partners
              </Button>
              <Button variant="outline" className="w-full">
                Partnership Proposals
              </Button>
              <Button variant="outline" className="w-full">
                Market Analysis
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Partnership Performance</CardTitle>
            <CardDescription>
              Track and optimize partnership effectiveness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full" style={{ backgroundColor: '#409452' }}>
                Performance Report
              </Button>
              <Button variant="outline" className="w-full">
                ROI Analysis
              </Button>
              <Button variant="outline" className="w-full">
                Renewal Management
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Partnership Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Partnership Pipeline</CardTitle>
          <CardDescription>
            Track potential partnerships through your sales process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium">Prospects</h4>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">potential partners</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium">In Discussion</h4>
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">active conversations</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium">Negotiating</h4>
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">in final stages</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium">Closed</h4>
              <p className="text-2xl font-bold">2</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">this quarter</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}