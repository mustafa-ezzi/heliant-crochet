import { useEffect, useState } from "react";

const API = "";

export function toProduct(row) {
  const images = row.images?.length ? row.images : [row.image];
  return {
    slug: row.slug,
    name: row.name,
    meta: row.meta,
    price: row.price_cents / 100,
    sticker: row.sticker,
    image: images[0] || "",
    images,
    category: row.category,
    timing: row.timing,
    description: row.description,
    fiber: row.fiber,
    careShort: row.care_short,
    care: row.care,
    ships: row.ships,
    story: row.story,
    measurements: row.measurements,
    colors: row.colors,
    sizes: row.sizes,
    position: row.position,
  };
}

export async function postJson(path, body) {
  await ensureCsrf();
  const response = await fetch(`${API}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken(),
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error("The studio did not answer.");
    error.payload = data;
    throw error;
  }
  return data;
}

function csrfToken() {
  const match = document.cookie.match(/(?:^|; )csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

async function ensureCsrf() {
  if (csrfToken()) return;
  await fetch(`${API}/api/v1/account`, { credentials: "include" });
}

async function getJson(path) {
  const response = await fetch(`${API}${path}`, { credentials: "include" });
  if (response.status === 404) return { missing: true };
  if (!response.ok) throw new Error("The catalog did not answer.");
  return { data: await response.json() };
}

export function useProducts() {
  const [state, setState] = useState({ status: "loading", products: [] });

  useEffect(() => {
    let cancel = false;
    getJson("/api/v1/products")
      .then((result) => {
        if (cancel) return;
        if (result.missing) {
          setState({ status: "error", products: [] });
          return;
        }
        setState({ status: "ready", products: result.data.map(toProduct) });
      })
      .catch(() => {
        if (!cancel) setState({ status: "error", products: [] });
      });
    return () => {
      cancel = true;
    };
  }, []);

  return state;
}

export function useProduct(slug) {
  const [state, setState] = useState({ status: "loading", product: null, related: [] });

  useEffect(() => {
    let cancel = false;
    setState({ status: "loading", product: null, related: [] });
    Promise.all([getJson(`/api/v1/products/${slug}`), getJson("/api/v1/products")])
      .then(([one, all]) => {
        if (cancel) return;
        if (one.missing) {
          setState({ status: "missing", product: null, related: [] });
          return;
        }
        if (!one.data || !all.data) throw new Error("The catalog did not answer.");
        const product = toProduct(one.data);
        const related = all.data
          .map(toProduct)
          .filter((item) => item.slug !== product.slug)
          .slice(0, 3);
        setState({ status: "ready", product, related });
      })
      .catch(() => {
        if (!cancel) setState({ status: "error", product: null, related: [] });
      });
    return () => {
      cancel = true;
    };
  }, [slug]);

  return state;
}
