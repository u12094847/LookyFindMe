from .models import *

def Register(user,password,name,surname):
    person = Person(Username=user,Password=password,Name=name,Surname=surname)
    person.save()
    return True

def Login(username,password):
    person = Person.objects.get(Username=username)
    
    if person:
        if person.Password == password:
            request.session['user']={'id':person.id,'name':person.Name,'surname':person.Surname}
            friends = Friend.objects.filter(userID=person)
            frnd = []
            pending = []
            for f in friend:
                temp = []
                temp.append(f.name)
                temp.append(f.surname)
                temp.append(f.id)
                if f.status == 1:
                    frnd.append(temp)
                else:
                    pending.append(temp)
            
            req = Request.objects.filter(Friend=person.id)
            request = []
            for i in req:
                tmp = []
                tmp.append(i.name)
                tmp.append(i.surname)
                tmp.append(i.id)
                request.append(tmp)
            
            data = {
                'friends':frnd,
                'pending':pending,
                'request': request
            }
            return data
        else:
            return ""
        
def sendRequest(request,friend):
    usr = request.session['user']['id']
    person = Person.objects.get(id=usr)
    
    frnd = Friend(userID=person,Friend=friend,status=0)
    frnd.save()
    req = Request(userID=person,Friend=friend)
    req.save()
    return True