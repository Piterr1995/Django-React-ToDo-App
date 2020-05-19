from django.urls import path
from . import views

urlpatterns = [
    path("", views.apiOverview),
    path("task-list", views.taskList, name="task-list"),
    path("task-create/", views.taskCreate, name="task-create"),
    path("task-detail/<int:pk>/", views.taskDetail, name="task-detail"),
    path("task-update/<int:pk>/", views.taskUpdate, name="task-detail"),
    path("task-delete/<int:pk>/", views.taskDelete, name="task-delete"),
]
