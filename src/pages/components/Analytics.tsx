import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Loader2,
  ArrowLeft,
  ExternalLink,
  Clock,
  MousePointerClick,
  TrendingUp,
} from "lucide-react";
import { getAnalytics, type AnalyticsData } from "@/services/api";

interface AnalyticsProps {
  shortCode: string;
  onBack: () => void;
}

export default function Analytics({ shortCode, onBack }: AnalyticsProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      const analyticsData = await getAnalytics(shortCode);
      setData(analyticsData);
      setLoading(false);
    };

    fetchAnalytics();
  }, [shortCode]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <Card className="w-full shadow-lg">
        <CardContent className="py-12 space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="w-full shadow-lg">
        <CardContent className="py-12">
          <div className="text-center animate-fade-in">
            <p className="text-muted-foreground mb-4">
              Failed to load analytics
            </p>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to List
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="hover:scale-105 transition-transform duration-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-white">
            <div className="relative">
              <MousePointerClick className="h-5 w-5 animate-pulse" />
              <div className="absolute inset-0 bg-blue-500/20 blur-lg animate-pulse" />
            </div>
            URL Analytics
          </CardTitle>
          <CardDescription>
            Detailed statistics for your shortened URL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* URL Info */}
          <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Original URL
                </p>
                <a
                  href={data.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 group"
                >
                  <span className="break-all">{data.originalUrl}</span>
                  <ExternalLink className="h-3 w-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2 flex-wrap">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Short URL
                </p>
                <code className="bg-white dark:bg-gray-900 px-2 py-1 rounded text-sm dark:text-gray-200">
                  {data.shortUrl}
                </code>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Created
                </p>
                <p className="text-sm dark:text-gray-300">
                  {formatDate(data.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-500/50 dark:hover:border-blue-400/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="relative inline-block mb-2">
                    <MousePointerClick className="h-8 w-8 mx-auto text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-blue-600/20 dark:bg-blue-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="text-3xl font-bold dark:text-white animate-count-up">
                    {data.totalClicks}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-green-500/50 dark:hover:border-green-400/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="relative inline-block mb-2">
                    <Clock className="h-8 w-8 mx-auto text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-green-600/20 dark:bg-green-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="text-3xl font-bold dark:text-white">
                    {data.recentClicks.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Recent Clicks</p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-purple-500/50 dark:hover:border-purple-400/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="relative inline-block mb-2">
                    <TrendingUp className="h-8 w-8 mx-auto text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-purple-600/20 dark:bg-purple-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-lg px-4 py-2 dark:bg-gray-700 dark:text-gray-200"
                  >
                    Active
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">Status</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Clicks */}
          <div>
            <h3 className="text-lg font-semibold mb-3 dark:text-white">
              Recent Click History
            </h3>
            {data.recentClicks.length === 0 ? (
              <p className="text-muted-foreground text-center py-8 animate-fade-in">
                No clicks yet
              </p>
            ) : (
              <div className="space-y-2">
                {data.recentClicks.map((click, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg hover:bg-muted/50 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-[1.02] animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <div>
                        <p className="text-sm font-medium dark:text-gray-200">
                          {formatDate(click.timestamp)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          IP: {click.ipAddress}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="dark:border-gray-600 dark:text-gray-300"
                    >
                      Click #{data.recentClicks.length - index}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
