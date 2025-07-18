import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  BarChart3,
  Building2,
  Target,
  Lightbulb,
  TrendingUp,
  FileText,
  Calendar,
  PenTool,
  Megaphone,
  Handshake,
  Users,
  MessageSquare,
  Newspaper,
  Star,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logoSvg from "@assets/2_color_light.svg";

const navigation = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/", icon: BarChart3 },
    ],
  },
  {
    title: "Strategy",
    items: [
      { name: "My Company", href: "/company", icon: Building2 },
      { name: "Competitive Analysis", href: "/competitive-analysis", icon: Target },
      { name: "Positioning Workshop", href: "/positioning-workshops", icon: Lightbulb },
      { name: "Growth Strategy", href: "/growth-strategy", icon: TrendingUp },
    ],
  },
  {
    title: "Content",
    items: [
      { name: "Content Strategy", href: "/content-strategy", icon: FileText },
      { name: "Content Calendar", href: "/content-calendar", icon: Calendar },
      { name: "Blog Creation", href: "/blog-creation", icon: PenTool },
    ],
  },
  {
    title: "Distribution",
    items: [
      { name: "Advertising", href: "/advertising", icon: Megaphone },
      { name: "Partnerships", href: "/partnerships", icon: Handshake },
      { name: "Influencers", href: "/influencers", icon: Users },
      { name: "Community", href: "/community", icon: MessageSquare },
      { name: "PR", href: "/pr", icon: Newspaper },
      { name: "Sponsored Events", href: "/sponsored-events", icon: Star },
    ],
  },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="w-64 bg-sidebar-background text-sidebar-foreground flex flex-col min-h-screen" style={{ backgroundColor: 'hsl(220, 26%, 14%)' }}>
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border bg-sidebar-background" style={{ backgroundColor: 'hsl(220, 26%, 14%)' }}>
        <div className="flex items-center justify-center">
          <img 
            src={logoSvg} 
            alt="Logo" 
            className="h-16 w-auto max-w-full"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-6 bg-sidebar-background" style={{ backgroundColor: 'hsl(220, 26%, 14%)' }}>
        {navigation.map((section) => (
          <div key={section.title}>
            <h3 className="px-3 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar-background" style={{ backgroundColor: 'hsl(220, 26%, 14%)' }}>
        <Link href="/settings">
          <div className="flex items-center space-x-3 mb-3 hover:bg-sidebar-accent rounded-lg p-2 -m-2 transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-sidebar-foreground">
                  {user?.firstName?.[0] || user?.email?.[0] || "U"}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email || "User"
                }
              </div>
              <div className="text-xs text-sidebar-foreground/60">My account</div>
            </div>
            <Settings className="w-4 h-4 text-sidebar-foreground/60" />
          </div>
        </Link>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}