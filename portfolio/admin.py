from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["title", "slug", "is_featured", "created_at", "updated_at"]
    list_filter = ["is_featured", "created_at", "updated_at"]
    search_fields = ["title", "short_description", "description"]
    prepopulated_fields = {"slug": ["title"]}
    readonly_fields = ["created_at", "updated_at"]
