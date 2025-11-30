import React from "react";

type FooterProps = {
  brand?: string;
  year?: number;
  origin?: string; // Allows passing server-side origin for SSR
  logoPath?: string; // path to logo in public dir (e.g., /FastLinksLogo.png)
};

export default function Footer({
  brand = "FastLinks",
  year = typeof Date !== "undefined" ? new Date().getFullYear() : 2025,
  origin,
  logoPath = "/FastLinksLogo.png",
}: FooterProps) {
  const siteOrigin =
    origin ?? (typeof window !== "undefined" ? window.location.origin : "");

  const logoUrl = siteOrigin ? `${siteOrigin}${logoPath}` : logoPath;

  const organizationLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand,
    url: siteOrigin || undefined,
    logo: logoUrl,
  };

  // add sameAs only if you have social links
  const sameAs: string[] = [];
  if (sameAs.length > 0) organizationLd.sameAs = sameAs;

  const siteLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: siteOrigin || undefined,
    name: brand,
    description: `${brand} is a free and fast URL shortener that lets you instantly create short links with a clean and modern interface. No login required — simply paste, shorten, and share your links anywhere.`,
  };

  return (
    <footer
      role="contentinfo"
      aria-label={`${brand} site footer`}
      className="border-t mt-12 py-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md transition-all duration-700 relative z-10"
    >
      <script
        type="application/ld+json"
        // react escapes string content, use dangerouslySetInnerHTML to inject raw JSON
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteLd) }}
      />

      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground space-y-2">
        <p className="font-medium">
          <strong>{brand}</strong> is a free and fast URL shortener that
          lets you instantly create short links with a clean and modern
          interface. No login required — simply paste, shorten, and share
          your links anywhere.
        </p>

        <p>
          Perfect for students, developers, creators, and anyone who needs a
          simple and reliable link shortener. Built with modern web
          technologies for speed and efficiency.
        </p>

        <div className="flex justify-center gap-3 items-center text-muted-foreground mt-2">
          <nav aria-label="Footer Navigation" className="flex gap-3 flex-wrap justify-center">
            <a href="/" className="hover:underline">
              Home
            </a>
            <a href="/privacy" className="hover:underline">
              Privacy
            </a>
            <a href="/terms" className="hover:underline">
              Terms
            </a>
            <a href="/docs" className="hover:underline">
              Docs
            </a>
          </nav>
        </div>

        <p className="mt-2">{brand} URL Shortener © {year}</p>
      </div>
    </footer>
  );
}
