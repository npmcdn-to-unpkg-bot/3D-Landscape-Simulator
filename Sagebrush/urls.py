from django.conf.urls import url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from ST_Sim_Landscape_Simulator.views import HomepageView, STSimRunnerView
from Heightmaps.views import generate_heightmap, heightmap_stats
from django.views.decorators.csrf import csrf_exempt

# TODO - place this in Heightmaps?
heightmap_path = r'^heightmap/(?P<nlat>\d+\.\d+)/(?P<slat>\d+\.\d+)/(?P<elon>\-\d+\.\d+)/(?P<wlon>\-\d+\.\d+)'

urlpatterns = [
    # Frontend application
    url(r'^$', HomepageView.as_view(), name='home'),

    # ST-Sim Model Runner
    url(r'^run_st_sim/(?P<scenario_id>\d+)$', csrf_exempt(STSimRunnerView.as_view()), name='run_st_sim'),

    # Heightmap generation
    url(heightmap_path + '$', generate_heightmap, name='heightmap-src'),
    url(heightmap_path + '/stats$', heightmap_stats, name='heightmap-stats'),
]

urlpatterns += staticfiles_urlpatterns()
