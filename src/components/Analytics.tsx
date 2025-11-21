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
import {
  Loader2,
  ArrowLeft,
  ExternalLink,
  Clock,
  MousePointerClick,
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
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="w-full">
        <CardContent className="py-12">
          <div className="text-center">
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
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MousePointerClick className="h-5 w-5" />
            URL Analytics
          </CardTitle>
          <CardDescription>
            Detailed statistics for your shortened URL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* URL Info */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Original URL
                </p>
                <a
                  href={data.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  {data.originalUrl}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Short URL
                </p>
                <code className="bg-muted px-2 py-1 rounded text-sm">
                  {data.shortUrl}
                </code>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Created
                </p>
                <p className="text-sm">{formatDate(data.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <MousePointerClick className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-3xl font-bold">{data.totalClicks}</div>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-3xl font-bold">
                    {data.recentClicks.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Recent Clicks</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Active
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">Status</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Clicks */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Recent Click History</h3>
            {data.recentClicks.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No clicks yet
              </p>
            ) : (
              <div className="space-y-2">
                {data.recentClicks.map((click, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <div>
                        <p className="text-sm font-medium">
                          {formatDate(click.timestamp)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          IP: {click.ipAddress}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
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
