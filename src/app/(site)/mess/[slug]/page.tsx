import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getMessBySlug } from "../../../../services/messApi";
import type { MessDetails } from "../../../../types/mess";
import ViewMessDetailsClient from "./ViewMessDetailsClient";

type Params = { params: Promise<{ slug: string }> };

// Server-side fetch used ONLY to populate <title>/OG tags for crawlers and
// social-share previews (see migration plan §5/§8) — the page body below
// still does its own independent client-side fetch, unchanged from before.
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;

  try {
    const mess: MessDetails = await getMessBySlug(slug);
    if (!mess) throw new Error("Mess not found");

    const title = `${mess.messName} – Menu & Meal Plans | MessMeals`;
    const description = `Order homely food from ${mess.messName} in ${mess.address?.location || "your area"
      }. ${mess.description?.length > 100
        ? mess.description.substring(0, 100) + "..."
        : mess.description || "Explore meal plans and pricing on MessMeals."
      }`;

    return {
      title,
      description,
      alternates: { canonical: `/mess/${mess.slug}` },
      openGraph: {
        title,
        description,
        images: mess.coverImage ? [mess.coverImage] : undefined,
        url: `/mess/${mess.slug}`,
      },
    };
  } catch {
    // Matches the old client component's `!mess` fallback (SEO title="Mess Not
    // Found | MessMeals" noindex) — the client body renders its own "Mess not
    // found" state independently.
    return {
      title: "Mess Not Found | MessMeals",
      robots: { index: false },
    };
  }
}

export default async function MessDetailsPage({ params }: Params) {
  const { slug } = await params;
  let initialMess: MessDetails | null = null;

  try {
    initialMess = await getMessBySlug(slug);
  } catch {
    initialMess = null;
  }

  if (!initialMess) {
    notFound();
  }

  let jsonLdScripts = null;

  if (initialMess) {
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    if (initialMess.plans && initialMess.plans.length > 0) {
      initialMess.plans.forEach(plan => {
        const price = Number(plan.price);
        if (!isNaN(price)) {
          if (price < minPrice) minPrice = price;
          if (price > maxPrice) maxPrice = price;
        }
      });
    }
    
    const priceRange = minPrice !== Infinity ? (minPrice === maxPrice ? `₹${minPrice}` : `₹${minPrice} - ₹${maxPrice}`) : "Contact for price";

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://messmeals.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Messes",
          "item": "https://messmeals.com/view-all-listings"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": initialMess.messName,
          "item": `https://messmeals.com/mess/${initialMess.slug}`
        }
      ]
    };

    const foodEstablishmentSchema = {
      "@context": "https://schema.org",
      "@type": "FoodEstablishment",
      "name": initialMess.messName,
      "image": initialMess.coverImage ? [initialMess.coverImage] : undefined,
      "description": initialMess.description || undefined,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": initialMess.address?.address || undefined,
        "addressLocality": initialMess.address?.location || undefined,
        "postalCode": initialMess.address?.zipcode || undefined,
        "addressCountry": "IN"
      },
      "geo": initialMess.address?.latitude && initialMess.address?.longitude ? {
        "@type": "GeoCoordinates",
        "latitude": initialMess.address.latitude,
        "longitude": initialMess.address.longitude
      } : undefined,
      "telephone": initialMess.phone || undefined,
      "servesCuisine": initialMess.foodTypes && initialMess.foodTypes.length > 0 ? initialMess.foodTypes.join(", ") : undefined,
      "priceRange": priceRange,
      "hasOfferCatalog": initialMess.plans && initialMess.plans.length > 0 ? {
        "@type": "OfferCatalog",
        "name": "Meal Plans",
        "itemListElement": initialMess.plans.map((plan: any) => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": plan.planName
          },
          "price": plan.price,
          "priceCurrency": "INR"
        }))
      } : undefined
    };

    jsonLdScripts = (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(foodEstablishmentSchema) }}
        />
      </>
    );
  }

  return (
    <Suspense fallback={null}>
      {jsonLdScripts}
      <ViewMessDetailsClient slug={slug} initialData={initialMess} />
    </Suspense>
  );
}
