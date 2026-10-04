import { Link } from "react-router-dom";

export default function BrandLockup({ onInk = false }) {
  return (
    <Link to="/" aria-label="Heliant Hook" className={onInk ? "lockup lockup-on-ink" : "lockup"}>
      <span className="mark">
        <img src="/logo.png" alt="" />
      </span>
      <span className="wordmark">
        heliant <span>hook</span>
      </span>
    </Link>
  );
}
