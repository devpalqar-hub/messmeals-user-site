import { MetadataRoute } from "next";
import { getIndexableLocationPages } from "../data/locations";
import { toAbsoluteUrl } from "../lib/locationSeo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://messmeals.com";
  const now = new Date();

  const locationRoutes: MetadataRoute.Sitemap = getIndexableLocationPages().map((loc) => ({
    url: toAbsoluteUrl(loc.path),
    lastModified: now,
    changeFrequency: "weekly",
    priority: loc.kind === "hub" ? 0.85 : 0.8,
  }));

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/mess`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/mess-manager`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...locationRoutes,
  ];

  // Fetch all messes for the dynamic sitemap
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
    const response = await fetch(`${apiUrl}/open/seo/messes`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (response.ok) {
      const result = await response.json();
      if (result && Array.isArray(result.data)) {
        const messRoutes = result.data.map((mess: any) => ({
          url: `${baseUrl}/mess/${mess.slug}`,
          lastModified: mess.updatedAt ? new Date(mess.updatedAt) : new Date(),
          changeFrequency: "daily" as const,
          priority: 0.8,
        }));

        return [...routes, ...messRoutes];
      }
    }
  } catch (err) {
    console.error("Failed to fetch messes for dynamic sitemap", err);
  }

  return routes;
}
