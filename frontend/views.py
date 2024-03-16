from django.shortcuts import render
from api.views import *
from api.models import *
from api.serializers import *
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.views import APIView




#lass TaskList(APIView):
#   renderer_classes = [TemplateHTMLRenderer]
#   template_name = 'frontend/task-list.html'
#
#   def get(self, request):
#       queryset = Task.objects.all()
#       return Response({'tasks': queryset})


def task_list(request):
    return render(request, 'frontend/task-list.html')



def task_create(request):
    return render(request, 'frontend/task-create.html')


def main(request):
    return render(request, 'frontend/main.html')