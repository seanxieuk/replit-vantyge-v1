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
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">MarketingAI</span>
          </div>
          <CardTitle className="text-xl text-gray-900">Welcome Back</CardTitle>
          <p className="text-gray-600 text-sm mt-2">
            Sign in to your account to access the marketing platform
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <Button 
            onClick={handleLogin} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
            size="lg"
          >
            Sign In
          </Button>
          <p className="text-xs text-gray-500 text-center mt-4">
            For existing users only. Contact support for access requests.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
