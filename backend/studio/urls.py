from django.urls import path

from studio.account import account, register, sign_in, sign_out
from studio.admin_api import (
    admin_customer_detail,
    admin_customers,
    admin_login,
    admin_order_detail,
    admin_orders,
    admin_product_detail,
    admin_products,
    admin_reports,
    admin_session,
    dashboard,
    update_settings,
    upload_product_photo,
)
from studio.api import create_contact, create_custom, create_order, create_stitch, order_detail, studio_settings

urlpatterns = [
    path("api/v1/orders", create_order),
    path("api/v1/orders/<int:order_id>", order_detail),
    path("api/v1/contact", create_contact),
    path("api/v1/custom-requests", create_custom),
    path("api/v1/stitch-list", create_stitch),
    path("api/v1/account", account),
    path("api/v1/account/register", register),
    path("api/v1/account/login", sign_in),
    path("api/v1/account/logout", sign_out),
    path("api/v1/settings", studio_settings),
    path("api/v1/admin/session", admin_session),
    path("api/v1/admin/login", admin_login),
    path("api/v1/admin/dashboard", dashboard),
    path("api/v1/admin/settings", update_settings),
    path("api/v1/admin/products", admin_products),
    path("api/v1/admin/products/<int:product_id>", admin_product_detail),
    path("api/v1/admin/orders", admin_orders),
    path("api/v1/admin/orders/<int:order_id>", admin_order_detail),
    path("api/v1/admin/customers", admin_customers),
    path("api/v1/admin/customers/<int:user_id>", admin_customer_detail),
    path("api/v1/admin/reports", admin_reports),
    path("api/v1/admin/uploads", upload_product_photo),
]
