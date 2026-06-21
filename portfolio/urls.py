from django.urls import path
from .views import project_detail_view, project_list_view

app_name = "portfolio"

urlpatterns = [
    path("", project_list_view, name="project_list"),
    path("<slug:slug>/", project_detail_view, name="project_detail"),
]
