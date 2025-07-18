import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Target, Users, DollarSign, BarChart3, Lightbulb } from "lucide-react";

export default function GrowthStrategy() {
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

  const strategies = [
    {
      icon: Target,
      title: "Market Penetration",
      description: "Increase market share in existing markets with current products",
      actions: ["Competitive pricing analysis", "Customer retention programs", "Enhanced marketing campaigns"],
    },
    {
      icon: Users,
      title: "Market Development",
      description: "Expand into new markets with existing products",
      actions: ["Geographic expansion", "New customer segments", "Distribution channel expansion"],
    },
    {
      icon: Lightbulb,
      title: "Product Development",
      description: "Develop new products for existing markets",
      actions: ["Feature enhancement", "Product line extension", "Innovation initiatives"],
    },
    {
      icon: DollarSign,
      title: "Diversification",
      description: "Enter new markets with new products",
      actions: ["Strategic partnerships", "Acquisitions", "New business ventures"],
    },
  ];

  const metrics = [
    { label: "Revenue Growth", value: "15%", trend: "up" },
    { label: "Customer Acquisition", value: "24%", trend: "up" },
    { label: "Market Share", value: "8.2%", trend: "up" },
    { label: "Customer Lifetime Value", value: "$1,250", trend: "up" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Growth Strategy</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Develop and execute strategic initiatives to drive sustainable business growth
        </p>
      </div>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Growth Strategies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {strategies.map((strategy) => {
          const Icon = strategy.icon;
          return (
            <Card key={strategy.title}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{strategy.title}</CardTitle>
                    <CardDescription>{strategy.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {strategy.actions.map((action, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{action}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-4" style={{ backgroundColor: '#409452' }}>
                  Develop Strategy
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Strategic Planning Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6" />
            <span>Strategic Planning Tools</span>
          </CardTitle>
          <CardDescription>
            Leverage AI-powered tools to analyze opportunities and develop growth strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Target className="h-6 w-6 mb-2" />
              <span>SWOT Analysis</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Users className="h-6 w-6 mb-2" />
              <span>Customer Journey</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <BarChart3 className="h-6 w-6 mb-2" />
              <span>Market Analysis</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}