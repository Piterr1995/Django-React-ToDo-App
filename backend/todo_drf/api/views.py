from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view

# do widoków funkcyjnych def... potrzebujemy tego dekoratora

from rest_framework.response import Response
from .serialiers import TaskSerializer
from .models import Task

# zwykły widok zwracający json response
# def apiOverview(request):
#     return JsonResponse("API BASE POINt", safe=False)


@api_view(["GET", "POST"])
def apiOverview(request):
    api_urls = {
        "List": "/task-list/",
        "Detail": "/task-detail/<str:pk>",
        "Create": "/task-create/",
        "Update": "/task-update/<str:pk>",
        "Delete": "/task-delete/<str:pk>",
    }
    # Używając Response zaimportowanego zamiast JsonResponse
    # dostaniemy widok z rest frameworka
    return Response(api_urls)


@api_view(["GET"])
def taskList(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    # many = True oznacza, że będzie więdzie wiele obiektów
    return Response(serializer.data)
    # zwróci nam dane z naszego serializera w postaci json


@api_view(["GET"])
def taskDetail(request, pk):
    tasks = Task.objects.get(id=pk)
    serializer = TaskSerializer(tasks, many=False)
    return Response(serializer.data)


@api_view(["POST"])
def taskCreate(request):
    serializer = TaskSerializer(data=request.data)
    # normalnie robimy request.method == POST itd
    # tutaj odbieramy dane, które podał użytkownik
    # w przeciwienstwie do request.POST można też uzyc put i patch
    if serializer.is_valid():
        serializer.save()

    # po prostu jeśli wprowadzone dane są poprawne to zapisujemy to
    return Response(serializer.data)
    # pamiętaj, żeby podając dane na tej stronie użyć formatu json, czyli w {}


@api_view(["POST"])
def taskUpdate(request, pk):
    task = Task.objects.get(id=pk)
    serializer = TaskSerializer(instance=task, data=request.data)

    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(["DELETE"])
def taskDelete(request, pk):
    task = Task.objects.get(id=pk)
    task.delete()
    return Response(data={"message": "Deleted"})
