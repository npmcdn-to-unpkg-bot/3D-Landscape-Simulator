$(document).ready(function() {
    // Tooltip popup on management scenarios
    $(".scenario_radio_label").hover(function(e) {
        var moveLeft = 50;
        var moveDown = -20;
        $("div#pop-up").html(this.id);
        $('div#pop-up').show();

       $('.scenario_radio_label').mousemove(function(e) {
              $("div#pop-up").css('top', e.pageY + moveDown).css('left', e.pageX + moveLeft);
            });

      // On mouse out
    },function(e){
            $('div#pop-up').hide();
            $(this).css("background-color", "white");
        }
    );

    $(".show_state_classes_link").click(function() {
        if ($(this).siblings(".sub_slider_text_inputs").is(":visible")) {
            $(this).html(" <img class='dropdown_arrows' src='"+static_url+"img/down_arrow.png'>")
            $(this).siblings(".sub_slider_text_inputs").hide()
        }
        else {
            $(this).html(" <img class='dropdown_arrows' src='"+static_url+"img/up_arrow.png'>")
            $(this).siblings(".sub_slider_text_inputs").show()
        }
    });

    // On state class value entry move slider bar and call 3D function on state class entry
    $(".veg_state_class_entry").keyup(function(){

        veg_type_id=this.id.split("_")[1];
        veg_type=this.closest('table').title;

        //Subtract the current slider value from the total percent
        //total_input_percent=total_input_percent - veg_slider_values[veg_type]
        total_input_percent = total_input_percent - veg_slider_values[veg_type];

        veg_slider_values_state_class[veg_type]={};
        veg_state_class_value_totals=0.0;

        // On keyup, go through each state class in the given veg type and add the values in each text entry field to the veg_slider_values_state_class dictionary
        $.each(veg_type_state_classes_json[veg_type],function(index, state_class){
            var veg_state_class_id=index+1
            var veg_state_class_value=$("#veg_"+veg_type_id+"_"+veg_state_class_id).val()
            if (veg_state_class_value == ''){
                veg_state_class_value = 0;
            }
            veg_state_class_value_totals+=parseFloat(veg_state_class_value)
            veg_slider_values_state_class[veg_type][state_class]=veg_state_class_value

        })

        // To avoid initialization error
        if ($("#veg" + veg_type_id + "_slider").slider()) {
            $("#veg" + veg_type_id + "_slider").slider("value", veg_state_class_value_totals)
            var this_veg_slider_value=$("#veg" + veg_type_id  + "_slider").slider("option", "value");
            veg_slider_values[veg_type]=this_veg_slider_value
            if (landscape_viewer.isInitialized()) {
                landscape_viewer.updateVegetation(veg_slider_values)
            }
        }


        $( "#veg" + veg_type_id + "_label" ).val( veg_state_class_value_totals.toFixed(0) + "%");

        //Add the current slider value from the total percent
        //total_input_percent=total_input_percent + veg_slider_values[veg_type]
        //total_input_percent = total_input_percent + $("#veg" + veg_type_id + "_slider").slider("option", "value");

        total_input_percent = total_input_percent + veg_slider_values[veg_type];

        if (veg_state_class_value_totals > 100){

            $("#total_input_percent").html(">100%");
            total_percent_action(9999)

        }

        else {

            $("#total_input_percent").html(total_input_percent.toFixed(0) + "%");
            total_percent_action(total_input_percent.toFixed(0))

        }

        if (total_input_cover != 100) {
            $("#run_button").addClass('disabled');
            $('input:submit').attr("disabled", true);
        }



    });

});

$(window).load(function(){
    $(".current_slider_setting").val(0);
});

// Disable Run Model button on model run.
$(document).ajaxStart(function(){
    $("#run_button").addClass('disabled');
    $('input:submit').attr("disabled", true);
});

function show_input_options (){

    //$("#scene").html("<img style='position:relative; top:-10px; border-radius:6px;width:100%' src='" + static_url + "img/3D_scene.png'>")

    $("#selected_features").html("Currently Selected: " + feature_id);

    $("#selected_features").animate({backgroundColor: '#DBDBDB'}, 400, function() {
        $('#selected_features').animate({backgroundColor: 'white'}, 400);
    });

    $("#input_initial_veg").show();
    $("#input_management_scenario").show();

    $("#run_button").on("click", function(){
            run_st_sim(feature_id)
        }
    );

    $("#scene").show()
    $("#map").hide()
    $("#button_list").css("visibility", "visible")

    landscape_viewer.resize()

    $("#run_button").show();

    // Set the second tab (3D) to the selected tab.
    $("#map_button").removeClass("selected")
    $("#scene_button").addClass("selected")

}

iteration=1
timestep=0

// Send the scenario and initial conditions to ST-Sim.
function run_st_sim(feature_id) {

    $(document).ajaxStart(function(){
        $("#run_button").val('Please Wait...');
        $("#running_st_sim").show()
    });
    //$("#results_table").empty()
    $("#runnin_st_sim").show()
    $("#output").show()
    $("#results_loading").html("<img src='"+static_url + "img/spinner.gif'>")
    var scenario=$("input[name=scenario]:checked").val()
    veg_slider_values_string=JSON.stringify(veg_slider_values)
    veg_slider_values_state_class_string=JSON.stringify(veg_slider_values_state_class)

    $.ajax({
        url: "", // the endpoint (for a specific view configured in urls.conf /view_name/)
        type: "POST", // http method
        //data: {'scenario': scenario, 'veg_slider_values':veg_slider_values_string, 'veg_slider_values_state_class':veg_slider_values_state_class_string},
        data: {'scenario': scenario, 'veg_slider_values_state_class':veg_slider_values_state_class_string},

        // handle a successful response
        success: function (json) {
            $("#results_loading").empty()
            var response = JSON.parse(json)
            results_data_json = JSON.parse(response["results_json"])
            var scenario_label = $("input:checked + label").text();

            update_results_table(scenario_label, timestep)

            landscape_viewer.updateVegetation(results_data_json_totals)
            previous_feature_id=feature_id

            create_area_charts(results_data_json)

        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>");
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });

    // Required here in order to disable button on page load.

    $(document).ajaxComplete(function() {
        $("#run_button").val('Run Model');
        $("#run_button").removeClass('disabled');
        $('input:submit').attr("disabled", false);
    });

}

function update_results_table(scenario_label, timestep) {

     // sum state class values for display in scene and table header
    results_data_json_totals={}
    $.each(results_data_json[iteration][timestep], function(key,value){
        var total=0
        $.each(value, function(state_class,pct_cover) {
            total = total+parseFloat(pct_cover)
        });
        results_data_json_totals[key] = total * 100
    });

    // Create the Results Table
    if (typeof previous_feature_id == "undefined" || previous_feature_id != feature_id) {
        $("#results_table").append("<tr><th colspan='3'>Location: " + feature_id + "</th></tr>");
    }

    $("#results_table").append("<tr class='veg_type_percent_tr'><td class='scenario_th' colspan='3'>Scenario: " + scenario_label + "</td></tr>");

    $("#selected_location_table").html("<tr><th colspan='3'>County: " + feature_id + "</th></tr>");
    $("#selected_location_table").append("<tr class='veg_type_percent_tr'><td class='scenario_th' colspan='3'>Scenario: " + scenario_label + "</td></tr>");

    // Create a list of all the veg types and create a sorted list.
    var veg_type_list = new Array()
    $.each(results_data_json[iteration][timestep], function(key,value){
        veg_type_list.push(key)
    })

    var sorted_veg_type_list = veg_type_list.sort()

    $("#running_st_sim").html("ST-Sim Model Results")

    // Go through each sorted veg_type
    $.each(sorted_veg_type_list, function (index, value) {

        var veg_type = value

        // Write veg type and % headers
       //$("#results_table").append("<tr class='veg_type_percent_tr'><td class='veg_type_th' colspan='3'>" + value + " " + (results_data_json_totals[value]).toFixed(1) + "%" +
        $("#results_table").append("<tr class='veg_type_percent_tr'><td class='veg_type_th' colspan='3'>" + value +
            "<span class='show_state_classes_results_link'> <img class='dropdown_arrows' src='" + static_url + "img/down_arrow.png'></span>" +
            "</td></tr>");

        // Create a list of all the state classes and create a sorted list.
        var state_list = new Array()
        $.each(results_data_json[iteration][timestep][value], function (key, value) {
            state_list.push(key)
        })

        var sorted_state_list = state_list.sort()

        // Go through each sorted state class within the veg_type in this loop and write out the values
        $.each(sorted_state_list, function (index, value) {
            $("results_table").find("tr:gt(0)").remove();
            $('#results_table').append('<tr class="state_class_tr"><td>' + value + '</td><td>' + (results_data_json[iteration][timestep][veg_type][value] * 100).toFixed(1) + '%</td></tr>');
        });

    });

    // Show/Hide state class data
    $('.show_state_classes_results_link').unbind('click');
    $('.show_state_classes_results_link').click(function () {

        if ($(this).children('img').attr('src') == '/static/img/down_arrow.png') {

            $(this).children('img').attr('src', '/static/img/up_arrow.png')
        }
        else {
            $(this).children('img').attr('src', '/static/img/down_arrow.png')
        }
        $(this).closest('tr').nextUntil('tr.veg_type_percent_tr').slideToggle(0);
    });
}

/*************************************************** Slider bars  ****************************************************/

//initialize default values. Change the default labels above as well.
var enable_environment_settings=false;
var veg1_slider=0;
var veg2_slider=0;
var veg3_slider=0;
var veg4_slider=0;
var veg5_slider=0;
var veg6_slider=0;
var veg7_slider=0;

var total_input_percent=0;

var veg_slider_values={
    "Basin Big Sagebrush Upland":veg1_slider,
    "Curleaf Mountain Mahogany":veg2_slider,
    "Low Sagebrush":veg3_slider,
    "Montane Sagebrush Upland":veg4_slider,
    "Montane Sagebrush Upland With Trees":veg5_slider,
    "Western Juniper Woodland & Savannah":veg6_slider,
    "Wyoming and Basin Big Sagebrush Upland":veg7_slider
};

var landscape_viewer = require('app').default('scene', veg_slider_values);

var veg_slider_values_state_class={}


veg_iteration=1;

$.each(veg_type_state_classes_json, function (veg_type, state_class_list) {

    // Count the number of state classes
    var state_class_count=state_class_list.length

    //Create a skeleton to house the intital conditions slider bar and  state class input table.
    veg_table_id=veg_type.replace(/ /g, "_").replace(/&/g, "__")
    $("#sliderTable").append("<tr><td><label for='amount_veg1'><span class='imageOverlayLink'>" + veg_type + " </span></label>" +
        "<input type='text' id='veg" + veg_iteration + "_label' class='current_slider_setting' readonly>" +
        "<span class='show_state_classes_link'> <img class='dropdown_arrows' src='" + static_url + "img/down_arrow.png'></span>" +
        "<div class='slider_bars' id='veg" + veg_iteration + "_slider'></div>" +
        "<div class='sub_slider_text_inputs' style='display:none'>" +
        "<table id='" + veg_table_id + "' class='sub_slider_table' title='" + veg_type  + "'><table>" +
        "</div></td></tr>"
    );

    // Create a slider bar
    create_slider(veg_iteration, veg_type, state_class_count)

    // Make a row for each state class.
    var state_class_count=1;
    $.each(state_class_list, function (index, state_class) {
        $("#"+veg_table_id).append("<tr><td>" + state_class + " </td><td><input class='veg_state_class_entry' id='" + "veg_"  + veg_iteration + "_" + state_class_count + "' type='text' size='2' value='0'>%</td></tr>" )
        state_class_count++
    });

    $("#sliderTable").append("</td></td>")

    veg_iteration++;

});

slider_values={}
veg_proportion={}

function create_slider(iterator, veg_type, state_class_count) {

    $(function () {
        slider_values[iterator] = 0
        veg_proportion[iterator] = 0
        counter_variable = "veg" + iterator + "_slider"

        $("#veg" + iterator + "_slider").slider({
            range: "min",
            value: slider_values[iterator],
            min: 0,
            max: 100,
            step:1,
            slide: function (event, ui) {
                veg_slider_values[veg_type] = ui.value
                $("#veg" + iterator + "_label").val(ui.value + "%");
                $("#total_input_percent").html(total_input_percent + ui.value + "%");
                total_percent_action(total_input_percent + ui.value)

                landscape_viewer.updateVegetation(veg_slider_values)

                // Populate state class values equally
                veg_proportion[iterator] = (ui.value / state_class_count).toFixed(2)
                for (i = 1; i <= state_class_count; i++) {
                    $("#veg_" + iterator + "_" + i).val(veg_proportion[iterator])
                }

                veg_slider_values_state_class[veg_type] = {}
            },
            start: function (event, ui) {
                total_input_percent = total_input_percent - ui.value
            },
            stop: function (event, ui) {
                total_input_percent = total_input_percent + ui.value

                $.each(veg_type_state_classes_json[veg_type], function (index, state_class)
                {
                    veg_slider_values_state_class[veg_type][state_class]=veg_proportion[iterator]

                })

            }
        });

    });
}

function total_percent_action(value){
    if (value == 100 ){
        $("#total_input_percent").css('background-color', '#1EBA36')
        $("#total_input_percent").css('color', 'white')
        $("#run_button").removeClass('disabled');
        $('input:submit').attr("disabled", false);
        $("#run_button").val('Run Model');
    }
    else {
        $("#total_input_percent").css('background-color','#E47369')
        $("#total_input_percent").css('color', '#444343')
        $("#run_button").addClass('disabled');
        $('input:submit').attr("disabled", true);
        $("#run_button").val('Total Percent Cover Must Equal 100%');
    }
}

function activate_map() {
    $("#map_button").addClass("selected")
    $("#scene_button").removeClass("selected")
    $("#map").show()
    $("#scene").hide()
}

function activate_scene(){
    $("#map_button").removeClass("selected")
    $("#scene_button").addClass("selected")
    $("#scene").show()
    $("#map").hide()

}

