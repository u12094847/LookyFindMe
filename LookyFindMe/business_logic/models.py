from django.db import models

# Create your models here.
class Person(models.Model):
    Username = models.CharField(max_length = 30)
    Password = models.CharField(max_length = 30)
    Name= models.CharField(max_length = 30)
    Surname = models.CharField(max_length = 30)
    FriendCount = models.IntegerField(null=True)

class Friend(models.Model):
    userID = models.ForeignKey(Person)
    Friend = models.IntegerField()
    status = models.IntegerField(null=True)
    
class Request(models.Model):
    userID = models.ForeignKey(Person)
    Friend = models.IntegerField()
    
   
