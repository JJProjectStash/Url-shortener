import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Link as LinkIcon, Sparkles } from "lucide-react";
import { shortenUrl, copyToClipboard } from "@/services/api";
import { toast } from "sonner";
import {
  AnimatedUrlProcess,
  AnimatedCheckmark,
  AnimatedCopyIcon,
  AnimatedSpinner,
} from "@/components/AnimatedSVGs";

interface UrlShortenerProps {
  onUrlCreated: () => void;
}

export default function UrlShortener({ onUrlCreated }: UrlShortenerProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    shortUrl: string;
    originalUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [showProcess, setShowProcess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL (include http:// or https://)");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setShowProcess(true);

    const response = await shortenUrl(url);

    setLoading(false);
    setShowProcess(false);

    if (response.success && response.data) {
      setResult({
        shortUrl: response.data.shortUrl,
        originalUrl: response.data.originalUrl,
      });
      setUrl("");
      toast.success("URL shortened successfully!", {
        description: "Your shortened link is ready to use",
      });
      onUrlCreated();
    } else {
      setError(response.error || "Failed to shorten URL");
      toast.error(response.error || "Failed to shorten URL");
    }
  };

  const handleCopy = async () => {
    if (result) {
      try {
        await copyToClipboard(result.shortUrl);
        setCopied(true);
        toast.success("Copied to clipboard!", {
          description: "Share your shortened link anywhere",
        });
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Failed to copy");
      }
    }
  };

  return (
    <Card className="w-full shadow-xl hover:shadow-2xl transition-all duration-500 border-2 dark:border-gray-700 hover-lift overflow-hidden relative group">
      {/* Animated gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl" />

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-3 dark:text-white text-2xl">
          <div className="relative">
            <LinkIcon className="h-6 w-6 animate-float" />
            <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-yellow-500 animate-pulse" />
          </div>
          Shorten URL
        </CardTitle>
        <CardDescription className="text-base">
          Enter a long URL to get a short, shareable link
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative group/input">
              <Input
                type="url"
                placeholder="https://example.com/very/long/url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 pr-10 text-base h-12"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover/input:opacity-100 transition-opacity duration-300">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="relative overflow-hidden group/btn transition-all duration-300 hover:scale-105 h-12 px-6 text-base font-semibold"
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Shortening...
                  </>
                ) : (
                  "Shorten"
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            </Button>
          </div>

          {/* Animated Process Visualization */}
          {showProcess && (
            <div className="flex justify-center py-4 animate-fade-in">
              <AnimatedSpinner className="w-16 h-16" />
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="animate-shake border-2">
              <AlertDescription className="font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 animate-scale-in overflow-hidden relative">
              {/* Success animation */}
              <div className="absolute top-2 right-2">
                <AnimatedCheckmark className="w-12 h-12" />
              </div>

              <AlertDescription className="space-y-3 pr-14">
                <div className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2 text-lg">
                  Success!
                </div>
                <div className="text-sm text-green-800 dark:text-green-200 space-y-2">
                  <div className="truncate">
                    <span className="font-medium">Original:</span>{" "}
                    {result.originalUrl}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap bg-white dark:bg-gray-800 p-3 rounded-lg border border-green-200 dark:border-green-700">
                    <span className="font-semibold text-green-900 dark:text-green-100">
                      Short URL:
                    </span>
                    <code className="flex-1 min-w-0 truncate text-green-900 dark:text-green-100 font-mono">
                      {result.shortUrl}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopy}
                      className="h-8 transition-all duration-300 hover:scale-105 border-green-300 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
                    >
                      <AnimatedCopyIcon
                        className="h-4 w-4 mr-1"
                        copied={copied}
                      />
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Process visualization when not loading */}
          {!loading && !result && !error && (
            <div className="flex justify-center py-2 opacity-50 hover:opacity-100 transition-opacity duration-300">
              <AnimatedUrlProcess className="w-full max-w-md h-20" />
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
