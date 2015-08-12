from django.shortcuts import render
from business_logic import api
import json

# Create your views here.
def Register(request):
    username = request.GET['username']
    password = request.GET['password']
    name = request.GET['name']
    surname = request.GET['surname']
    
    result = api.Register(username,password,name,surname)
    
    if result:
        return HttpResponse()
    else:
        return HttpResponse()

def Login(request):
    username = request.GET['username']
    password = request.GET['password']
    
    result = api.Login(username,password)
    
    if result:
        return HttpResponse(json.dumps(result))
    else:
        return HttpResponse()
    
def SendRequest(request):
    friendID = request.GET['friend']
    res = api.sendRequest(request,friendID)
    
    if res:
        return HttpResponse()
    else:
        return HttpResponse()
    