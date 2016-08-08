$(document).ready(function() {


    $(".current_slider_setting").val(0);

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
            $('div#pop-up').hide()
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

    // Function for moving slider bar and calling 3D function on state class entry
    $(".veg_state_class_entry").keyup(function(){
        if (typeof this.id != "undefined") {
            veg_type_id=this.id.split("_")[1]
        }
        else {
            veg_type_id = "1"
        }
        veg_type=this.closest('table').title
        veg_slider_values_state_class[veg_type]=[]
        veg_state_class_value_totals=0
        for (i = 1; i < 18; i++){
            veg_state_class_value=$("#veg_"+veg_type_id+"_"+i).val()
            veg_state_class_value_totals+=parseFloat(veg_state_class_value)
            veg_slider_values_state_class[veg_type].push(veg_state_class_value)

        }
        // To avoid initialization error
        if ($("#veg" + veg_type_id + "_slider").slider()) {
            $("#veg" + veg_type_id + "_slider").slider("value", veg_state_class_value_totals)
            // Unable to trigger slide callback on state class input
            // $('#veg1_slider').trigger('change');
            // $('#veg1_slider').trigger('slidechange');
            var this_veg_slider_value=$("#veg" + veg_type_id  + "_slider").slider("option", "value");
            veg_slider_values[veg_type]=this_veg_slider_value
            if (landscape_viewer.isInitialized()) {
                landscape_viewer.updateVegetation(veg_slider_values)
            }
        }
        $( "#veg" + veg_type_id + "_label" ).val( parseInt(veg_state_class_value_totals) + "%");
    }).keyup();

});

// Disable Run Model button on model run.
$(document).ajaxStart(function(){
    $("#run_button").addClass('disabled');
    $('input:submit').attr("disabled", true);
});

$(document).ajaxComplete(function() {
    $("#run_button").removeClass('disabled');
    $('input:submit').attr("disabled", false);
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
    //$("#results_table").empty()
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
                $("#results_table").append("<tr><th colspan='3'>County: " + feature_id + "</th></tr>");
            }
            $("#results_table").append("<tr><td class='scenario_th' colspan='3'>Scenario: " + scenario_label + "</td></tr>");

            // Create a list of all the veg types and create a sorted list.
            var veg_type_list = new Array()
            $.each(results_data_json[iteration][timestep], function(key,value){
                veg_type_list.push(key)
            })
            var sorted_veg_type_list=veg_type_list.sort()

            // Go through each sorted veg_type
            $.each(sorted_veg_type_list, function(index, value) {
                var veg_type=value
                $("#results_table").append("<tr><td class='veg_type_th' colspan='3'>" + value + " " + (results_data_json_totals[value]).toFixed(2) + "%</td></tr>");

                    // Create a list of all the state classes and create a sorted list.
                    var state_list = new Array()
                    $.each(results_data_json[iteration][timestep][value], function(key,value){
                        state_list.push(key)
                    })
                    var sorted_state_list=state_list.sort()

                    // Go through each sorted state class within the veg_type in this loop and write out the values
                    $.each(sorted_state_list, function(index,value) {
                        //console.log(key + ": " + value);
                        $("results_table").find("tr:gt(0)").remove();
                        $('#results_table').append('<tr><td>' + value + '</td><td>' + (results_data_json[iteration][timestep][veg_type][value] * 100).toFixed(1) + '%</td></tr>');
                    });
            });

            $("#running_st_sim").html("ST-Sim Model Results")


            landscape_viewer.updateVegetation(results_data_json_totals)
            previous_feature_id=feature_id

            $("#results_table").tablesorter();

        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>");
            console.log(xhr.status + ": " + xhr.responseText);
        }
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

$(function() {
    $( "#veg1_slider" ).slider({
      range: "min",
      value: veg1_slider,
      min: 0,
      max: 100,
      step:1,
      slide: function( event, ui ) {
          veg_slider_values["Basin Big Sagebrush Upland"]=ui.value
          $( "#veg1_label" ).val( ui.value + "%");
          $( "#total_input_percent").html(total_input_percent + ui.value + "%");
          total_percent_action(total_input_percent + ui.value)
          landscape_viewer.updateVegetation(veg_slider_values)

          veg_proportion1=(ui.value/18).toFixed(1)
          for (i=1; i <= 18; i++) {
              $("#veg_1_"+i).val(veg_proportion1)
          }

          veg_slider_values_state_class["Basin Big Sagebrush Upland"]=[]

      },
      start:function(event, ui){
            total_input_percent=total_input_percent-ui.value
      },
      stop:function(event, ui){
            total_input_percent=total_input_percent+ui.value

            for (i = 0; i < 18; i++){
                  veg_slider_values_state_class["Basin Big Sagebrush Upland"].push(veg_proportion1)
            }

      }
    });
});

$(function() {
  $( "#veg2_slider" ).slider({
      range: "min",
      value: veg2_slider,
      min: 0,
      max: 100,
      step:1,
      slide: function( event, ui ) {
          veg_slider_values["Curleaf Mountain Mahogany"]=ui.value
          $( "#veg2_label" ).val( ui.value + "%");
          $( "#total_input_percent").html(total_input_percent + ui.value + "%");
          total_percent_action(total_input_percent + ui.value)
          landscape_viewer.updateVegetation(veg_slider_values)

          veg_proportion2=(ui.value/18).toFixed(1)
          for (i=1; i <= 18; i++) {
              $("#veg_2_"+i).val(veg_proportion2)
          }

          veg_slider_values_state_class["Curleaf Mountain Mahogany"]=[]
      },
      start:function(event, ui){
          total_input_percent=total_input_percent-ui.value
      },
      stop:function(event, ui){
          total_input_percent=total_input_percent+ui.value

          for (i = 0; i < 18; i++){
              veg_slider_values_state_class["Curleaf Mountain Mahogany"].push(veg_proportion2)
          }
      }
  });
});

$(function() {
    $( "#veg3_slider" ).slider({
        range: "min",
        value: veg3_slider,
        min: 0,
        max: 100,
        step:1,
        slide: function( event, ui ) {
            veg_slider_values["Low Sagebrush"]=ui.value
            $( "#veg3_label" ).val( ui.value + "%");
            $( "#total_input_percent").html(total_input_percent + ui.value + "%");
            total_percent_action(total_input_percent + ui.value)
            landscape_viewer.updateVegetation(veg_slider_values)

            veg_proportion3=(ui.value/18).toFixed(1)
            for (i=1; i <= 18; i++) {
                $("#veg_3_"+i).val(veg_proportion3)
            }

            veg_slider_values_state_class["Low Sagebrush"]=[]
        },
        start:function(event, ui){
            total_input_percent=total_input_percent-ui.value
        },
        stop:function(event, ui){
            total_input_percent=total_input_percent+ui.value

            for (i = 0; i < 18; i++){
                veg_slider_values_state_class["Low Sagebrush"].push(veg_proportion3)
            }
        }
    });
});

$(function() {
    $( "#veg4_slider" ).slider({
        range: "min",
        value: veg4_slider,
        min: 0,
        max: 100,
        step:1,
        slide: function( event, ui ) {
            veg_slider_values["Montane Sagebrush Upland"]=ui.value
            $( "#veg4_label" ).val( ui.value + "%");
            $( "#total_input_percent").html(total_input_percent + ui.value + "%");
            total_percent_action(total_input_percent + ui.value)
            landscape_viewer.updateVegetation(veg_slider_values)

            veg_proportion4=(ui.value/18).toFixed(1)
            for (i=1; i <= 18; i++) {
                $("#veg_4_"+i).val(veg_proportion4)
            }

            veg_slider_values_state_class["Montane Sagebrush Upland"]=[]
        },
        start:function(event, ui){
            total_input_percent=total_input_percent-ui.value
        },
        stop:function(event, ui){
            total_input_percent=total_input_percent+ui.value

            for (i = 0; i < 18; i++){
                veg_slider_values_state_class["Montane Sagebrush Upland"].push(veg_proportion4)
            }
        }
    });
});

$(function() {
    $( "#veg5_slider" ).slider({
        range: "min",
        value: veg5_slider,
        min: 0,
        max: 100,
        step:1,
        slide: function( event, ui ) {
            veg_slider_values["Montane Sagebrush Upland With Trees"]=ui.value
            $( "#veg5_label" ).val( ui.value + "%");
            $( "#total_input_percent").html(total_input_percent + ui.value + "%");
            total_percent_action(total_input_percent + ui.value)
            landscape_viewer.updateVegetation(veg_slider_values)

            veg_proportion5=(ui.value/18).toFixed(1)
            for (i=1; i <= 18; i++) {
                $("#veg_5_"+i).val(veg_proportion5)
            }

            veg_slider_values_state_class["Montane Sagebrush Upland With Trees"]=[]
        },
        start:function(event, ui){
            total_input_percent=total_input_percent-ui.value
        },
        stop:function(event, ui){
            total_input_percent=total_input_percent+ui.value

            for (i = 0; i < 18; i++){
                veg_slider_values_state_class["Montane Sagebrush Upland With Trees"].push(veg_proportion5)
            }
        }
    });
});

$(function() {
    $( "#veg6_slider" ).slider({
        range: "min",
        value: veg6_slider,
        min: 0,
        max: 100,
        step:1,
        slide: function( event, ui ) {
            veg_slider_values["Western Juniper Woodland & Savannah"]=ui.value
            $( "#veg6_label" ).val( ui.value + "%");
            $( "#total_input_percent").html(total_input_percent + ui.value + "%");
            total_percent_action(total_input_percent + ui.value)
            landscape_viewer.updateVegetation(veg_slider_values)

            veg_proportion6=(ui.value/18).toFixed(1)
            for (i=1; i <= 18; i++) {
                $("#veg_6_"+i).val(veg_proportion6)
            }

            veg_slider_values_state_class["Western Juniper Woodland & Savannah"]=[]
        },
        start:function(event, ui){
            total_input_percent=total_input_percent-ui.value
        },
        stop:function(event, ui){
            total_input_percent=total_input_percent+ui.value

            for (i = 0; i < 18; i++){
                veg_slider_values_state_class["Western Juniper Woodland & Savannah"].push(veg_proportion6)
            }
        }
    });
});

$(function() {
    $( "#veg7_slider" ).slider({
        range: "min",
        value: veg7_slider,
        min: 0,
        max: 100,
        step:1,
        slide: function( event, ui ) {
            veg_slider_values["Wyoming and Basin Big Sagebrush Upland"]=ui.value
            $( "#veg7_label" ).val( ui.value + "%");
            $( "#total_input_percent").html(total_input_percent + ui.value + "%");
            total_percent_action(total_input_percent + ui.value)
            landscape_viewer.updateVegetation(veg_slider_values)

            veg_proportion7=(ui.value/18).toFixed(1)
            for (i=1; i <= 18; i++) {
                $("#veg_7_"+i).val(veg_proportion7)
            }

            veg_slider_values_state_class["Wyoming and Basin Big Sagebrush Upland"]=[]
        },
        start:function(event, ui){
            total_input_percent=total_input_percent-ui.value
        },
        stop:function(event, ui){
            total_input_percent=total_input_percent+ui.value

            for (i = 0; i < 18; i++){
                veg_slider_values_state_class["Wyoming and Basin Big Sagebrush Upland"].push(veg_proportion7)
            }
        }
    });
});

function total_percent_action(value){
    if (value > 100 ){
        $("#total_input_percent").css('background-color','#E47369')
    }
    else {
        $("#total_input_percent").css('background-color', 'white')
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

