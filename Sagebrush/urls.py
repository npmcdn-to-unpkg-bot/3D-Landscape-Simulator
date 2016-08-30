from django.conf.urls import url, include
from django.contrib.staticfiles.urls import staticfiles_urlpatterns


urlpatterns = [
    # Frontend application
    url(r'^', include('ST_Sim_Landscape_Simulator.urls')),

    # Heightmap Service
    url(r'^', include('Heightmaps.urls')),
]

urlpatterns += staticfiles_urlpatterns()
