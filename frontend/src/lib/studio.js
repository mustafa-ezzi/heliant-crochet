import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_BASE || "";
const FALLBACK = {
  announcement: "Made to order in small batches · delivery in 10–15 working days",
  giftWrap: 6,
};

export function useStudioSettings() {
  const [settings, setSettings] = useState(FALLBACK);

  useEffect(() => {
    let current = true;
    fetch(`${API}/api/v1/settings`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!current || !data) return;
        setSettings({
          announcement: data.announcement || FALLBACK.announcement,
          giftWrap: data.gift_wrap_cents / 100,
        });
      })
      .catch(() => {});
    return () => {
      current = false;
    };
  }, []);

  return settings;
}
