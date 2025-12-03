import { useState, useRef } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Upload,
  Download,
  Plus,
  Trash2,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Layers,
  ClipboardPaste,
  QrCode,
} from "lucide-react";
import {
  bulkShortenUrls,
  exportUrlsToCsv,
  downloadCsv,
  parseCsvForImport,
  parseUrlsFromText,
  getDefaultExpiryDate,
  getMaxExpiryDate,
  type UrlData,
} from "@/services/api";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { QRCodeButton } from "./QRCodeDialog";

interface BulkUrlEntry {
  id: string;
  originalUrl: string;
  expiresAt: string;
  category: string;
}

interface BulkResult {
  successful: UrlData[];
  failed: Array<{ originalUrl: string; error: string }>;
}

interface BulkUrlShortenerProps {
  onUrlsCreated: () => void;
}

export default function BulkUrlShortener({
  onUrlsCreated,
}: BulkUrlShortenerProps) {
  const [entries, setEntries] = useState<BulkUrlEntry[]>([
    {
      id: crypto.randomUUID(),
      originalUrl: "",
      expiresAt: getDefaultExpiryDate(),
      category: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BulkResult | null>(null);
  const [pasteText, setPasteText] = useState("");
  const [showPasteArea, setShowPasteArea] = useState(false);
  const [globalCategory, setGlobalCategory] = useState("");
  const [globalExpiry, setGlobalExpiry] = useState(getDefaultExpiryDate());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        id: crypto.randomUUID(),
        originalUrl: "",
        expiresAt: getDefaultExpiryDate(),
        category: "",
      },
    ]);
  };

  const removeEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter((entry) => entry.id !== id));
    }
  };

  const updateEntry = (
    id: string,
    field: keyof BulkUrlEntry,
    value: string
  ) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validEntries = entries.filter((entry) => entry.originalUrl.trim());

    if (validEntries.length === 0) {
      toast.error("Please enter at least one URL");
      return;
    }

    // Validate all URLs
    for (const entry of validEntries) {
      try {
        new URL(entry.originalUrl);
      } catch {
        toast.error(`Invalid URL: ${entry.originalUrl}`, {
          description: "Make sure all URLs include http:// or https://",
        });
        return;
      }
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await bulkShortenUrls(
        validEntries.map((entry) => ({
          originalUrl: entry.originalUrl,
          expiresAt: entry.expiresAt || getDefaultExpiryDate(),
          category: entry.category || undefined,
        }))
      );

      if (response.success && response.data) {
        setResult(response.data);
        toast.success(
          `Created ${response.data.successful.length} shortened URLs`,
          {
            description:
              response.data.failed.length > 0
                ? `${response.data.failed.length} URLs failed`
                : "All URLs shortened successfully!",
          }
        );

        // Clear successful entries
        if (response.data.successful.length > 0) {
          setEntries([
            {
              id: crypto.randomUUID(),
              originalUrl: "",
              expiresAt: getDefaultExpiryDate(),
              category: "",
            },
          ]);
          setPasteText("");
          setShowPasteArea(false);
          onUrlsCreated();
        }
      } else {
        toast.error(response.error || "Failed to shorten URLs");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = parseCsvForImport(content);

      if (parsed.length === 0) {
        toast.error("No valid URLs found in the file");
        return;
      }

      setEntries(
        parsed.map((item) => ({
          id: crypto.randomUUID(),
          originalUrl: item.originalUrl,
          expiresAt: item.expiresAt || getDefaultExpiryDate(),
          category: item.category || "",
        }))
      );

      toast.success(`Imported ${parsed.length} URLs from file`);
    };

    reader.onerror = () => {
      toast.error("Failed to read file");
    };

    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePasteUrls = () => {
    if (!pasteText.trim()) {
      toast.error("Please paste some URLs");
      return;
    }

    const urls = parseUrlsFromText(pasteText);

    if (urls.length === 0) {
      toast.error("No valid URLs found in the text");
      return;
    }

    setEntries(
      urls.map((url) => ({
        id: crypto.randomUUID(),
        originalUrl: url,
        expiresAt: globalExpiry || getDefaultExpiryDate(),
        category: globalCategory || "",
      }))
    );

    toast.success(`Found ${urls.length} URLs`);
    setShowPasteArea(false);
    setPasteText("");
  };

  const handleExportResults = () => {
    if (!result || result.successful.length === 0) {
      toast.error("No successful URLs to export");
      return;
    }

    const csv = exportUrlsToCsv(result.successful);
    downloadCsv(
      csv,
      `shortened-urls-${new Date().toISOString().split("T")[0]}.csv`
    );
    toast.success("URLs exported successfully!");
  };

  const downloadTemplate = () => {
    const template =
      "URL,Expires At (YYYY-MM-DD),Category\nhttps://example.com/page1,,marketing\nhttps://example.com/page2,2024-12-31,campaign";
    downloadCsv(template, "bulk-url-template.csv");
    toast.success("Template downloaded!");
  };

  return (
    <Card className="w-full shadow-xl hover:shadow-2xl transition-all duration-500 border-2 dark:border-gray-700 overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl" />

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-3 dark:text-white text-2xl">
          <div className="relative">
            <Layers className="h-6 w-6 animate-float" />
          </div>
          Bulk URL Shortener
        </CardTitle>
        <CardDescription className="text-base">
          Create multiple shortened URLs at once. Import from CSV or add URLs
          manually.
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        {/* File Actions */}
        <div className="flex flex-wrap gap-3">
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button
            variant={showPasteArea ? "default" : "outline"}
            onClick={() => setShowPasteArea(!showPasteArea)}
            className="flex items-center gap-2"
          >
            <ClipboardPaste className="h-4 w-4" />
            Paste URLs
          </Button>
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Download Template
          </Button>
          {result && result.successful.length > 0 && (
            <Button
              variant="outline"
              onClick={handleExportResults}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Results
            </Button>
          )}
        </div>

        {/* Paste URLs Area */}
        {showPasteArea && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800 space-y-4 animate-fade-in">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <ClipboardPaste className="h-4 w-4" />
                Paste URLs (one per line or comma-separated)
              </Label>
              <Textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder={`Paste your URLs here, for example:

https://bit.ly/3QmVfXn
https://tinyurl.com/2p9b4v9y
https://rebrand.ly/demo123
https://short.io/abc123
https://is.gd/xyz789`}
                className="min-h-[150px] font-mono text-sm"
              />
            </div>

            {/* Global settings for pasted URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Expiry for all URLs (default: 6 months)
                </Label>
                <Input
                  type="date"
                  value={globalExpiry}
                  onChange={(e) => setGlobalExpiry(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  max={getMaxExpiryDate()}
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Category for all URLs (optional)
                </Label>
                <Input
                  type="text"
                  value={globalCategory}
                  onChange={(e) => setGlobalCategory(e.target.value)}
                  placeholder="e.g., marketing, campaign"
                  className="h-9"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handlePasteUrls}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Parse URLs
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasteArea(false);
                  setPasteText("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* URL Entry Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className="flex gap-2 items-start p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg animate-fade-in"
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="md:col-span-1">
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      URL {index + 1}
                    </Label>
                    <Input
                      type="url"
                      placeholder="https://example.com/long-url"
                      value={entry.originalUrl}
                      onChange={(e) =>
                        updateEntry(entry.id, "originalUrl", e.target.value)
                      }
                      disabled={loading}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      Expires At (Max: 6 months)
                    </Label>
                    <Input
                      type="date"
                      value={entry.expiresAt}
                      onChange={(e) =>
                        updateEntry(entry.id, "expiresAt", e.target.value)
                      }
                      disabled={loading}
                      className="h-9"
                      min={new Date().toISOString().split("T")[0]}
                      max={getMaxExpiryDate()}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      Category (Optional)
                    </Label>
                    <Input
                      type="text"
                      placeholder="e.g., marketing"
                      value={entry.category}
                      onChange={(e) =>
                        updateEntry(entry.id, "category", e.target.value)
                      }
                      disabled={loading}
                      className="h-9"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEntry(entry.id)}
                  disabled={entries.length === 1 || loading}
                  className="mt-6 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={addEntry}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add URL
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 md:flex-none md:min-w-[200px]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Layers className="h-4 w-4 mr-2" />
                  Shorten {
                    entries.filter((e) => e.originalUrl.trim()).length
                  }{" "}
                  URLs
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Results */}
        {result && (
          <div className="space-y-4 animate-fade-in">
            {result.successful.length > 0 && (
              <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <div className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    Successfully Created ({result.successful.length})
                  </div>
                  <div className="rounded-lg border border-green-200 dark:border-green-800 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-green-100 dark:bg-green-900/30">
                          <TableHead className="text-green-800 dark:text-green-200">
                            Original URL
                          </TableHead>
                          <TableHead className="text-green-800 dark:text-green-200">
                            Short Code
                          </TableHead>
                          <TableHead className="text-green-800 dark:text-green-200">
                            Category
                          </TableHead>
                          <TableHead className="text-green-800 dark:text-green-200">
                            QR
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.successful.map((url) => (
                          <TableRow key={url._id}>
                            <TableCell className="truncate max-w-xs">
                              {url.originalUrl}
                            </TableCell>
                            <TableCell>
                              <code className="bg-green-100 dark:bg-green-800 px-2 py-1 rounded">
                                {url.shortCode}
                              </code>
                            </TableCell>
                            <TableCell>
                              {url.category && (
                                <Badge variant="secondary">
                                  {url.category}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <QRCodeButton
                                shortCode={url.shortCode}
                                shortUrl={url.shortUrl}
                                variant="outline"
                                size="sm"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {result.failed.length > 0 && (
              <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  <div className="font-semibold text-red-800 dark:text-red-200 mb-2">
                    Failed ({result.failed.length})
                  </div>
                  <div className="space-y-1">
                    {result.failed.map((item, index) => (
                      <div
                        key={index}
                        className="text-sm text-red-700 dark:text-red-300"
                      >
                        <span className="font-medium">{item.originalUrl}</span>:{" "}
                        {item.error}
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
