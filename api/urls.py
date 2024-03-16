from django.urls import path
from .views import *

urlpatterns = [
    path('task-list-create/', TaskListCreate.as_view(), name='task-list-create'),
    path('task-change/<pk>', TaskChange.as_view(), name='task-change'),

]
