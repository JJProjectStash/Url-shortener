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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, ExternalLink, Trash2, BarChart3, Loader2 } from "lucide-react";
import {
  getAllUrls,
  deleteUrl,
  copyToClipboard,
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

interface UrlListProps {
  refreshTrigger: number;
  onViewAnalytics: (shortCode: string) => void;
}

export default function UrlList({
  refreshTrigger,
  onViewAnalytics,
}: UrlListProps) {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState<string | null>(null);

  const fetchUrls = async () => {
    setLoading(true);
    const data = await getAllUrls();
    setUrls(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUrls();
  }, [refreshTrigger]);

  const handleCopy = async (shortUrl: string) => {
    try {
      await copyToClipboard(shortUrl);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDelete = async () => {
    if (!urlToDelete) return;

    const success = await deleteUrl(urlToDelete);
    if (success) {
      toast.success("URL deleted successfully");
      fetchUrls();
    } else {
      toast.error("Failed to delete URL");
    }
    setDeleteDialogOpen(false);
    setUrlToDelete(null);
  };

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

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Shortened URLs</CardTitle>
          <CardDescription>
            Manage and track your shortened links
          </CardDescription>
        </CardHeader>
        <CardContent>
          {urls.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No URLs yet. Create your first shortened URL above!
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Original URL</TableHead>
                    <TableHead>Short Code</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {urls.map((url) => (
                    <TableRow key={url._id}>
                      <TableCell className="max-w-xs truncate">
                        <a
                          href={url.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {url.originalUrl}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded text-sm">
                          {url.shortCode}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{url.clicks}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(url.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopy(url.shortUrl)}
                            title="Copy short URL"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onViewAnalytics(url.shortCode)}
                            title="View analytics"
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
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete URL?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The shortened URL will no longer
              work.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
