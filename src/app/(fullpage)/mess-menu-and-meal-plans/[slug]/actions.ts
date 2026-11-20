"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  PREVIEW_SLUG,
  THEME_COOKIE,
  isThemeId,
  type ThemeId,
} from "./themes/registry";

const ONE_YEAR = 60 * 60 * 24 * 365;
const SLUG = /^[a-z0-9][a-z0-9-]{0,120}$/i;
const BASE = "/mess-menu-and-meal-plans";

async function remember(id: ThemeId) {
  (await cookies()).set(THEME_COOKIE, id, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "lax",
    httpOnly: true,
  });
}

async function forget() {
  (await cookies()).delete(THEME_COOKIE);
}

/** Chooser page: remember a theme and stay on the chooser. */
export async function selectTheme(id: string) {
  if (!isThemeId(id)) return;
  await remember(id);
}

export async function clearTheme() {
  await forget();
}

/**
 * Theme picker on a landing page: remember the theme, then reload the same
 * page in it. A sample-data preview is driven by ?theme=, so it is put there;
 * a real mess page is reloaded without the parameter so the saved theme applies.
 */
export async function pickTheme(slug: string, id: string) {
  if (!isThemeId(id) || !SLUG.test(slug)) return;
  await remember(id);
  redirect(
    slug === PREVIEW_SLUG
      ? `${BASE}/${PREVIEW_SLUG}?theme=${id}`
      : `${BASE}/${slug}`,
  );
}

/** Theme picker: drop the remembered theme (back to the default). */
export async function resetTheme(slug: string) {
  if (!SLUG.test(slug)) return;
  await forget();
  redirect(`${BASE}/${slug}`);
}
