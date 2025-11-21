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
}

export interface AnalyticsData {
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  totalClicks: number;
  createdAt: string;
  recentClicks: Array<{
    timestamp: string;
    ipAddress: string;
  }>;
}

/**
 * Shorten a URL
 */
export async function shortenUrl(
  originalUrl: string
): Promise<ShortenUrlResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ originalUrl }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error shortening URL:", error);
    return {
      success: false,
      error: "Failed to connect to server",
    };
  }
}

/**
 * Get all shortened URLs
 */
export async function getAllUrls(): Promise<UrlData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/urls`);
    const data = await response.json();
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
    const response = await fetch(`${API_BASE_URL}/api/analytics/${shortCode}`);
    const data = await response.json();
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
    const response = await fetch(`${API_BASE_URL}/api/urls/${shortCode}`, {
      method: "DELETE",
    });
    const data = await response.json();
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
