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
import { Loader2, Link as LinkIcon, Copy, Check } from "lucide-react";
import { shortenUrl, copyToClipboard } from "@/services/api";
import { toast } from "sonner";

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

    const response = await shortenUrl(url);

    setLoading(false);

    if (response.success && response.data) {
      setResult({
        shortUrl: response.data.shortUrl,
        originalUrl: response.data.originalUrl,
      });
      setUrl("");
      toast.success("URL shortened successfully!");
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
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Failed to copy");
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          Shorten URL
        </CardTitle>
        <CardDescription>
          Enter a long URL to get a short, shareable link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://example.com/very/long/url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Shortening...
                </>
              ) : (
                "Shorten"
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="space-y-2">
                <div className="font-medium text-green-900">Success!</div>
                <div className="text-sm text-green-800">
                  <div className="mb-1">Original: {result.originalUrl}</div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Short URL:</span>
                    <code className="bg-white px-2 py-1 rounded text-green-900">
                      {result.shortUrl}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopy}
                      className="h-7"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
