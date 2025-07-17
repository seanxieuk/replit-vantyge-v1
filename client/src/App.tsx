import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Company from "@/pages/company";
import CompetitiveAnalysis from "@/pages/competitive-analysis";
import ContentCreation from "@/pages/content-creation";
import ContentCalendar from "@/pages/content-calendar";
import Settings from "@/pages/settings";
import AppLayout from "@/components/layout/app-layout";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <AppLayout>
          <Route path="/" component={Dashboard} />
          <Route path="/company" component={Company} />
          <Route path="/competitive-analysis" component={CompetitiveAnalysis} />
          <Route path="/content-creation" component={ContentCreation} />
          <Route path="/content-calendar" component={ContentCalendar} />
          <Route path="/settings" component={Settings} />
        </AppLayout>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
