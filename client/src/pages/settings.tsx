import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
  Edit
} from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

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

  const handleEditProfile = () => {
    toast({
      title: "Coming Soon",
      description: "Profile editing will be available soon",
    });
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
              <Button variant="ghost" onClick={handleEditProfile} className="text-primary hover:text-primary/80">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleEditProfile}
                    className="mt-3 text-sm text-primary hover:text-primary/80 w-full"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <span>Marketing Director</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <div className="flex items-center text-gray-900">
                      <Building className="w-4 h-4 text-gray-400 mr-3" />
                      <span>Acme Corporation</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />
              
              <div className="text-sm text-gray-600 flex items-center">
                <Building className="w-4 h-4 mr-2" />
                <span>Acme Corporation</span>
                <span className="mx-2">•</span>
                <Calendar className="w-4 h-4 mr-2" />
                <span>Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}</span>
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
