import { Heart, PackageCheck } from "lucide-react";
import { Link } from "react-router-dom";
import BrandLockup from "./BrandLockup";

export default function Footer() {
  return (
    <>
      <div className="scallop-ink" aria-hidden="true" />
      <footer className="footer">
        <div className="wrap footer-grid">
          <div>
            <BrandLockup onInk />
            <p className="footer-note">
              Soft things for homes, people, and thoughtful gifts. Handmade in small batches.
            </p>
          </div>
          <div>
            <h2>Come visit</h2>
            <nav className="footer-links" aria-label="Visit">
              <Link to="/shop">Shop the latest</Link>
              <Link to="/about">Our studio</Link>
              <Link to="/custom">Custom orders</Link>
              <Link to="/policies">Policies</Link>
            </nav>
          </div>
          <div>
            <p className="hand">Thank you for keeping handmade things in the world.</p>
            <div className="socials">
              <button type="button" className="social-btn" aria-label="Instagram">
                <Heart size={18} strokeWidth={2} />
              </button>
              <Link className="social-btn" to="/policies#shipping" aria-label="Shipping and delivery policy">
                <PackageCheck size={18} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
        <div className="wrap">
          <p className="footer-fine">© 2026 Heliant Hook. Stitched with care.</p>
          <p className="footer-credit">
            Design and developed by{" "}
            <a href="https://trisitesolutions.com/" target="_blank" rel="noreferrer">
              Trisite Solutions
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
