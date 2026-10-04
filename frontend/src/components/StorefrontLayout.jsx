import { Outlet } from "react-router-dom";
import { shopFont } from "../lib/fonts";
import { useStudioSettings } from "../lib/studio";
import AnnouncementBar from "./AnnouncementBar";
import Footer from "./Footer";
import Header from "./Header";

export default function StorefrontLayout() {
  const { font } = useStudioSettings();
  const choice = shopFont(font);
  return (
    <div
      className="storefront"
      style={{ "--font-display": choice.display, "--font-body": choice.body }}
    >
      <AnnouncementBar />
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
