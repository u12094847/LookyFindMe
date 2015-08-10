from django.db import models

# Create your models here.
class Person(models.Model):
    Username = CharField(max_length = 30)
    Password = CharField(max_length = 30)
    Name= CharField(max_length = 30)
    Surname = CharField(max_length = 30)
    FriendCount = models.IntegerField()

class Friend(models.Model):
    userID = models.ForeignKey(Person)
    Friend = models.ForeignKey(Person)
    

   
