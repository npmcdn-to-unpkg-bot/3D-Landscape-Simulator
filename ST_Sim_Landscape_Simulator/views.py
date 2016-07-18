import os
import csv
import json

from collections import OrderedDict

#Two decimal places when dumping to JSON
from json import encoder
encoder.FLOAT_REPR = lambda o: format(o, '.2f')

from django.http import HttpResponse

from django.shortcuts import render
from django.db import connection

from django.views.decorators.gzip import gzip_page

from django.views.decorators.csrf import csrf_exempt

@gzip_page
@csrf_exempt
def index(request):
    st_scenario=str(request.POST.get('scenario'))
    if st_scenario == "None":
        return render(request, 'index.html')
    else:
        initial_conditions_data=request.POST.get('initial_conditions_data')
        context=run_st_sim(st_scenario,initial_conditions_data)
        return HttpResponse(context)


def run_st_sim(st_scenario,initial_conditions_data):

    print initial_conditions_data

    st_initial_conditions_file="F:/Projects2/OSU_BLM_Sagebrush2016/Tasks/Web_Applications/Landscape_Simulator/3D_Landscape_Simulator/Sagebrush/static/st_sim/initial_conditions/initial_conditions_temp.csv"

    st_initial_conditions_file_handle=open(st_initial_conditions_file,'w')
    for line in initial_conditions_data:
        st_initial_conditions_file_handle.write(line)

    st_initial_conditions_file_handle.close()

    st_exe="F:/Projects2/OSU_BLM_Sagebrush2016/Tasks/Web_Applications/Landscape_Simulator/3D_Landscape_Simulator/Sagebrush/static/deps/st_sim/syncrosim-linux-1-0-24-x64/SyncroSim.Console.exe"
    st_library_path="F:/Projects2/OSU_BLM_Sagebrush2016/Tasks/Web_Applications/Landscape_Simulator/3D_Landscape_Simulator/Sagebrush/static/st_sim/libraries"
    st_library_file="ST-Sim-Sample-V3-0-24.ssim"
    st_library=st_library_path+os.sep+st_library_file

    print "Running scenario sid:" + st_scenario
    # Initial Conditions
    st_initial_conditions_command="--import --lib=" + st_library + " --sheet=STSim_InitialConditionsNonSpatialDistribution table_name --file="  + st_initial_conditions_file +  " --sid=" + st_scenario
    os.system(st_exe + " " + st_initial_conditions_command)

    st_run_model_command="--run --lib=" + st_library + " --sid="+st_scenario

    st_model_output_sid=str(os.system(st_exe + " " + st_run_model_command))
    print st_model_output_sid

    st_model_results_dir=r"F:\Projects2\OSU_BLM_Sagebrush2016\Tasks\Web_Applications\Landscape_Simulator\3D_Landscape_Simulator\Sagebrush\static\st_sim\model_results"

    st_model_output_file="stateclass-summary-" +str(st_model_output_sid)+ ".csv"

    st_report_command=" --console=stsim --create-report --name=stateclass-summary --lib=" + st_library + " --file=" + st_model_results_dir + os.sep + st_model_output_file + " --sids=" + st_model_output_sid

    os.system(st_exe + " " + st_report_command)

    results_dict={}

    reader=csv.reader(open(st_model_results_dir + os.sep + st_model_output_file))
    reader.next()

    for row in reader:
        key=row[3]
        if key in results_dict:
            results_dict[key]=results_dict[key]+ float(row[9])
        else:
            results_dict[key]=float(row[9])

    rounded_dict = {k:round(v,1) for k, v in results_dict.items()}
    sorted_dict=OrderedDict(sorted(rounded_dict.items(), key=lambda t: t[0]))
    results_json=json.dumps(sorted_dict)
    print results_json

    context={
        'results_json':results_json
    }

    return HttpResponse(json.dumps(context))


