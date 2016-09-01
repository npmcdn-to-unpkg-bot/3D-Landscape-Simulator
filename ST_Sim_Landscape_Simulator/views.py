import os
import json
import time
from django.views.generic import TemplateView, View
from django.conf import settings
from json import encoder
from django.http import HttpResponse, JsonResponse
from stsimpy import STSimConsole
from PIL import Image

# Two decimal places when dumping to JSON
encoder.FLOAT_REPR = lambda o: format(o, '.2f')

# Declare the stsim console we want to work with
stsim = STSimConsole(lib_path=settings.ST_SIM_WORKING_LIB,
                     orig_lib_path=settings.ST_SIM_ORIG_LIB,
                     exe=settings.ST_SIM_EXE)

# Defaults for this library. Run once and hold in memory.
default_sid = stsim.list_scenarios()[0]
default_sc_path = os.path.join(settings.ST_SIM_WORKING_DIR, 'state_classes', 'state_classes.csv')
default_transitions_path = os.path.join(settings.ST_SIM_WORKING_DIR, 'probabilistic_transitions', 'original','prob_trans.csv')
all_veg_state_classes = stsim.export_veg_state_classes(default_sid,
                                                       state_class_path=default_sc_path)
all_transition_types = stsim.export_probabilistic_transitions_types(default_sid,
                                                                    transitions_path=default_transitions_path)


class HomepageView(TemplateView):

    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        context = super(HomepageView, self).get_context_data(**kwargs)

        # veg state classes
        context['veg_type_state_classes_json'] = json.dumps(all_veg_state_classes)

        # our probabilistic transition types for this application
        probabilistic_transition_types = ["Replacement Fire",
                                          "Annual Grass Invasion",
                                          "Insect/Disease",
                                          "Wind/Weather/Stress"]

        if not all(value in all_transition_types for value in probabilistic_transition_types):
            raise KeyError("Invalid transition type specified for this library. Supplied values: " +
                           str([value for value in probabilistic_transition_types]))

        probabilistic_transition_dict = {value: 0 for value in probabilistic_transition_types}
        context['probabilistic_transitions_json'] = json.dumps(probabilistic_transition_dict)
        return context


class STSimSpatialStats(View):

    DATA_TYPES = ['veg', 'stateclass']

    def __init__(self):

        self.scenario_id = None
        self.data_type = None
        super().__init__()

    def dispatch(self, request, *args, **kwargs):
        self.scenario_id = kwargs.get('scenario_id')
        self.data_type = kwargs.get('data_type')

        if self.data_type not in self.DATA_TYPES:
            raise ValueError(self.data_type + ' is not a valid data type. Types are "veg" or "stateclass".')

        return super(STSimSpatialStats, self).dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):

        # TODO - obtain from veg_state_class dictionary (from stsimpy)
        return HttpResponse(json.dumps(
            {
                'data':
                {
                    'Basin Big Sagebrush Upland': 2,
                    'Curleaf Mountain Mahogany': 3,
                    'Low Sagebrush': 4,
                    'Montane Sagebrush Upland':	5,
                    'Montane Sagebrush Upland With Trees': 6,
                    'Western Juniper Woodland & Savannah': 7,
                    'Wyoming and Basin Big Sagebrush Upland': 8
                }
            }
        ))


class STSimSpatialOutputs(View):

    DATA_TYPES = ['veg', 'stateclass']

    def __init__(self):

        self.scenario_id = None
        self.timestep = None
        self.data_type = None
        super(STSimSpatialOutputs, self).__init__()

    def dispatch(self, request, *args, **kwargs):
        self.scenario_id = kwargs.get('scenario_id')
        self.data_type = kwargs.get('data_type')
        self.timestep = kwargs.get('timestep')

        if self.data_type not in self.DATA_TYPES:
            raise ValueError(self.data_type + ' is not a valid data type. Types are "veg" or "stateclass".')

        return super(STSimSpatialOutputs, self).dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):

        # TODO - construct a path to the actual directory serving the output tifs from STSim
        image_directory = os.path.join(settings.ST_SIM_WORKING_DIR, 'initial_conditions', 'spatial')
        if self.data_type == 'veg':
            image_path = 'veg.png'
        else:
            image_path = 'stateclass_{timestep}.png'.format(timestep=self.timestep)

        image_path = os.path.join(image_directory, image_path)
        response = HttpResponse(content_type="image/png")

        # TODO - take the clipped area for this scenario and create the image dynamically

        image = Image.open(image_path)
        image.save(response, 'PNG')
        return response


class STSimSpatialRunnerView(View):

    def __init__(self):

        self.sid = None
        super().__init__()

    def post(self, request, *args, **kwargs):

        # TODO - Integrate ST-Sim and actually run the model.
        # Return the completed spatial run id, and use that ID for obtaining the resulting output timesteps' rasters
        response = {'min_step': 5,
                    'max_step': 20,
                    'step_size': 5,
                    'result_scenario_id': 123}  # TODO - replace with an actual result_scenario_id

        return JsonResponse({'data': response})

    def dispatch(self, request, *args, **kwargs):
        self.sid = kwargs.get('scenario_id')

        #if int(self.sid) != 10:   # TODO - generalize to other areas
        #    raise ValueError('Area selected for model run does not exist.')

        return super(STSimSpatialRunnerView, self).dispatch(request, *args, **kwargs)


class STSimRunnerView(View):

    def __init__(self):

        self.sid = None
        super().__init__()

    def post(self, request, *args, **kwargs):
        values_dict = json.loads(request.POST['veg_slider_values_state_class'])
        if 'probabilistic_transitions_slider_values' in request.POST:
            transitions_dict = json.loads(request.POST['probabilistic_transitions_slider_values'])
        else:
            transitions_dict = None
        return HttpResponse(json.dumps(run_st_sim(self.sid, values_dict, transitions_dict)))

    def dispatch(self, request, *args, **kwargs):
        self.sid = kwargs.get('scenario_id')
        return super(STSimRunnerView, self).dispatch(request, *args, **kwargs)


def run_st_sim(st_scenario, veg_slider_values_state_class_dict, probabilistic_transitions_slider_values_dict=None):

    # working file path
    st_model_init_conditions_file = os.path.join(settings.ST_SIM_WORKING_DIR,
                                                 "initial_conditions",
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

    if probabilistic_transitions_slider_values_dict is not None and len(probabilistic_transitions_slider_values_dict.keys()) > 0:
        user_probabilities = default_probabilities
        # adjust the values of the default probabilites
        for veg_type in user_probabilities.keys():
            for state_class in user_probabilities[veg_type]:
                transition_type = state_class['type']
                if transition_type in probabilistic_transitions_slider_values_dict.keys():
                    value = probabilistic_transitions_slider_values_dict[transition_type]
                    state_class['probability'] += value

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
    st_model_results_dir = os.path.join(settings.ST_SIM_WORKING_DIR, "model_results")
    st_model_output_file = os.path.join(st_model_results_dir, "stateclass-summary-" + st_model_output_sid + ".csv")
    results_json = json.dumps(stsim.export_stateclass_summary(sid=st_model_output_sid,
                                                              report_path=st_model_output_file))
    return {'results_json': results_json}
