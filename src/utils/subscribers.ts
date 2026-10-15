/**
 * Formats subscriber count into tiered display strings:
 * e.g., 5+, 10+, 15+, 20+, 25+, 50+, 75+, 100+, 250+, 500+, 1000+
 * Returns null if count is null, undefined, or less than 5.
 */
export function getSubscriberTier(count?: number | null): string | null {
  if (count === undefined || count === null || count < 5) {
    return null;
  }
  if (count >= 1000) return "1000+";
  if (count >= 500) return "500+";
  if (count >= 250) return "250+";
  if (count >= 100) return "100+";
  if (count >= 75) return "75+";
  if (count >= 50) return "50+";
  if (count >= 25) return "25+";
  if (count >= 20) return "20+";
  if (count >= 15) return "15+";
  if (count >= 10) return "10+";
  return "5+";
}

/**
 * Formats subscriber count with the "Subscribers" suffix,
 * e.g., "5+ Subscribers", "10+ Subscribers", "25+ Subscribers"
 */
export function formatSubscribers(count?: number | null): string | null {
  const tier = getSubscriberTier(count);
  return tier ? `${tier} Subscribers` : null;
}
