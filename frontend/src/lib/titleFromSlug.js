const KNOWN_PIECES = {
  "daisy-day-bag": "Daisy day bag",
  "petal-bucket-hat": "Petal bucket hat",
  "flower-patch-cushion": "Flower patch cushion",
  "lilac-market-tote": "Lilac market tote",
};

export function titleFromSlug(slug = "") {
  if (KNOWN_PIECES[slug]) return KNOWN_PIECES[slug];
  const words = slug.split("-").filter(Boolean);
  if (words.length === 0) return "Product";
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
