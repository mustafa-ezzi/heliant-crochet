from django.urls import path

from catalog.api import product_detail, product_list

urlpatterns = [
    path("api/v1/products", product_list),
    path("api/v1/products/<slug:slug>", product_detail),
]
