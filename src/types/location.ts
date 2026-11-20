export type GeoLocation = {
  id: number;
  country: string;
  zipcode: string;
  placeName: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
};

export type GeoLocationResponse = {
  data: GeoLocation[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};
export type LocationKind = "hub" | "city" | "locality";

export type LocationRegion = "kerala" | "uae" | "bangalore" | "qatar";

export type LocationBreadcrumbItem = {
  label: string;
  href?: string;
};

export type LocationLinkCard = {
  title: string;
  href: string;
  tag?: string;
  summary: string;
};

export type LocationPocket = {
  name: string;
  landmark: string;
  summary: string;
};

export type LocationPersona = {
  title: string;
  summary: string;
  icon:
  | "briefcase"
  | "graduation"
  | "home"
  | "train"
  | "building"
  | "utensils"
  | "clock"
  | "compass";
};

export type LocationMealColumn = {
  eyebrow: string;
  title: string;
  intro: string;
  highlights: string[];
};

export type LocationFaq = {
  q: string;
  a: string;
};

export type LocationQuickFact = {
  label: string;
  value: string;
};

export type LocationPageData = {
  id: string;
  path: string; // No trailing slash, e.g. "/kerala/ernakulam" or "/uae/dubai/karama"
  region: LocationRegion;
  kind: LocationKind;
  indexable: boolean;
  indexabilityReason?: string;
  schemaType: "CollectionPage" | "WebPage";

  // SEO Metadata
  metaTitle: string;
  metaDescription: string;
  ogTitle?: string;
  ogDescription?: string;

  // Header & Hero
  breadcrumbs: LocationBreadcrumbItem[];
  heroEyebrow: string;
  h1: string;
  heroAccent?: string;
  heroSummary: string;
  heroSecondaryNote: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };

  // Snapshot
  quickFacts: LocationQuickFact[];

  // Sub-routes (e.g., cities under a hub or localities under a city)
  childLinksHeading?: string;
  childLinksSubheading?: string;
  childLinks?: LocationLinkCard[];

  // Micro-neighborhood / Landmark pockets
  pocketsHeading: string;
  pocketsSubheading: string;
  pockets: LocationPocket[];

  // Audience & daily routine fit
  audienceHeading: string;
  audienceSubheading: string;
  audiences: LocationPersona[];

  // Food style & schedule nuances (2 columns)
  mealSectionHeading: string;
  mealSectionSubheading: string;
  mealColumns: [LocationMealColumn, LocationMealColumn];

  // Practical local verification checklist
  checklistHeading: string;
  checklistSubheading: string;
  checklistItems: {
    title: string;
    detail: string;
  }[];

  // Sibling / related navigation
  relatedHeading: string;
  relatedSubheading: string;
  relatedLinks: LocationLinkCard[];

  // FAQs
  faqHeading: string;
  faqs: LocationFaq[];

  // Closing CTA
  closingHeading: string;
  closingDescription: string;
  closingPrimaryCta: {
    label: string;
    href: string;
  };
  closingSecondaryCta: {
    label: string;
    href: string;
  };
};
