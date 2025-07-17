import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Globe, Building } from "lucide-react";
import type { Company, Competitor, InsertCompany, InsertCompetitor } from "@shared/schema";

export default function CompanyPage() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [companyForm, setCompanyForm] = useState<Partial<InsertCompany>>({});
  const [competitorForm, setCompetitorForm] = useState<Partial<InsertCompetitor>>({
    name: "",
    website: "",
    description: "",
  });
  const [showCompetitorForm, setShowCompetitorForm] = useState(false);

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

  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ["/api/company"],
    enabled: isAuthenticated,
  });

  const { data: competitors = [], isLoading: competitorsLoading } = useQuery({
    queryKey: ["/api/competitors"],
    enabled: isAuthenticated,
  });

  // Initialize form with existing company data
  useEffect(() => {
    if (company) {
      setCompanyForm({
        name: company.name || "",
        industry: company.industry || "",
        size: company.size || "",
        website: company.website || "",
        description: company.description || "",
        targetAudience: company.targetAudience || "",
      });
    }
  }, [company]);

  const saveCompanyMutation = useMutation({
    mutationFn: async (data: Partial<InsertCompany>) => {
      return await apiRequest("POST", "/api/company", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Company information saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/company"] });
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
        description: "Failed to save company information",
        variant: "destructive",
      });
    },
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
      setShowCompetitorForm(false);
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
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove competitor",
        variant: "destructive",
      });
    },
  });

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    saveCompanyMutation.mutate(companyForm);
  };

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!competitorForm.name) return;
    addCompetitorMutation.mutate(competitorForm);
  };

  return (
    <>
      <Header 
        title="My Company" 
        subtitle="Manage your company information and competitors" 
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveCompany} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Company Name</Label>
                    <Input
                      id="name"
                      value={companyForm.name || ""}
                      onChange={(e) => setCompanyForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Select 
                      value={companyForm.industry || ""} 
                      onValueChange={(value) => setCompanyForm(prev => ({ ...prev, industry: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="size">Company Size</Label>
                    <Select 
                      value={companyForm.size || ""} 
                      onValueChange={(value) => setCompanyForm(prev => ({ ...prev, size: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10 employees">1-10 employees</SelectItem>
                        <SelectItem value="11-50 employees">11-50 employees</SelectItem>
                        <SelectItem value="51-200 employees">51-200 employees</SelectItem>
                        <SelectItem value="201-1000 employees">201-1000 employees</SelectItem>
                        <SelectItem value="1000+ employees">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={companyForm.website || ""}
                      onChange={(e) => setCompanyForm(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={companyForm.description || ""}
                    onChange={(e) => setCompanyForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your company, products, and services..."
                  />
                </div>

                <div>
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Textarea
                    id="targetAudience"
                    rows={3}
                    value={companyForm.targetAudience || ""}
                    onChange={(e) => setCompanyForm(prev => ({ ...prev, targetAudience: e.target.value }))}
                    placeholder="Describe your ideal customers..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button 
                    type="submit" 
                    disabled={saveCompanyMutation.isPending}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {saveCompanyMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Competitors Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Competitors</CardTitle>
              <Button 
                onClick={() => setShowCompetitorForm(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Competitor
              </Button>
            </CardHeader>
            <CardContent>
              {showCompetitorForm && (
                <Card className="mb-6 border-2 border-dashed border-gray-200">
                  <CardContent className="pt-6">
                    <form onSubmit={handleAddCompetitor} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="competitorName">Competitor Name</Label>
                          <Input
                            id="competitorName"
                            value={competitorForm.name || ""}
                            onChange={(e) => setCompetitorForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter competitor name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="competitorWebsite">Website</Label>
                          <Input
                            id="competitorWebsite"
                            type="url"
                            value={competitorForm.website || ""}
                            onChange={(e) => setCompetitorForm(prev => ({ ...prev, website: e.target.value }))}
                            placeholder="https://competitor.com"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="competitorDescription">Description</Label>
                        <Textarea
                          id="competitorDescription"
                          rows={2}
                          value={competitorForm.description || ""}
                          onChange={(e) => setCompetitorForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Brief description of the competitor..."
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => {
                            setShowCompetitorForm(false);
                            setCompetitorForm({ name: "", website: "", description: "" });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={addCompetitorMutation.isPending}
                          className="bg-primary hover:bg-primary/90"
                        >
                          {addCompetitorMutation.isPending ? "Adding..." : "Add Competitor"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {competitorsLoading ? (
                <div className="text-center py-8 text-gray-500">Loading competitors...</div>
              ) : competitors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No competitors added yet. Click "Add Competitor" to get started.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {competitors.map((competitor: Competitor) => (
                    <Card key={competitor.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{competitor.name}</h4>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteCompetitorMutation.mutate(competitor.id)}
                            className="text-gray-400 hover:text-red-500 h-6 w-6 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        {competitor.description && (
                          <p className="text-sm text-gray-600 mb-3">{competitor.description}</p>
                        )}
                        {competitor.website && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Globe className="w-4 h-4 mr-2" />
                            <a 
                              href={competitor.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-primary"
                            >
                              {competitor.website.replace(/^https?:\/\//, "")}
                            </a>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
