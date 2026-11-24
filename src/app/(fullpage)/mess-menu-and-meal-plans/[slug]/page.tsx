import type { Metadata } from "next";
import { ThemeChooser } from "./ThemePreview";
import { PREVIEW_SLUG, DEFAULT_THEME } from "./themes";
import { landingMetadata, renderLanding } from "./landing";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
}: Pick<PageProps, "params">): Promise<Metadata> {
  const { slug } = await params;
  return landingMetadata(slug, false);
}

/**
 * /mess-menu-and-meal-plans/<slug>                       → default (warm) theme
 * /mess-menu-and-meal-plans/<slug>/custom-theme/<theme>  → any other theme
 * /mess-menu-and-meal-plans/preview[?mess=<slug>]        → theme chooser
 */
export default async function MessLandingPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;

  if (slug === PREVIEW_SLUG) {
    const { mess } = await searchParams;
    return <ThemeChooser mess={typeof mess === "string" ? mess : undefined} />;
  }

  return renderLanding(slug, DEFAULT_THEME);
}
