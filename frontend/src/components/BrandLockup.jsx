import { Link } from "react-router-dom";
import Flower from "./Flower";

export default function BrandLockup({ onInk = false }) {
  return (
    <Link to="/" className={onInk ? "lockup lockup-on-ink" : "lockup"}>
      <span className="mark">
        <Flower />
      </span>
      <span className="wordmark">
        heliant <span>hook</span>
      </span>
    </Link>
  );
}
