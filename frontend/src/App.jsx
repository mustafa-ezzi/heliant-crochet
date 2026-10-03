import { Navigate, Route, Routes } from "react-router-dom";
import StorefrontLayout from "./components/StorefrontLayout";
import AboutPage from "./routes/AboutPage";
import AccountPage from "./routes/AccountPage";
import CartPage from "./routes/CartPage";
import CheckoutPage from "./routes/CheckoutPage";
import ConfirmationPage from "./routes/ConfirmationPage";
import ContactPage from "./routes/ContactPage";
import CustomPage from "./routes/CustomPage";
import HomePage from "./routes/HomePage";
import NotFoundPage from "./routes/NotFoundPage";
import PoliciesPage from "./routes/PoliciesPage";
import ProductPage from "./routes/ProductPage";
import ShopPage from "./routes/ShopPage";
import AdminLayout from "./routes/admin/AdminLayout";
import AdminLogin from "./routes/admin/AdminLogin";
import CustomersPage from "./routes/admin/CustomersPage";
import DashboardPage from "./routes/admin/DashboardPage";
import OrderDetailPage from "./routes/admin/OrderDetailPage";
import OrdersPage from "./routes/admin/OrdersPage";
import ProductEditorPage from "./routes/admin/ProductEditorPage";
import ProductsPage from "./routes/admin/ProductsPage";
import ReportsPage from "./routes/admin/ReportsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<StorefrontLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="shop/:slug" element={<ProductPage />} />
        <Route path="custom" element={<CustomPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="policies" element={<PoliciesPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="checkout/confirmation" element={<ConfirmationPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="admin/login" element={<AdminLogin />} />
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/new" element={<ProductEditorPage />} />
        <Route path="products/:id" element={<ProductEditorPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>
      <Route path="admin/*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
