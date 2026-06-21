from django.shortcuts import get_object_or_404, render
from .models import Project


def project_list_view(request):
    projects = Project.objects.all()
    return render(request, "portfolio/project_list.html", {"projects": projects})


def project_detail_view(request, slug):
    project = get_object_or_404(Project, slug=slug)
    return render(request, "portfolio/project_detail.html", {"project": project})
