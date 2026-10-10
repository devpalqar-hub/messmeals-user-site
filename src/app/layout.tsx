import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";
import Providers from "./providers";
import "./globals.css";

// Self-hosted via next/font/google — replaces the render-blocking
// fonts.googleapis.com <link> tags from the old index.html. Same family/
// weights, zero visual change.
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// metadataBase lets every page's relative OG/canonical URLs resolve to an
// absolute URL automatically — replaces the old SEO.tsx component's
// `window.location.origin` computation.
export const metadata: Metadata = {
  metadataBase: new URL("https://messmeals.com"),
  title: "MessMeals – Find the Best Mess & Homely Food Near You",
  description:
    "Discover the best verified messes and homely food near you. Explore daily and monthly meal plans, reviews, and menus on MessMeals.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "MessMeals – Find the Best Mess & Homely Food Near You",
    description:
      "Discover the best verified messes and homely food near you. Explore daily and monthly meal plans, reviews, and menus on MessMeals.",
    images: ["/seo/og-home.png"],
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={beVietnamPro.className}>
        <Providers>{children}</Providers>
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <Script id="ms-clarity" strategy="afterInteractive">
            {`(function (c, l, a, r, i, t, y) {
              c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
              t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
              y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");`}
          </Script>
        )}
        <Script
          id="json-ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "MessMeals",
              "url": "https://messmeals.com"
            })
          }}
        />
        <Script
          id="json-ld-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "MessMeals",
              "url": "https://messmeals.com",
              "logo": "https://messmeals.com/favicon.png"
            })
          }}
        />
      </body>
    </html>
  );
}
