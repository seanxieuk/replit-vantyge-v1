import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">MarketingAI</span>
          </div>
          <CardTitle className="text-xl text-gray-900">Welcome</CardTitle>
          <p className="text-gray-600 text-sm mt-2">
            Sign in to access your AI-powered marketing platform
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <Button 
            onClick={handleLogin} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
            size="lg"
          >
            Sign In / Sign Up
          </Button>
          <p className="text-xs text-gray-500 text-center mt-4">
            New users will be automatically registered on first sign-in
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
