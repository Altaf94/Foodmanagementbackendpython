# from django.shortcuts import render
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status
# from .models import FoodTruck, FoodSchedule
# from .serializers import FoodTruckSerializer, FoodScheduleSerializer
# from datetime import datetime

# # Create your views here.

# @api_view(['GET'])
# def get_food_trucks(request):
#     registrationid = request.query_params.get('registrationid', None)
#     if registrationid:
#         try:
#             food_truck = FoodTruck.objects.get(registrationid=registrationid)
#             serializer = FoodTruckSerializer(food_truck)
#             return Response(serializer.data)
#         except FoodTruck.DoesNotExist:
#             return Response({"error": "Food truck not found"}, status=status.HTTP_404_NOT_FOUND)
#     return Response({"error": "registrationid parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['POST'])
# def create_food_truck(request):
#     serializer = FoodTruckSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET', 'PATCH'])
# def food_schedule(request):
#     if request.method == 'GET':
#         # Get schedule for a specific food truck and date
#         registrationid = request.query_params.get('registrationid')
#         date_str = request.query_params.get('date')
        
#         if not registrationid or not date_str:
#             return Response(
#                 {"error": "Both registrationid and date parameters are required"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
        
#         try:
#             date = datetime.strptime(date_str, '%Y-%m-%d').date()
#             food_truck = FoodTruck.objects.get(registrationid=registrationid)
            
#             # Get or create the schedule
#             schedule, created = FoodSchedule.objects.get_or_create(
#                 food_truck=food_truck,
#                 date=date,
#                 defaults={
#                     'lunch': False,
#                     'dinner': False
#                 }
#             )
            
#             serializer = FoodScheduleSerializer(schedule)
#             return Response(serializer.data)
            
#         except ValueError:
#             return Response(
#                 {"error": "Invalid date format"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
#         except FoodTruck.DoesNotExist:
#             return Response(
#                 {"error": "User Not Found", "status": 300},
#                 status=300
#             )
    
#     elif request.method == 'PATCH':
#         # Update schedule for a food truck
#         registrationid = request.data.get('registrationid')
#         date_str = request.data.get('date')
#         lunch = request.data.get('lunch')
#         dinner = request.data.get('dinner')
        
#         if not all([registrationid, date_str, lunch is not None, dinner is not None]):
#             return Response(
#                 {"error": "registrationid, date, lunch, and dinner are required"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
        
#         try:
#             date = datetime.strptime(date_str, '%Y-%m-%d').date()
#             food_truck = FoodTruck.objects.get(registrationid=registrationid)
            
#             # Try to get existing schedule
#             schedule = FoodSchedule.objects.filter(food_truck=food_truck, date=date).first()
            
#             if schedule:
#                 # Update existing schedule
#                 schedule.lunch = lunch
#                 schedule.dinner = dinner
#                 schedule.save()
#             else:
#                 # Create new schedule if it doesn't exist
#                 schedule = FoodSchedule.objects.create(
#                     food_truck=food_truck,
#                     date=date,
#                     lunch=lunch,
#                     dinner=dinner
#                 )
            
#             serializer = FoodScheduleSerializer(schedule)
#             return Response(serializer.data)
            
#         except ValueError:
#             return Response(
#                 {"error": "Invalid date format"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
#         except FoodTruck.DoesNotExist:
#             return Response(
#                 {"error": "User Not Found", "status": 300},
#                 status=300
#             )

# @api_view(['PATCH'])
# def update_schedule_state(request):
#     """
#     Update the lunch and dinner states for a food truck's schedule.
#     Required parameters:
#     - registrationid: The food truck's registration ID
#     - date: The schedule date in YYYY-MM-DD format
#     - lunch: Boolean value for lunch state
#     - dinner: Boolean value for dinner state
#     """
#     registrationid = request.data.get('registrationid')
#     date_str = request.data.get('date')
#     lunch = request.data.get('lunch')
#     dinner = request.data.get('dinner')

#     if not all([registrationid, date_str, lunch is not None, dinner is not None]):
#         return Response(
#             {"error": "registrationid, date, lunch, and dinner are required"},
#             status=status.HTTP_400_BAD_REQUEST
#         )

#     try:
#         date = datetime.strptime(date_str, '%Y-%m-%d').date()
#         food_truck = FoodTruck.objects.get(registrationid=registrationid)
        
#         # Try to get existing schedule
#         schedule = FoodSchedule.objects.filter(food_truck=food_truck, date=date).first()
        
#         if schedule:
#             # Update existing schedule
#             schedule.lunch = lunch
#             schedule.dinner = dinner
#             schedule.save()
#         else:
#             # Create new schedule if it doesn't exist
#             schedule = FoodSchedule.objects.create(
#                 food_truck=food_truck,
#                 date=date,
#                 lunch=lunch,
#                 dinner=dinner
#             )
        
#         serializer = FoodScheduleSerializer(schedule)
#         return Response(serializer.data)
        
#     except (ValueError, FoodTruck.DoesNotExist):
#         return Response(
#             {"error": "Invalid date format or food truck not found"},
#             status=status.HTTP_400_BAD_REQUEST
#         )


from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import FoodTruck, FoodSchedule
from .serializers import FoodTruckSerializer, FoodScheduleSerializer
from datetime import datetime

@api_view(['GET'])
def get_food_trucks(request):
    registrationid = request.query_params.get('registrationid', None)
    if registrationid:
        try:
            food_truck = FoodTruck.objects.get(registrationid=registrationid)
            serializer = FoodTruckSerializer(food_truck)
            return Response(serializer.data)
        except FoodTruck.DoesNotExist:
            return Response({"error": "Food truck not found"}, status=status.HTTP_404_NOT_FOUND)
    return Response({"error": "registrationid parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_food_truck(request):
    serializer = FoodTruckSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PATCH'])
def food_schedule(request):
    if request.method == 'GET':
        # Get schedule for a specific food truck and date
        registrationid = request.query_params.get('registrationid')
        date_str = request.query_params.get('date')
        
        if not registrationid or not date_str:
            return Response(
                {"error": "Both registrationid and date parameters are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
            food_truck = FoodTruck.objects.get(registrationid=registrationid)
            
            # Get or create the schedule
            schedule, created = FoodSchedule.objects.get_or_create(
                food_truck=food_truck,
                date=date,
                defaults={
                    'lunch': False,
                    'dinner': False
                }
            )
            
            serializer = FoodScheduleSerializer(schedule)
            return Response(serializer.data)
            
        except ValueError:
            return Response(
                {"error": "Invalid date format"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except FoodTruck.DoesNotExist:
            return Response(
                {"error": "User Not Found", "status": 300},
                status=300
            )
    
    elif request.method == 'PATCH':
        # Update schedule for a food truck
        registrationid = request.data.get('registrationid')
        date_str = request.data.get('date')
        lunch = request.data.get('lunch')
        dinner = request.data.get('dinner')
        
        if not all([registrationid, date_str, lunch is not None, dinner is not None]):
            return Response(
                {"error": "registrationid, date, lunch, and dinner are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
            food_truck = FoodTruck.objects.get(registrationid=registrationid)
            
            # Try to get existing schedule
            schedule = FoodSchedule.objects.filter(food_truck=food_truck, date=date).first()
            
            if schedule:
                # Update existing schedule
                schedule.lunch = lunch
                schedule.dinner = dinner
                schedule.save()
            else:
                # Create new schedule if it doesn't exist
                schedule = FoodSchedule.objects.create(
                    food_truck=food_truck,
                    date=date,
                    lunch=lunch,
                    dinner=dinner
                )
            
            serializer = FoodScheduleSerializer(schedule)
            return Response(serializer.data)
            
        except ValueError:
            return Response(
                {"error": "Invalid date format"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except FoodTruck.DoesNotExist:
            return Response(
                {"error": "User Not Found", "status": 300},
                status=300
            )

@api_view(['PATCH'])
def update_food_truck(request):
    registrationid = request.data.get('registrationid')
    if not registrationid:
        return Response(
            {"error": "registrationid is required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        food_truck = FoodTruck.objects.get(registrationid=registrationid)
        serializer = FoodTruckSerializer(food_truck, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except FoodTruck.DoesNotExist:
        return Response(
            {"error": "Food truck not found"},
            status=status.HTTP_404_NOT_FOUND
        )

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import FoodTruck
from .serializers import FoodTruckSerializer
from datetime import datetime
from rest_framework import permissions

class FoodTruckViewSet(viewsets.ModelViewSet):
    queryset = FoodTruck.objects.all()
    serializer_class = FoodTruckSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        return self.queryset.filter(owner=self.request.user)

    @action(detail=False, methods=['get'])
    def schedule(self, request):
        # Get current day and time
        now = datetime.now()
        current_day = now.strftime('%A').lower()
        current_time = now.strftime('%H:%M')

        # Filter trucks that are open
        open_trucks = []
        for truck in self.get_queryset():
            if current_day in truck.schedule:
                schedule = truck.schedule[current_day]
                if isinstance(schedule, list):
                    for time_slot in schedule:
                        if 'open' in time_slot and 'close' in time_slot:
                            if time_slot['open'] <= current_time <= time_slot['close']:
                                truck.is_open = True
                                open_trucks.append(truck)
                                break

        serializer = self.get_serializer(open_trucks, many=True)
        return Response(serializer.data)