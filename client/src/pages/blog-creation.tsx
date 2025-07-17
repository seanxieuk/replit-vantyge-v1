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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PenTool, 
  Plus, 
  Eye, 
  Edit,
  Trash2,
  Download,
  Copy,
  Calendar,
  Target,
  TrendingUp,
  FileText,
  Lightbulb,
  Brain,
  Sparkles,
  CheckCircle,
  Clock
} from "lucide-react";
import type { ContentItem, InsertContentItem } from "@shared/schema";

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
}

function BlogIdeaCard({ 
  idea, 
  onGenerate, 
  isGenerating 
}: {
  idea: BlogIdea;
  onGenerate: (idea: BlogIdea) => void;
  isGenerating: boolean;
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
    <Card className="relative hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight">{idea.title}</CardTitle>
            <p className="text-sm text-gray-600 mt-2">{idea.description}</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Badge className={getDifficultyColor(idea.difficulty)}>
              {idea.difficulty}
            </Badge>
            <Badge variant="outline">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span className={getSeoScoreColor(idea.seoScore)}>
                {idea.seoScore}%
              </span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Target Audience:</span>
            <p className="text-gray-600">{idea.targetAudience}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Est. Length:</span>
            <p className="text-gray-600">{idea.estimatedLength}</p>
          </div>
        </div>
        
        <div>
          <span className="font-medium text-gray-700 text-sm">Keywords:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {idea.keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <span className="font-medium text-gray-700 text-sm">Content Pillars:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {idea.contentPillars.map((pillar, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {pillar}
              </Badge>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div className="flex justify-end">
          <Button
            onClick={() => onGenerate(idea)}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
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

function ContentCard({ 
  content, 
  onEdit, 
  onDelete, 
  onView 
}: {
  content: ContentItem;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{content.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusColor(content.status)}>
                {content.status}
              </Badge>
              <Badge variant="outline">
                {content.wordCount} words
              </Badge>
              {content.tone && (
                <Badge variant="secondary">
                  {content.tone}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onView}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {content.keywords && (
          <div className="flex flex-wrap gap-1 mb-3">
            {content.keywords.split(',').map((keyword, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {keyword.trim()}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="text-sm text-gray-600">
          {content.scheduledFor && (
            <p className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Scheduled for: {new Date(content.scheduledFor).toLocaleDateString()}
            </p>
          )}
          {content.publishedAt && (
            <p className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Published: {new Date(content.publishedAt).toLocaleDateString()}
            </p>
          )}
          {!content.publishedAt && !content.scheduledFor && (
            <p className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Created: {new Date(content.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function BlogCreationPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState("ideas");
  const [generatingIdeas, setGeneratingIdeas] = useState(false);
  const [generatingContent, setGeneratingContent] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [showContentDialog, setShowContentDialog] = useState(false);

  const { data: company } = useQuery({
    queryKey: ["/api/company"],
    enabled: !!user,
  });

  const { data: competitors } = useQuery({
    queryKey: ["/api/competitors"],
    enabled: !!user,
  });

  const { data: contentItems, isLoading } = useQuery<ContentItem[]>({
    queryKey: ["/api/content"],
    enabled: !!user,
  });

  const { data: blogIdeas } = useQuery<BlogIdea[]>({
    queryKey: ["/api/blog-ideas"],
    enabled: !!user,
    retry: false,
  });

  const generateIdeasMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/blog-ideas", {});
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog ideas generated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-ideas"] });
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

  const generateContentMutation = useMutation({
    mutationFn: async (idea: BlogIdea) => {
      return await apiRequest("POST", "/api/content", {
        title: idea.title,
        type: "blog",
        keywords: idea.keywords.join(", "),
        tone: "professional",
        status: "draft"
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog article generated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      setActiveTab("content");
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
        description: "Failed to generate blog article",
        variant: "destructive",
      });
    },
  });

  const deleteContentMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/content/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Content deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      });
    },
  });

  const handleGenerateIdeas = () => {
    setGeneratingIdeas(true);
    generateIdeasMutation.mutate(undefined, {
      onSettled: () => setGeneratingIdeas(false)
    });
  };

  const handleGenerateContent = (idea: BlogIdea) => {
    setGeneratingContent(idea.id);
    generateContentMutation.mutate(idea, {
      onSettled: () => setGeneratingContent(null)
    });
  };

  const handleViewContent = (content: ContentItem) => {
    setSelectedContent(content);
    setShowContentDialog(true);
  };

  const hasPrerequisites = company && competitors && competitors.length > 0;

  return (
    <>
      <Header 
        title="Blog Creation" 
        subtitle="AI-powered blog content generation using your company context and competitive insights" 
      />

      <main className="flex-1 overflow-y-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ideas">Content Ideas</TabsTrigger>
            <TabsTrigger value="content">Generated Content</TabsTrigger>
          </TabsList>

          <TabsContent value="ideas" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">AI-Generated Blog Ideas</h2>
                <p className="text-gray-600 mt-1">
                  Content suggestions based on your company positioning and competitive analysis
                </p>
              </div>
              <Button
                onClick={handleGenerateIdeas}
                disabled={!hasPrerequisites || generatingIdeas}
              >
                {generatingIdeas ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Generate Ideas
                  </>
                )}
              </Button>
            </div>

            {!hasPrerequisites && (
              <Card>
                <CardContent className="text-center py-12">
                  <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Setup Required</h3>
                  <p className="text-gray-600 mb-4">
                    Complete your company information and competitive analysis to generate relevant blog ideas.
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

            {blogIdeas && blogIdeas.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogIdeas.map((idea) => (
                  <BlogIdeaCard
                    key={idea.id}
                    idea={idea}
                    onGenerate={handleGenerateContent}
                    isGenerating={generatingContent === idea.id}
                  />
                ))}
              </div>
            )}

            {hasPrerequisites && (!blogIdeas || blogIdeas.length === 0) && (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Ideas Generated Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Generate AI-powered blog ideas tailored to your company and market positioning.
                  </p>
                  <Button onClick={handleGenerateIdeas} disabled={generatingIdeas}>
                    <Brain className="h-4 w-4 mr-2" />
                    Generate Ideas
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Generated Content</h2>
                <p className="text-gray-600 mt-1">
                  Manage your AI-generated blog articles and content
                </p>
              </div>
              <Button onClick={() => setActiveTab("ideas")}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Content
              </Button>
            </div>

            {contentItems && contentItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contentItems.map((content) => (
                  <ContentCard
                    key={content.id}
                    content={content}
                    onEdit={() => {}}
                    onDelete={() => deleteContentMutation.mutate(content.id)}
                    onView={() => handleViewContent(content)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <PenTool className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Created Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Generate your first blog article from the content ideas tab.
                  </p>
                  <Button onClick={() => setActiveTab("ideas")}>
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Browse Ideas
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Content View Dialog */}
        <Dialog open={showContentDialog} onOpenChange={setShowContentDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedContent?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedContent && (
                <>
                  <div className="flex items-center gap-2">
                    <Badge className={selectedContent.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {selectedContent.status}
                    </Badge>
                    <Badge variant="outline">
                      {selectedContent.wordCount} words
                    </Badge>
                    {selectedContent.tone && (
                      <Badge variant="secondary">
                        {selectedContent.tone}
                      </Badge>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700">
                      {selectedContent.content || "Content not available"}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => {
                      navigator.clipboard.writeText(selectedContent.content || "");
                      toast({ title: "Success", description: "Content copied to clipboard" });
                    }}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}