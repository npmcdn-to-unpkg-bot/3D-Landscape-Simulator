from django.conf.urls import url, include
from Heightmaps.views import Heightmap, Stats


heightmap_path = r'^heightmap/(?P<nlat>\d+\.\d+)/(?P<slat>\d+\.\d+)/(?P<elon>\-\d+\.\d+)/(?P<wlon>\-\d+\.\d+)/'

urlpatterns = [
    url(heightmap_path, include([
        url('^$', Heightmap.as_view(), name='heightmap-src'),
        url('^stats/$', Stats.as_view(), name='heightmap-stats'),
    ]))
]