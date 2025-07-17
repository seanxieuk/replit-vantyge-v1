import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  PenTool, 
  Eye, 
  Target,
  TrendingUp,
  FileText,
  Lightbulb,
  Brain,
  Sparkles,
  CheckCircle,
  Clock,
  Copy,
  Download,
  Loader2
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

interface BlogIdea {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  estimatedLength: string;
  difficulty: string;
  targetAudience: string;
  contentPillars: string[];
  seoScore: number;
  rationale: string;
}

interface GeneratedArticle {
  title: string;
  content: string;
  metaDescription: string;
  keywords: string[];
  wordCount: number;
}

function BlogIdeaCard({ 
  idea, 
  onGenerate, 
  generatingArticleId 
}: {
  idea: BlogIdea;
  onGenerate: (idea: BlogIdea) => void;
  generatingArticleId: string | null;
}) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeoScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="relative hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{idea.title}</CardTitle>
            <p className="text-sm text-gray-600 mb-3">{idea.description}</p>
            <p className="text-xs text-gray-500 mb-3 italic">{idea.rationale}</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Badge className={getDifficultyColor(idea.difficulty)}>
              {idea.difficulty}
            </Badge>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span className={`text-sm font-medium ${getSeoScoreColor(idea.seoScore)}`}>
                {idea.seoScore}%
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Target Audience</span>
            </div>
            <p className="text-gray-600">{idea.targetAudience}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="font-medium">Estimated Length</span>
            </div>
            <p className="text-gray-600">{idea.estimatedLength}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-purple-600" />
            <span className="font-medium text-sm">Content Pillars</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {idea.contentPillars.map((pillar, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {pillar}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-yellow-600" />
            <span className="font-medium text-sm">Keywords</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {idea.keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button
            onClick={() => onGenerate(idea)}
            disabled={generatingArticleId === idea.id}
            className="w-full"
          >
            {generatingArticleId === idea.id ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Article...
              </>
            ) : (
              <>
                <PenTool className="h-4 w-4 mr-2" />
                Generate Full Article
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ArticleModal({ 
  article, 
  isOpen, 
  onClose 
}: {
  article: GeneratedArticle | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { toast } = useToast();

  const handleCopy = () => {
    if (article) {
      navigator.clipboard.writeText(article.content);
      toast({
        title: "Copied to clipboard",
        description: "Article content has been copied to your clipboard",
      });
    }
  };

  const handleDownload = () => {
    if (article) {
      const blob = new Blob([article.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${article.title.replace(/[^a-zA-Z0-9]/g, '-')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Downloaded",
        description: "Article has been downloaded as a text file",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {article?.title || "Generated Article"}
          </DialogTitle>
        </DialogHeader>
        
        {article && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Word Count: {article.wordCount}</span>
                <span>Keywords: {article.keywords.length}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Meta Description</h4>
              <p className="text-sm text-blue-800">{article.metaDescription}</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">SEO Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-4">Article Content</h4>
              <div className="prose max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                {article.content}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function BlogCreationPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedArticle, setSelectedArticle] = useState<GeneratedArticle | null>(null);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [generatingArticleId, setGeneratingArticleId] = useState<string | null>(null);

  const { data: company } = useQuery({
    queryKey: ["/api/company"],
    enabled: !!user,
  });

  const { data: competitors } = useQuery({
    queryKey: ["/api/competitors"],
    enabled: !!user,
  });

  const { data: positioningRecommendations } = useQuery({
    queryKey: ["/api/positioning-recommendations"],
    enabled: !!user,
    retry: false,
  });

  const { data: blogIdeas, isLoading: isLoadingIdeas } = useQuery<BlogIdea[]>({
    queryKey: ["/api/blog-ideas"],
    enabled: !!user && !!company,
    retry: false,
  });

  const generateIdeasMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/blog-ideas', {});
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Blog topic ideas generated successfully",
      });
      queryClient.setQueryData(["/api/blog-ideas"], data);
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
        description: "Failed to generate blog ideas",
        variant: "destructive",
      });
    },
  });

  const generateArticleMutation = useMutation({
    mutationFn: async (idea: BlogIdea) => {
      const response = await apiRequest('POST', '/api/generate-article', { idea });
      return response.json();
    },
    onSuccess: (data) => {
      setSelectedArticle(data);
      setShowArticleModal(true);
      setGeneratingArticleId(null);
    },
    onError: (error) => {
      setGeneratingArticleId(null);
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
        description: "Failed to generate article",
        variant: "destructive",
      });
    },
  });

  const handleGenerateIdeas = () => {
    generateIdeasMutation.mutate();
  };

  const handleGenerateArticle = (idea: BlogIdea) => {
    setGeneratingArticleId(idea.id);
    generateArticleMutation.mutate(idea);
  };

  const hasPrerequisites = company;
  const hasCompetitiveData = competitors && competitors.length > 0;
  const hasPositioningData = positioningRecommendations && positioningRecommendations.length > 0;

  return (
    <>
      <Header 
        title="Blog Creation" 
        subtitle="AI-powered blog topic generation and article writing based on your company profile and competitive intelligence" 
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1028px] mx-auto space-y-6">
          {/* Prerequisites Check */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Data Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  {company ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                  )}
                  <div>
                    <span className={company ? "text-green-700 font-medium" : "text-gray-500"}>
                      Company Profile
                    </span>
                    <p className="text-xs text-gray-500">Required for topic generation</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {hasCompetitiveData ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                  )}
                  <div>
                    <span className={hasCompetitiveData ? "text-green-700 font-medium" : "text-gray-500"}>
                      Competitive Analysis
                    </span>
                    <p className="text-xs text-gray-500">Enhances topic relevance</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {hasPositioningData ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                  )}
                  <div>
                    <span className={hasPositioningData ? "text-green-700 font-medium" : "text-gray-500"}>
                      Positioning Insights
                    </span>
                    <p className="text-xs text-gray-500">Refines messaging approach</p>
                  </div>
                </div>
              </div>

              {!hasPrerequisites && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Complete your company profile to enable AI-powered blog topic generation.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Topic Generation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Topic Generator
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasPrerequisites ? (
                <div className="text-center">
                  <div className="mb-4">
                    <p className="text-gray-600 mb-2">
                      Generate personalized blog topics based on your company profile
                      {hasCompetitiveData && ", competitive analysis"}
                      {hasPositioningData && ", and positioning insights"}.
                    </p>
                  </div>
                  <Button
                    onClick={handleGenerateIdeas}
                    disabled={generateIdeasMutation.isPending}
                    size="lg"
                    className="px-8"
                  >
                    {generateIdeasMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Ideas...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Topic Ideas
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Company Profile Required</h3>
                  <p className="text-gray-600 mb-4">
                    Complete your company setup to unlock AI-powered blog topic generation.
                  </p>
                  <Button variant="outline" onClick={() => window.location.href = "/company"}>
                    Complete Company Setup
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generated Topics */}
          {blogIdeas && blogIdeas.length > 0 && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Generated Topic Ideas</h2>
                <p className="text-gray-600">
                  AI-generated blog topics tailored to your company and market positioning
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {blogIdeas.map((idea) => (
                  <BlogIdeaCard
                    key={idea.id}
                    idea={idea}
                    onGenerate={handleGenerateArticle}
                    generatingArticleId={generatingArticleId}
                  />
                ))}
              </div>
            </div>
          )}

          {hasPrerequisites && (!blogIdeas || blogIdeas.length === 0) && !isLoadingIdeas && !generateIdeasMutation.isPending && (
            <Card>
              <CardContent className="text-center py-12">
                <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Topics Generated Yet</h3>
                <p className="text-gray-600 mb-4">
                  Click "Generate Topic Ideas" to create personalized blog topics for your company.
                </p>
                <Button onClick={handleGenerateIdeas} disabled={generateIdeasMutation.isPending}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Topic Ideas
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <ArticleModal 
        article={selectedArticle}
        isOpen={showArticleModal}
        onClose={() => setShowArticleModal(false)}
      />
    </>
  );
}