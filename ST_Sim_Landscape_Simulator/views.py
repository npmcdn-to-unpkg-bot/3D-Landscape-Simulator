import os
import json
import time
from django.views.generic import TemplateView, View
from django.conf import settings
from json import encoder
from django.http import HttpResponse
from stsimpy import STSimConsole

# Two decimal places when dumping to JSON
encoder.FLOAT_REPR = lambda o: format(o, '.2f')

# Declare the stsim console we want to work with
# TODO - make the library user selectable? Could be selected when we choose ecoregions...
static_files_dir = settings.STATICFILES_DIRS[0]
st_exe = os.path.join(static_files_dir, "deps", "st_sim", "syncrosim-linux-1-0-24-x64", "SyncroSim.Console.exe" )
st_library_path = os.path.join(static_files_dir, "st_sim", "libraries")
st_library_file = "ST-Sim-Sample-V3-0-24.ssim"
st_library = os.path.join(st_library_path, st_library_file)
stsim = STSimConsole(lib_path=os.path.join(static_files_dir, st_library),
                     exe=st_exe)


class HomepageView(TemplateView):

    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        context = super(HomepageView, self).get_context_data(**kwargs)
        default_sid = stsim.list_scenarios()[0]
        context['veg_type_state_classes_json'] = json.dumps(stsim.export_vegstate_classes(default_sid))
        return context


class STSimRunnerView(View):

    http_method_names = ['post']

    def __init__(self):

        self.sid = None
        super().__init__()

    def post(self, request, *args, **kwargs):
        values_dict = json.loads(request.POST['veg_slider_values_state_class'])
        return HttpResponse(json.dumps(run_st_sim(self.sid, values_dict)))

    def dispatch(self, request, *args, **kwargs):
        self.sid = kwargs.get('scenario_id')
        return super(STSimRunnerView, self).dispatch(request, *args, **kwargs)


def run_st_sim(st_scenario, veg_slider_values_state_class_dict):

    st_model_init_conditions_file = os.path.join(static_files_dir,
                                                 "st_sim", "initial_conditions",
                                                 "user_defined_temp" + str(time.time()) + ".csv")
    stsim.import_distribution_conditions(sid=st_scenario,
                                         values_dict=veg_slider_values_state_class_dict,
                                         working_path=st_model_init_conditions_file)
    st_model_output_sid = stsim.run_model(st_scenario)
    st_model_results_dir = os.path.join(static_files_dir, "st_sim", "model_results")
    st_model_output_file = os.path.join(st_model_results_dir, "stateclass-summary-" + st_model_output_sid + ".csv")
    results_json = json.dumps(stsim.export_stateclass_summary(sid=st_model_output_sid,
                                                              report_path=st_model_output_file))
    return {'results_json': results_json}
