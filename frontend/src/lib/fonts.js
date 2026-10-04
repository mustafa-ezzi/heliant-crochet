export const SHOP_FONTS = [
  {
    id: "studio",
    label: "Studio",
    display: '"Fraunces", "Iowan Old Style", Palatino, serif',
    body: '"Nunito", "Avenir Next", "Segoe UI", sans-serif',
  },
  {
    id: "fraunces",
    label: "Fraunces",
    display: '"Fraunces", "Iowan Old Style", Palatino, serif',
    body: '"Fraunces", "Iowan Old Style", Palatino, serif',
  },
  {
    id: "nunito",
    label: "Nunito",
    display: '"Nunito", "Avenir Next", "Segoe UI", sans-serif',
    body: '"Nunito", "Avenir Next", "Segoe UI", sans-serif',
  },
  {
    id: "playfair",
    label: "Playfair Display",
    display: '"Playfair Display", Palatino, serif',
    body: '"Playfair Display", Palatino, serif',
  },
  {
    id: "cormorant",
    label: "Cormorant Garamond",
    display: '"Cormorant Garamond", Palatino, serif',
    body: '"Cormorant Garamond", Palatino, serif',
  },
  {
    id: "quicksand",
    label: "Quicksand",
    display: '"Quicksand", "Avenir Next", "Segoe UI", sans-serif',
    body: '"Quicksand", "Avenir Next", "Segoe UI", sans-serif',
  },
];

export function shopFont(id) {
  return SHOP_FONTS.find((font) => font.id === id) || SHOP_FONTS[0];
}
