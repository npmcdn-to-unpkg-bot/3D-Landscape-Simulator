import os
import csv
import json

import subprocess32 as sub_proc # for handling return codes better than os.system

from django.conf import settings
from collections import OrderedDict

#Two decimal places when dumping to JSON
from json import encoder
encoder.FLOAT_REPR = lambda o: format(o, '.2f')

from django.http import HttpResponse

from django.shortcuts import render
from django.db import connection

from django.views.decorators.gzip import gzip_page

from django.views.decorators.csrf import csrf_exempt

static_files_dir = settings.STATICFILES_DIRS[0]

@gzip_page
@csrf_exempt
def index(request):

    st_scenario=str(request.POST.get('scenario'))

    if st_scenario == "None":
        return render(request, 'index.html')

    else:
        veg_slider_values=request.POST.get('veg_slider_values')
        veg_slider_values_dict=json.loads(veg_slider_values)

        # for csv initial conditions
        # feature_id=request.POST.get('feature_id')
        # context=run_st_sim(st_scenario,feature_id)
        context=run_st_sim(st_scenario,veg_slider_values_dict)
        return HttpResponse(context)

#def run_st_sim(st_scenario,feature_id): # for csv initial conditions
def run_st_sim(st_scenario,veg_slider_values_dict):

    # TODO - handle multiple users
    st_initial_conditions_file=static_files_dir + "/st_sim/initial_conditions/user_defined_temp.csv"

    # Only for user defined initial conditions. Write initial conditions slider values to csv.
    st_initial_conditions_file_handle=open(st_initial_conditions_file,'w')
    st_initial_conditions_file_handle.write('StratumID,StateClassID,RelativeAmount\n')
    for key,value in veg_slider_values_dict.iteritems():
        st_initial_conditions_file_handle.write(key+",Ann Gr Mono:Open,"+str(value) +"\n")

    st_initial_conditions_file_handle.close()

    # Handle running under mono on linux machines
    os_prefix = 'sudo mono ' if os.name == 'posix' else ''
    st_exe= os_prefix + static_files_dir + "/deps/st_sim/syncrosim-linux-1-0-24-x64/SyncroSim.Console.exe"

    st_library_path=static_files_dir + "/st_sim/libraries"
    st_library_file="ST-Sim-Sample-V3-0-24.ssim"
    st_library=st_library_path+os.sep+st_library_file

    #print "\nRunning scenario sid:" + st_scenario
    
    # Run ST-Sim with initial conditions and user specified scenario.
    st_initial_conditions_command="--import --lib=" + st_library + \
        " --sheet=STSim_InitialConditionsNonSpatialDistribution table_name --file="  + st_initial_conditions_file +  " --sid=" + st_scenario
    sub_proc.call(st_exe + " " + st_initial_conditions_command, shell=True)

    # Run the model process
    # use Popen since we want to handle the output on the live
    st_run_model_command="--run --lib=" + st_library + " --sid="+st_scenario
    test_model_run = sub_proc.Popen(st_exe + " " + st_run_model_command, shell=True, stdout=sub_proc.PIPE)
    result = ""

    # wait for the process to end
    while True: # TODO - implement a timeout? This should be handled VERY carefully...
        out = test_model_run.stdout.read(1)
        result += out
        if out == '' and test_model_run.poll() != None:
            break;

    st_model_output_sid = result.split(" ")[-1].strip()
    st_model_results_dir=static_files_dir + "/st_sim/model_results"
    st_model_output_file="stateclass-summary-" + st_model_output_sid + ".csv"

    # Generate a report (csv) from ST-Sim for the model run above
    st_report_command=" --console=stsim --create-report --name=stateclass-summary --lib=" \
     + st_library + " --file=" + st_model_results_dir + os.sep + st_model_output_file \
     + " --sids=" + st_model_output_sid
    sub_proc.call(st_exe + " " + st_report_command, shell=True)

    # Get results out of ST-Sim csv report.
    results_dict={}
    #print "\nOutput file location: "
    #print st_model_results_dir + os.sep + st_model_output_file

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
    #print "\nResults: "
    #print results_json

    context={
        'results_json':results_json
    }

    return HttpResponse(json.dumps(context))
