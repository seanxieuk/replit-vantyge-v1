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
import { Building2, Globe, Linkedin, Plus, X, Target, Users, AlertCircle } from "lucide-react";
import type { Company, InsertCompany } from "@shared/schema";

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

function MultiInputField({ 
  label, 
  values, 
  onChange, 
  placeholder, 
  icon: Icon 
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  icon: React.ComponentType<any>;
}) {
  const [inputValue, setInputValue] = useState("");

  const addValue = () => {
    if (inputValue.trim() && !values.includes(inputValue.trim())) {
      onChange([...values, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeValue = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {label}
      </Label>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addValue();
            }
          }}
        />
        <Button type="button" onClick={addValue} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((value, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {value}
            <X
              className="h-3 w-3 cursor-pointer hover:text-red-500"
              onClick={() => removeValue(index)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default function CompanyPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [companyForm, setCompanyForm] = useState<Partial<InsertCompany>>({
    name: "",
    domain: "",
    linkedinUrl: "",
    industry: "",
    size: "",
    description: "",
    uniqueSellingProposition: "",
    products: [],
    services: [],
    idealCustomerProfiles: "",
    customerPainPoints: [],
    targetAudience: "",
  });

  const { data: company, isLoading } = useQuery<Company>({
    queryKey: ["/api/company"],
    enabled: !!user,
  });

  React.useEffect(() => {
    if (company && !isLoading) {
      setCompanyForm({
        name: company.name || "",
        domain: company.domain || "",
        linkedinUrl: company.linkedinUrl || "",
        industry: company.industry || "",
        size: company.size || "",
        description: company.description || "",
        uniqueSellingProposition: company.uniqueSellingProposition || "",
        products: company.products || [],
        services: company.services || [],
        idealCustomerProfiles: company.idealCustomerProfiles || "",
        customerPainPoints: company.customerPainPoints || [],
        targetAudience: company.targetAudience || "",
      });
    }
  }, [company, isLoading]);

  const saveCompanyMutation = useMutation({
    mutationFn: async (data: Partial<InsertCompany>) => {
      const method = company ? "PUT" : "POST";
      return await apiRequest(method, "/api/company", data);
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

  const handleDomainChange = (domain: string) => {
    setCompanyForm(prev => ({ 
      ...prev, 
      domain,
      // Auto-generate company name from domain
      name: domain ? domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('.')[0] : prev.name
    }));
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    saveCompanyMutation.mutate(companyForm);
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
        title="My Company" 
        subtitle="Manage your company information to power AI insights across all marketing functions" 
      />

      <main className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSaveCompany} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="domain" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website Domain
                  </Label>
                  <Input
                    id="domain"
                    value={companyForm.domain || ""}
                    onChange={(e) => handleDomainChange(e.target.value)}
                    placeholder="https://yourcompany.com"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    value={companyForm.name || ""}
                    onChange={(e) => setCompanyForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Auto-generated from domain"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="linkedinUrl" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn URL
                </Label>
                <Input
                  id="linkedinUrl"
                  value={companyForm.linkedinUrl || ""}
                  onChange={(e) => setCompanyForm(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={companyForm.industry || ""}
                    onChange={(e) => setCompanyForm(prev => ({ ...prev, industry: e.target.value }))}
                    placeholder="Technology, Healthcare, Finance, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="size">Company Size</Label>
                  <Input
                    id="size"
                    value={companyForm.size || ""}
                    onChange={(e) => setCompanyForm(prev => ({ ...prev, size: e.target.value }))}
                    placeholder="1-10, 11-50, 51-200, etc."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  value={companyForm.description || ""}
                  onChange={(e) => setCompanyForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what your company does..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Value Proposition */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Value Proposition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="usp">Unique Selling Proposition</Label>
                <Textarea
                  id="usp"
                  value={companyForm.uniqueSellingProposition || ""}
                  onChange={(e) => setCompanyForm(prev => ({ ...prev, uniqueSellingProposition: e.target.value }))}
                  placeholder="What makes your company unique and different from competitors?"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Products & Services */}
          <Card>
            <CardHeader>
              <CardTitle>Products & Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <MultiInputField
                label="Products"
                values={companyForm.products || []}
                onChange={(values) => setCompanyForm(prev => ({ ...prev, products: values }))}
                placeholder="Add a product"
                icon={Plus}
              />
              
              <Separator />
              
              <MultiInputField
                label="Services"
                values={companyForm.services || []}
                onChange={(values) => setCompanyForm(prev => ({ ...prev, services: values }))}
                placeholder="Add a service"
                icon={Plus}
              />
            </CardContent>
          </Card>

          {/* Customer Intelligence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="idealCustomerProfiles" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Ideal Customer Profiles (ICPs)
                </Label>
                <Textarea
                  id="idealCustomerProfiles"
                  value={companyForm.idealCustomerProfiles || ""}
                  onChange={(e) => setCompanyForm(prev => ({ ...prev, idealCustomerProfiles: e.target.value }))}
                  placeholder="Describe your ideal customer's organization type, company type, company size, revenue range, job titles, job functions, seniority level, decision-making process, and key characteristics..."
                  rows={4}
                />
              </div>
              
              <Separator />
              
              <MultiInputField
                label="Customer Pain Points"
                values={companyForm.customerPainPoints || []}
                onChange={(values) => setCompanyForm(prev => ({ ...prev, customerPainPoints: values }))}
                placeholder="Add a customer pain point"
                icon={AlertCircle}
              />
              
              <Separator />
              
              <div>
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Textarea
                  id="targetAudience"
                  value={companyForm.targetAudience || ""}
                  onChange={(e) => setCompanyForm(prev => ({ ...prev, targetAudience: e.target.value }))}
                  placeholder="Describe your target audience in detail..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saveCompanyMutation.isPending}
              className="min-w-[120px]"
            >
              {saveCompanyMutation.isPending ? "Saving..." : "Save Company"}
            </Button>
          </div>
        </form>
      </main>
    </>
  );
}