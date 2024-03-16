from django.urls import path
from .views import *

urlpatterns = [
    #path('task-list/', TaskList.as_view(), name='task-list'),
    path('', main, name='main'),

]
