import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessBySlug } from "../../../../services/messApi";
import type { MessDetails } from "../../../../types/mess";
import { MOCK_MESS } from "./mockMess";
import { PREVIEW_SLUG, THEME_COMPONENTS, type ThemeId } from "./themes";

export const LANDING_BASE = "/mess-menu-and-meal-plans";

export async function fetchMess(slug: string): Promise<MessDetails | null> {
  try {
    const mess: MessDetails = await getMessBySlug(slug);
    return mess ?? null;
  } catch {
    return null;
  }
}

/**
 * Metadata for a mess landing page. Every theme of a mess canonicalises to the
 * default URL, and only the default URL is indexable.
 */
export async function landingMetadata(
  slug: string,
  themed: boolean,
): Promise<Metadata> {
  if (slug === PREVIEW_SLUG) {
    return {
      title: "Landing page themes | MessMeals",
      robots: { index: false, follow: false },
    };
  }

  const mess = await fetchMess(slug);
  if (!mess) {
    return { title: "Mess Not Found | MessMeals", robots: { index: false } };
  }

  const title = `${mess.messName} – Subscribe to Daily Meals | MessMeals`;
  const description = `Fresh homely food from ${mess.messName} in ${
    mess.address?.location || "your area"
  }. See this week's menu, plans & pricing — subscribe on MessMeals.`;
  const url = `${LANDING_BASE}/${mess.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: themed ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      images: mess.coverImage ? [mess.coverImage] : undefined,
      url,
    },
  };
}

/** Renders a mess (or the sample mess for the preview slug) in one theme. */
export async function renderLanding(slug: string, theme: ThemeId) {
  const Theme = THEME_COMPONENTS[theme];

  if (slug === PREVIEW_SLUG) {
    return <Theme mess={MOCK_MESS} />;
  }

  const mess = await fetchMess(slug);
  if (!mess) notFound();

  return <Theme mess={mess} />;
}
