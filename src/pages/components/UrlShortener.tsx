import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Link as LinkIcon,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  Tag,
  QrCode,
  Download,
} from "lucide-react";
import {
  shortenUrl,
  copyToClipboard,
  generateQRCode,
  getDefaultExpiryDate,
  getMaxExpiryDate,
} from "@/services/api";
import { toast } from "sonner";
import {
  AnimatedUrlProcess,
  AnimatedCheckmark,
  AnimatedCopyIcon,
  AnimatedSpinner,
} from "./AnimatedSVGs";

interface UrlShortenerProps {
  onUrlCreated: () => void;
}

export default function UrlShortener({ onUrlCreated }: UrlShortenerProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    shortUrl: string;
    shortCode: string;
    originalUrl: string;
    qrCode?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expiresAt, setExpiresAt] = useState(getDefaultExpiryDate());
  const [category, setCategory] = useState("");
  const [loadingQR, setLoadingQR] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const fetchQRCode = async (shortCode: string) => {
    setLoadingQR(true);
    try {
      const response = await generateQRCode(shortCode);
      if (response.success && response.data) {
        setResult((prev) =>
          prev ? { ...prev, qrCode: response.data!.qrCode } : null
        );
      }
    } catch (err) {
      console.error("Failed to fetch QR code:", err);
    } finally {
      setLoadingQR(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    try {
      new URL(url);
    } catch {
      toast.error("Please enter a valid URL", {
        description: "Make sure to include http:// or https://",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Always use the expiration date (default is 6 months)
      const response = await shortenUrl(
        url,
        expiresAt || getDefaultExpiryDate(),
        category || undefined
      );

      if (response.success && response.data) {
        setResult({
          shortUrl: response.data.shortUrl,
          shortCode: response.data.shortCode,
          originalUrl: response.data.originalUrl,
        });
        setUrl("");
        setExpiresAt(getDefaultExpiryDate());
        setCategory("");
        toast.success("URL shortened successfully!", {
          description: "Your shortened link is ready to use",
        });
        onUrlCreated();

        // Automatically fetch QR code
        fetchQRCode(response.data.shortCode);
      } else {
        toast.error(response.error || "Failed to shorten URL");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
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
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                type="url"
                placeholder="https://example.com/very/long/url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 pr-10 text-base h-12"
              />
              {url && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setUrl("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading}
              className={`relative overflow-hidden group/btn transition-all duration-300 hover:scale-105 h-12 px-6 text-base font-semibold ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Shortening...
                  </>
                ) : (
                  "Shorten"
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            </Button>
          </div>

          {/* Advanced Options Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {showAdvanced ? (
              <ChevronUp className="h-4 w-4 mr-1" />
            ) : (
              <ChevronDown className="h-4 w-4 mr-1" />
            )}
            {showAdvanced ? "Hide" : "Show"} Advanced Options
          </Button>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg animate-fade-in">
              <div className="space-y-2">
                <Label
                  htmlFor="expiresAt"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <Calendar className="h-4 w-4" />
                  Link Expiration
                </Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  disabled={loading}
                  min={new Date().toISOString().split("T")[0]}
                  max={getMaxExpiryDate()}
                  className="h-10"
                />
                <p className="text-xs text-muted-foreground">
                  Default: 6 months (max). Link expires after this date.
                </p>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <Tag className="h-4 w-4" />
                  Category
                </Label>
                <Input
                  id="category"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={loading}
                  placeholder="e.g., marketing, social"
                  className="h-10"
                />
                <p className="text-xs text-muted-foreground">
                  Group links for easy filtering
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex justify-center py-4 animate-fade-in">
              <AnimatedSpinner className="w-16 h-16" />
            </div>
          )}

          {result && (
            <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 animate-scale-in overflow-hidden relative">
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

                  {/* Short URL and QR Code side by side */}
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Short URL Section */}
                    <div className="flex-1 bg-white dark:bg-gray-800 p-3 rounded-lg border border-green-200 dark:border-green-700">
                      <span className="font-semibold text-green-900 dark:text-green-100 block mb-2">
                        Short URL:
                      </span>
                      <div className="flex items-center gap-2">
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

                    {/* QR Code Section */}
                    <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-3 rounded-lg border border-green-200 dark:border-green-700">
                      <span className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center gap-1">
                        <QrCode className="h-4 w-4" />
                        QR Code:
                      </span>
                      {loadingQR ? (
                        <div className="w-24 h-24 flex items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                        </div>
                      ) : result.qrCode ? (
                        <div className="flex flex-col items-center gap-2">
                          <img
                            src={result.qrCode}
                            alt="QR Code"
                            className="w-24 h-24 rounded"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (result.qrCode) {
                                const link = document.createElement("a");
                                link.href = result.qrCode;
                                link.download = `qr-${result.shortCode}.png`;
                                link.click();
                                toast.success("QR code downloaded!");
                              }
                            }}
                            className="h-7 text-xs border-green-300 dark:border-green-700"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 flex items-center justify-center text-muted-foreground text-xs">
                          Loading...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {!loading && !result && (
            <div className="flex justify-center py-2 opacity-50 hover:opacity-100 transition-opacity duration-300">
              <AnimatedUrlProcess className="w-full max-w-md h-20" />
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
