import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, Building, Bot, TrendingUp, AlertTriangle, Target } from "lucide-react";
import type { CompetitiveAnalysis, Competitor } from "@shared/schema";

export default function CompetitiveAnalysisPage() {
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

  const { data: analyses = [], isLoading: analysesLoading } = useQuery({
    queryKey: ["/api/competitive-analysis"],
    enabled: isAuthenticated,
  });

  const { data: competitors = [] } = useQuery({
    queryKey: ["/api/competitors"],
    enabled: isAuthenticated,
  });

  const runAnalysisMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/competitive-analysis/run");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Competitive analysis completed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/competitive-analysis"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to run competitive analysis",
        variant: "destructive",
      });
    },
  });

  const getCompetitorName = (competitorId: number) => {
    const competitor = competitors.find((c: Competitor) => c.id === competitorId);
    return competitor?.name || "Unknown Competitor";
  };

  const getMarketShareColor = (marketShare: number) => {
    if (marketShare >= 70) return "bg-red-600";
    if (marketShare >= 40) return "bg-yellow-600";
    return "bg-green-600";
  };

  const getContentVolumeProgress = (volume: string) => {
    switch (volume) {
      case "high": return 75;
      case "medium": return 50;
      case "low": return 25;
      default: return 0;
    }
  };

  const getSeoStrengthProgress = (strength: string) => {
    switch (strength) {
      case "strong": return 85;
      case "moderate": return 50;
      case "weak": return 20;
      default: return 0;
    }
  };

  return (
    <>
      <Header 
        title="Competitive Analysis" 
        subtitle="AI-powered competitor intelligence" 
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                {competitors.length} competitors tracked • {analyses.length} analyses completed
              </p>
            </div>
            <Button 
              onClick={() => runAnalysisMutation.mutate()}
              disabled={runAnalysisMutation.isPending || competitors.length === 0}
              className="bg-primary hover:bg-primary/90"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${runAnalysisMutation.isPending ? 'animate-spin' : ''}`} />
              {runAnalysisMutation.isPending ? "Analyzing..." : "Run New Analysis"}
            </Button>
          </div>

          {competitors.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Competitors Added</h3>
                <p className="text-gray-600 mb-4">
                  Add competitors in the Company section to start running competitive analysis.
                </p>
                <Button variant="outline" onClick={() => window.location.href = "/company"}>
                  Add Competitors
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Competitor Overview */}
              {analyses.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {analyses.map((analysis: CompetitiveAnalysis) => (
                    <Card key={analysis.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                            <Building className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {getCompetitorName(analysis.competitorId)}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Last analyzed: {new Date(analysis.analyzedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Market Share</span>
                              <span className="font-medium">{analysis.marketShare}%</span>
                            </div>
                            <Progress 
                              value={analysis.marketShare || 0} 
                              className="h-2"
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Content Volume</span>
                              <span className="font-medium capitalize">{analysis.contentVolume}</span>
                            </div>
                            <Progress 
                              value={getContentVolumeProgress(analysis.contentVolume || "")} 
                              className="h-2"
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">SEO Strength</span>
                              <span className="font-medium capitalize">{analysis.seoStrength}</span>
                            </div>
                            <Progress 
                              value={getSeoStrengthProgress(analysis.seoStrength || "")} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* AI Insights */}
              {analyses.length > 0 && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Bot className="w-6 h-6 text-primary mr-3" />
                      <h4 className="font-semibold text-gray-900">AI-Generated Insights</h4>
                    </div>
                    <div className="space-y-4">
                      {analyses.slice(0, 3).map((analysis: CompetitiveAnalysis) => (
                        <div key={analysis.id} className="space-y-3 text-gray-700">
                          <h5 className="font-medium">{getCompetitorName(analysis.competitorId)}</h5>
                          
                          {analysis.opportunities && (
                            <div className="flex items-start space-x-2">
                              <Target className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <strong className="text-green-700">Opportunity:</strong> {analysis.opportunities}
                              </div>
                            </div>
                          )}
                          
                          {analysis.threats && (
                            <div className="flex items-start space-x-2">
                              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <strong className="text-red-700">Threat:</strong> {analysis.threats}
                              </div>
                            </div>
                          )}
                          
                          {analysis.recommendations && (
                            <div className="flex items-start space-x-2">
                              <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <strong className="text-blue-700">Recommendation:</strong> {analysis.recommendations}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* No Analysis Available */}
              {analyses.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Available</h3>
                    <p className="text-gray-600 mb-4">
                      Run your first competitive analysis to get AI-powered insights about your competitors.
                    </p>
                    <Button 
                      onClick={() => runAnalysisMutation.mutate()}
                      disabled={runAnalysisMutation.isPending}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${runAnalysisMutation.isPending ? 'animate-spin' : ''}`} />
                      {runAnalysisMutation.isPending ? "Analyzing..." : "Run Analysis"}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
