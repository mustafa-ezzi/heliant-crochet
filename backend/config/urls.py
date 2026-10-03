from django.urls import include, path

urlpatterns = [
    path("", include("catalog.urls")),
    path("", include("studio.urls")),
]
