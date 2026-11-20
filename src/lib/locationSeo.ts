import type { Metadata } from "next";
import type { LocationPageData } from "../types/location";

const BASE_URL = "https://messmeals.com";

export function toAbsoluteUrl(path: string): string {
  if (path === "/") {
    return `${BASE_URL}/`;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL}${normalized.replace(/\/+$/, "")}`;
}

export function buildLocationMetadata(data: LocationPageData): Metadata {
  const canonicalUrl = toAbsoluteUrl(data.path);
  const ogTitle = data.ogTitle ?? data.metaTitle;
  const ogDescription = data.ogDescription ?? data.metaDescription;

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: data.indexable
      ? {
          index: true,
          follow: true,
        }
      : {
          index: false,
          follow: true,
        },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      type: "website",
      siteName: "MessMeals",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
    },
  };
}

export function buildLocationJsonLd(data: LocationPageData) {
  const pageUrl = toAbsoluteUrl(data.path);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: data.breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: crumb.href ? toAbsoluteUrl(crumb.href) : pageUrl,
    })),
  };

  const pageLd = {
    "@context": "https://schema.org",
    "@type": data.schemaType,
    name: data.metaTitle,
    description: data.metaDescription,
    url: pageUrl,
    inLanguage: "en",
    isPartOf: {
      "@type": "WebSite",
      name: "MessMeals",
      url: `${BASE_URL}/`,
    },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return { breadcrumbLd, pageLd, faqLd };
}
