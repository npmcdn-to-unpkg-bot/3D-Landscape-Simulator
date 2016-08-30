from django.conf.urls import url, include
from Heightmaps.views import generate_heightmap, heightmap_stats

heightmap_path = r'^heightmap/(?P<nlat>\d+\.\d+)/(?P<slat>\d+\.\d+)/(?P<elon>\-\d+\.\d+)/(?P<wlon>\-\d+\.\d+)/'

urlpatterns = [
    url(heightmap_path, include([
        url('^$', generate_heightmap, name='heightmap-src'),
        url('^stats/$', heightmap_stats, name='heightmap-stats'),
    ]))
]