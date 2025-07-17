import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Search, 
  Plus, 
  Globe, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Eye,
  Trash2,
  BarChart3,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Shield,
  FileText,
  Link as LinkIcon,
  Loader2
} from "lucide-react";
import type { Competitor, InsertCompetitor, CompetitiveAnalysis } from "@shared/schema";

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

function CompetitorCard({ 
  competitor, 
  onDelete,
  analysis
}: {
  competitor: Competitor;
  onDelete: () => void;
  analysis?: CompetitiveAnalysis;
}) {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              {competitor.name}
            </CardTitle>
            {competitor.website && (
              <p className="text-sm text-gray-500 mt-1">{competitor.website}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Competitor</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {competitor.name}? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {competitor.description && (
          <p className="text-sm text-gray-600 mb-4">{competitor.description}</p>
        )}
        
        {analysis && (
          <div className="space-y-4">
            <Separator />
            
            {/* SEO Strength */}
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">SEO Strength:</span>
              <Badge variant={analysis.seoStrength === 'Strong' ? 'default' : 'secondary'}>
                {analysis.seoStrength || 'Unknown'}
              </Badge>
            </div>
            
            {/* SEO Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {analysis.domainAuthority !== undefined && (
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Domain Authority:</span>
                  <span className="text-sm font-bold">{analysis.domainAuthority}/100</span>
                </div>
              )}
              
              {analysis.pageAuthority !== undefined && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Page Authority:</span>
                  <span className="text-sm font-bold">{analysis.pageAuthority}/100</span>
                </div>
              )}
              
              {analysis.spamScore !== undefined && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Spam Score:</span>
                  <span className="text-sm font-bold">{analysis.spamScore}/100</span>
                </div>
              )}
              
              {analysis.linkingDomains !== undefined && (
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Linking Domains:</span>
                  <span className="text-sm font-bold">{analysis.linkingDomains.toLocaleString()}</span>
                </div>
              )}
            </div>
            
            {/* Insights */}
            {analysis.insights && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">Key Insights:</span>
                </div>
                <p className="text-sm text-gray-600 pl-6">{analysis.insights}</p>
              </div>
            )}
            
            {/* Opportunities */}
            {analysis.opportunities && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Opportunities:</span>
                </div>
                <p className="text-sm text-gray-600 pl-6">{analysis.opportunities}</p>
              </div>
            )}
            
            {/* Threats */}
            {analysis.threats && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Threats:</span>
                </div>
                <p className="text-sm text-gray-600 pl-6">{analysis.threats}</p>
              </div>
            )}
            
            {/* Recommendations */}
            {analysis.recommendations && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-medium">Recommendations:</span>
                </div>
                <p className="text-sm text-gray-600 pl-6">{analysis.recommendations}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function CompetitiveAnalysisPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showAddForm, setShowAddForm] = useState(false);
  const [competitorForm, setCompetitorForm] = useState<Partial<InsertCompetitor>>({
    name: "",
    website: "",
    description: "",
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [landscapeAnalysis, setLandscapeAnalysis] = useState<any>(null);


  const { data: competitors, isLoading } = useQuery<Competitor[]>({
    queryKey: ["/api/competitors"],
    enabled: !!user,
  });

  const { data: analyses } = useQuery<CompetitiveAnalysis[]>({
    queryKey: ["/api/competitive-analyses"],
    enabled: !!user,
  });

  const addCompetitorMutation = useMutation({
    mutationFn: async (data: Partial<InsertCompetitor>) => {
      return await apiRequest("POST", "/api/competitors", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Competitor added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/competitors"] });
      setCompetitorForm({ name: "", website: "", description: "" });
      setShowAddForm(false);
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
        description: "Failed to add competitor",
        variant: "destructive",
      });
    },
  });

  const deleteCompetitorMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/competitors/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Competitor removed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/competitors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/competitive-analyses"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove competitor",
        variant: "destructive",
      });
    },
  });



  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!competitorForm.website) return;
    
    // Ensure name is generated from website if not already set
    const finalForm = {
      ...competitorForm,
      name: competitorForm.name || competitorForm.website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('.')[0]
    };
    
    addCompetitorMutation.mutate(finalForm);
  };



  const analyzeAllMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/competitive-analyses/analyze-all", {});
    },
    onSuccess: () => {
      toast({
        title: "Analysis Complete",
        description: "All competitors have been analyzed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/competitive-analyses"] });
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
      
      // Extract error message from the error object
      const errorMessage = error.message || "Failed to analyze competitors";
      
      toast({
        title: "Analysis Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const analyzeLandscapeMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/competitive-landscape-analysis", {});
    },
    onSuccess: (data) => {
      setLandscapeAnalysis(data);
      toast({
        title: "Success",
        description: "Competitive landscape analysis completed",
      });
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
        description: "Failed to analyze competitive landscape",
        variant: "destructive",
      });
    },
  });

  const handleAnalyzeAll = () => {
    if (!competitors?.length) return;
    analyzeAllMutation.mutate();
  };

  const handleAnalyzeLandscape = () => {
    if (!competitors?.length) return;
    setIsAnalyzing(true);
    analyzeLandscapeMutation.mutate(undefined, {
      onSettled: () => setIsAnalyzing(false)
    });
  };

  const getAnalysisForCompetitor = (competitorId: number) => {
    return analyses?.find(analysis => analysis.competitorId === competitorId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Header 
        title="Competitive Analysis" 
        subtitle="Track competitors and analyze their strengths, weaknesses, and market positioning" 
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Add Competitor Button */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleAnalyzeLandscape}
              disabled={!competitors?.length || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analyze All
                </>
              )}
            </Button>
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Competitor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Competitor</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddCompetitor} className="space-y-4">
                  <div>
                    <Label htmlFor="website">Website/Domain</Label>
                    <Input
                      id="website"
                      value={competitorForm.website || ""}
                      onChange={(e) => setCompetitorForm(prev => ({ 
                        ...prev, 
                        website: e.target.value,
                        // Auto-generate name from domain
                        name: e.target.value ? e.target.value.replace(/^https?:\/\//, '').replace(/^www\./, '').split('.')[0] : prev.name
                      }))}
                      placeholder="https://competitor.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Additional Notes/Context</Label>
                    <Textarea
                      id="description"
                      value={competitorForm.description || ""}
                      onChange={(e) => setCompetitorForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Add any additional context or notes about this competitor..."
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={addCompetitorMutation.isPending}>
                      {addCompetitorMutation.isPending ? "Adding..." : "Add Competitor"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Competitors Grid */}
          {competitors && competitors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {competitors.map((competitor) => (
                <CompetitorCard
                  key={competitor.id}
                  competitor={competitor}
                  onDelete={() => deleteCompetitorMutation.mutate(competitor.id)}
                  analysis={getAnalysisForCompetitor(competitor.id)}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center p-12">
              <div className="flex flex-col items-center space-y-4">
                <Search className="h-12 w-12 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">No competitors added yet</h3>
                <p className="text-gray-600">Start by adding your first competitor to begin competitive analysis</p>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Competitor
                </Button>
              </div>
            </Card>
          )}

          {/* Competitive Landscape Analysis Results */}
          {landscapeAnalysis && (
            <div className="space-y-6">
              <div className="border-t pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Competitive Landscape Analysis</h2>
                
                {/* Executive Summary */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Executive Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{landscapeAnalysis.summary}</p>
                  </CardContent>
                </Card>

                {/* SWOT Analysis */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Your Competitive Position
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {landscapeAnalysis.competitivePosition && (
                      <>
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Market Position</h4>
                          <p className="text-gray-700">{landscapeAnalysis.competitivePosition.marketPosition}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              Strengths
                            </h4>
                            <ul className="space-y-1">
                              {landscapeAnalysis.competitivePosition.strengths?.map((strength: string, index: number) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              Weaknesses
                            </h4>
                            <ul className="space-y-1">
                              {landscapeAnalysis.competitivePosition.weaknesses?.map((weakness: string, index: number) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <AlertTriangle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                                  {weakness}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-blue-600" />
                              Opportunities
                            </h4>
                            <ul className="space-y-1">
                              {landscapeAnalysis.competitivePosition.opportunities?.map((opportunity: string, index: number) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <TrendingUp className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                  {opportunity}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                              <Shield className="h-4 w-4 text-orange-600" />
                              Threats
                            </h4>
                            <ul className="space-y-1">
                              {landscapeAnalysis.competitivePosition.threats?.map((threat: string, index: number) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <Shield className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                                  {threat}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Competitor Insights */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Competitor Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {landscapeAnalysis.competitorInsights?.map((insight: any) => (
                        <div key={insight.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{insight.name}</h4>
                            <Badge variant={insight.threat_level === 'High' ? 'destructive' : insight.threat_level === 'Medium' ? 'default' : 'secondary'}>
                              {insight.threat_level} Threat
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{insight.positioning}</p>
                          <p className="text-sm text-gray-500">Est. Market Share: {insight.marketShare}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Strategic Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Strategic Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {landscapeAnalysis.recommendations?.map((rec: any) => (
                        <div key={rec.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{rec.title}</h4>
                            <Badge variant={rec.priority === 'High' ? 'destructive' : rec.priority === 'Medium' ? 'default' : 'secondary'}>
                              {rec.priority} Priority
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Timeline:</span> {rec.timeline}
                            </div>
                            <div>
                              <span className="font-medium">Expected Impact:</span> {rec.expectedImpact}
                            </div>
                          </div>
                          {rec.actionItems && rec.actionItems.length > 0 && (
                            <div className="mt-3">
                              <span className="font-medium text-sm">Action Items:</span>
                              <ul className="list-disc list-inside mt-1 space-y-1">
                                {rec.actionItems.map((item: string, index: number) => (
                                  <li key={index} className="text-sm text-gray-600">{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}