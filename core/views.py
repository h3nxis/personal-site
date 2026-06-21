from django.shortcuts import render
from portfolio.models import Project


def home_view(request):
    featured_projects = Project.objects.filter(is_featured=True)[:3]
    return render(request, "core/home.html", {"featured_projects": featured_projects})


def about_view(request):
    return render(request, "core/about.html")
