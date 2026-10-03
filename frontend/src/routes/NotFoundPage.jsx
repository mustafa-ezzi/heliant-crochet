import { Link } from "react-router-dom";
import Flower from "../components/Flower";
import { usePageTitle } from "../lib/usePageTitle";

export default function NotFoundPage() {
  usePageTitle("Heliant Hook — Not found");

  return (
    <main className="route-page">
      <div className="wrap">
        <article className="empty-card">
          <Flower className="doodle" />
          <h1>This page is not on the table.</h1>
          <Link className="btn" to="/shop">
            Shop the latest
          </Link>
        </article>
      </div>
    </main>
  );
}
