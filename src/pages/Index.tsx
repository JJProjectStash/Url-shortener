import { useState } from "react";
import UrlShortener from "@/components/UrlShortener";
import UrlList from "@/components/UrlList";
import Analytics from "@/components/Analytics";
import { Card, CardContent } from "@/components/ui/card";
import { Link2, Database, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  FloatingParticles,
  AnimatedLinkChain,
  LightModeDecoration,
  DarkModeDecoration,
} from "@/components/AnimatedSVGs";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-700 ease-in-out relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-20 transition-opacity duration-700">
        <FloatingParticles className="w-full h-full" />
      </div>

      {/* Light Mode Decorations */}
      <div className="fixed top-10 right-10 w-64 h-64 pointer-events-none opacity-40 dark:opacity-0 transition-opacity duration-700">
        <LightModeDecoration className="w-full h-full" />
      </div>
      <div className="fixed bottom-10 left-10 w-64 h-64 pointer-events-none opacity-40 dark:opacity-0 transition-opacity duration-700">
        <LightModeDecoration className="w-full h-full" />
      </div>

      {/* Dark Mode Decorations */}
      <div className="fixed top-10 right-10 w-64 h-64 pointer-events-none opacity-0 dark:opacity-30 transition-opacity duration-700">
        <DarkModeDecoration className="w-full h-full" />
      </div>
      <div className="fixed bottom-10 left-10 w-64 h-64 pointer-events-none opacity-0 dark:opacity-30 transition-opacity duration-700">
        <DarkModeDecoration className="w-full h-full" />
      </div>

      {/* Gradient Orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse-glow transition-all duration-700" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse-glow animation-delay-500 transition-all duration-700" />

      {/* Header with enhanced animations */}
      <header className="border-b bg-white/90 dark:bg-gray-900/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-700 shadow-sm hover:shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 animate-fade-in-down group cursor-pointer">
              <div className="relative w-10 h-10 group-hover:scale-110 transition-transform duration-500">
                <AnimatedLinkChain className="w-full h-full" />
                <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <h1 className="text-2xl font-bold gradient-text animate-gradient group-hover:scale-105 transition-transform duration-500">
                URL Shortener
              </h1>
            </div>
            <div className="flex items-center gap-4 animate-fade-in-down animation-delay-200">
              <div className="text-sm text-muted-foreground hidden sm:block font-medium opacity-80 hover:opacity-100 transition-opacity duration-300">
                DSA Project - Hash Map & Queue
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section with enhanced title animations */}
          <div className="text-center space-y-6 animate-fade-in-up py-8">
            <h2 className="text-6xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
              <span className="inline-block animate-fade-in-up">Shorten</span>{" "}
              <span className="inline-block animate-fade-in-up animation-delay-100">
                Your
              </span>{" "}
              <span className="inline-block animate-fade-in-up animation-delay-200">
                URLs
              </span>
              <br />
              <span className="gradient-text animate-gradient inline-block animate-fade-in-up animation-delay-300 text-7xl md:text-8xl">
                Instantly
              </span>
            </h2>

            {/* Animated underline */}
            <div className="flex justify-center animate-fade-in-up animation-delay-400">
              <div className="h-1 w-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-gradient" />
            </div>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-500 font-medium">
              A URL shortener demonstrating{" "}
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                Hash Maps (O(1) lookups)
              </span>{" "}
              and{" "}
              <span className="text-purple-600 dark:text-purple-400 font-semibold">
                Queue-based rate limiting
              </span>
              .
              <br />
              Built with modern web technologies.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up animation-delay-200">
            <Card className="group hover-lift border-2 hover:border-yellow-500/50 dark:hover:border-yellow-400/50 transition-all duration-500 overflow-hidden relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-glow" />
                    <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mt-1 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative z-10" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 dark:text-white text-lg group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors duration-300">
                      O(1) Lookups
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Hash Map implementation for instant URL retrieval
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover-lift border-2 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-500 overflow-hidden relative animation-delay-100 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-glow" />
                    <Database className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative z-10" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      Queue-Based Limiting
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      FIFO queue for rate limiting and abuse prevention
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover-lift border-2 hover:border-green-500/50 dark:hover:border-green-400/50 transition-all duration-500 overflow-hidden relative animation-delay-200 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-glow" />
                    <Link2 className="h-6 w-6 text-green-600 dark:text-green-400 mt-1 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative z-10" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 dark:text-white text-lg group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                      Click Analytics
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Track clicks and view detailed statistics
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Functionality */}
          <div className="animate-fade-in-up animation-delay-400">
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
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md transition-all duration-700 relative z-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground space-y-2">
          <p className="animate-fade-in font-medium">
            Built with React, Shadcn-UI, Node.js, Express, and MongoDB
          </p>
          <p className="animate-fade-in animation-delay-100">
            Demonstrating Hash Maps and Queue data structures
          </p>
        </div>
      </footer>
    </div>
  );
}
