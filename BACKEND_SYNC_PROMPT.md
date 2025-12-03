# Backend Implementation Prompt - URL Shortener Updates

## Overview

This document outlines the backend changes required to sync with the frontend updates for the URL shortener's new features.

---

## Key Frontend Changes That Require Backend Updates

### 1. Default and Maximum Expiration (6 Months)

**Frontend Change:** All URLs now have a default expiration of 6 months, which is also the maximum allowed expiration time.

**Backend Implementation Required:**

```javascript
// In your URL model or controller

const MAX_EXPIRY_MONTHS = 6;

// Calculate max expiry date
function getMaxExpiryDate() {
  const date = new Date();
  date.setMonth(date.getMonth() + MAX_EXPIRY_MONTHS);
  return date;
}

// In POST /api/shorten endpoint
router.post("/shorten", async (req, res) => {
  try {
    const { originalUrl, expiresAt, category } = req.body;

    // Validate URL
    if (!originalUrl || !isValidUrl(originalUrl)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid URL",
      });
    }

    // Calculate expiration date
    let expDate;
    const maxExpiry = getMaxExpiryDate();

    if (expiresAt) {
      expDate = new Date(expiresAt);
      // Validate: not in the past
      if (expDate <= new Date()) {
        return res.status(400).json({
          success: false,
          error: "Expiration date must be in the future",
        });
      }
      // Enforce maximum of 6 months
      if (expDate > maxExpiry) {
        expDate = maxExpiry;
      }
    } else {
      // Default to 6 months if not provided
      expDate = maxExpiry;
    }

    const shortCode = generateShortCode();

    const url = new Url({
      originalUrl,
      shortCode,
      expiresAt: expDate,
      category: category ? category.toLowerCase().trim() : null,
    });

    await url.save();

    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;

    res.status(201).json({
      success: true,
      data: {
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl,
        clicks: url.clicks,
        createdAt: url.createdAt,
        expiresAt: url.expiresAt,
        category: url.category,
      },
    });
  } catch (error) {
    console.error("Shorten URL error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});
```

---

### 2. Bulk Shorten Endpoint Update

**Frontend Change:** Bulk URL creation now:

- Supports plain text paste (URLs separated by newlines/commas)
- Applies default 6-month expiration if not specified
- Applies global category to all URLs if specified

**Backend Implementation Required:**

```javascript
// POST /api/bulk-shorten
router.post("/bulk-shorten", async (req, res) => {
  try {
    const { urls } = req.body;

    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Please provide an array of URLs",
      });
    }

    // Limit bulk operations (e.g., max 100 URLs)
    if (urls.length > 100) {
      return res.status(400).json({
        success: false,
        error: "Maximum 100 URLs allowed per bulk operation",
      });
    }

    const maxExpiry = getMaxExpiryDate();
    const successful = [];
    const failed = [];

    for (const item of urls) {
      try {
        const { originalUrl, expiresAt, category } = item;

        // Validate URL
        if (!originalUrl || !isValidUrl(originalUrl)) {
          failed.push({
            originalUrl: originalUrl || "undefined",
            error: "Invalid URL format",
          });
          continue;
        }

        // Calculate expiration - default to 6 months, max 6 months
        let expDate = maxExpiry;
        if (expiresAt) {
          const providedDate = new Date(expiresAt);
          if (!isNaN(providedDate.getTime()) && providedDate > new Date()) {
            expDate = providedDate > maxExpiry ? maxExpiry : providedDate;
          }
        }

        const shortCode = generateShortCode();

        const url = new Url({
          originalUrl,
          shortCode,
          expiresAt: expDate,
          category: category ? category.toLowerCase().trim() : null,
        });

        await url.save();

        successful.push({
          _id: url._id,
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          shortUrl: `${process.env.BASE_URL}/${shortCode}`,
          clicks: url.clicks,
          createdAt: url.createdAt,
          expiresAt: url.expiresAt,
          category: url.category,
        });
      } catch (itemError) {
        failed.push({
          originalUrl: item.originalUrl || "undefined",
          error: itemError.message || "Failed to create short URL",
        });
      }
    }

    res.status(201).json({
      success: true,
      data: {
        successful,
        failed,
      },
    });
  } catch (error) {
    console.error("Bulk shorten error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});
```

---

### 3. QR Code Generation Endpoint

**Frontend Change:** QR code is now automatically displayed when a URL is shortened.

**Backend Implementation Required:**

Install the `qrcode` package:

```bash
npm install qrcode
```

```javascript
const QRCode = require("qrcode");

// GET /api/qrcode/:shortCode
router.get("/qrcode/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({
        success: false,
        error: "URL not found",
      });
    }

    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;

    // Generate QR code as base64 data URL
    const qrCodeDataUrl = await QRCode.toDataURL(shortUrl, {
      width: 256,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    res.json({
      success: true,
      data: {
        qrCode: qrCodeDataUrl,
        shortUrl,
      },
    });
  } catch (error) {
    console.error("QR code generation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate QR code",
    });
  }
});
```

---

## Summary of Required Endpoints

| Method | Endpoint                 | Changes                                          |
| ------ | ------------------------ | ------------------------------------------------ |
| POST   | `/api/shorten`           | Add default 6-month expiry, enforce max 6 months |
| POST   | `/api/bulk-shorten`      | Add default 6-month expiry, enforce max 6 months |
| GET    | `/api/qrcode/:shortCode` | No changes needed (already implemented)          |

---

## URL Model Update

Ensure your URL model includes:

```javascript
const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Date,
    required: true, // Now required - defaults to 6 months
  },
  category: {
    type: String,
    default: null,
    trim: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add index for faster expiration queries
urlSchema.index({ expiresAt: 1 });
urlSchema.index({ category: 1 });
```

---

## Environment Variables

Ensure these are set:

```env
BASE_URL=http://localhost:5000
# For production: BASE_URL=https://yourdomain.com
```

---

## Dependencies to Install

```bash
npm install qrcode
```

---

## Testing Checklist

- [ ] Single URL creation defaults to 6-month expiry
- [ ] Expiration dates beyond 6 months are capped to 6 months
- [ ] Bulk URL creation applies 6-month expiry by default
- [ ] QR code endpoint returns valid base64 image data
- [ ] Expired URLs return 410 Gone status on redirect
- [ ] Category filtering works correctly
