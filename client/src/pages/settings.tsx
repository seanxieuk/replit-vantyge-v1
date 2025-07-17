import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  User, 
  Mail, 
  Briefcase, 
  Building, 
  Calendar,
  Shield,
  Bell,
  Key,
  Smartphone,
  Monitor,
  Edit,
  Save,
  X,
  Upload
} from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const [companyForm, setCompanyForm] = useState({
    name: "",
    industry: "",
    description: "",
  });

  // Get company data
  const { data: company } = useQuery({
    queryKey: ["/api/company"],
    enabled: !!user,
  });

  // Initialize forms when data loads
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        role: "Marketing Director", // Default role
      });
    }
  }, [user]);

  useEffect(() => {
    if (company) {
      setCompanyForm({
        name: company.name || "",
        industry: company.industry || "",
        description: company.description || "",
      });
    }
  }, [company]);

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

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PATCH", "/api/user/profile", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsEditingProfile(false);
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
        description: "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  // Update company mutation
  const updateCompanyMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PATCH", "/api/company", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Company information updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/company"] });
      setIsEditingCompany(false);
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
        description: "Failed to update company information",
        variant: "destructive",
      });
    },
  });

  // Helper function to compress image
  const compressImage = (file: File, maxWidth = 400, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      
      img.onerror = () => reject(new Error("Failed to load image"));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  // Upload profile photo mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      try {
        const compressedImageData = await compressImage(file);
        const result = await apiRequest("POST", "/api/user/upload-photo", { imageData: compressedImageData });
        return result;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile photo updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
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
        description: "Failed to upload profile photo",
        variant: "destructive",
      });
    },
  });

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(profileForm);
  };

  const handleCancelProfileEdit = () => {
    // Reset form to original values
    if (user) {
      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        role: "Marketing Director",
      });
    }
    setIsEditingProfile(false);
  };

  const handleEditCompany = () => {
    setIsEditingCompany(true);
  };

  const handleSaveCompany = () => {
    updateCompanyMutation.mutate(companyForm);
  };

  const handleCancelCompanyEdit = () => {
    // Reset form to original values
    if (company) {
      setCompanyForm({
        name: company.name || "",
        industry: company.industry || "",
        description: company.description || "",
      });
    }
    setIsEditingCompany(false);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive",
        });
        // Clear the input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "Image size must be less than 5MB",
          variant: "destructive",
        });
        // Clear the input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      uploadPhotoMutation.mutate(file);
    }
    
    // Clear the input after upload attempt
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChangePassword = () => {
    toast({
      title: "Coming Soon", 
      description: "Password change functionality will be available soon",
    });
  };

  const handleEnable2FA = () => {
    toast({
      title: "Coming Soon",
      description: "Two-factor authentication setup will be available soon",
    });
  };

  const handleViewSessions = () => {
    toast({
      title: "Coming Soon",
      description: "Session management will be available soon",
    });
  };

  const handleConfigureNotifications = () => {
    toast({
      title: "Coming Soon",
      description: "Notification settings will be available soon",
    });
  };

  if (isLoading) {
    return (
      <>
        <Header 
          title="Account Settings" 
          subtitle="Manage your account settings and preferences" 
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading settings...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  const userFullName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user?.email || "User";

  const userInitial = user?.firstName?.[0] || user?.email?.[0] || "U";

  return (
    <>
      <Header 
        title="Account Settings" 
        subtitle="Manage your account settings and preferences" 
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Update your personal details and contact information
                </p>
              </div>
              {!isEditingProfile ? (
                <Button variant="ghost" onClick={handleEditProfile} className="text-primary hover:text-primary/80">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    onClick={handleCancelProfileEdit}
                    disabled={updateProfileMutation.isPending}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={updateProfileMutation.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updateProfileMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    {user?.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-medium text-gray-600">
                        {userInitial}
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 text-sm text-primary hover:text-primary/80 w-full"
                    disabled={uploadPhotoMutation.isPending}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadPhotoMutation.isPending ? "Uploading..." : "Change Photo"}
                  </Button>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isEditingProfile ? (
                    <>
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm(prev => ({...prev, firstName: e.target.value}))}
                          placeholder="Enter first name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm(prev => ({...prev, lastName: e.target.value}))}
                          placeholder="Enter last name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm(prev => ({...prev, email: e.target.value}))}
                          placeholder="Enter email"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Input
                          id="role"
                          value={profileForm.role}
                          onChange={(e) => setProfileForm(prev => ({...prev, role: e.target.value}))}
                          placeholder="Enter your role"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <div className="flex items-center text-gray-900">
                          <User className="w-4 h-4 text-gray-400 mr-3" />
                          <span>{userFullName}</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="flex items-center text-gray-900">
                          <Mail className="w-4 h-4 text-gray-400 mr-3" />
                          <span>{user?.email || "Not provided"}</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <div className="flex items-center text-gray-900">
                          <Briefcase className="w-4 h-4 text-gray-400 mr-3" />
                          <span>{profileForm.role || "Marketing Director"}</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                        <div className="flex items-center text-gray-900">
                          <Building className="w-4 h-4 text-gray-400 mr-3" />
                          <span>{company?.name || "No company set"}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Separator className="my-6" />
              
              <div className="text-sm text-gray-600 flex items-center">
                <Building className="w-4 h-4 mr-2" />
                <span>{company?.name || "No company set"}</span>
                <span className="mx-2">•</span>
                <Calendar className="w-4 h-4 mr-2" />
                <span>Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Company Information
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Update your company details and business information
                </p>
              </div>
              {!isEditingCompany ? (
                <Button variant="ghost" onClick={handleEditCompany} className="text-primary hover:text-primary/80">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    onClick={handleCancelCompanyEdit}
                    disabled={updateCompanyMutation.isPending}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveCompany}
                    disabled={updateCompanyMutation.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updateCompanyMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isEditingCompany ? (
                  <>
                    <div className="md:col-span-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={companyForm.name}
                        onChange={(e) => setCompanyForm(prev => ({...prev, name: e.target.value}))}
                        placeholder="Enter company name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        value={companyForm.industry}
                        onChange={(e) => setCompanyForm(prev => ({...prev, industry: e.target.value}))}
                        placeholder="e.g. Technology, Healthcare, Finance"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={companyForm.description}
                        onChange={(e) => setCompanyForm(prev => ({...prev, description: e.target.value}))}
                        placeholder="Describe your company's mission, products, or services"
                        rows={3}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                      <div className="flex items-center text-gray-900">
                        <Building className="w-4 h-4 text-gray-400 mr-3" />
                        <span>{company?.name || "Not set"}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                      <div className="flex items-center text-gray-900">
                        <Briefcase className="w-4 h-4 text-gray-400 mr-3" />
                        <span>{company?.industry || "Not specified"}</span>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <p className="text-gray-900 text-sm leading-relaxed">
                        {company?.description || "No description provided"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security & Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security & Privacy
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage your account security settings
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <Key className="w-5 h-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-900">Password</h4>
                    <p className="text-sm text-gray-600">Last updated 30 days ago</p>
                  </div>
                </div>
                <Button variant="ghost" onClick={handleChangePassword} className="text-primary hover:text-primary/80">
                  Change Password
                </Button>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                    Disabled
                  </Badge>
                  <Button variant="ghost" onClick={handleEnable2FA} className="text-primary hover:text-primary/80">
                    Enable 2FA
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-3">
                  <Monitor className="w-5 h-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-900">Login Sessions</h4>
                    <p className="text-sm text-gray-600">Manage your active sessions</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-green-100 text-green-600">
                    1 Active
                  </Badge>
                  <Button variant="ghost" onClick={handleViewSessions} className="text-primary hover:text-primary/80">
                    View Sessions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications & Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notifications & Preferences
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Customize your notification settings
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive updates via email</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-600">
                    Enabled
                  </Badge>
                  <Button variant="ghost" onClick={handleConfigureNotifications} className="text-primary hover:text-primary/80">
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
