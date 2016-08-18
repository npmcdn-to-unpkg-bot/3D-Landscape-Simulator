// Colors used in the chart.
colors=[
    "#9CC7F0",
    "#717175",
    "#ABF19D",
    "#F8B984",
    "#9FA3EE",
    "#F4849F",
    "#EADD7E",
    "#5FABAA",
    "#F68383",
    "#ACEDE8",
    "#CBC77A",
    "#9AB17A",
    "#BB845B"
];


// Makes state class colors consistent across all charts.
i=0;
state_class_color_map={};
$.each(veg_type_state_classes_json, function(veg_type,state_classes){

    $.each(state_classes, function(index, state_class){
        if (typeof state_class_color_map[state_class] == "undefined") {
            state_class_color_map[state_class] = colors[i]
        }
        i++
    });
});

function createAreaChart(veg_type, chart_div_id) {

    $(function () {
       $('#' + chart_div_id).highcharts({
            chart: {
                type: 'area',
                width:327,
                height:290,
                marginBottom: 50,
                marginLeft:60,
                marginRight:25,
            },
            title: {
                text: veg_type,
                margin:5,
                x:15,
                style: {
                    fontSize: '1.1em',
                },
            },
            credits: {
                enabled:false
            },
            subtitle: {
                text: ''
            },
            legend: {
                enabled:false,
            },
            xAxis: {
                startOnTick: false,
                endOnTick: false,
                tickInterval:1,
                title: {
                    text: 'Year'
                },
                style: {
                    "textOverflow": "none"
                }
            },
            yAxis: {
                endOnTick:false,
                title: {
                    text: 'Percent of Landscape'
                },
                labels: {
                    formatter: function () {
                        return this.value;
                    }
                }
            },
            tooltip: {
                shared: true,
                formatter: function () {
                    var points = this.points;
                    var pointsLength = points.length;
                    var tooltipMarkup = '<div id="areaChartTooltipContainer">';
                    tooltipMarkup += pointsLength ? '<span style="font-size: 12px">Year: ' + points[0].key + '</span><br/>' : '';
                    var index;
                    var y_value;

                    for(index = 0; index < pointsLength; index += 1) {
                        y_value = (points[index].y).toFixed(2)

                        if (y_value > 0) {
                            tooltipMarkup += '<span style="color:' + points[index].series.color + '">\u25CF</span> ' + points[index].series.name + ': <b>' + y_value + '%</b><br/>';
                        }
                    }
                   tooltipMarkup += '</div>';

                   return tooltipMarkup;
                }
            },
            plotOptions: {
                area: {
                    pointStart:1,
                    stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        enabled:false,
                        lineWidth: 1,
                        lineColor: '#666666'
                    },
                },
            },
        });
    });

}

function create_area_charts(results_data_json) {

        //Restructure Dictionary
        chart_dict = {}
        $.each(results_data_json[1], function (timestep, results_dict) {
            $.each(results_dict, function (veg_type, value) {
                if (typeof chart_dict[veg_type] == "undefined") {
                    chart_dict[veg_type] = {}
                }
                $.each(results_dict[veg_type], function (key, value) {
                    if (typeof chart_dict[veg_type][key] == "undefined") {
                        chart_dict[veg_type][key] = []
                    }
                    chart_dict[veg_type][key].push((parseFloat(value) * 100))
                })
            })
        });

        // Go through each veg type in the results and make a chart out of the state class values
        chart_count=1
        $.each(chart_dict, function(veg_type,value) {

            chart_div_id="chart_" + chart_count

            //add a new chart div
            $("#area_charts").append("<div id='" + chart_div_id + "'></div>")

            createAreaChart(veg_type,chart_div_id)

            ac = $('#'+chart_div_id).highcharts()

            $.each(chart_dict[veg_type], function (state_class_name, values_array) {
                ac.addSeries({
                    name: state_class_name,
                    color: state_class_color_map[state_class_name],
                    data: values_array,
                    lineWidth: 0,
                    stacking: 'normal',
                    point: {
                        events: {
                            mouseOver: function () {
                            },
                        }
                    }
                })
            });

            chart_count++;
        });
}




