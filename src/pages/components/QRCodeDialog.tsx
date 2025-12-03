import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Download, QrCode, Copy, Check } from "lucide-react";
import { generateQRCode, copyToClipboard } from "@/services/api";
import { toast } from "sonner";

interface QRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shortCode: string;
  shortUrl: string;
}

export default function QRCodeDialog({
  open,
  onOpenChange,
  shortCode,
  shortUrl,
}: QRCodeDialogProps) {
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open && shortCode) {
      fetchQRCode();
    }
  }, [open, shortCode]);

  const fetchQRCode = async () => {
    setLoading(true);
    setError(null);
    setQrCode(null);

    try {
      const response = await generateQRCode(shortCode);
      if (response.success && response.data) {
        setQrCode(response.data.qrCode);
      } else {
        setError(response.error || "Failed to generate QR code");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrCode) return;

    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `qr-${shortCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR code downloaded!");
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(shortUrl);
      setCopied(true);
      toast.success("Short URL copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md dark:bg-gray-900 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 dark:text-white">
            <QrCode className="h-5 w-5" />
            QR Code
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Scan this QR code to access your shortened URL
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 w-64">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              <p className="mt-4 text-muted-foreground">
                Generating QR code...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 w-64 text-center">
              <QrCode className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-red-500">{error}</p>
              <Button variant="outline" onClick={fetchQRCode} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : qrCode ? (
            <>
              <div className="bg-white p-4 rounded-xl shadow-lg">
                <img
                  src={qrCode}
                  alt={`QR code for ${shortUrl}`}
                  className="w-56 h-56"
                />
              </div>

              <div className="w-full space-y-2">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <code className="flex-1 text-sm truncate dark:text-gray-200">
                    {shortUrl}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopy}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleDownload} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download PNG
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Compact QR code button component for use in tables/lists
interface QRCodeButtonProps {
  shortCode: string;
  shortUrl: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}

export function QRCodeButton({
  shortCode,
  shortUrl,
  variant = "ghost",
  size = "sm",
}: QRCodeButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setDialogOpen(true)}
        title="Generate QR Code"
        className="hover:scale-110 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200"
      >
        <QrCode className="h-4 w-4" />
      </Button>
      <QRCodeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        shortCode={shortCode}
        shortUrl={shortUrl}
      />
    </>
  );
}
