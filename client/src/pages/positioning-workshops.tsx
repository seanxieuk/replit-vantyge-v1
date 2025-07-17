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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        
        <Separator />
        
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-purple-600" />
              Messaging Style
            </h4>
            <p className="text-sm text-gray-600 pl-6">{recommendation.messagingStyle}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-600" />
              Value Proposition
            </h4>
            <p className="text-sm text-gray-600 pl-6">{recommendation.valueProposition}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Key Differentiators
            </h4>
            <ul className="text-sm text-gray-600 pl-6 space-y-1">
              {recommendation.differentiators.map((diff, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                  {diff}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Target Segments
            </h4>
            <div className="flex flex-wrap gap-2 pl-6">
              {recommendation.targetSegments.map((segment, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {segment}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WorkshopStep({ 
  number, 
  title, 
  description, 
  isCompleted, 
  isActive 
}: {
  number: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}) {
  return (
    <div className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
      isActive ? 'bg-blue-50 border-2 border-blue-200' : 
      isCompleted ? 'bg-green-50 border-2 border-green-200' : 
      'bg-gray-50 border-2 border-gray-200'
    }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
        isCompleted ? 'bg-green-500 text-white' :
        isActive ? 'bg-blue-500 text-white' :
        'bg-gray-300 text-gray-600'
      }`}>
        {isCompleted ? <CheckCircle className="h-4 w-4" /> : number}
      </div>
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
}

export default function PositioningWorkshopsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

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
    setIsGenerating(true);
    generateRecommendationsMutation.mutate(undefined, {
      onSettled: () => setIsGenerating(false)
    });
  };

  const workshopSteps = [
    {
      title: "Company Analysis",
      description: "Analyze your company's strengths, values, and market position",
      isCompleted: !!company,
      isActive: !company
    },
    {
      title: "Competitive Intelligence",
      description: "Gather insights about your competitors' positioning strategies",
      isCompleted: competitors && competitors.length > 0,
      isActive: !!company && (!competitors || competitors.length === 0)
    },
    {
      title: "AI-Powered Recommendations",
      description: "Generate personalized positioning recommendations using AI",
      isCompleted: !!recommendations,
      isActive: !!company && competitors && competitors.length > 0 && !recommendations
    },
    {
      title: "Strategy Implementation",
      description: "Apply recommendations to your content and messaging strategy",
      isCompleted: false,
      isActive: !!recommendations
    }
  ];

  const hasPrerequisites = company && competitors && competitors.length > 0;

  return (
    <>
      <Header 
        title="Positioning Workshops" 
        subtitle="AI-driven brand positioning and messaging recommendations based on your company and competitive analysis" 
      />

      <main className="flex-1 overflow-y-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Workshop Overview</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Workshop Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workshopSteps.map((step, index) => (
                  <WorkshopStep
                    key={index}
                    number={index + 1}
                    title={step.title}
                    description={step.description}
                    isCompleted={step.isCompleted}
                    isActive={step.isActive}
                  />
                ))}
              </CardContent>
            </Card>

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
                      disabled={isGenerating}
                      size="lg"
                      className="px-8"
                    >
                      {isGenerating ? (
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
            {analysis?.currentPositioning && (
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
                    <p className="text-gray-700">{analysis.currentPositioning.overview}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {analysis.currentPositioning.strengths.map((strength, index) => (
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
                        {analysis.currentPositioning.weaknesses.map((weakness, index) => (
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
                    <p className="text-gray-700">{analysis.currentPositioning.marketPosition}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">AI-Generated Positioning Recommendations</h2>
              <p className="text-gray-600 mt-1">
                Personalized recommendations based on your company and competitive analysis
              </p>
            </div>

            {!hasPrerequisites && (
              <Card>
                <CardContent className="text-center py-12">
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
                </CardContent>
              </Card>
            )}

            {recommendations && recommendations.length > 0 && (
              <div className="grid grid-cols-1 gap-6">
                {recommendations.map((recommendation) => (
                  <RecommendationCard key={recommendation.id} recommendation={recommendation} />
                ))}
              </div>
            )}

            {hasPrerequisites && (!recommendations || recommendations.length === 0) && !isLoading && (
              <Card>
                <CardContent className="text-center py-12">
                  <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Generate AI-powered positioning recommendations based on your company and competitive analysis.
                  </p>
                  <Button onClick={handleGenerateRecommendations} disabled={isGenerating}>
                    <Brain className="h-4 w-4 mr-2" />
                    {isGenerating ? 'Analyzing...' : 'Analyze'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="implementation" className="space-y-6">
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
                      Highlight your unique differentiators identified through competitive analysis.
                    </p>
                  </div>
                </div>

                {recommendations && recommendations.length > 0 && (
                  <div className="mt-6">
                    <Button className="w-full" onClick={() => window.location.href = "/blog-creation"}>
                      Apply to Content Creation
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}