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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Copy,
  ExternalLink,
  Trash2,
  BarChart3,
  Loader2,
  Link2,
  Check,
  Clock,
  Download,
  Filter,
} from "lucide-react";
import {
  getAllUrls,
  deleteUrl,
  copyToClipboard,
  exportUrlsToCsv,
  downloadCsv,
  type UrlData,
} from "@/services/api";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { QRCodeButton } from "./QRCodeDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UrlListProps {
  refreshTrigger: number;
  onViewAnalytics: (shortCode: string) => void;
}

const LOCAL_STORAGE_KEY = "shortenedUrls";

export default function UrlList({
  refreshTrigger,
  onViewAnalytics,
}: UrlListProps) {
  const [urls, setUrls] = useState<UrlData[]>(() => {
    const savedUrls = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedUrls ? JSON.parse(savedUrls) : [];
  });
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchUrls = async () => {
    if (urls.length === 0) {
      setLoading(true);
    }

    try {
      const data = await getAllUrls();
      // Mark expired URLs
      const processedData = data.map((url) => ({
        ...url,
        isExpired: url.expiresAt ? new Date(url.expiresAt) < new Date() : false,
      }));
      setUrls(processedData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(processedData));
    } catch (error) {
      toast.error("Failed to fetch URLs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [refreshTrigger]);

  // Get unique categories
  const categories = [
    ...new Set(urls.map((url) => url.category).filter(Boolean)),
  ];

  // Filter URLs
  const filteredUrls = urls.filter((url) => {
    const matchesCategory =
      categoryFilter === "all" || url.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !url.isExpired) ||
      (statusFilter === "expired" && url.isExpired);
    return matchesCategory && matchesStatus;
  });

  const handleExport = () => {
    if (filteredUrls.length === 0) {
      toast.error("No URLs to export");
      return;
    }
    const csv = exportUrlsToCsv(filteredUrls);
    downloadCsv(
      csv,
      `urls-export-${new Date().toISOString().split("T")[0]}.csv`
    );
    toast.success("URLs exported successfully!");
  };

  const handleCopy = async (shortUrl: string) => {
    try {
      await copyToClipboard(shortUrl);
      toast.success("Copied to clipboard!");
      setCopiedUrl(shortUrl);
      setTimeout(() => {
        setCopiedUrl(null);
      }, 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDelete = async () => {
    if (!urlToDelete) return;

    setDeleting(true);
    try {
      const success = await deleteUrl(urlToDelete);
      if (success) {
        toast.success("URL deleted successfully");
        const updatedUrls = urls.filter((url) => url.shortCode !== urlToDelete);
        setUrls(updatedUrls);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedUrls));
      } else {
        toast.error("Failed to delete URL");
      }
    } catch (error) {
      toast.error("An unexpected error occurred while deleting the URL.");
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setUrlToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const formatExpirationDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const isExpired = date < now;
    const daysLeft = Math.ceil(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      formatted: date.toLocaleDateString(),
      isExpired,
      daysLeft,
    };
  };

  if (loading) {
    return (
      <Card className="w-full mt-8 shadow-xl border-2 dark:border-gray-700">
        <CardHeader>
          <Skeleton className="h-7 w-56 shimmer" />
          <Skeleton className="h-4 w-80 mt-2 shimmer" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-16 w-full shimmer" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full mt-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 dark:border-gray-700 hover-lift overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl" />

        <CardHeader className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="dark:text-white text-2xl flex items-center gap-2">
                <Link2 className="h-6 w-6 animate-float" />
                Your Shortened URLs
              </CardTitle>
              <CardDescription className="text-base">
                Manage and track your shortened links
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Category Filter */}
              {categories.length > 0 && (
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[140px] h-9">
                    <Filter className="h-4 w-4 mr-1" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat!}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px] h-9">
                  <Clock className="h-4 w-4 mr-1" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>

              {/* Export Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="h-9"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          {filteredUrls.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground animate-fade-in">
              <div className="mb-6 relative inline-block">
                <svg
                  className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600 animate-float"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl animate-pulse-glow" />
              </div>
              <p className="text-xl font-semibold mb-2">
                {urls.length === 0 ? "No URLs yet" : "No matching URLs"}
              </p>
              <p className="text-base">
                {urls.length === 0
                  ? "Create your first shortened URL above!"
                  : "Try adjusting your filters"}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border-2 dark:border-gray-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <TableHead className="dark:text-gray-300 font-semibold">
                      Original URL
                    </TableHead>
                    <TableHead className="dark:text-gray-300 font-semibold">
                      Short Code
                    </TableHead>
                    <TableHead className="dark:text-gray-300 font-semibold">
                      Clicks
                    </TableHead>
                    <TableHead className="dark:text-gray-300 font-semibold">
                      Created
                    </TableHead>
                    <TableHead className="dark:text-gray-300 font-semibold">
                      Expires
                    </TableHead>
                    <TableHead className="text-right dark:text-gray-300 font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUrls.map((url, index) => {
                    const expiration = formatExpirationDate(url.expiresAt);
                    return (
                      <TableRow
                        key={url._id}
                        className={`stagger-item dark:border-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-300 group/row ${
                          url.isExpired ? "opacity-60" : ""
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell className="max-w-xs">
                          <div className="space-y-1">
                            <a
                              href={url.originalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2 group/link transition-all duration-200"
                            >
                              <span className="truncate font-medium">
                                {url.originalUrl}
                              </span>
                              <ExternalLink className="h-4 w-4 flex-shrink-0 opacity-0 group-hover/link:opacity-100 group-hover/link:scale-110 transition-all duration-200" />
                            </a>
                            {url.category && (
                              <Badge variant="outline" className="text-xs">
                                {url.category}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 px-3 py-1.5 rounded-md text-sm dark:text-gray-200 font-mono font-semibold">
                              {url.shortCode}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="p-1 h-auto"
                              onClick={() => handleCopy(url.shortUrl)}
                              title="Copy short URL"
                            >
                              {copiedUrl === url.shortUrl ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="animate-pulse-slow dark:bg-gray-700 dark:text-gray-200 font-semibold px-3 py-1"
                          >
                            {url.clicks}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground dark:text-gray-400">
                          {formatDate(url.createdAt)}
                        </TableCell>
                        <TableCell>
                          {expiration ? (
                            <div className="flex items-center gap-1">
                              <Clock
                                className={`h-3 w-3 ${
                                  expiration.isExpired
                                    ? "text-red-500"
                                    : "text-yellow-500"
                                }`}
                              />
                              <span
                                className={`text-sm ${
                                  expiration.isExpired
                                    ? "text-red-500"
                                    : expiration.daysLeft <= 7
                                    ? "text-yellow-600 dark:text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {expiration.isExpired
                                  ? "Expired"
                                  : `${expiration.daysLeft}d left`}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Never
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 opacity-60 group-hover/row:opacity-100 transition-opacity duration-200">
                            <QRCodeButton
                              shortCode={url.shortCode}
                              shortUrl={url.shortUrl}
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onViewAnalytics(url.shortCode)}
                              title="View analytics"
                              className="hover:scale-110 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-200"
                            >
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setUrlToDelete(url.shortCode);
                                setDeleteDialogOpen(true);
                              }}
                              title="Delete URL"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-110 transition-all duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="dark:bg-gray-900 dark:border-gray-700 animate-scale-in">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white text-xl">
              Delete URL?
            </AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400 text-base">
              This action cannot be undone. The shortened URL will no longer
              work.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition-all duration-200"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
