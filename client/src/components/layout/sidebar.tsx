import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { 
  Brain, 
  BarChart3, 
  Building, 
  Search, 
  Target, 
  Lightbulb, 
  PenTool, 
  Calendar, 
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logoSvg from "@assets/2_color_light.svg";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3, group: "Overview" },
  { name: "My Company", href: "/company", icon: Building, group: "Overview" },
  { name: "Competitive Analysis", href: "/competitive-analysis", icon: Search, group: "AI Tools" },
  { name: "Content Creation", href: "/content-creation", icon: PenTool, group: "AI Tools" },
  { name: "Content Calendar", href: "/content-calendar", icon: Calendar, group: "AI Tools" },
  { name: "Settings", href: "/settings", icon: Settings, group: "Account" },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  // Group navigation items
  const groupedNav = navigation.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof navigation>);

  return (
    <div className="w-64 bg-sidebar-background text-sidebar-foreground flex flex-col min-h-screen" style={{ backgroundColor: 'hsl(220, 26%, 14%)' }}>
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border bg-sidebar-background" style={{ backgroundColor: 'hsl(220, 26%, 14%)' }}>
        <div className="flex items-center space-x-3">
          <img 
            src={logoSvg} 
            alt="Logo" 
            className="h-8 w-auto"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 bg-sidebar-background" style={{ backgroundColor: 'hsl(220, 26%, 14%)' }}>
        {Object.entries(groupedNav).map(([group, items]) => (
          <div key={group}>
            <div className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider mb-3">
              {group}
            </div>
            <div className="space-y-1 mb-6">
              {items.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
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
        <div className="flex items-center space-x-3 mb-3">
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
            <div className="text-xs text-sidebar-foreground/60">Marketing Team</div>
          </div>
        </div>
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
