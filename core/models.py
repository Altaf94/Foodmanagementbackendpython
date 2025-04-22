# from django.db import models

# # Create your models here.

# class FoodTruck(models.Model):
#     registrationid = models.CharField(max_length=100, unique=True)
#     type = models.CharField(max_length=50)
#     name = models.CharField(max_length=100)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         db_table = 'foodtrucks_userdata'

#     def __str__(self):
#         return self.name

# class FoodSchedule(models.Model):
#     food_truck = models.ForeignKey(FoodTruck, on_delete=models.CASCADE, related_name='schedules')
#     date = models.DateField()
#     lunch = models.BooleanField(default=False)
#     dinner = models.BooleanField(default=False)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         db_table = 'food_schedules'
#         # Ensure a food truck can only have one schedule per date
#         unique_together = ['food_truck', 'date']

#     def __str__(self):
#         return f"{self.food_truck.name} - {self.date}"



from django.db import models

class FoodTruck(models.Model):
    registrationid = models.CharField(max_length=100, unique=True)
    type = models.CharField(max_length=50)
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'foodtrucks_userdata'

    def __str__(self):
        return self.name

class FoodSchedule(models.Model):
    food_truck = models.ForeignKey(FoodTruck, on_delete=models.CASCADE, related_name='schedules')
    date = models.DateField()
    lunch = models.BooleanField(default=False)
    dinner = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'food_schedules'
        unique_together = ['food_truck', 'date']

    def __str__(self):
        return f"{self.food_truck.name} - {self.date}"