/**
 * API Service for URL Shortener Frontend
 * Handles all communication with the backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface ShortenUrlResponse {
  success: boolean;
  data?: {
    originalUrl: string;
    shortCode: string;
    shortUrl: string;
    clicks: number;
    createdAt: string;
    expiresAt?: string;
    category?: string;
  };
  error?: string;
}

export interface UrlData {
  _id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  expiresAt?: string;
  category?: string;
  isExpired?: boolean;
}

export interface AnalyticsData {
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  totalClicks: number;
  createdAt: string;
  expiresAt?: string;
  recentClicks: Array<{
    timestamp: string;
    ipAddress: string;
  }>;
}

export interface BulkShortenRequest {
  urls: Array<{
    originalUrl: string;
    expiresAt?: string;
    category?: string;
  }>;
}

export interface BulkShortenResponse {
  success: boolean;
  data?: {
    successful: UrlData[];
    failed: Array<{
      originalUrl: string;
      error: string;
    }>;
  };
  error?: string;
}

export interface QRCodeResponse {
  success: boolean;
  data?: {
    qrCode: string; // Base64 encoded QR code image
    shortUrl: string;
  };
  error?: string;
}

/**
 * Default expiration is 6 months, which is also the maximum
 */
export const DEFAULT_EXPIRY_MONTHS = 6;
export const MAX_EXPIRY_MONTHS = 6;

/**
 * Get the default expiration date (6 months from now)
 */
export function getDefaultExpiryDate(): string {
  const date = new Date();
  date.setMonth(date.getMonth() + DEFAULT_EXPIRY_MONTHS);
  return date.toISOString().split("T")[0];
}

/**
 * Get the maximum expiration date (6 months from now)
 */
export function getMaxExpiryDate(): string {
  const date = new Date();
  date.setMonth(date.getMonth() + MAX_EXPIRY_MONTHS);
  return date.toISOString().split("T")[0];
}

/**
 * Parse plain text URLs (separated by newlines, commas, or spaces)
 */
export function parseUrlsFromText(text: string): string[] {
  // Split by newlines, commas, or multiple spaces
  const lines = text
    .split(/[\n\r,]+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const urls: string[] = [];

  for (const line of lines) {
    // Try to extract URLs from each line
    // This regex matches http/https URLs
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const matches = line.match(urlRegex);

    if (matches) {
      urls.push(...matches);
    } else if (line.startsWith("http://") || line.startsWith("https://")) {
      urls.push(line);
    }
  }

  // Remove duplicates
  return [...new Set(urls)];
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

/**
 * Shorten a URL with optional expiration and category
 */
export async function shortenUrl(
  originalUrl: string,
  expiresAt?: string,
  category?: string
): Promise<ShortenUrlResponse> {
  try {
    const data = await fetchWithErrorHandling<ShortenUrlResponse>(
      `${API_BASE_URL}/api/shorten`,
      {
        method: "POST",
        body: JSON.stringify({ originalUrl, expiresAt, category }),
      }
    );
    return data;
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to connect to server",
    };
  }
}

/**
 * Get all shortened URLs
 */
export async function getAllUrls(): Promise<UrlData[]> {
  try {
    const data = await fetchWithErrorHandling<{
      success: boolean;
      data: UrlData[];
    }>(`${API_BASE_URL}/api/urls`);
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return [];
  }
}

/**
 * Get analytics for a specific short URL
 */
export async function getAnalytics(
  shortCode: string
): Promise<AnalyticsData | null> {
  try {
    const data = await fetchWithErrorHandling<{
      success: boolean;
      data: AnalyticsData;
    }>(`${API_BASE_URL}/api/analytics/${shortCode}`);
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return null;
  }
}

/**
 * Delete a shortened URL
 */
export async function deleteUrl(shortCode: string): Promise<boolean> {
  try {
    const data = await fetchWithErrorHandling<{ success: boolean }>(
      `${API_BASE_URL}/api/urls/${shortCode}`,
      {
        method: "DELETE",
      }
    );
    return data.success;
  } catch (error) {
    console.error("Error deleting URL:", error);
    return false;
  }
}

/**
 * Copy text to clipboard
 */
export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

/**
 * Check backend health
 */
export async function checkHealth(): Promise<{
  status: string;
  timestamp: string;
}> {
  try {
    const data = await fetchWithErrorHandling<{
      status: string;
      timestamp: string;
    }>(`${API_BASE_URL}/health`);
    return data;
  } catch (error) {
    console.error("Health check failed:", error);
    return {
      status: "ERROR",
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Bulk shorten multiple URLs
 */
export async function bulkShortenUrls(
  urls: BulkShortenRequest["urls"]
): Promise<BulkShortenResponse> {
  try {
    const data = await fetchWithErrorHandling<BulkShortenResponse>(
      `${API_BASE_URL}/api/bulk-shorten`,
      {
        method: "POST",
        body: JSON.stringify({ urls }),
      }
    );
    return data;
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to connect to server",
    };
  }
}

/**
 * Generate QR code for a shortened URL
 */
export async function generateQRCode(
  shortCode: string
): Promise<QRCodeResponse> {
  try {
    const data = await fetchWithErrorHandling<QRCodeResponse>(
      `${API_BASE_URL}/api/qrcode/${shortCode}`
    );
    return data;
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate QR code",
    };
  }
}

/**
 * Update URL expiration
 */
export async function updateUrlExpiration(
  shortCode: string,
  expiresAt: string | null
): Promise<{ success: boolean; error?: string }> {
  try {
    const data = await fetchWithErrorHandling<{ success: boolean }>(
      `${API_BASE_URL}/api/urls/${shortCode}/expiration`,
      {
        method: "PATCH",
        body: JSON.stringify({ expiresAt }),
      }
    );
    return data;
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update expiration",
    };
  }
}

/**
 * Get URLs by category
 */
export async function getUrlsByCategory(category: string): Promise<UrlData[]> {
  try {
    const data = await fetchWithErrorHandling<{
      success: boolean;
      data: UrlData[];
    }>(`${API_BASE_URL}/api/urls/category/${encodeURIComponent(category)}`);
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching URLs by category:", error);
    return [];
  }
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<string[]> {
  try {
    const data = await fetchWithErrorHandling<{
      success: boolean;
      data: string[];
    }>(`${API_BASE_URL}/api/categories`);
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * Export URLs to CSV format
 */
export function exportUrlsToCsv(urls: UrlData[]): string {
  const headers = [
    "Original URL",
    "Short Code",
    "Short URL",
    "Clicks",
    "Created At",
    "Expires At",
    "Category",
  ];
  const rows = urls.map((url) => [
    url.originalUrl,
    url.shortCode,
    url.shortUrl,
    url.clicks.toString(),
    url.createdAt,
    url.expiresAt || "",
    url.category || "",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return csvContent;
}

/**
 * Download CSV file
 */
export function downloadCsv(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Parse CSV content for bulk import
 */
export function parseCsvForImport(csvContent: string): Array<{
  originalUrl: string;
  expiresAt?: string;
  category?: string;
}> {
  const lines = csvContent.split("\n").filter((line) => line.trim());
  const results: Array<{
    originalUrl: string;
    expiresAt?: string;
    category?: string;
  }> = [];

  // Skip header row if present
  const startIndex = lines[0]?.toLowerCase().includes("url") ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const values = lines[i]
      .split(",")
      .map((v) => v.trim().replace(/^"|"$/g, ""));
    if (values[0]) {
      results.push({
        originalUrl: values[0],
        expiresAt: values[1] || undefined,
        category: values[2] || undefined,
      });
    }
  }

  return results;
}
