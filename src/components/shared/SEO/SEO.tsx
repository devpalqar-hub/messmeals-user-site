export type SEOProps = {
  title: string;
  description?: string;
  noindex?: boolean;
  image?: string;
  url?: string;
};

export default function SEO({ title, description, noindex, image, url }: SEOProps) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  
  const ogImage = image || "/seo/og-default.png";
  const absoluteOgImage = ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`;
  
  // Clean url logic to remove tracking/query params and trailing slashes for fallback
  let cleanUrl = url;
  if (!cleanUrl && typeof window !== "undefined") {
    // Drop query params and hash
    const rawPath = window.location.href.split("?")[0].split("#")[0];
    // Remove trailing slash if it's not the root
    cleanUrl = rawPath.endsWith("/") && rawPath !== baseUrl + "/" ? rawPath.slice(0, -1) : rawPath;
  }
  
  const absoluteCanonicalUrl = cleanUrl 
    ? (cleanUrl.startsWith("http") ? cleanUrl : `${baseUrl}${cleanUrl}`)
    : "";

  return (
    <>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {noindex && <meta name="robots" content="noindex" />}
      
      {!noindex && (
        <>
          {absoluteCanonicalUrl && <link rel="canonical" href={absoluteCanonicalUrl} />}
          <meta property="og:title" content={title} />
          {description && <meta property="og:description" content={description} />}
          <meta property="og:image" content={absoluteOgImage} />
          {absoluteCanonicalUrl && <meta property="og:url" content={absoluteCanonicalUrl} />}
          <meta property="og:type" content="website" />
        </>
      )}
    </>
  );
}
