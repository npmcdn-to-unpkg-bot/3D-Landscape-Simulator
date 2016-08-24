import os
import csv
import json
import time

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

        # Create dictionary of veg type/state classes
        st_state_classes_file=static_files_dir + "/st_sim/state_classes/castle_creek.csv"
        st_state_classes_reader=csv.reader(open(st_state_classes_file))
        st_state_classes_reader.next()

        veg_type_state_classes_dict={}
        for row in st_state_classes_reader:
            veg_type=row[0]
            if veg_type not in veg_type_state_classes_dict:
                veg_type_state_classes_dict[veg_type]=[]
            veg_type_state_classes_dict[veg_type].append(row[1])

        veg_type_state_classes_json=json.dumps(OrderedDict(sorted(veg_type_state_classes_dict.items(), key=lambda t: t[0])))

        return render(request, 'index.html', {'veg_type_state_classes_json':veg_type_state_classes_json})

    else:

        veg_slider_values_state_class=request.POST.get('veg_slider_values_state_class')
        veg_slider_values_state_class_dict=json.loads(veg_slider_values_state_class)

        fire_slider=(float(request.POST.get('fire_slider'))/100)

        # for csv initial conditions
        # feature_id=request.POST.get('feature_id')
        # context=run_st_sim(st_scenario,feature_id)
        context=run_st_sim(st_scenario, veg_slider_values_state_class_dict,fire_slider)
        return HttpResponse(context)

#def run_st_sim(st_scenario,feature_id): # for csv initial conditions
def run_st_sim(st_scenario, veg_slider_values_state_class_dict, fire_slider):

    st_initial_conditions_file=static_files_dir + "/st_sim/initial_conditions/user_defined_temp" + str(time.time()) +".csv"

    # Only for user defined initial conditions. Write initial conditions slider values to csv.
    st_initial_conditions_file_handle=open(st_initial_conditions_file,'w')
    st_initial_conditions_file_handle.write('StratumID,StateClassID,RelativeAmount\n')
    # Random state class. Values directly from sliders
    #for key,value in veg_slider_values_dict.iteritems():
    #    st_initial_conditions_file_handle.write(key+",Ann Gr Mono:Open,"+str(value) +"\n")

    for veg_type,state_class_dict in veg_slider_values_state_class_dict.iteritems():
        print veg_type,state_class_dict
        for state_class,value in state_class_dict.iteritems():
            st_initial_conditions_file_handle.write(veg_type+","+state_class+"," + value +"\n")

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
        " --sheet=STSim_InitialConditionsNonSpatialDistribution --file="  + st_initial_conditions_file +  " --sid=" + st_scenario
    sub_proc.call(st_exe + " " + st_initial_conditions_command, shell=True)

    os.remove(st_initial_conditions_file)

    # Define probabalistic transitions
    st_probabalistic_transitions_file_original=static_files_dir + "/st_sim/probabalistic_transitions/original/castle_creek_probabalistic_transitions.csv"

    if fire_slider >= 0:

        file_reader=csv.reader(open(st_probabalistic_transitions_file_original))

        st_probabalistic_transitions_file_user_defined=static_files_dir + "/st_sim/probabalistic_transitions/user_defined/castle_creek_probabalistic_transitions.csv"
        st_probabalistic_transitions_file_user_defined_handle=open(st_probabalistic_transitions_file_user_defined, "wb")
        file_writer=csv.writer(st_probabalistic_transitions_file_user_defined_handle)

        # The required field header names don't match what you get when you export to an Excel file.
        # Need to get field names with SyncroSim.Console.exe --export --lib=<lib name> --file=<output file> --sheet=STSim_Transition --pid=2 --sid=10
        st_probabalistic_transitions_field_headers=["StratumIDSource", "StateClassIDSource", "StratumIDDest", "StateClassIDDest", "TransitionTypeID", "Probability", "Proportion", "AgeMin", "AgeMax", "AgeRelative", "AgeReset", "TSTMin", "TSTMax", "TSTRelative"]
        file_writer.writerow(st_probabalistic_transitions_field_headers)

        file_reader.next()

        for line in file_reader:
            new_array=line
            if line[4] == 'Replacement Fire':
                new_array[5]=fire_slider
            print new_array
            file_writer.writerow(new_array)

        st_probabalistic_transitions_file_user_defined_handle.close()
        # Import probabalistic transitions into user specified scenario.
        st_probabalistic_transitions_command ="--import --lib=" + st_library + \
                                      " --sheet=STSim_Transition --file=" + st_probabalistic_transitions_file_user_defined + " --sid=" + st_scenario
    else:
        print "default"
        st_probabalistic_transitions_command ="--import --lib=" + st_library + \
                                              " --sheet=STSim_Transition --file=" + st_probabalistic_transitions_file_original + " --sid=" + st_scenario

    sub_proc.call(st_exe + " " + st_probabalistic_transitions_command, shell=True)

    print st_probabalistic_transitions_command

    # Run the model process
    # use Popen since we want to handle the output on the live
    st_run_model_command="--run --lib=" + st_library + " --sid="+st_scenario
    print st_exe + " " + st_run_model_command
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


    results_dict={}
    for row in reader:
        if row[1] not in results_dict:
            # Iteration
            results_dict[row[1]]={}
        if row[2] not in results_dict[row[1]]:
            # Timestep
            results_dict[row[1]][row[2]]={}
        if row[3] not in results_dict[row[1]][row[2]]:
            # Stratum
            results_dict[row[1]][row[2]][row[3]]={}
        results_dict[row[1]][row[2]][row[3]][row[5]]=row[9]

    #print results_dict['1']

    sorted_dict=OrderedDict(sorted(results_dict.items(), key=lambda t: t[0]))
    results_json=json.dumps(sorted_dict)
    #print "\nResults: "
    #print results_json

    context={
        'results_json':results_json,
    }

    return HttpResponse(json.dumps(context))
