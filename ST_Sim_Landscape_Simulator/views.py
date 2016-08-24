import os
import json
import time
from django.conf import settings
from json import encoder
from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.gzip import gzip_page
from django.views.decorators.csrf import csrf_exempt
from stsimpy import STSimConsole

# Two decimal places when dumping to JSON
encoder.FLOAT_REPR = lambda o: format(o, '.2f')

# Declare the stsim console we want to work with
# TODO - make this user selectable?
static_files_dir = settings.STATICFILES_DIRS[0]
st_library_path=os.path.join(static_files_dir, "st_sim", "libraries")
st_library_file="ST-Sim-Sample-V3-0-24.ssim"
st_library=os.path.join(st_library_path,st_library_file)
stsim = STSimConsole(lib_path=os.path.join(static_files_dir, st_library))

@gzip_page
@csrf_exempt
def index(request):

    st_scenario=str(request.POST.get('scenario'))

    if st_scenario == "None":

        veg_type_state_classes_json = json.dumps(stsim.export_vegstate_classes(10))
        return render(request, 'index.html', {'veg_type_state_classes_json':veg_type_state_classes_json})
        # TODO - alternatively, we can just use JsonResponse to serve up the results

    else:

        veg_slider_values_state_class=request.POST.get('veg_slider_values_state_class')
        veg_slider_values_state_class_dict=json.loads(veg_slider_values_state_class)

        # for csv initial conditions
        # feature_id=request.POST.get('feature_id')
        # context=run_st_sim(st_scenario,feature_id)
        context=run_st_sim(st_scenario, veg_slider_values_state_class_dict)
        return HttpResponse(context)


def run_st_sim(st_scenario, veg_slider_values_state_class_dict):

    stsim.import_init_conditions(sid=st_scenario,
                                 values_dict=veg_slider_values_state_class_dict,
                                 working_path=os.path.join(static_files_dir, "st_sim","initial_conditions", "user_defined_temp" + str(time.time()) + ".csv"))

    st_model_output_sid = stsim.run_model(st_scenario)
    st_model_results_dir=os.path.join(static_files_dir,"st_sim", "model_results")
    st_model_output_file=os.path.join(st_model_results_dir, "stateclass-summary-" + st_model_output_sid + ".csv")
    results_json = json.dumps(stsim.export_stateclass_summary(sid=st_model_output_sid,report_path=st_model_output_file))

    context={
        'results_json':results_json,
    }

    return HttpResponse(json.dumps(context))
