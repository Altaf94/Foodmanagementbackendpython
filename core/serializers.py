# from rest_framework import serializers
# from .models import FoodTruck, FoodSchedule

# class FoodTruckSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = FoodTruck
#         fields = ['id', 'registrationid', 'type', 'name', 'created_at', 'updated_at']

# class FoodScheduleSerializer(serializers.ModelSerializer):
#     food_truck_name = serializers.CharField(source='food_truck.name', read_only=True)
#     food_truck_type = serializers.CharField(source='food_truck.type', read_only=True)
    
#     class Meta:
#         model = FoodSchedule
#         fields = ['id', 'food_truck', 'food_truck_name', 'food_truck_type', 'date', 'lunch', 'dinner', 'created_at', 'updated_at']
#         read_only_fields = ['created_at', 'updated_at']

#     def validate(self, data):
#         # Ensure at least one meal (lunch or dinner) is selected
#         if not data.get('lunch', False) and not data.get('dinner', False):
#             raise serializers.ValidationError("At least one meal (lunch or dinner) must be selected.")
#         return data 


from rest_framework import serializers
from .models import FoodTruck, FoodSchedule

class FoodTruckSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodTruck
        fields = ['id', 'registrationid', 'type', 'name', 'created_at', 'updated_at']

class FoodScheduleSerializer(serializers.ModelSerializer):
    food_truck_name = serializers.CharField(source='food_truck.name', read_only=True)
    food_truck_type = serializers.CharField(source='food_truck.type', read_only=True)
    
    class Meta:
        model = FoodSchedule
        fields = ['id', 'food_truck', 'food_truck_name', 'food_truck_type', 'date', 'lunch', 'dinner', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, data):
        # Ensure at least one meal (lunch or dinner) is selected
        if not data.get('lunch', False) and not data.get('dinner', False):
            raise serializers.ValidationError("At least one meal (lunch or dinner) must be selected.")
        return data