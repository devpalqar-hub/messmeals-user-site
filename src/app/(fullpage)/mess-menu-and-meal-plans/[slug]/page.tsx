import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getMessBySlug } from "../../../../services/messApi";
import type { MessDetails } from "../../../../types/mess";
import { MOCK_MESS } from "./mockMess";
import { PreviewBar, ThemeChooser } from "./ThemePreview";
import {
  DEFAULT_THEME,
  PREVIEW_SLUG,
  THEME_COMPONENTS,
  THEME_COOKIE,
  isThemeId,
} from "./themes";

type Params = { params: Promise<{ slug: string }> };
type PageProps = Params & {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function fetchMess(slug: string): Promise<MessDetails | null> {
  try {
    const mess: MessDetails = await getMessBySlug(slug);
    return mess ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;

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

export default async function MessLandingPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { theme: themeParam } = await searchParams;
  const savedTheme = (await cookies()).get(THEME_COOKIE)?.value;
  const saved = isThemeId(savedTheme) ? savedTheme : null;

  // "/…/preview" is the theme chooser; "/…/preview?theme=<id>" renders that
  // theme with the bundled sample mess, without calling the API.
  if (slug === PREVIEW_SLUG) {
    if (!isThemeId(themeParam)) return <ThemeChooser selected={saved} />;

    const Theme = THEME_COMPONENTS[themeParam];
    return (
      <>
        <Theme mess={MOCK_MESS} />
        <PreviewBar theme={themeParam} note="sample data" slug={slug} />
      </>
    );
  }

  const mess = await fetchMess(slug);
  if (!mess) notFound();

  // The API has no per-mess theme field yet. Until it does: a ?theme= link wins,
  // then the theme remembered on this browser, then the default.
  const fromLink = isThemeId(themeParam) ? themeParam : null;
  const theme = fromLink ?? saved ?? DEFAULT_THEME;
  const Theme = THEME_COMPONENTS[theme];

  return (
    <>
      <Theme mess={mess} />
      {(fromLink || saved) && (
        <PreviewBar
          theme={theme}
          note={fromLink ? "from link" : "saved on this browser"}
          slug={slug}
          canReset={!!saved}
        />
      )}
    </>
  );
}
