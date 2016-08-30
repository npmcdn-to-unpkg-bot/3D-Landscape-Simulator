import os
import csv
import json
import time
from shutil import copyfile

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

        # Selectively choose transition types to expose.
        probabilistic_transition_types=["Replacement Fire", "Annual Grass Invasion","Insect/Disease", "Wind/Weather/Stress"]
        probabilistic_transitions_dict={}
        for transition_type in probabilistic_transition_types:
            if transition_type not in probabilistic_transitions_dict:
                probabilistic_transitions_dict[transition_type]=0

        probabilistic_transitions_json=json.dumps(OrderedDict(sorted(probabilistic_transitions_dict.items(), key=lambda t: t[0])))

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

        return render(request, 'index.html', {'veg_type_state_classes_json':veg_type_state_classes_json, 'probabilistic_transitions_json': probabilistic_transitions_json})

    else:

        veg_slider_values_state_class=request.POST.get('veg_slider_values_state_class')
        veg_slider_values_state_class_dict=json.loads(veg_slider_values_state_class)

        probabilistic_transitions_slider_values=request.POST.get('probabilistic_transitions_slider_values')
        probabilistic_transitions_slider_values_dict=json.loads(probabilistic_transitions_slider_values)

        print probabilistic_transitions_slider_values_dict

        # for csv initial conditions
        # feature_id=request.POST.get('feature_id')
        # context=run_st_sim(st_scenario,feature_id)
        context=run_st_sim(st_scenario, veg_slider_values_state_class_dict, probabilistic_transitions_slider_values_dict)
        return HttpResponse(context)

#def run_st_sim(st_scenario,feature_id): # for csv initial conditions
def run_st_sim(st_scenario, veg_slider_values_state_class_dict, probabilistic_transitions_slider_values_dict):

    unique_session_id=str(time.time())

    ############################################ ST-Sim Configuration #################################################

    # Handle running under mono on linux machines
    os_prefix = 'sudo mono ' if os.name == 'posix' else ''
    st_exe= os_prefix + static_files_dir + "/deps/st_sim/syncrosim-linux-1-0-24-x64/SyncroSim.Console.exe"

    st_library_path=static_files_dir + "/st_sim/libraries"
    st_library_file="ST-Sim-Sample-V3-0-24.ssim"
    st_library=st_library_path+os.sep+st_library_file


    ############################################## Define initial conditions ###########################################

    st_initial_conditions_file=static_files_dir + "/st_sim/initial_conditions/user_defined_temp" + unique_session_id +".csv"

    # Only for user defined initial conditions. Write initial conditions slider values to csv.
    st_initial_conditions_file_handle=open(st_initial_conditions_file,'w')
    st_initial_conditions_file_handle.write('StratumID,StateClassID,RelativeAmount\n')

    for veg_type,state_class_dict in veg_slider_values_state_class_dict.iteritems():
        print veg_type,state_class_dict
        for state_class,value in state_class_dict.iteritems():
            st_initial_conditions_file_handle.write(veg_type+","+state_class+"," + value +"\n")

    st_initial_conditions_file_handle.close()

    st_initial_conditions_command="--import --lib=" + st_library + \
        " --sheet=STSim_InitialConditionsNonSpatialDistribution --file="  + st_initial_conditions_file +  " --sid=" + st_scenario
    sub_proc.call(st_exe + " " + st_initial_conditions_command, shell=True)

    os.remove(st_initial_conditions_file)

    ########################################## Define probabilistic transitions ########################################

    st_probabilistic_transitions_file_original=static_files_dir + "/st_sim/probabilistic_transitions/original/castle_creek_probabilistic_transitions.csv"

    if not probabilistic_transitions_slider_values_dict or all(value == 0 for value in probabilistic_transitions_slider_values_dict.values()):

        print "Using default probabilities"
        st_probabilistic_transitions_command ="--import --lib=" + st_library + \
                                              " --sheet=STSim_Transition --file=" + st_probabilistic_transitions_file_original + " --sid=" + st_scenario
        sub_proc.call(st_exe + " " + st_probabilistic_transitions_command, shell=True)

    else:

        print "Using user defined probabilities"
        st_probabilistic_transitions_file_user_defined=static_files_dir + "/st_sim/probabilistic_transitions/user_defined/castle_creek_probabilistic_transitions_" + unique_session_id + ".csv"
        copyfile(st_probabilistic_transitions_file_original,st_probabilistic_transitions_file_user_defined)

        file_reader=csv.reader(open(st_probabilistic_transitions_file_original))
        st_probabilistic_transitions_file_user_defined_handle=open(st_probabilistic_transitions_file_user_defined, "wb")
        file_writer=csv.writer(st_probabilistic_transitions_file_user_defined_handle)

        for key,value in probabilistic_transitions_slider_values_dict.iteritems():
            for line in file_reader:
                new_array=line
                if line[4] == key:
                    new_array[5]=float(new_array[5])+value
                file_writer.writerow(new_array)

        st_probabilistic_transitions_file_user_defined_handle.close()
        # Import probabilistic transitions into user specified scenario.
        st_probabilistic_transitions_command ="--import --lib=" + st_library + \
                                      " --sheet=STSim_Transition --file=" + st_probabilistic_transitions_file_user_defined + " --sid=" + st_scenario
        sub_proc.call(st_exe + " " + st_probabilistic_transitions_command, shell=True)

        os.remove(st_probabilistic_transitions_file_user_defined)


    ################################################## Run ST-Sim ######################################################

    # Run ST-Sim with initial conditions, probabilistic transitions, and user specified scenario.
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
    st_model_output_filename="stateclass-summary-" + st_model_output_sid + ".csv"
    st_model_output_file=st_model_results_dir + os.sep + st_model_output_filename

    # Generate a report (csv) from ST-Sim for the model run above
    st_report_command=" --console=stsim --create-report --name=stateclass-summary --lib=" \
     + st_library + " --file=" + st_model_output_file \
     + " --sids=" + st_model_output_sid
    sub_proc.call(st_exe + " " + st_report_command, shell=True)

    # Get results out of ST-Sim csv report.
    results_dict={}
    #print "\nOutput file location: "
    #print st_model_results_dir + os.sep + st_model_output_file

    st_model_output_filehandle=open(st_model_output_file)
    reader=csv.reader(st_model_output_filehandle)
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

    st_model_output_filehandle.close()
    os.remove(st_model_output_file)

    context={
        'results_json':results_json,
    }

    return HttpResponse(json.dumps(context))
