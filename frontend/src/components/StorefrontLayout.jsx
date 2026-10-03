import { Outlet } from "react-router-dom";
import AnnouncementBar from "./AnnouncementBar";
import Footer from "./Footer";
import Header from "./Header";

export default function StorefrontLayout() {
  return (
    <div className="storefront">
      <AnnouncementBar />
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
