import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageTitle } from "../lib/brand";
import { POLICIES } from "../data/policies";
import { usePageTitle } from "../lib/usePageTitle";

export default function PoliciesPage() {
  const { hash } = useLocation();
  usePageTitle(pageTitle("Policies"));

  useEffect(() => {
    if (!hash) return;
    document.querySelector(hash)?.scrollIntoView();
  }, [hash]);

  return (
    <main>
      <header className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Heliant Hook</p>
          <h1>Policies</h1>
          <p className="lede">
            Handmade with <span className="hand-bit">love</span>. Please read these before you order.
          </p>
        </div>
      </header>
      <section className="policy-section" aria-label="Studio policies">
        <div className="wrap policy-stack">
          {POLICIES.map((policy) => (
            <article className={`policy-card fill-${policy.tone}`} id={policy.id} key={policy.id}>
              <h2>{policy.title}</h2>
              {policy.items ? (
                <ul>
                  {policy.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                policy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
