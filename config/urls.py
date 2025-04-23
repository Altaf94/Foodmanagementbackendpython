# """
# URL configuration for config project.

# The `urlpatterns` list routes URLs to views. For more information please see:
#     https://docs.djangoproject.com/en/5.2/topics/http/urls/
# Examples:
# Function views
#     1. Add an import:  from my_app import views
#     2. Add a URL to urlpatterns:  path('', views.home, name='home')
# Class-based views
#     1. Add an import:  from other_app.views import Home
#     2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
# Including another URLconf
#     1. Import the include() function: from django.urls import include, path
#     2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
# """
# from django.contrib import admin
# from django.urls import path, include
# from core.views import get_food_trucks, create_food_truck, food_schedule
# from django.http import HttpResponse

# def home(request):
#     return HttpResponse("Food Truck API is running")

# urlpatterns = [
#     path('', home),
#     path('admin/', admin.site.urls),
#     path('api/foodtrucks/', get_food_trucks),
#     path('api/foodtrucks/create/', create_food_truck),
#     path('api/foodtrucks/schedule', food_schedule, name='food_schedule'),
#     path('api/foodtrucks/schedule/', food_schedule, name='food_schedule_with_slash'),
# ]


from django.contrib import admin
from django.urls import path
from core.views import get_food_trucks, create_food_truck, food_schedule, update_food_truck
from django.http import HttpResponse

def home(request):
    return HttpResponse("Food Truck API is running")

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('api/foodtrucks/', get_food_trucks),
    path('api/foodtrucks/create/', create_food_truck),
    path('api/foodtrucks/update/', update_food_truck),
    path('api/foodtrucks/schedule', food_schedule, name='food_schedule'),
    path('api/foodtrucks/schedule/', food_schedule, name='food_schedule_with_slash'),
]