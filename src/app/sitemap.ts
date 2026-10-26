import { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://messmeals.com";

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/messes`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/mess-manager`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/messes/ernakulam/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/messes/thiruvananthapuram/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/messes/kozhikode/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/messes/kasaragod/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/messes/thrissur/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
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
