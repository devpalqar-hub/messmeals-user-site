import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessBySlug } from "../../../../services/messApi";
import type { MessDetails } from "../../../../types/mess";
import { MOCK_MESS } from "./mockMess";
import MessLandingClient from "./MessLandingClient";

type Params = { params: Promise<{ slug: string }> };

async function fetchMess(slug: string): Promise<MessDetails | null> {
  // "/mess-menu-and-meal-plans/preview" renders the bundled mock payload without hitting the API.
  if (slug === "preview") return MOCK_MESS;
  try {
    const mess: MessDetails = await getMessBySlug(slug);
    return mess ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const mess = await fetchMess(slug);

  if (!mess) {
    return { title: "Mess Not Found | MessMeals", robots: { index: false } };
  }

  const title = `${mess.messName} – Subscribe to Daily Meals | MessMeals`;
  const description = `Fresh homely food from ${mess.messName} in ${
    mess.address?.location || "your area"
  }. See this week's menu, plans & pricing — subscribe on MessMeals.`;

  return {
    title,
    description,
    alternates: { canonical: `/mess-menu-and-meal-plans/${mess.slug}` },
    openGraph: {
      title,
      description,
      images: mess.coverImage ? [mess.coverImage] : undefined,
      url: `/mess-menu-and-meal-plans/${mess.slug}`,
    },
  };
}

export default async function MessLandingPage({ params }: Params) {
  const { slug } = await params;
  const mess = await fetchMess(slug);
  if (!mess) notFound();

  return <MessLandingClient mess={mess} />;
}
