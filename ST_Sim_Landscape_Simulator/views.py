import os
import json
import time
from django.views.generic import TemplateView, View
from django.conf import settings
from json import encoder
from django.http import HttpResponse
from stsimpy import STSimConsole
from pprint import pprint

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

# defaults for this library
default_sid = stsim.list_scenarios()[0]
all_veg_state_classes = stsim.export_veg_state_classes(default_sid)
all_transition_types = stsim.export_probabilistic_transitions_types(default_sid)


class HomepageView(TemplateView):

    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        context = super(HomepageView, self).get_context_data(**kwargs)

        # veg state classes
        context['veg_type_state_classes_json'] = json.dumps(all_veg_state_classes)

        # probabilistic transition types
        probabilistic_transition_types = ["Replacement Fire", "Annual Grass Invasion", "Insect/Disease"]
        if not all(value in all_transition_types for value in probabilistic_transition_types):
            raise KeyError("Invalid transition type specified for this library. Supplied values: " +
                           str([value for value in probabilistic_transition_types]))

        context['probabilistic_transitions_json'] = json.dumps(probabilistic_transition_types)
        return context


class STSimRunnerView(View):

    def __init__(self):

        self.sid = None
        super().__init__()

    def post(self, request, *args, **kwargs):
        values_dict = json.loads(request.POST['veg_slider_values_state_class'])
        transitions_dict = json.loads(request.POST['probabilistic_transitions_slider_values_dict'])
        pprint(transitions_dict)
        return HttpResponse(json.dumps(run_st_sim(self.sid, values_dict, transitions_dict)))

    def dispatch(self, request, *args, **kwargs):
        self.sid = kwargs.get('scenario_id')
        return super(STSimRunnerView, self).dispatch(request, *args, **kwargs)


def run_st_sim(st_scenario, veg_slider_values_state_class_dict, probabilistic_transitions_slider_values_dict=None):

    # working file path
    st_model_init_conditions_file = os.path.join(static_files_dir,
                                                 "st_sim", "initial_conditions",
                                                 "user_defined_temp" + str(time.time()) + ".csv")

    # initial PVT
    stsim.import_nonspatial_distribution(sid=st_scenario,
                                         values_dict=veg_slider_values_state_class_dict,
                                         working_path=st_model_init_conditions_file)

    # probabilistic transition probabilities
    default_probabilities = stsim.export_probabilistic_transitions_map(
        sid=default_sid,
        transitions_path=st_model_init_conditions_file,
        orig=True)

    if probabilistic_transitions_slider_values_dict:
        # adjust the values of the default probabilites
        user_probabilities = default_probabilities
        for transition_type in probabilistic_transitions_slider_values_dict.keys():
            value = probabilistic_transitions_slider_values_dict[transition_type]
            user_probabilities[transition_type]['probability'] += value
        stsim.import_probabilistic_transitions(sid=st_scenario,
                                               values_dict=user_probabilities,
                                               working_path=st_model_init_conditions_file)
    else:
        # use default probabilities
        stsim.import_probabilistic_transitions(sid=st_scenario,
                                               values_dict=default_probabilities,
                                               working_path=st_model_init_conditions_file)

    # run model and collect results
    st_model_output_sid = stsim.run_model(st_scenario)
    st_model_results_dir = os.path.join(static_files_dir, "st_sim", "model_results")
    st_model_output_file = os.path.join(st_model_results_dir, "stateclass-summary-" + st_model_output_sid + ".csv")
    results_json = json.dumps(stsim.export_stateclass_summary(sid=st_model_output_sid,
                                                              report_path=st_model_output_file))
    return {'results_json': results_json}
