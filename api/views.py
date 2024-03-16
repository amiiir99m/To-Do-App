from django.shortcuts import render
from .serializers import *
from .models import *
from rest_framework.response import Response
from rest_framework import generics


class TaskListCreate(generics.ListCreateAPIView):

    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class TaskChange(generics.RetrieveUpdateDestroyAPIView):

    queryset = Task.objects.all()
    serializer_class = TaskSerializer


