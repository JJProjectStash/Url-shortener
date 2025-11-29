import { Card, CardContent } from "@/components/ui/card";
import { Link2, Database, Zap } from "lucide-react";

const Features = () => (
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
);

export default Features;
