import { useState } from "react";
import UrlShortener from "./components/UrlShortener";
import UrlList from "./components/UrlList";
import Analytics from "./components/Analytics";
import Hero from "./components/Hero";
import Features from "./components/Features";
import { ThemeToggle } from "./components/ThemeToggle";
import {
  FloatingParticles,
  AnimatedLinkChain,
  LightModeDecoration,
  DarkModeDecoration,
} from "./components/AnimatedSVGs";
import Footer from "./components/Footer";

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
                FastLinks
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
          <Hero />
          <Features />
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
      <Footer />
    </div>
  );
}
