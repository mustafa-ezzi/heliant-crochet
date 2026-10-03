import { formatMoney } from "./money";

const API = "";

function csrfToken() {
  const match = document.cookie.match(/(?:^|; )csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

async function ensureCsrf() {
  if (csrfToken()) return;
  await fetch(`${API}/api/v1/account`, { credentials: "include" });
}

export async function adminRequest(path, { method = "GET", body } = {}) {
  if (method !== "GET") await ensureCsrf();
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (method !== "GET") headers["X-CSRFToken"] = csrfToken();
  const response = await fetch(`${API}${path}`, {
    method,
    credentials: "include",
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.detail || "The studio did not answer.");
    error.status = response.status;
    error.payload = data;
    throw error;
  }
  return data;
}

export async function uploadPhoto(file) {
  await ensureCsrf();
  const body = new FormData();
  body.append("file", file);
  const response = await fetch(`${API}/api/v1/admin/uploads`, {
    method: "POST",
    credentials: "include",
    headers: { "X-CSRFToken": csrfToken() },
    body,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.detail || "The photo did not reach the shelf.");
    error.payload = data;
    throw error;
  }
  return data.url;
}

export function money(cents) {
  return (Number(cents) || 0) / 100;
}

export function shortDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function matchesQuery(query, ...parts) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return parts.some((part) => String(part || "").toLowerCase().includes(needle));
}

export function downloadCsv(filename, rows) {
  const header = ["number", "date", "customer", "email", "status", "total", "pieces"];
  const lines = rows.map((row) => [
    row.number,
    String(row.created_at).slice(0, 10),
    row.name,
    row.email,
    row.status,
    formatMoney(row.subtotal_cents / 100),
    row.pieces,
  ]);
  const csv = [header, ...lines]
    .map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
