import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Copy, Download, CalendarPlus, FileText } from "lucide-react";

export default function ContentCreationPage() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [generatedContent, setGeneratedContent] = useState("");
  const [formData, setFormData] = useState({
    topic: "",
    keywords: "",
    tone: "",
    wordCount: "",
    contentType: "Blog Post",
    additionalInstructions: "",
  });

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

  const generateContentMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/content/generate", data);
      return await response.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(data.content);
      toast({
        title: "Success",
        description: "Content generated successfully",
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
        description: "Failed to generate content",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic",
        variant: "destructive",
      });
      return;
    }
    generateContentMutation.mutate(formData);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      toast({
        title: "Copied",
        description: "Content copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const blob = new Blob([generatedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.topic.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Header 
        title="AI Content Generator" 
        subtitle="Create high-quality marketing content with AI assistance" 
      />

      <main className="flex-1 overflow-y-auto p-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Content Generator</CardTitle>
            <div className="flex space-x-3">
              <Select 
                value={formData.contentType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, contentType: value }))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Blog Post">Blog Post</SelectItem>
                  <SelectItem value="Social Media">Social Media</SelectItem>
                  <SelectItem value="Email Newsletter">Email Newsletter</SelectItem>
                  <SelectItem value="Landing Page">Landing Page</SelectItem>
                  <SelectItem value="Product Description">Product Description</SelectItem>
                  <SelectItem value="Press Release">Press Release</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleGenerate}
                disabled={generateContentMutation.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                <Sparkles className={`w-4 h-4 mr-2 ${generateContentMutation.isPending ? 'animate-pulse' : ''}`} />
                {generateContentMutation.isPending ? "Generating..." : "Generate"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Content Brief Form */}
              <div className="lg:col-span-1 space-y-4">
                <div>
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    value={formData.topic}
                    onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                    placeholder="e.g., Future of Marketing Automation"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="keywords">Target Keywords</Label>
                  <Input
                    id="keywords"
                    value={formData.keywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                    placeholder="marketing automation, AI, workflow"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tone">Tone</Label>
                  <Select 
                    value={formData.tone} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Conversational">Conversational</SelectItem>
                      <SelectItem value="Educational">Educational</SelectItem>
                      <SelectItem value="Persuasive">Persuasive</SelectItem>
                      <SelectItem value="Casual">Casual</SelectItem>
                      <SelectItem value="Formal">Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="wordCount">Word Count</Label>
                  <Select 
                    value={formData.wordCount} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, wordCount: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select word count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="500-800 words">500-800 words</SelectItem>
                      <SelectItem value="800-1200 words">800-1200 words</SelectItem>
                      <SelectItem value="1200-1500 words">1200-1500 words</SelectItem>
                      <SelectItem value="1500+ words">1500+ words</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="additionalInstructions">Additional Instructions</Label>
                  <Textarea
                    id="additionalInstructions"
                    rows={3}
                    value={formData.additionalInstructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalInstructions: e.target.value }))}
                    placeholder="Include case studies, focus on ROI, etc."
                  />
                </div>
              </div>

              {/* Generated Content Preview */}
              <div className="lg:col-span-2">
                <div className="border border-gray-200 rounded-lg p-6 min-h-96 overflow-y-auto bg-gray-50">
                  {generateContentMutation.isPending ? (
                    <div className="text-center text-gray-500 mt-20">
                      <Sparkles className="w-8 h-8 mx-auto mb-4 animate-pulse" />
                      <p>Generating content...</p>
                      <p className="text-sm">This may take a moment</p>
                    </div>
                  ) : generatedContent ? (
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-gray-900">
                        {generatedContent}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 mt-20">
                      <FileText className="w-12 h-12 mx-auto mb-4" />
                      <p>Generated content will appear here</p>
                      <p className="text-sm">Fill out the form and click "Generate" to create AI-powered content</p>
                    </div>
                  )}
                </div>
                
                {generatedContent && (
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCopy}
                        size="sm"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleExport}
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                    <Button
                      type="button"
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <CalendarPlus className="w-4 h-4 mr-2" />
                      Add to Calendar
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
