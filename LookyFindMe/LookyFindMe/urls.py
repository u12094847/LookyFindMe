from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'LookyFindMe.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'login', 'web_services.views.login', name = 'login'),
    url(r'register', 'web_services.views.register', name = 'registerNewUser'),
)
