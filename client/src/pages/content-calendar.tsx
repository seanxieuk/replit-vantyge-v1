import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import type { ContentItem } from "@shared/schema";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const getContentTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "blog post":
    case "blog":
      return "bg-blue-100 text-blue-800";
    case "social media":
    case "social":
      return "bg-green-100 text-green-800";
    case "email":
    case "email newsletter":
      return "bg-purple-100 text-purple-800";
    case "webinar":
      return "bg-orange-100 text-orange-800";
    case "landing page":
      return "bg-indigo-100 text-indigo-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "draft":
    case "in progress":
      return "bg-yellow-400";
    case "review":
      return "bg-blue-400";
    case "ready":
    case "published":
      return "bg-green-400";
    default:
      return "bg-gray-400";
  }
};

export default function ContentCalendarPage() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);

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

  const { data: contentItems = [] } = useQuery({
    queryKey: ["/api/content"],
    enabled: isAuthenticated,
  });

  // Generate calendar days
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) { // 6 weeks
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    setCalendarDays(days);
  }, [currentDate]);

  const getContentForDate = (date: Date) => {
    return contentItems.filter((item: ContentItem) => {
      if (!item.scheduledFor) return false;
      const scheduledDate = new Date(item.scheduledFor);
      return (
        scheduledDate.getDate() === date.getDate() &&
        scheduledDate.getMonth() === date.getMonth() &&
        scheduledDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  // Pipeline content organized by status
  const pipelineContent = {
    "In Progress": contentItems.filter((item: ContentItem) => item.status === "draft"),
    "Review": contentItems.filter((item: ContentItem) => item.status === "review"),
    "Ready to Publish": contentItems.filter((item: ContentItem) => item.status === "ready" || item.status === "published"),
  };

  return (
    <>
      <Header 
        title="Content Calendar" 
        subtitle="Plan and schedule your content strategy" 
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Calendar */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Content Calendar</CardTitle>
              <div className="flex space-x-3">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={previousMonth}>
                    ←
                  </Button>
                  <span className="text-lg font-medium min-w-48 text-center">
                    {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </span>
                  <Button variant="outline" onClick={nextMonth}>
                    →
                  </Button>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Content
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-700">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => {
                  const dayContent = getContentForDate(date);
                  const isOtherMonth = !isCurrentMonth(date);
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-24 p-2 border border-gray-100 ${
                        isOtherMonth ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isOtherMonth ? "text-gray-400" : "text-gray-900"
                      }`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayContent.slice(0, 2).map((item: ContentItem) => (
                          <Badge
                            key={item.id}
                            variant="secondary"
                            className={`text-xs block w-full truncate ${getContentTypeColor(item.type)}`}
                          >
                            {item.type}
                          </Badge>
                        ))}
                        {dayContent.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayContent.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Content Pipeline */}
          <Card>
            <CardHeader>
              <CardTitle>Content Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(pipelineContent).map(([status, items]) => (
                  <div key={status}>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(status)}`}></div>
                      {status} ({items.length})
                    </h4>
                    <div className="space-y-3">
                      {items.length === 0 ? (
                        <div className="text-sm text-gray-500 text-center py-4">
                          No content in this stage
                        </div>
                      ) : (
                        items.map((item: ContentItem) => (
                          <Card key={item.id} className="border border-gray-200">
                            <CardContent className="p-3">
                              <h5 className="font-medium text-sm text-gray-900 mb-1">
                                {item.title}
                              </h5>
                              <p className="text-xs text-gray-600 mb-2">
                                {item.type}
                                {item.scheduledFor && (
                                  <span> • Due {new Date(item.scheduledFor).toLocaleDateString()}</span>
                                )}
                              </p>
                              <div className="flex items-center">
                                <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                                <span className="text-xs text-gray-600">Content Creator</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{contentItems.length}</div>
                <div className="text-sm text-gray-600">Total Content</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {pipelineContent["In Progress"].length}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {pipelineContent["Review"].length}
                </div>
                <div className="text-sm text-gray-600">In Review</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {pipelineContent["Ready to Publish"].length}
                </div>
                <div className="text-sm text-gray-600">Ready</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
