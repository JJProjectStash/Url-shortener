import { useState } from "react";
import UrlShortener from "@/components/UrlShortener";
import UrlList from "@/components/UrlList";
import Analytics from "@/components/Analytics";
import { Card, CardContent } from "@/components/ui/card";
import { Link2, Database, Zap } from "lucide-react";

export default function Index() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedShortCode, setSelectedShortCode] = useState<string | null>(
    null
  );

  const handleUrlCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleViewAnalytics = (shortCode: string) => {
    setSelectedShortCode(shortCode);
  };

  const handleBackToList = () => {
    setSelectedShortCode(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link2 className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                URL Shortener
              </h1>
            </div>
            <div className="text-sm text-muted-foreground">
              DSA Project - Hash Map & Queue
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">
              Shorten Your URLs Instantly
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A production-ready URL shortener demonstrating Hash Maps (O(1)
              lookups) and Queue-based rate limiting. Perfect for your DSA
              project!
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-yellow-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">O(1) Lookups</h3>
                    <p className="text-sm text-muted-foreground">
                      Hash Map implementation for instant URL retrieval
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Database className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Queue-Based Limiting</h3>
                    <p className="text-sm text-muted-foreground">
                      FIFO queue for rate limiting and abuse prevention
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Link2 className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Click Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      Track clicks and view detailed statistics
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Functionality */}
          {selectedShortCode ? (
            <Analytics
              shortCode={selectedShortCode}
              onBack={handleBackToList}
            />
          ) : (
            <>
              <UrlShortener onUrlCreated={handleUrlCreated} />
              <UrlList
                refreshTrigger={refreshTrigger}
                onViewAnalytics={handleViewAnalytics}
              />
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built with React, Shadcn-UI, Node.js, Express, and MongoDB</p>
          <p className="mt-1">
            Demonstrating Hash Maps and Queue data structures
          </p>
        </div>
      </footer>
    </div>
  );
}
