from django.conf.urls import patterns, include, url

from ST_Sim_Landscape_Simulator import views
from Heightmaps.views import generate_heightmap

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'Sagebrush.views.home', name='home'),
    # url(r'^Sagebrush/', include('Sagebrush.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
    url(r'^run_st_sim$', views.run_st_sim, name='st_sim'),
    url(r'^$', views.index, name='index'),

    # Heightmap generation service
    url(r'^heightmap/(?P<nlat>\d+\.\d+)/(?P<slat>\d+\.\d+)/(?P<elon>\-\d+\.\d+)/(?P<wlon>\-\d+\.\d+)$',
                    generate_heightmap, name='heightmap'),
)
