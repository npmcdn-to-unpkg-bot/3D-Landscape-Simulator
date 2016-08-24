from django.conf.urls import url, include
from ST_Sim_Landscape_Simulator.views import HomepageView, STSimRunnerView
from django.views.decorators.csrf import csrf_exempt


urlpatterns = [
    # Home
    url(r'^$', HomepageView.as_view(), name='home'),

    # ST-Sim Model Runner
    url(r'^run_st_sim/(?P<scenario_id>\d+)$', csrf_exempt(STSimRunnerView.as_view()), name='run_st_sim'),
]
