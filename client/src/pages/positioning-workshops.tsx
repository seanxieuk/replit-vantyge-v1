import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Target, 
  MessageSquare, 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Brain,
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useBackgroundAnalysis } from "@/hooks/useBackgroundAnalysis";

interface Header {
  title: string;
  subtitle?: string;
}

function Header({ title, subtitle }: Header) {
  return (
    <div className="bg-white border-b p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

interface PositioningRecommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  keyPoints: string[];
  messagingStyle: string;
  valueProposition: string;
  differentiators: string[];
  targetSegments: string[];
  confidence: number;
}

function RecommendationCard({ recommendation }: { recommendation: PositioningRecommendation }) {
  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{recommendation.title}</CardTitle>
              <p className="text-sm text-gray-600">{recommendation.category}</p>
            </div>
          </div>
          <Badge variant={recommendation.confidence > 0.8 ? "default" : "secondary"}>
            {Math.round(recommendation.confidence * 100)}% confidence
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700">{recommendation.description}</p>
        
        {recommendation.keyPoints.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Key Points:</h4>
            <ul className="space-y-1">
              {recommendation.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {recommendation.valueProposition && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Value Proposition:</h4>
            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">{recommendation.valueProposition}</p>
          </div>
        )}
        
        {recommendation.differentiators.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Differentiators:</h4>
            <div className="flex flex-wrap gap-2">
              {recommendation.differentiators.map((diff, index) => (
                <Badge key={index} variant="outline">{diff}</Badge>
              ))}
            </div>
          </div>
        )}
        
        {recommendation.targetSegments.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Target Segments:</h4>
            <div className="flex flex-wrap gap-2">
              {recommendation.targetSegments.map((segment, index) => (
                <Badge key={index} variant="secondary">{segment}</Badge>
              ))}
            </div>
          </div>
        )}
        
        {recommendation.messagingStyle && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Messaging Style:</h4>
            <p className="text-sm text-gray-600">{recommendation.messagingStyle}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function PositioningWorkshopsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAnalyzing, results: positioningAnalysis, analysisType, startPositioningAnalysis } = useBackgroundAnalysis();

  const { data: company } = useQuery({
    queryKey: ["/api/company"],
    enabled: !!user,
  });

  const { data: competitors } = useQuery({
    queryKey: ["/api/competitors"],
    enabled: !!user,
  });

  const { data: recommendations, isLoading } = useQuery<PositioningRecommendation[]>({
    queryKey: ["/api/positioning-recommendations"],
    enabled: !!user,
    retry: false,
  });

  const { data: analysis } = useQuery<{
    currentPositioning: {
      overview: string;
      strengths: string[];
      weaknesses: string[];
      marketPosition: string;
    };
    recommendations: PositioningRecommendation[];
  }>({
    queryKey: ["/api/positioning-analysis"],
    enabled: !!user,
    retry: false,
  });

  const generateRecommendationsMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/positioning-recommendations", {});
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Positioning recommendations generated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/positioning-recommendations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/positioning-analysis"] });
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
        description: "Failed to generate positioning recommendations",
        variant: "destructive",
      });
    },
  });

  const handleGenerateRecommendations = () => {
    startPositioningAnalysis();
  };

  const hasPrerequisites = company && competitors && competitors.length > 0;

  return (
    <>
      <Header 
        title="Positioning Workshops" 
        subtitle="AI-driven brand positioning and messaging recommendations based on your company and competitive analysis" 
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Prerequisites Check */}
          <Card>
            <CardHeader>
              <CardTitle>Prerequisites Check</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                {company ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span className={company ? "text-green-700" : "text-red-700"}>
                  Company information completed
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                {competitors && competitors.length > 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span className={competitors && competitors.length > 0 ? "text-green-700" : "text-red-700"}>
                  Competitors added ({competitors?.length || 0})
                </span>
              </div>

              {!hasPrerequisites && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Complete your company information and add competitors to unlock AI-powered positioning recommendations.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Analysis Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Positioning Analysis
              </CardTitle>
              <CardDescription>
                Generate comprehensive positioning insights based on your company and competitive data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasPrerequisites ? (
                <div className="flex justify-center">
                  <Button
                    onClick={handleGenerateRecommendations}
                    disabled={isAnalyzing}
                    size="lg"
                    className="px-8"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Analyze
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">
                    Complete prerequisites above to unlock AI positioning analysis
                  </p>
                  <Button disabled variant="outline">
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Positioning Analysis */}
          {(analysis?.currentPositioning || (positioningAnalysis && analysisType === 'positioning')) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Current Positioning Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Overview</h4>
                  <p className="text-gray-700">
                    {positioningAnalysis && analysisType === 'positioning' 
                      ? positioningAnalysis.currentPositioning?.overview 
                      : analysis?.currentPositioning?.overview}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Strengths
                    </h4>
                    <ul className="space-y-1">
                      {(positioningAnalysis && analysisType === 'positioning' 
                        ? positioningAnalysis.currentPositioning?.strengths 
                        : analysis?.currentPositioning?.strengths)?.map((strength: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-1">
                      {(positioningAnalysis && analysisType === 'positioning' 
                        ? positioningAnalysis.currentPositioning?.weaknesses 
                        : analysis?.currentPositioning?.weaknesses)?.map((weakness: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <AlertCircle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Market Position</h4>
                  <p className="text-gray-700">
                    {positioningAnalysis && analysisType === 'positioning' 
                      ? positioningAnalysis.currentPositioning?.marketPosition 
                      : analysis?.currentPositioning?.marketPosition}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI-Generated Positioning Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                AI-Generated Positioning Recommendations
              </CardTitle>
              <CardDescription>
                Personalized recommendations based on your company and competitive analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!hasPrerequisites ? (
                <div className="text-center py-12">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Prerequisites Required</h3>
                  <p className="text-gray-600 mb-4">
                    Complete your company setup and add competitors to generate positioning recommendations.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={() => window.location.href = "/company"}>
                      Complete Company Setup
                    </Button>
                    <Button variant="outline" onClick={() => window.location.href = "/competitive-analysis"}>
                      Add Competitors
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {(recommendations && recommendations.length > 0) || (positioningAnalysis && analysisType === 'positioning') ? (
                    <div className="grid grid-cols-1 gap-6">
                      {/* Show background analysis results first if available */}
                      {positioningAnalysis && analysisType === 'positioning' && positioningAnalysis.recommendations?.map((recommendation: any) => (
                        <RecommendationCard key={recommendation.id} recommendation={recommendation} />
                      ))}
                      
                      {/* Then show cached recommendations */}
                      {recommendations?.map((recommendation) => (
                        <RecommendationCard key={recommendation.id} recommendation={recommendation} />
                      ))}
                    </div>
                  ) : !isLoading ? (
                    <div className="text-center py-12">
                      <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Yet</h3>
                      <p className="text-gray-600 mb-4">
                        Generate AI-powered positioning recommendations based on your company and competitive analysis.
                      </p>
                      <Button onClick={handleGenerateRecommendations} disabled={isAnalyzing}>
                        <Brain className="h-4 w-4 mr-2" />
                        {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading recommendations...</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Implementation Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Implementation Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Content Strategy</h4>
                  <p className="text-sm text-blue-700">
                    Apply positioning recommendations to your content creation and messaging across all channels.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Brand Messaging</h4>
                  <p className="text-sm text-green-700">
                    Use recommended messaging styles and value propositions in your marketing materials.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Competitive Differentiation</h4>
                  <p className="text-sm text-purple-700">
                    Leverage identified differentiators to stand out in your market positioning.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}