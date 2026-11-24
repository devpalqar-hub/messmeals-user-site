import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { landingMetadata, renderLanding } from "../../landing";
import { isThemeId } from "../../themes";

type PageProps = { params: Promise<{ slug: string; theme: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return landingMetadata(slug, true);
}

/** /mess-menu-and-meal-plans/<slug>/custom-theme/<standard|modern|classic|warm> */
export default async function CustomThemePage({ params }: PageProps) {
  const { slug, theme } = await params;
  if (!isThemeId(theme)) notFound();
  return renderLanding(slug, theme);
}
