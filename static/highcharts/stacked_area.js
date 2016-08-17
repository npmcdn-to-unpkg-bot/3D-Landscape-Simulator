function createAreaChart(veg_type, chart_div_id) {

    $(function () {
       $('#' + chart_div_id).highcharts({
            chart: {
                type: 'area',
                width:320,
                height:320,
                marginBottom: 50,
            },
            title: {
                text: veg_type,
                margin:5,
                x:25,
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

        test_results=results_data_json

        test_results1 = {


            "1": {
                "0": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0568",
                        "Ann Gr:Open": "0.0548",
                        "Sh Ann Gr:Closed": "0.0506",
                        "Seeded:Open": "0.0564",
                        "Sh Dpl:Closed": "0.0576",
                        "Ann Gr Mono:Open": "0.0610",
                        "Late:Closed": "0.0498",
                        "Crst Wht Gr:Open": "0.0552",
                        "Early:Open": "0.0580"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0538",
                        "Ann Gr:Open": "0.0552",
                        "Seeded:Open": "0.0472",
                        "Mid:Closed": "0.0484",
                        "Late:Closed": "0.0496",
                        "Tr Enc:Open": "0.0472",
                        "Tr Ann Gr:Closed": "0.0486",
                        "Late:Open": "0.0516",
                        "Early:Open": "0.0484",
                        "Mid 2:Open": "0.0498"
                    }
                },
                "1": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0596",
                        "Ann Gr:Open": "0.0486",
                        "Sh Ann Gr:Closed": "0.0400",
                        "Seeded:Open": "0.0564",
                        "Sh Dpl:Closed": "0.0578",
                        "Ann Gr Mono:Open": "0.0784",
                        "Late:Closed": "0.0476",
                        "Crst Wht Gr:Open": "0.0552",
                        "Early:Open": "0.0566"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0542",
                        "Ann Gr:Open": "0.0558",
                        "Seeded:Open": "0.0466",
                        "Mid:Closed": "0.0492",
                        "Late:Closed": "0.0490",
                        "Tr Enc:Open": "0.0480",
                        "Tr Ann Gr:Closed": "0.0490",
                        "Late:Open": "0.0480",
                        "Early:Open": "0.0480",
                        "Mid 2:Open": "0.0520"
                    }
                },
                "2": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0598",
                        "Ann Gr:Open": "0.0430",
                        "Sh Ann Gr:Closed": "0.0328",
                        "Seeded:Open": "0.0564",
                        "Sh Dpl:Closed": "0.0574",
                        "Ann Gr Mono:Open": "0.0920",
                        "Late:Closed": "0.0448",
                        "Crst Wht Gr:Open": "0.0552",
                        "Early:Open": "0.0588"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0540",
                        "Ann Gr:Open": "0.0564",
                        "Seeded:Open": "0.0462",
                        "Mid:Closed": "0.0494",
                        "Late:Closed": "0.0474",
                        "Tr Enc:Open": "0.0500",
                        "Tr Ann Gr:Closed": "0.0494",
                        "Late:Open": "0.0460",
                        "Early:Open": "0.0494",
                        "Mid 2:Open": "0.0516"
                    }
                },
                "3": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0612",
                        "Ann Gr:Open": "0.0396",
                        "Sh Ann Gr:Closed": "0.0262",
                        "Seeded:Open": "0.0564",
                        "Sh Dpl:Closed": "0.0568",
                        "Ann Gr Mono:Open": "0.1026",
                        "Late:Closed": "0.0422",
                        "Crst Wht Gr:Open": "0.0552",
                        "Early:Open": "0.0600"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0532",
                        "Ann Gr:Open": "0.0566",
                        "Seeded:Open": "0.0460",
                        "Mid:Closed": "0.0502",
                        "Late:Closed": "0.0466",
                        "Tr Enc:Open": "0.0526",
                        "Tr Ann Gr:Closed": "0.0502",
                        "Late:Open": "0.0442",
                        "Early:Open": "0.0492",
                        "Mid 2:Open": "0.0510"
                    }
                },
                "4": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0652",
                        "Ann Gr:Open": "0.0358",
                        "Sh Ann Gr:Closed": "0.0210",
                        "Seeded:Open": "0.0564",
                        "Sh Dpl:Closed": "0.0566",
                        "Ann Gr Mono:Open": "0.1120",
                        "Late:Closed": "0.0404",
                        "Crst Wht Gr:Open": "0.0552",
                        "Early:Open": "0.0576"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0528",
                        "Ann Gr:Open": "0.0568",
                        "Seeded:Open": "0.0458",
                        "Mid:Closed": "0.0516",
                        "Late:Closed": "0.0460",
                        "Tr Enc:Open": "0.0518",
                        "Tr Ann Gr:Closed": "0.0516",
                        "Late:Open": "0.0432",
                        "Early:Open": "0.0488",
                        "Mid 2:Open": "0.0514"
                    }
                },
                "5": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0646",
                        "Ann Gr:Open": "0.0318",
                        "Sh Ann Gr:Closed": "0.0174",
                        "Seeded:Open": "0.0564",
                        "Sh Dpl:Closed": "0.0566",
                        "Ann Gr Mono:Open": "0.1198",
                        "Late:Closed": "0.0384",
                        "Crst Wht Gr:Open": "0.0552",
                        "Early:Open": "0.0600"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0520",
                        "Ann Gr:Open": "0.0568",
                        "Seeded:Open": "0.0458",
                        "Mid:Closed": "0.0528",
                        "Late:Closed": "0.0466",
                        "Tr Enc:Open": "0.0534",
                        "Tr Ann Gr:Closed": "0.0520",
                        "Late:Open": "0.0400",
                        "Early:Open": "0.0480",
                        "Mid 2:Open": "0.0524"
                    }
                },
                "6": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0654",
                        "Ann Gr:Open": "0.0278",
                        "Sh Ann Gr:Closed": "0.0132",
                        "Seeded:Open": "0.0562",
                        "Sh Dpl:Closed": "0.0566",
                        "Ann Gr Mono:Open": "0.1288",
                        "Late:Closed": "0.0358",
                        "Crst Wht Gr:Open": "0.0552",
                        "Early:Open": "0.0612"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0512",
                        "Ann Gr:Open": "0.0570",
                        "Seeded:Open": "0.0458",
                        "Mid:Closed": "0.0546",
                        "Late:Closed": "0.0460",
                        "Tr Enc:Open": "0.0540",
                        "Tr Ann Gr:Closed": "0.0520",
                        "Late:Open": "0.0384",
                        "Early:Open": "0.0470",
                        "Mid 2:Open": "0.0538"
                    }
                },
                "7": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0652",
                        "Ann Gr:Open": "0.0244",
                        "Sh Ann Gr:Closed": "0.0108",
                        "Seeded:Open": "0.0562",
                        "Sh Dpl:Closed": "0.0560",
                        "Ann Gr Mono:Open": "0.1362",
                        "Late:Closed": "0.0330",
                        "Crst Wht Gr:Open": "0.0552",
                        "Early:Open": "0.0632"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0530",
                        "Ann Gr:Open": "0.0572",
                        "Seeded:Open": "0.0456",
                        "Mid:Closed": "0.0540",
                        "Late:Closed": "0.0448",
                        "Tr Enc:Open": "0.0564",
                        "Tr Ann Gr:Closed": "0.0524",
                        "Late:Open": "0.0366",
                        "Early:Open": "0.0466",
                        "Mid 2:Open": "0.0532"
                    }
                },
                "8": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0638",
                        "Ann Gr:Open": "0.0228",
                        "Sh Ann Gr:Closed": "0.0084",
                        "Seeded:Open": "0.0560",
                        "Sh Dpl:Closed": "0.0556",
                        "Ann Gr Mono:Open": "0.1412",
                        "Late:Closed": "0.0318",
                        "Crst Wht Gr:Open": "0.0552",
                        "Early:Open": "0.0654"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0524",
                        "Ann Gr:Open": "0.0574",
                        "Seeded:Open": "0.0456",
                        "Mid:Closed": "0.0574",
                        "Late:Closed": "0.0440",
                        "Tr Enc:Open": "0.0576",
                        "Tr Ann Gr:Closed": "0.0528",
                        "Late:Open": "0.0360",
                        "Early:Open": "0.0446",
                        "Mid 2:Open": "0.0520"
                    }
                },
                "9": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0628",
                        "Ann Gr:Open": "0.0214",
                        "Sh Ann Gr:Closed": "0.0076",
                        "Seeded:Open": "0.0560",
                        "Sh Dpl:Closed": "0.0550",
                        "Ann Gr Mono:Open": "0.1442",
                        "Late:Closed": "0.0296",
                        "Crst Wht Gr:Open": "0.0552",
                        "Early:Open": "0.0684"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0524",
                        "Ann Gr:Open": "0.0578",
                        "Seeded:Open": "0.0452",
                        "Mid:Closed": "0.0586",
                        "Late:Closed": "0.0438",
                        "Tr Enc:Open": "0.0594",
                        "Tr Ann Gr:Closed": "0.0530",
                        "Late:Open": "0.0340",
                        "Early:Open": "0.0440",
                        "Mid 2:Open": "0.0516"
                    }
                },
                "10": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0634",
                        "Ann Gr:Open": "0.0192",
                        "Sh Ann Gr:Closed": "0.0056",
                        "Seeded:Open": "0.0558",
                        "Sh Dpl:Closed": "0.0546",
                        "Ann Gr Mono:Open": "0.1496",
                        "Late:Closed": "0.0262",
                        "Crst Wht Gr:Open": "0.0552",
                        "Early:Open": "0.0706"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0536",
                        "Ann Gr:Open": "0.0586",
                        "Seeded:Open": "0.0446",
                        "Mid:Closed": "0.0578",
                        "Late:Closed": "0.0418",
                        "Tr Enc:Open": "0.0598",
                        "Tr Ann Gr:Closed": "0.0542",
                        "Late:Open": "0.0326",
                        "Early:Open": "0.0446",
                        "Mid 2:Open": "0.0522"
                    }
                },
                "11": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0656",
                        "Ann Gr:Open": "0.0188",
                        "Sh Ann Gr:Closed": "0.0052",
                        "Seeded:Open": "0.0558",
                        "Sh Dpl:Closed": "0.0542",
                        "Ann Gr Mono:Open": "0.1512",
                        "Late:Closed": "0.0248",
                        "Crst Wht Gr:Open": "0.0552",
                        "Early:Open": "0.0694"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0538",
                        "Ann Gr:Open": "0.0590",
                        "Seeded:Open": "0.0444",
                        "Mid:Closed": "0.0594",
                        "Late:Closed": "0.0414",
                        "Tr Enc:Open": "0.0604",
                        "Tr Ann Gr:Closed": "0.0558",
                        "Late:Open": "0.0312",
                        "Early:Open": "0.0434",
                        "Mid 2:Open": "0.0510"
                    }
                },
                "12": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0666",
                        "Ann Gr:Open": "0.0164",
                        "Sh Ann Gr:Closed": "0.0042",
                        "Seeded:Open": "0.0558",
                        "Sh Dpl:Closed": "0.0538",
                        "Ann Gr Mono:Open": "0.1550",
                        "Late:Closed": "0.0228",
                        "Crst Wht Gr:Open": "0.0552",
                        "Early:Open": "0.0704"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0540",
                        "Ann Gr:Open": "0.0592",
                        "Seeded:Open": "0.0442",
                        "Mid:Closed": "0.0600",
                        "Late:Closed": "0.0410",
                        "Tr Enc:Open": "0.0620",
                        "Tr Ann Gr:Closed": "0.0562",
                        "Late:Open": "0.0304",
                        "Early:Open": "0.0428",
                        "Mid 2:Open": "0.0500"
                    }
                },
                "13": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0690",
                        "Ann Gr:Open": "0.0162",
                        "Sh Ann Gr:Closed": "0.0038",
                        "Seeded:Open": "0.0558",
                        "Sh Dpl:Closed": "0.0528",
                        "Ann Gr Mono:Open": "0.1572",
                        "Late:Closed": "0.0202",
                        "Crst Wht Gr:Open": "0.0552",
                        "Early:Open": "0.0700"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0538",
                        "Ann Gr:Open": "0.0598",
                        "Seeded:Open": "0.0438",
                        "Mid:Closed": "0.0614",
                        "Late:Closed": "0.0404",
                        "Tr Enc:Open": "0.0630",
                        "Tr Ann Gr:Closed": "0.0566",
                        "Late:Open": "0.0286",
                        "Early:Open": "0.0422",
                        "Mid 2:Open": "0.0502"
                    }
                },
                "14": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0704",
                        "Ann Gr:Open": "0.0150",
                        "Sh Ann Gr:Closed": "0.0034",
                        "Seeded:Open": "0.0558",
                        "Sh Dpl:Closed": "0.0522",
                        "Ann Gr Mono:Open": "0.1598",
                        "Late:Closed": "0.0192",
                        "Crst Wht Gr:Open": "0.0552",
                        "Early:Open": "0.0692"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0546",
                        "Ann Gr:Open": "0.0600",
                        "Seeded:Open": "0.0438",
                        "Mid:Closed": "0.0624",
                        "Late:Closed": "0.0402",
                        "Tr Enc:Open": "0.0634",
                        "Tr Ann Gr:Closed": "0.0566",
                        "Late:Open": "0.0284",
                        "Early:Open": "0.0412",
                        "Mid 2:Open": "0.0492"
                    }
                },
                "15": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0716",
                        "Ann Gr:Open": "0.0134",
                        "Sh Ann Gr:Closed": "0.0028",
                        "Seeded:Open": "0.0556",
                        "Sh Dpl:Closed": "0.0514",
                        "Ann Gr Mono:Open": "0.1632",
                        "Late:Closed": "0.0180",
                        "Crst Wht Gr:Open": "0.0552",
                        "Early:Open": "0.0690"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0560",
                        "Ann Gr:Open": "0.0600",
                        "Seeded:Open": "0.0438",
                        "Mid:Closed": "0.0626",
                        "Late:Closed": "0.0392",
                        "Tr Enc:Open": "0.0634",
                        "Tr Ann Gr:Closed": "0.0572",
                        "Late:Open": "0.0278",
                        "Early:Open": "0.0402",
                        "Mid 2:Open": "0.0496"
                    }
                },
                "16": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0728",
                        "Ann Gr:Open": "0.0132",
                        "Sh Ann Gr:Closed": "0.0028",
                        "Seeded:Open": "0.0554",
                        "Sh Dpl:Closed": "0.0510",
                        "Ann Gr Mono:Open": "0.1646",
                        "Late:Closed": "0.0168",
                        "Crst Wht Gr:Open": "0.0552",
                        "Early:Open": "0.0684"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0564",
                        "Ann Gr:Open": "0.0604",
                        "Seeded:Open": "0.0434",
                        "Mid:Closed": "0.0638",
                        "Late:Closed": "0.0396",
                        "Tr Enc:Open": "0.0640",
                        "Tr Ann Gr:Closed": "0.0580",
                        "Late:Open": "0.0264",
                        "Early:Open": "0.0388",
                        "Mid 2:Open": "0.0490"
                    }
                },
                "17": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0756",
                        "Ann Gr:Open": "0.0134",
                        "Sh Ann Gr:Closed": "0.0022",
                        "Seeded:Open": "0.0550",
                        "Sh Dpl:Closed": "0.0496",
                        "Ann Gr Mono:Open": "0.1668",
                        "Late:Closed": "0.0158",
                        "Crst Wht Gr:Open": "0.0552",
                        "Early:Open": "0.0666"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0576",
                        "Ann Gr:Open": "0.0608",
                        "Seeded:Open": "0.0430",
                        "Mid:Closed": "0.0634",
                        "Late:Closed": "0.0374",
                        "Tr Enc:Open": "0.0662",
                        "Tr Ann Gr:Closed": "0.0582",
                        "Late:Open": "0.0264",
                        "Early:Open": "0.0382",
                        "Mid 2:Open": "0.0486"
                    }
                },
                "18": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0762",
                        "Ann Gr:Open": "0.0130",
                        "Sh Ann Gr:Closed": "0.0016",
                        "Seeded:Open": "0.0550",
                        "Sh Dpl:Closed": "0.0494",
                        "Ann Gr Mono:Open": "0.1684",
                        "Late:Closed": "0.0152",
                        "Crst Wht Gr:Open": "0.0552",
                        "Early:Open": "0.0662"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0580",
                        "Ann Gr:Open": "0.0610",
                        "Seeded:Open": "0.0428",
                        "Mid:Closed": "0.0636",
                        "Late:Closed": "0.0368",
                        "Tr Enc:Open": "0.0668",
                        "Tr Ann Gr:Closed": "0.0586",
                        "Late:Open": "0.0266",
                        "Early:Open": "0.0376",
                        "Mid 2:Open": "0.0480"
                    }
                },
                "19": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0784",
                        "Ann Gr:Open": "0.0124",
                        "Sh Ann Gr:Closed": "0.0014",
                        "Seeded:Open": "0.0550",
                        "Sh Dpl:Closed": "0.0490",
                        "Ann Gr Mono:Open": "0.1700",
                        "Late:Closed": "0.0138",
                        "Crst Wht Gr:Open": "0.0550",
                        "Early:Open": "0.0652"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0582",
                        "Ann Gr:Open": "0.0614",
                        "Seeded:Open": "0.0426",
                        "Mid:Closed": "0.0658",
                        "Late:Closed": "0.0360",
                        "Tr Enc:Open": "0.0676",
                        "Tr Ann Gr:Closed": "0.0588",
                        "Late:Open": "0.0258",
                        "Early:Open": "0.0362",
                        "Mid 2:Open": "0.0474"
                    }
                },
                "20": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0796",
                        "Ann Gr:Open": "0.0118",
                        "Sh Ann Gr:Closed": "0.0012",
                        "Seeded:Open": "0.0550",
                        "Sh Dpl:Closed": "0.0488",
                        "Ann Gr Mono:Open": "0.1714",
                        "Late:Closed": "0.0132",
                        "Crst Wht Gr:Open": "0.0550",
                        "Early:Open": "0.0642"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0598",
                        "Ann Gr:Open": "0.0618",
                        "Seeded:Open": "0.0424",
                        "Mid:Closed": "0.0690",
                        "Late:Closed": "0.0342",
                        "Tr Enc:Open": "0.0688",
                        "Tr Ann Gr:Closed": "0.0594",
                        "Late:Open": "0.0242",
                        "Early:Open": "0.0322",
                        "Mid 2:Open": "0.0480"
                    }
                }
            },
            "2": {
                "0": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0598",
                        "Ann Gr:Open": "0.0596",
                        "Sh Ann Gr:Closed": "0.0518",
                        "Seeded:Open": "0.0596",
                        "Sh Dpl:Closed": "0.0578",
                        "Ann Gr Mono:Open": "0.0496",
                        "Late:Closed": "0.0542",
                        "Crst Wht Gr:Open": "0.0566",
                        "Early:Open": "0.0576"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0554",
                        "Ann Gr:Open": "0.0478",
                        "Seeded:Open": "0.0512",
                        "Mid:Closed": "0.0502",
                        "Late:Closed": "0.0466",
                        "Tr Enc:Open": "0.0478",
                        "Tr Ann Gr:Closed": "0.0540",
                        "Late:Open": "0.0422",
                        "Early:Open": "0.0490",
                        "Mid 2:Open": "0.0492"
                    }
                },
                "1": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0610",
                        "Ann Gr:Open": "0.0532",
                        "Sh Ann Gr:Closed": "0.0422",
                        "Seeded:Open": "0.0596",
                        "Sh Dpl:Closed": "0.0572",
                        "Ann Gr Mono:Open": "0.0674",
                        "Late:Closed": "0.0516",
                        "Crst Wht Gr:Open": "0.0566",
                        "Early:Open": "0.0578"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0550",
                        "Ann Gr:Open": "0.0478",
                        "Seeded:Open": "0.0512",
                        "Mid:Closed": "0.0522",
                        "Late:Closed": "0.0466",
                        "Tr Enc:Open": "0.0492",
                        "Tr Ann Gr:Closed": "0.0546",
                        "Late:Open": "0.0396",
                        "Early:Open": "0.0476",
                        "Mid 2:Open": "0.0496"
                    }
                },
                "2": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0648",
                        "Ann Gr:Open": "0.0498",
                        "Sh Ann Gr:Closed": "0.0342",
                        "Seeded:Open": "0.0596",
                        "Sh Dpl:Closed": "0.0568",
                        "Ann Gr Mono:Open": "0.0798",
                        "Late:Closed": "0.0476",
                        "Crst Wht Gr:Open": "0.0566",
                        "Early:Open": "0.0574"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0548",
                        "Ann Gr:Open": "0.0480",
                        "Seeded:Open": "0.0510",
                        "Mid:Closed": "0.0538",
                        "Late:Closed": "0.0448",
                        "Tr Enc:Open": "0.0494",
                        "Tr Ann Gr:Closed": "0.0552",
                        "Late:Open": "0.0378",
                        "Early:Open": "0.0462",
                        "Mid 2:Open": "0.0524"
                    }
                },
                "3": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0658",
                        "Ann Gr:Open": "0.0442",
                        "Sh Ann Gr:Closed": "0.0274",
                        "Seeded:Open": "0.0594",
                        "Sh Dpl:Closed": "0.0562",
                        "Ann Gr Mono:Open": "0.0938",
                        "Late:Closed": "0.0448",
                        "Crst Wht Gr:Open": "0.0566",
                        "Early:Open": "0.0584"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0550",
                        "Ann Gr:Open": "0.0486",
                        "Seeded:Open": "0.0504",
                        "Mid:Closed": "0.0542",
                        "Late:Closed": "0.0436",
                        "Tr Enc:Open": "0.0510",
                        "Tr Ann Gr:Closed": "0.0556",
                        "Late:Open": "0.0366",
                        "Early:Open": "0.0460",
                        "Mid 2:Open": "0.0524"
                    }
                },
                "4": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0694",
                        "Ann Gr:Open": "0.0402",
                        "Sh Ann Gr:Closed": "0.0200",
                        "Seeded:Open": "0.0594",
                        "Sh Dpl:Closed": "0.0560",
                        "Ann Gr Mono:Open": "0.1054",
                        "Late:Closed": "0.0430",
                        "Crst Wht Gr:Open": "0.0566",
                        "Early:Open": "0.0566"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0564",
                        "Ann Gr:Open": "0.0488",
                        "Seeded:Open": "0.0502",
                        "Mid:Closed": "0.0532",
                        "Late:Closed": "0.0426",
                        "Tr Enc:Open": "0.0526",
                        "Tr Ann Gr:Closed": "0.0562",
                        "Late:Open": "0.0340",
                        "Early:Open": "0.0458",
                        "Mid 2:Open": "0.0536"
                    }
                },
                "5": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0682",
                        "Ann Gr:Open": "0.0368",
                        "Sh Ann Gr:Closed": "0.0156",
                        "Seeded:Open": "0.0594",
                        "Sh Dpl:Closed": "0.0558",
                        "Ann Gr Mono:Open": "0.1138",
                        "Late:Closed": "0.0426",
                        "Crst Wht Gr:Open": "0.0566",
                        "Early:Open": "0.0578"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0566",
                        "Ann Gr:Open": "0.0490",
                        "Seeded:Open": "0.0502",
                        "Mid:Closed": "0.0550",
                        "Late:Closed": "0.0408",
                        "Tr Enc:Open": "0.0538",
                        "Tr Ann Gr:Closed": "0.0566",
                        "Late:Open": "0.0330",
                        "Early:Open": "0.0446",
                        "Mid 2:Open": "0.0538"
                    }
                },
                "6": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0726",
                        "Ann Gr:Open": "0.0340",
                        "Sh Ann Gr:Closed": "0.0136",
                        "Seeded:Open": "0.0592",
                        "Sh Dpl:Closed": "0.0554",
                        "Ann Gr Mono:Open": "0.1200",
                        "Late:Closed": "0.0394",
                        "Crst Wht Gr:Open": "0.0566",
                        "Early:Open": "0.0558"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0570",
                        "Ann Gr:Open": "0.0492",
                        "Seeded:Open": "0.0500",
                        "Mid:Closed": "0.0560",
                        "Late:Closed": "0.0396",
                        "Tr Enc:Open": "0.0538",
                        "Tr Ann Gr:Closed": "0.0570",
                        "Late:Open": "0.0330",
                        "Early:Open": "0.0438",
                        "Mid 2:Open": "0.0540"
                    }
                },
                "7": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0754",
                        "Ann Gr:Open": "0.0304",
                        "Sh Ann Gr:Closed": "0.0114",
                        "Seeded:Open": "0.0592",
                        "Sh Dpl:Closed": "0.0548",
                        "Ann Gr Mono:Open": "0.1266",
                        "Late:Closed": "0.0362",
                        "Crst Wht Gr:Open": "0.0566",
                        "Early:Open": "0.0560"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0582",
                        "Ann Gr:Open": "0.0494",
                        "Seeded:Open": "0.0498",
                        "Mid:Closed": "0.0562",
                        "Late:Closed": "0.0384",
                        "Tr Enc:Open": "0.0556",
                        "Tr Ann Gr:Closed": "0.0580",
                        "Late:Open": "0.0318",
                        "Early:Open": "0.0434",
                        "Mid 2:Open": "0.0526"
                    }
                },
                "8": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0740",
                        "Ann Gr:Open": "0.0276",
                        "Sh Ann Gr:Closed": "0.0088",
                        "Seeded:Open": "0.0592",
                        "Sh Dpl:Closed": "0.0540",
                        "Ann Gr Mono:Open": "0.1334",
                        "Late:Closed": "0.0338",
                        "Crst Wht Gr:Open": "0.0566",
                        "Early:Open": "0.0592"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0588",
                        "Ann Gr:Open": "0.0502",
                        "Seeded:Open": "0.0490",
                        "Mid:Closed": "0.0570",
                        "Late:Closed": "0.0380",
                        "Tr Enc:Open": "0.0558",
                        "Tr Ann Gr:Closed": "0.0588",
                        "Late:Open": "0.0306",
                        "Early:Open": "0.0424",
                        "Mid 2:Open": "0.0528"
                    }
                },
                "9": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0750",
                        "Ann Gr:Open": "0.0250",
                        "Sh Ann Gr:Closed": "0.0062",
                        "Seeded:Open": "0.0592",
                        "Sh Dpl:Closed": "0.0540",
                        "Ann Gr Mono:Open": "0.1390",
                        "Late:Closed": "0.0308",
                        "Crst Wht Gr:Open": "0.0566",
                        "Early:Open": "0.0608"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0586",
                        "Ann Gr:Open": "0.0506",
                        "Seeded:Open": "0.0486",
                        "Mid:Closed": "0.0594",
                        "Late:Closed": "0.0382",
                        "Tr Enc:Open": "0.0560",
                        "Tr Ann Gr:Closed": "0.0590",
                        "Late:Open": "0.0296",
                        "Early:Open": "0.0394",
                        "Mid 2:Open": "0.0540"
                    }
                },
                "10": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0750",
                        "Ann Gr:Open": "0.0198",
                        "Sh Ann Gr:Closed": "0.0052",
                        "Seeded:Open": "0.0592",
                        "Sh Dpl:Closed": "0.0538",
                        "Ann Gr Mono:Open": "0.1456",
                        "Late:Closed": "0.0282",
                        "Crst Wht Gr:Open": "0.0566",
                        "Early:Open": "0.0632"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0594",
                        "Ann Gr:Open": "0.0518",
                        "Seeded:Open": "0.0476",
                        "Mid:Closed": "0.0598",
                        "Late:Closed": "0.0376",
                        "Tr Enc:Open": "0.0568",
                        "Tr Ann Gr:Closed": "0.0600",
                        "Late:Open": "0.0276",
                        "Early:Open": "0.0386",
                        "Mid 2:Open": "0.0542"
                    }
                },
                "11": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0784",
                        "Ann Gr:Open": "0.0170",
                        "Sh Ann Gr:Closed": "0.0044",
                        "Seeded:Open": "0.0592",
                        "Sh Dpl:Closed": "0.0538",
                        "Ann Gr Mono:Open": "0.1494",
                        "Late:Closed": "0.0272",
                        "Crst Wht Gr:Open": "0.0566",
                        "Early:Open": "0.0606"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0584",
                        "Ann Gr:Open": "0.0518",
                        "Seeded:Open": "0.0476",
                        "Mid:Closed": "0.0612",
                        "Late:Closed": "0.0374",
                        "Tr Enc:Open": "0.0580",
                        "Tr Ann Gr:Closed": "0.0612",
                        "Late:Open": "0.0276",
                        "Early:Open": "0.0370",
                        "Mid 2:Open": "0.0532"
                    }
                },
                "12": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0812",
                        "Ann Gr:Open": "0.0162",
                        "Sh Ann Gr:Closed": "0.0040",
                        "Seeded:Open": "0.0592",
                        "Sh Dpl:Closed": "0.0530",
                        "Ann Gr Mono:Open": "0.1520",
                        "Late:Closed": "0.0254",
                        "Crst Wht Gr:Open": "0.0566",
                        "Early:Open": "0.0590"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0582",
                        "Ann Gr:Open": "0.0522",
                        "Seeded:Open": "0.0472",
                        "Mid:Closed": "0.0622",
                        "Late:Closed": "0.0374",
                        "Tr Enc:Open": "0.0590",
                        "Tr Ann Gr:Closed": "0.0614",
                        "Late:Open": "0.0272",
                        "Early:Open": "0.0362",
                        "Mid 2:Open": "0.0524"
                    }
                },
                "13": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0802",
                        "Ann Gr:Open": "0.0146",
                        "Sh Ann Gr:Closed": "0.0032",
                        "Seeded:Open": "0.0592",
                        "Sh Dpl:Closed": "0.0522",
                        "Ann Gr Mono:Open": "0.1558",
                        "Late:Closed": "0.0234",
                        "Crst Wht Gr:Open": "0.0566",
                        "Early:Open": "0.0614"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0576",
                        "Ann Gr:Open": "0.0522",
                        "Seeded:Open": "0.0472",
                        "Mid:Closed": "0.0636",
                        "Late:Closed": "0.0380",
                        "Tr Enc:Open": "0.0590",
                        "Tr Ann Gr:Closed": "0.0620",
                        "Late:Open": "0.0264",
                        "Early:Open": "0.0358",
                        "Mid 2:Open": "0.0516"
                    }
                },
                "14": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0782",
                        "Ann Gr:Open": "0.0144",
                        "Sh Ann Gr:Closed": "0.0026",
                        "Seeded:Open": "0.0592",
                        "Sh Dpl:Closed": "0.0520",
                        "Ann Gr Mono:Open": "0.1574",
                        "Late:Closed": "0.0216",
                        "Crst Wht Gr:Open": "0.0566",
                        "Early:Open": "0.0646"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0582",
                        "Ann Gr:Open": "0.0528",
                        "Seeded:Open": "0.0466",
                        "Mid:Closed": "0.0634",
                        "Late:Closed": "0.0366",
                        "Tr Enc:Open": "0.0610",
                        "Tr Ann Gr:Closed": "0.0626",
                        "Late:Open": "0.0250",
                        "Early:Open": "0.0358",
                        "Mid 2:Open": "0.0514"
                    }
                },
                "15": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0792",
                        "Ann Gr:Open": "0.0136",
                        "Sh Ann Gr:Closed": "0.0024",
                        "Seeded:Open": "0.0592",
                        "Sh Dpl:Closed": "0.0518",
                        "Ann Gr Mono:Open": "0.1590",
                        "Late:Closed": "0.0206",
                        "Crst Wht Gr:Open": "0.0566",
                        "Early:Open": "0.0642"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0592",
                        "Ann Gr:Open": "0.0532",
                        "Seeded:Open": "0.0462",
                        "Mid:Closed": "0.0642",
                        "Late:Closed": "0.0362",
                        "Tr Enc:Open": "0.0606",
                        "Tr Ann Gr:Closed": "0.0634",
                        "Late:Open": "0.0236",
                        "Early:Open": "0.0350",
                        "Mid 2:Open": "0.0518"
                    }
                },
                "16": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0806",
                        "Ann Gr:Open": "0.0128",
                        "Sh Ann Gr:Closed": "0.0022",
                        "Seeded:Open": "0.0592",
                        "Sh Dpl:Closed": "0.0514",
                        "Ann Gr Mono:Open": "0.1610",
                        "Late:Closed": "0.0200",
                        "Crst Wht Gr:Open": "0.0564",
                        "Early:Open": "0.0630"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0590",
                        "Ann Gr:Open": "0.0534",
                        "Seeded:Open": "0.0460",
                        "Mid:Closed": "0.0648",
                        "Late:Closed": "0.0366",
                        "Tr Enc:Open": "0.0616",
                        "Tr Ann Gr:Closed": "0.0640",
                        "Late:Open": "0.0236",
                        "Early:Open": "0.0338",
                        "Mid 2:Open": "0.0506"
                    }
                },
                "17": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0788",
                        "Ann Gr:Open": "0.0130",
                        "Sh Ann Gr:Closed": "0.0022",
                        "Seeded:Open": "0.0592",
                        "Sh Dpl:Closed": "0.0504",
                        "Ann Gr Mono:Open": "0.1622",
                        "Late:Closed": "0.0190",
                        "Crst Wht Gr:Open": "0.0564",
                        "Early:Open": "0.0654"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0592",
                        "Ann Gr:Open": "0.0542",
                        "Seeded:Open": "0.0452",
                        "Mid:Closed": "0.0656",
                        "Late:Closed": "0.0364",
                        "Tr Enc:Open": "0.0628",
                        "Tr Ann Gr:Closed": "0.0650",
                        "Late:Open": "0.0222",
                        "Early:Open": "0.0326",
                        "Mid 2:Open": "0.0502"
                    }
                },
                "18": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0792",
                        "Ann Gr:Open": "0.0122",
                        "Sh Ann Gr:Closed": "0.0016",
                        "Seeded:Open": "0.0592",
                        "Sh Dpl:Closed": "0.0498",
                        "Ann Gr Mono:Open": "0.1644",
                        "Late:Closed": "0.0182",
                        "Crst Wht Gr:Open": "0.0564",
                        "Early:Open": "0.0656"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0604",
                        "Ann Gr:Open": "0.0542",
                        "Seeded:Open": "0.0452",
                        "Mid:Closed": "0.0684",
                        "Late:Closed": "0.0360",
                        "Tr Enc:Open": "0.0640",
                        "Tr Ann Gr:Closed": "0.0652",
                        "Late:Open": "0.0212",
                        "Early:Open": "0.0286",
                        "Mid 2:Open": "0.0502"
                    }
                },
                "19": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0800",
                        "Ann Gr:Open": "0.0104",
                        "Sh Ann Gr:Closed": "0.0010",
                        "Seeded:Open": "0.0592",
                        "Sh Dpl:Closed": "0.0494",
                        "Ann Gr Mono:Open": "0.1672",
                        "Late:Closed": "0.0186",
                        "Crst Wht Gr:Open": "0.0564",
                        "Early:Open": "0.0644"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0598",
                        "Ann Gr:Open": "0.0544",
                        "Seeded:Open": "0.0450",
                        "Mid:Closed": "0.0674",
                        "Late:Closed": "0.0362",
                        "Tr Enc:Open": "0.0652",
                        "Tr Ann Gr:Closed": "0.0656",
                        "Late:Open": "0.0204",
                        "Early:Open": "0.0304",
                        "Mid 2:Open": "0.0490"
                    }
                },
                "20": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0800",
                        "Ann Gr:Open": "0.0100",
                        "Sh Ann Gr:Closed": "0.0010",
                        "Seeded:Open": "0.0592",
                        "Sh Dpl:Closed": "0.0488",
                        "Ann Gr Mono:Open": "0.1686",
                        "Late:Closed": "0.0168",
                        "Crst Wht Gr:Open": "0.0564",
                        "Early:Open": "0.0658"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0606",
                        "Ann Gr:Open": "0.0550",
                        "Seeded:Open": "0.0444",
                        "Mid:Closed": "0.0680",
                        "Late:Closed": "0.0358",
                        "Tr Enc:Open": "0.0660",
                        "Tr Ann Gr:Closed": "0.0662",
                        "Late:Open": "0.0204",
                        "Early:Open": "0.0290",
                        "Mid 2:Open": "0.0480"
                    }
                }
            },
            "3": {
                "0": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0582",
                        "Ann Gr:Open": "0.0592",
                        "Sh Ann Gr:Closed": "0.0592",
                        "Seeded:Open": "0.0528",
                        "Sh Dpl:Closed": "0.0516",
                        "Ann Gr Mono:Open": "0.0598",
                        "Late:Closed": "0.0558",
                        "Crst Wht Gr:Open": "0.0548",
                        "Early:Open": "0.0506"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0464",
                        "Ann Gr:Open": "0.0524",
                        "Seeded:Open": "0.0512",
                        "Mid:Closed": "0.0482",
                        "Late:Closed": "0.0456",
                        "Tr Enc:Open": "0.0504",
                        "Tr Ann Gr:Closed": "0.0482",
                        "Late:Open": "0.0562",
                        "Early:Open": "0.0502",
                        "Mid 2:Open": "0.0492"
                    }
                },
                "1": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0612",
                        "Ann Gr:Open": "0.0520",
                        "Sh Ann Gr:Closed": "0.0474",
                        "Seeded:Open": "0.0528",
                        "Sh Dpl:Closed": "0.0516",
                        "Ann Gr Mono:Open": "0.0792",
                        "Late:Closed": "0.0522",
                        "Crst Wht Gr:Open": "0.0548",
                        "Early:Open": "0.0508"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0470",
                        "Ann Gr:Open": "0.0534",
                        "Seeded:Open": "0.0502",
                        "Mid:Closed": "0.0490",
                        "Late:Closed": "0.0448",
                        "Tr Enc:Open": "0.0516",
                        "Tr Ann Gr:Closed": "0.0484",
                        "Late:Open": "0.0540",
                        "Early:Open": "0.0500",
                        "Mid 2:Open": "0.0496"
                    }
                },
                "2": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0630",
                        "Ann Gr:Open": "0.0470",
                        "Sh Ann Gr:Closed": "0.0386",
                        "Seeded:Open": "0.0528",
                        "Sh Dpl:Closed": "0.0512",
                        "Ann Gr Mono:Open": "0.0942",
                        "Late:Closed": "0.0484",
                        "Crst Wht Gr:Open": "0.0548",
                        "Early:Open": "0.0520"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0464",
                        "Ann Gr:Open": "0.0536",
                        "Seeded:Open": "0.0500",
                        "Mid:Closed": "0.0508",
                        "Late:Closed": "0.0438",
                        "Tr Enc:Open": "0.0530",
                        "Tr Ann Gr:Closed": "0.0496",
                        "Late:Open": "0.0518",
                        "Early:Open": "0.0486",
                        "Mid 2:Open": "0.0504"
                    }
                },
                "3": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0648",
                        "Ann Gr:Open": "0.0430",
                        "Sh Ann Gr:Closed": "0.0312",
                        "Seeded:Open": "0.0524",
                        "Sh Dpl:Closed": "0.0508",
                        "Ann Gr Mono:Open": "0.1070",
                        "Late:Closed": "0.0448",
                        "Crst Wht Gr:Open": "0.0546",
                        "Early:Open": "0.0534"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0452",
                        "Ann Gr:Open": "0.0536",
                        "Seeded:Open": "0.0500",
                        "Mid:Closed": "0.0538",
                        "Late:Closed": "0.0444",
                        "Tr Enc:Open": "0.0546",
                        "Tr Ann Gr:Closed": "0.0506",
                        "Late:Open": "0.0498",
                        "Early:Open": "0.0458",
                        "Mid 2:Open": "0.0502"
                    }
                },
                "4": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0676",
                        "Ann Gr:Open": "0.0386",
                        "Sh Ann Gr:Closed": "0.0256",
                        "Seeded:Open": "0.0524",
                        "Sh Dpl:Closed": "0.0500",
                        "Ann Gr Mono:Open": "0.1180",
                        "Late:Closed": "0.0422",
                        "Crst Wht Gr:Open": "0.0546",
                        "Early:Open": "0.0530"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0456",
                        "Ann Gr:Open": "0.0540",
                        "Seeded:Open": "0.0498",
                        "Mid:Closed": "0.0536",
                        "Late:Closed": "0.0450",
                        "Tr Enc:Open": "0.0562",
                        "Tr Ann Gr:Closed": "0.0510",
                        "Late:Open": "0.0464",
                        "Early:Open": "0.0460",
                        "Mid 2:Open": "0.0504"
                    }
                },
                "5": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0666",
                        "Ann Gr:Open": "0.0362",
                        "Sh Ann Gr:Closed": "0.0214",
                        "Seeded:Open": "0.0524",
                        "Sh Dpl:Closed": "0.0498",
                        "Ann Gr Mono:Open": "0.1256",
                        "Late:Closed": "0.0394",
                        "Crst Wht Gr:Open": "0.0546",
                        "Early:Open": "0.0560"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0458",
                        "Ann Gr:Open": "0.0544",
                        "Seeded:Open": "0.0494",
                        "Mid:Closed": "0.0544",
                        "Late:Closed": "0.0450",
                        "Tr Enc:Open": "0.0560",
                        "Tr Ann Gr:Closed": "0.0514",
                        "Late:Open": "0.0446",
                        "Early:Open": "0.0456",
                        "Mid 2:Open": "0.0514"
                    }
                },
                "6": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0666",
                        "Ann Gr:Open": "0.0336",
                        "Sh Ann Gr:Closed": "0.0164",
                        "Seeded:Open": "0.0524",
                        "Sh Dpl:Closed": "0.0496",
                        "Ann Gr Mono:Open": "0.1340",
                        "Late:Closed": "0.0374",
                        "Crst Wht Gr:Open": "0.0546",
                        "Early:Open": "0.0574"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0456",
                        "Ann Gr:Open": "0.0550",
                        "Seeded:Open": "0.0488",
                        "Mid:Closed": "0.0558",
                        "Late:Closed": "0.0458",
                        "Tr Enc:Open": "0.0566",
                        "Tr Ann Gr:Closed": "0.0518",
                        "Late:Open": "0.0422",
                        "Early:Open": "0.0442",
                        "Mid 2:Open": "0.0522"
                    }
                },
                "7": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0652",
                        "Ann Gr:Open": "0.0314",
                        "Sh Ann Gr:Closed": "0.0134",
                        "Seeded:Open": "0.0524",
                        "Sh Dpl:Closed": "0.0502",
                        "Ann Gr Mono:Open": "0.1398",
                        "Late:Closed": "0.0360",
                        "Crst Wht Gr:Open": "0.0546",
                        "Early:Open": "0.0590"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0464",
                        "Ann Gr:Open": "0.0552",
                        "Seeded:Open": "0.0486",
                        "Mid:Closed": "0.0564",
                        "Late:Closed": "0.0454",
                        "Tr Enc:Open": "0.0582",
                        "Tr Ann Gr:Closed": "0.0524",
                        "Late:Open": "0.0402",
                        "Early:Open": "0.0426",
                        "Mid 2:Open": "0.0526"
                    }
                },
                "8": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0648",
                        "Ann Gr:Open": "0.0288",
                        "Sh Ann Gr:Closed": "0.0114",
                        "Seeded:Open": "0.0524",
                        "Sh Dpl:Closed": "0.0498",
                        "Ann Gr Mono:Open": "0.1450",
                        "Late:Closed": "0.0336",
                        "Crst Wht Gr:Open": "0.0546",
                        "Early:Open": "0.0616"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0466",
                        "Ann Gr:Open": "0.0554",
                        "Seeded:Open": "0.0486",
                        "Mid:Closed": "0.0570",
                        "Late:Closed": "0.0450",
                        "Tr Enc:Open": "0.0604",
                        "Tr Ann Gr:Closed": "0.0528",
                        "Late:Open": "0.0380",
                        "Early:Open": "0.0420",
                        "Mid 2:Open": "0.0522"
                    }
                },
                "9": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0638",
                        "Ann Gr:Open": "0.0264",
                        "Sh Ann Gr:Closed": "0.0092",
                        "Seeded:Open": "0.0524",
                        "Sh Dpl:Closed": "0.0498",
                        "Ann Gr Mono:Open": "0.1502",
                        "Late:Closed": "0.0314",
                        "Crst Wht Gr:Open": "0.0546",
                        "Early:Open": "0.0642"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0462",
                        "Ann Gr:Open": "0.0558",
                        "Seeded:Open": "0.0482",
                        "Mid:Closed": "0.0580",
                        "Late:Closed": "0.0450",
                        "Tr Enc:Open": "0.0606",
                        "Tr Ann Gr:Closed": "0.0532",
                        "Late:Open": "0.0368",
                        "Early:Open": "0.0416",
                        "Mid 2:Open": "0.0526"
                    }
                },
                "10": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0622",
                        "Ann Gr:Open": "0.0242",
                        "Sh Ann Gr:Closed": "0.0080",
                        "Seeded:Open": "0.0524",
                        "Sh Dpl:Closed": "0.0494",
                        "Ann Gr Mono:Open": "0.1544",
                        "Late:Closed": "0.0304",
                        "Crst Wht Gr:Open": "0.0546",
                        "Early:Open": "0.0664"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0472",
                        "Ann Gr:Open": "0.0562",
                        "Seeded:Open": "0.0478",
                        "Mid:Closed": "0.0586",
                        "Late:Closed": "0.0462",
                        "Tr Enc:Open": "0.0614",
                        "Tr Ann Gr:Closed": "0.0536",
                        "Late:Open": "0.0354",
                        "Early:Open": "0.0406",
                        "Mid 2:Open": "0.0510"
                    }
                },
                "11": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0668",
                        "Ann Gr:Open": "0.0236",
                        "Sh Ann Gr:Closed": "0.0058",
                        "Seeded:Open": "0.0522",
                        "Sh Dpl:Closed": "0.0486",
                        "Ann Gr Mono:Open": "0.1582",
                        "Late:Closed": "0.0270",
                        "Crst Wht Gr:Open": "0.0546",
                        "Early:Open": "0.0652"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0480",
                        "Ann Gr:Open": "0.0562",
                        "Seeded:Open": "0.0478",
                        "Mid:Closed": "0.0592",
                        "Late:Closed": "0.0456",
                        "Tr Enc:Open": "0.0616",
                        "Tr Ann Gr:Closed": "0.0542",
                        "Late:Open": "0.0348",
                        "Early:Open": "0.0400",
                        "Mid 2:Open": "0.0506"
                    }
                },
                "12": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0676",
                        "Ann Gr:Open": "0.0212",
                        "Sh Ann Gr:Closed": "0.0052",
                        "Seeded:Open": "0.0522",
                        "Sh Dpl:Closed": "0.0488",
                        "Ann Gr Mono:Open": "0.1618",
                        "Late:Closed": "0.0252",
                        "Crst Wht Gr:Open": "0.0546",
                        "Early:Open": "0.0654"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0488",
                        "Ann Gr:Open": "0.0568",
                        "Seeded:Open": "0.0474",
                        "Mid:Closed": "0.0594",
                        "Late:Closed": "0.0450",
                        "Tr Enc:Open": "0.0634",
                        "Tr Ann Gr:Closed": "0.0544",
                        "Late:Open": "0.0336",
                        "Early:Open": "0.0390",
                        "Mid 2:Open": "0.0502"
                    }
                },
                "13": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0706",
                        "Ann Gr:Open": "0.0196",
                        "Sh Ann Gr:Closed": "0.0042",
                        "Seeded:Open": "0.0522",
                        "Sh Dpl:Closed": "0.0488",
                        "Ann Gr Mono:Open": "0.1650",
                        "Late:Closed": "0.0236",
                        "Crst Wht Gr:Open": "0.0546",
                        "Early:Open": "0.0634"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0494",
                        "Ann Gr:Open": "0.0576",
                        "Seeded:Open": "0.0468",
                        "Mid:Closed": "0.0602",
                        "Late:Closed": "0.0440",
                        "Tr Enc:Open": "0.0652",
                        "Tr Ann Gr:Closed": "0.0548",
                        "Late:Open": "0.0318",
                        "Early:Open": "0.0386",
                        "Mid 2:Open": "0.0496"
                    }
                },
                "14": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0724",
                        "Ann Gr:Open": "0.0160",
                        "Sh Ann Gr:Closed": "0.0034",
                        "Seeded:Open": "0.0522",
                        "Sh Dpl:Closed": "0.0484",
                        "Ann Gr Mono:Open": "0.1700",
                        "Late:Closed": "0.0230",
                        "Crst Wht Gr:Open": "0.0546",
                        "Early:Open": "0.0620"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0496",
                        "Ann Gr:Open": "0.0584",
                        "Seeded:Open": "0.0462",
                        "Mid:Closed": "0.0608",
                        "Late:Closed": "0.0430",
                        "Tr Enc:Open": "0.0668",
                        "Tr Ann Gr:Closed": "0.0556",
                        "Late:Open": "0.0300",
                        "Early:Open": "0.0382",
                        "Mid 2:Open": "0.0494"
                    }
                },
                "15": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0742",
                        "Ann Gr:Open": "0.0140",
                        "Sh Ann Gr:Closed": "0.0022",
                        "Seeded:Open": "0.0522",
                        "Sh Dpl:Closed": "0.0482",
                        "Ann Gr Mono:Open": "0.1738",
                        "Late:Closed": "0.0204",
                        "Crst Wht Gr:Open": "0.0546",
                        "Early:Open": "0.0624"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0508",
                        "Ann Gr:Open": "0.0588",
                        "Seeded:Open": "0.0458",
                        "Mid:Closed": "0.0614",
                        "Late:Closed": "0.0418",
                        "Tr Enc:Open": "0.0680",
                        "Tr Ann Gr:Closed": "0.0558",
                        "Late:Open": "0.0288",
                        "Early:Open": "0.0372",
                        "Mid 2:Open": "0.0496"
                    }
                },
                "16": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0746",
                        "Ann Gr:Open": "0.0138",
                        "Sh Ann Gr:Closed": "0.0018",
                        "Seeded:Open": "0.0522",
                        "Sh Dpl:Closed": "0.0476",
                        "Ann Gr Mono:Open": "0.1754",
                        "Late:Closed": "0.0190",
                        "Crst Wht Gr:Open": "0.0546",
                        "Early:Open": "0.0630"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0502",
                        "Ann Gr:Open": "0.0592",
                        "Seeded:Open": "0.0454",
                        "Mid:Closed": "0.0608",
                        "Late:Closed": "0.0414",
                        "Tr Enc:Open": "0.0690",
                        "Tr Ann Gr:Closed": "0.0560",
                        "Late:Open": "0.0276",
                        "Early:Open": "0.0386",
                        "Mid 2:Open": "0.0498"
                    }
                },
                "17": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0760",
                        "Ann Gr:Open": "0.0142",
                        "Sh Ann Gr:Closed": "0.0012",
                        "Seeded:Open": "0.0522",
                        "Sh Dpl:Closed": "0.0462",
                        "Ann Gr Mono:Open": "0.1772",
                        "Late:Closed": "0.0180",
                        "Crst Wht Gr:Open": "0.0546",
                        "Early:Open": "0.0624"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0508",
                        "Ann Gr:Open": "0.0592",
                        "Seeded:Open": "0.0454",
                        "Mid:Closed": "0.0612",
                        "Late:Closed": "0.0404",
                        "Tr Enc:Open": "0.0692",
                        "Tr Ann Gr:Closed": "0.0562",
                        "Late:Open": "0.0266",
                        "Early:Open": "0.0390",
                        "Mid 2:Open": "0.0500"
                    }
                },
                "18": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0760",
                        "Ann Gr:Open": "0.0134",
                        "Sh Ann Gr:Closed": "0.0014",
                        "Seeded:Open": "0.0522",
                        "Sh Dpl:Closed": "0.0456",
                        "Ann Gr Mono:Open": "0.1792",
                        "Late:Closed": "0.0174",
                        "Crst Wht Gr:Open": "0.0546",
                        "Early:Open": "0.0622"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0512",
                        "Ann Gr:Open": "0.0592",
                        "Seeded:Open": "0.0454",
                        "Mid:Closed": "0.0618",
                        "Late:Closed": "0.0414",
                        "Tr Enc:Open": "0.0696",
                        "Tr Ann Gr:Closed": "0.0570",
                        "Late:Open": "0.0254",
                        "Early:Open": "0.0380",
                        "Mid 2:Open": "0.0490"
                    }
                },
                "19": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0758",
                        "Ann Gr:Open": "0.0130",
                        "Sh Ann Gr:Closed": "0.0010",
                        "Seeded:Open": "0.0520",
                        "Sh Dpl:Closed": "0.0448",
                        "Ann Gr Mono:Open": "0.1816",
                        "Late:Closed": "0.0162",
                        "Crst Wht Gr:Open": "0.0546",
                        "Early:Open": "0.0630"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0520",
                        "Ann Gr:Open": "0.0596",
                        "Seeded:Open": "0.0450",
                        "Mid:Closed": "0.0638",
                        "Late:Closed": "0.0396",
                        "Tr Enc:Open": "0.0702",
                        "Tr Ann Gr:Closed": "0.0580",
                        "Late:Open": "0.0244",
                        "Early:Open": "0.0360",
                        "Mid 2:Open": "0.0494"
                    }
                },
                "20": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0750",
                        "Ann Gr:Open": "0.0112",
                        "Sh Ann Gr:Closed": "0.0012",
                        "Seeded:Open": "0.0518",
                        "Sh Dpl:Closed": "0.0442",
                        "Ann Gr Mono:Open": "0.1840",
                        "Late:Closed": "0.0150",
                        "Crst Wht Gr:Open": "0.0546",
                        "Early:Open": "0.0650"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0528",
                        "Ann Gr:Open": "0.0606",
                        "Seeded:Open": "0.0440",
                        "Mid:Closed": "0.0670",
                        "Late:Closed": "0.0382",
                        "Tr Enc:Open": "0.0710",
                        "Tr Ann Gr:Closed": "0.0584",
                        "Late:Open": "0.0242",
                        "Early:Open": "0.0326",
                        "Mid 2:Open": "0.0492"
                    }
                }
            },
            "4": {
                "0": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0532",
                        "Ann Gr:Open": "0.0522",
                        "Sh Ann Gr:Closed": "0.0622",
                        "Seeded:Open": "0.0550",
                        "Sh Dpl:Closed": "0.0590",
                        "Ann Gr Mono:Open": "0.0564",
                        "Late:Closed": "0.0592",
                        "Crst Wht Gr:Open": "0.0560",
                        "Early:Open": "0.0550"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0458",
                        "Ann Gr:Open": "0.0512",
                        "Seeded:Open": "0.0464",
                        "Mid:Closed": "0.0514",
                        "Late:Closed": "0.0490",
                        "Tr Enc:Open": "0.0492",
                        "Tr Ann Gr:Closed": "0.0476",
                        "Late:Open": "0.0472",
                        "Early:Open": "0.0470",
                        "Mid 2:Open": "0.0570"
                    }
                },
                "1": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0566",
                        "Ann Gr:Open": "0.0462",
                        "Sh Ann Gr:Closed": "0.0480",
                        "Seeded:Open": "0.0548",
                        "Sh Dpl:Closed": "0.0590",
                        "Ann Gr Mono:Open": "0.0776",
                        "Late:Closed": "0.0556",
                        "Crst Wht Gr:Open": "0.0560",
                        "Early:Open": "0.0544"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0466",
                        "Ann Gr:Open": "0.0516",
                        "Seeded:Open": "0.0460",
                        "Mid:Closed": "0.0526",
                        "Late:Closed": "0.0492",
                        "Tr Enc:Open": "0.0506",
                        "Tr Ann Gr:Closed": "0.0480",
                        "Late:Open": "0.0458",
                        "Early:Open": "0.0450",
                        "Mid 2:Open": "0.0564"
                    }
                },
                "2": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0594",
                        "Ann Gr:Open": "0.0424",
                        "Sh Ann Gr:Closed": "0.0412",
                        "Seeded:Open": "0.0548",
                        "Sh Dpl:Closed": "0.0574",
                        "Ann Gr Mono:Open": "0.0904",
                        "Late:Closed": "0.0528",
                        "Crst Wht Gr:Open": "0.0560",
                        "Early:Open": "0.0538"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0478",
                        "Ann Gr:Open": "0.0518",
                        "Seeded:Open": "0.0460",
                        "Mid:Closed": "0.0534",
                        "Late:Closed": "0.0490",
                        "Tr Enc:Open": "0.0518",
                        "Tr Ann Gr:Closed": "0.0480",
                        "Late:Open": "0.0442",
                        "Early:Open": "0.0436",
                        "Mid 2:Open": "0.0562"
                    }
                },
                "3": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0614",
                        "Ann Gr:Open": "0.0386",
                        "Sh Ann Gr:Closed": "0.0316",
                        "Seeded:Open": "0.0548",
                        "Sh Dpl:Closed": "0.0574",
                        "Ann Gr Mono:Open": "0.1042",
                        "Late:Closed": "0.0506",
                        "Crst Wht Gr:Open": "0.0560",
                        "Early:Open": "0.0536"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0478",
                        "Ann Gr:Open": "0.0518",
                        "Seeded:Open": "0.0460",
                        "Mid:Closed": "0.0546",
                        "Late:Closed": "0.0488",
                        "Tr Enc:Open": "0.0536",
                        "Tr Ann Gr:Closed": "0.0488",
                        "Late:Open": "0.0418",
                        "Early:Open": "0.0430",
                        "Mid 2:Open": "0.0556"
                    }
                },
                "4": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0616",
                        "Ann Gr:Open": "0.0362",
                        "Sh Ann Gr:Closed": "0.0248",
                        "Seeded:Open": "0.0548",
                        "Sh Dpl:Closed": "0.0568",
                        "Ann Gr Mono:Open": "0.1144",
                        "Late:Closed": "0.0480",
                        "Crst Wht Gr:Open": "0.0560",
                        "Early:Open": "0.0556"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0494",
                        "Ann Gr:Open": "0.0526",
                        "Seeded:Open": "0.0452",
                        "Mid:Closed": "0.0538",
                        "Late:Closed": "0.0474",
                        "Tr Enc:Open": "0.0556",
                        "Tr Ann Gr:Closed": "0.0496",
                        "Late:Open": "0.0408",
                        "Early:Open": "0.0428",
                        "Mid 2:Open": "0.0546"
                    }
                },
                "5": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0620",
                        "Ann Gr:Open": "0.0344",
                        "Sh Ann Gr:Closed": "0.0188",
                        "Seeded:Open": "0.0546",
                        "Sh Dpl:Closed": "0.0564",
                        "Ann Gr Mono:Open": "0.1238",
                        "Late:Closed": "0.0452",
                        "Crst Wht Gr:Open": "0.0560",
                        "Early:Open": "0.0570"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0502",
                        "Ann Gr:Open": "0.0530",
                        "Seeded:Open": "0.0448",
                        "Mid:Closed": "0.0552",
                        "Late:Closed": "0.0476",
                        "Tr Enc:Open": "0.0580",
                        "Tr Ann Gr:Closed": "0.0498",
                        "Late:Open": "0.0394",
                        "Early:Open": "0.0400",
                        "Mid 2:Open": "0.0538"
                    }
                },
                "6": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0616",
                        "Ann Gr:Open": "0.0308",
                        "Sh Ann Gr:Closed": "0.0144",
                        "Seeded:Open": "0.0546",
                        "Sh Dpl:Closed": "0.0560",
                        "Ann Gr Mono:Open": "0.1326",
                        "Late:Closed": "0.0432",
                        "Crst Wht Gr:Open": "0.0560",
                        "Early:Open": "0.0590"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0512",
                        "Ann Gr:Open": "0.0536",
                        "Seeded:Open": "0.0444",
                        "Mid:Closed": "0.0546",
                        "Late:Closed": "0.0460",
                        "Tr Enc:Open": "0.0588",
                        "Tr Ann Gr:Closed": "0.0516",
                        "Late:Open": "0.0372",
                        "Early:Open": "0.0402",
                        "Mid 2:Open": "0.0542"
                    }
                },
                "7": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0616",
                        "Ann Gr:Open": "0.0272",
                        "Sh Ann Gr:Closed": "0.0130",
                        "Seeded:Open": "0.0544",
                        "Sh Dpl:Closed": "0.0556",
                        "Ann Gr Mono:Open": "0.1384",
                        "Late:Closed": "0.0406",
                        "Crst Wht Gr:Open": "0.0560",
                        "Early:Open": "0.0614"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0522",
                        "Ann Gr:Open": "0.0540",
                        "Seeded:Open": "0.0442",
                        "Mid:Closed": "0.0542",
                        "Late:Closed": "0.0446",
                        "Tr Enc:Open": "0.0604",
                        "Tr Ann Gr:Closed": "0.0522",
                        "Late:Open": "0.0358",
                        "Early:Open": "0.0398",
                        "Mid 2:Open": "0.0544"
                    }
                },
                "8": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0614",
                        "Ann Gr:Open": "0.0242",
                        "Sh Ann Gr:Closed": "0.0106",
                        "Seeded:Open": "0.0544",
                        "Sh Dpl:Closed": "0.0556",
                        "Ann Gr Mono:Open": "0.1444",
                        "Late:Closed": "0.0382",
                        "Crst Wht Gr:Open": "0.0560",
                        "Early:Open": "0.0634"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0530",
                        "Ann Gr:Open": "0.0542",
                        "Seeded:Open": "0.0440",
                        "Mid:Closed": "0.0546",
                        "Late:Closed": "0.0426",
                        "Tr Enc:Open": "0.0620",
                        "Tr Ann Gr:Closed": "0.0526",
                        "Late:Open": "0.0344",
                        "Early:Open": "0.0388",
                        "Mid 2:Open": "0.0556"
                    }
                },
                "9": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0630",
                        "Ann Gr:Open": "0.0232",
                        "Sh Ann Gr:Closed": "0.0084",
                        "Seeded:Open": "0.0542",
                        "Sh Dpl:Closed": "0.0542",
                        "Ann Gr Mono:Open": "0.1496",
                        "Late:Closed": "0.0352",
                        "Crst Wht Gr:Open": "0.0560",
                        "Early:Open": "0.0644"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0526",
                        "Ann Gr:Open": "0.0546",
                        "Seeded:Open": "0.0436",
                        "Mid:Closed": "0.0548",
                        "Late:Closed": "0.0422",
                        "Tr Enc:Open": "0.0634",
                        "Tr Ann Gr:Closed": "0.0530",
                        "Late:Open": "0.0336",
                        "Early:Open": "0.0394",
                        "Mid 2:Open": "0.0546"
                    }
                },
                "10": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0634",
                        "Ann Gr:Open": "0.0232",
                        "Sh Ann Gr:Closed": "0.0068",
                        "Seeded:Open": "0.0538",
                        "Sh Dpl:Closed": "0.0538",
                        "Ann Gr Mono:Open": "0.1528",
                        "Late:Closed": "0.0330",
                        "Crst Wht Gr:Open": "0.0560",
                        "Early:Open": "0.0654"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0532",
                        "Ann Gr:Open": "0.0548",
                        "Seeded:Open": "0.0434",
                        "Mid:Closed": "0.0554",
                        "Late:Closed": "0.0402",
                        "Tr Enc:Open": "0.0652",
                        "Tr Ann Gr:Closed": "0.0530",
                        "Late:Open": "0.0332",
                        "Early:Open": "0.0386",
                        "Mid 2:Open": "0.0548"
                    }
                },
                "11": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0688",
                        "Ann Gr:Open": "0.0208",
                        "Sh Ann Gr:Closed": "0.0058",
                        "Seeded:Open": "0.0538",
                        "Sh Dpl:Closed": "0.0532",
                        "Ann Gr Mono:Open": "0.1568",
                        "Late:Closed": "0.0292",
                        "Crst Wht Gr:Open": "0.0560",
                        "Early:Open": "0.0638"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0532",
                        "Ann Gr:Open": "0.0554",
                        "Seeded:Open": "0.0428",
                        "Mid:Closed": "0.0578",
                        "Late:Closed": "0.0408",
                        "Tr Enc:Open": "0.0654",
                        "Tr Ann Gr:Closed": "0.0538",
                        "Late:Open": "0.0312",
                        "Early:Open": "0.0368",
                        "Mid 2:Open": "0.0546"
                    }
                },
                "12": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0682",
                        "Ann Gr:Open": "0.0196",
                        "Sh Ann Gr:Closed": "0.0052",
                        "Seeded:Open": "0.0536",
                        "Sh Dpl:Closed": "0.0528",
                        "Ann Gr Mono:Open": "0.1596",
                        "Late:Closed": "0.0270",
                        "Crst Wht Gr:Open": "0.0560",
                        "Early:Open": "0.0662"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0530",
                        "Ann Gr:Open": "0.0556",
                        "Seeded:Open": "0.0426",
                        "Mid:Closed": "0.0602",
                        "Late:Closed": "0.0400",
                        "Tr Enc:Open": "0.0656",
                        "Tr Ann Gr:Closed": "0.0546",
                        "Late:Open": "0.0306",
                        "Early:Open": "0.0344",
                        "Mid 2:Open": "0.0552"
                    }
                },
                "13": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0696",
                        "Ann Gr:Open": "0.0192",
                        "Sh Ann Gr:Closed": "0.0050",
                        "Seeded:Open": "0.0536",
                        "Sh Dpl:Closed": "0.0516",
                        "Ann Gr Mono:Open": "0.1620",
                        "Late:Closed": "0.0250",
                        "Crst Wht Gr:Open": "0.0560",
                        "Early:Open": "0.0662"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0528",
                        "Ann Gr:Open": "0.0560",
                        "Seeded:Open": "0.0422",
                        "Mid:Closed": "0.0604",
                        "Late:Closed": "0.0386",
                        "Tr Enc:Open": "0.0664",
                        "Tr Ann Gr:Closed": "0.0554",
                        "Late:Open": "0.0296",
                        "Early:Open": "0.0348",
                        "Mid 2:Open": "0.0556"
                    }
                },
                "14": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0728",
                        "Ann Gr:Open": "0.0190",
                        "Sh Ann Gr:Closed": "0.0054",
                        "Seeded:Open": "0.0536",
                        "Sh Dpl:Closed": "0.0508",
                        "Ann Gr Mono:Open": "0.1632",
                        "Late:Closed": "0.0236",
                        "Crst Wht Gr:Open": "0.0560",
                        "Early:Open": "0.0638"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0536",
                        "Ann Gr:Open": "0.0564",
                        "Seeded:Open": "0.0418",
                        "Mid:Closed": "0.0608",
                        "Late:Closed": "0.0384",
                        "Tr Enc:Open": "0.0682",
                        "Tr Ann Gr:Closed": "0.0558",
                        "Late:Open": "0.0284",
                        "Early:Open": "0.0344",
                        "Mid 2:Open": "0.0540"
                    }
                },
                "15": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0756",
                        "Ann Gr:Open": "0.0186",
                        "Sh Ann Gr:Closed": "0.0046",
                        "Seeded:Open": "0.0536",
                        "Sh Dpl:Closed": "0.0496",
                        "Ann Gr Mono:Open": "0.1662",
                        "Late:Closed": "0.0222",
                        "Crst Wht Gr:Open": "0.0560",
                        "Early:Open": "0.0618"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0538",
                        "Ann Gr:Open": "0.0566",
                        "Seeded:Open": "0.0416",
                        "Mid:Closed": "0.0602",
                        "Late:Closed": "0.0376",
                        "Tr Enc:Open": "0.0696",
                        "Tr Ann Gr:Closed": "0.0560",
                        "Late:Open": "0.0272",
                        "Early:Open": "0.0356",
                        "Mid 2:Open": "0.0536"
                    }
                },
                "16": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0740",
                        "Ann Gr:Open": "0.0166",
                        "Sh Ann Gr:Closed": "0.0044",
                        "Seeded:Open": "0.0536",
                        "Sh Dpl:Closed": "0.0490",
                        "Ann Gr Mono:Open": "0.1696",
                        "Late:Closed": "0.0212",
                        "Crst Wht Gr:Open": "0.0560",
                        "Early:Open": "0.0638"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0538",
                        "Ann Gr:Open": "0.0568",
                        "Seeded:Open": "0.0414",
                        "Mid:Closed": "0.0610",
                        "Late:Closed": "0.0376",
                        "Tr Enc:Open": "0.0696",
                        "Tr Ann Gr:Closed": "0.0562",
                        "Late:Open": "0.0266",
                        "Early:Open": "0.0354",
                        "Mid 2:Open": "0.0534"
                    }
                },
                "17": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0754",
                        "Ann Gr:Open": "0.0164",
                        "Sh Ann Gr:Closed": "0.0036",
                        "Seeded:Open": "0.0534",
                        "Sh Dpl:Closed": "0.0482",
                        "Ann Gr Mono:Open": "0.1716",
                        "Late:Closed": "0.0198",
                        "Crst Wht Gr:Open": "0.0560",
                        "Early:Open": "0.0638"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0530",
                        "Ann Gr:Open": "0.0570",
                        "Seeded:Open": "0.0412",
                        "Mid:Closed": "0.0632",
                        "Late:Closed": "0.0366",
                        "Tr Enc:Open": "0.0714",
                        "Tr Ann Gr:Closed": "0.0568",
                        "Late:Open": "0.0252",
                        "Early:Open": "0.0340",
                        "Mid 2:Open": "0.0534"
                    }
                },
                "18": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0776",
                        "Ann Gr:Open": "0.0152",
                        "Sh Ann Gr:Closed": "0.0024",
                        "Seeded:Open": "0.0532",
                        "Sh Dpl:Closed": "0.0478",
                        "Ann Gr Mono:Open": "0.1748",
                        "Late:Closed": "0.0182",
                        "Crst Wht Gr:Open": "0.0560",
                        "Early:Open": "0.0630"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0536",
                        "Ann Gr:Open": "0.0574",
                        "Seeded:Open": "0.0408",
                        "Mid:Closed": "0.0648",
                        "Late:Closed": "0.0366",
                        "Tr Enc:Open": "0.0724",
                        "Tr Ann Gr:Closed": "0.0582",
                        "Late:Open": "0.0236",
                        "Early:Open": "0.0320",
                        "Mid 2:Open": "0.0524"
                    }
                },
                "19": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0756",
                        "Ann Gr:Open": "0.0138",
                        "Sh Ann Gr:Closed": "0.0022",
                        "Seeded:Open": "0.0530",
                        "Sh Dpl:Closed": "0.0476",
                        "Ann Gr Mono:Open": "0.1774",
                        "Late:Closed": "0.0170",
                        "Crst Wht Gr:Open": "0.0560",
                        "Early:Open": "0.0656"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0542",
                        "Ann Gr:Open": "0.0580",
                        "Seeded:Open": "0.0404",
                        "Mid:Closed": "0.0638",
                        "Late:Closed": "0.0358",
                        "Tr Enc:Open": "0.0734",
                        "Tr Ann Gr:Closed": "0.0596",
                        "Late:Open": "0.0222",
                        "Early:Open": "0.0326",
                        "Mid 2:Open": "0.0518"
                    }
                },
                "20": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0760",
                        "Ann Gr:Open": "0.0114",
                        "Sh Ann Gr:Closed": "0.0014",
                        "Seeded:Open": "0.0530",
                        "Sh Dpl:Closed": "0.0472",
                        "Ann Gr Mono:Open": "0.1812",
                        "Late:Closed": "0.0160",
                        "Crst Wht Gr:Open": "0.0560",
                        "Early:Open": "0.0660"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0542",
                        "Ann Gr:Open": "0.0588",
                        "Seeded:Open": "0.0396",
                        "Mid:Closed": "0.0654",
                        "Late:Closed": "0.0362",
                        "Tr Enc:Open": "0.0746",
                        "Tr Ann Gr:Closed": "0.0600",
                        "Late:Open": "0.0214",
                        "Early:Open": "0.0304",
                        "Mid 2:Open": "0.0512"
                    }
                }
            },
            "5": {
                "0": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0526",
                        "Ann Gr:Open": "0.0506",
                        "Sh Ann Gr:Closed": "0.0614",
                        "Seeded:Open": "0.0548",
                        "Sh Dpl:Closed": "0.0524",
                        "Ann Gr Mono:Open": "0.0524",
                        "Late:Closed": "0.0564",
                        "Crst Wht Gr:Open": "0.0550",
                        "Early:Open": "0.0598"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0510",
                        "Ann Gr:Open": "0.0456",
                        "Seeded:Open": "0.0532",
                        "Mid:Closed": "0.0526",
                        "Late:Closed": "0.0484",
                        "Tr Enc:Open": "0.0506",
                        "Tr Ann Gr:Closed": "0.0468",
                        "Late:Open": "0.0474",
                        "Early:Open": "0.0560",
                        "Mid 2:Open": "0.0530"
                    }
                },
                "1": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0586",
                        "Ann Gr:Open": "0.0458",
                        "Sh Ann Gr:Closed": "0.0510",
                        "Seeded:Open": "0.0546",
                        "Sh Dpl:Closed": "0.0524",
                        "Ann Gr Mono:Open": "0.0684",
                        "Late:Closed": "0.0530",
                        "Crst Wht Gr:Open": "0.0550",
                        "Early:Open": "0.0566"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0520",
                        "Ann Gr:Open": "0.0462",
                        "Seeded:Open": "0.0526",
                        "Mid:Closed": "0.0530",
                        "Late:Closed": "0.0478",
                        "Tr Enc:Open": "0.0528",
                        "Tr Ann Gr:Closed": "0.0474",
                        "Late:Open": "0.0452",
                        "Early:Open": "0.0554",
                        "Mid 2:Open": "0.0522"
                    }
                },
                "2": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0626",
                        "Ann Gr:Open": "0.0414",
                        "Sh Ann Gr:Closed": "0.0398",
                        "Seeded:Open": "0.0546",
                        "Sh Dpl:Closed": "0.0524",
                        "Ann Gr Mono:Open": "0.0846",
                        "Late:Closed": "0.0496",
                        "Crst Wht Gr:Open": "0.0550",
                        "Early:Open": "0.0554"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0534",
                        "Ann Gr:Open": "0.0464",
                        "Seeded:Open": "0.0524",
                        "Mid:Closed": "0.0552",
                        "Late:Closed": "0.0456",
                        "Tr Enc:Open": "0.0562",
                        "Tr Ann Gr:Closed": "0.0486",
                        "Late:Open": "0.0418",
                        "Early:Open": "0.0530",
                        "Mid 2:Open": "0.0520"
                    }
                },
                "3": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0620",
                        "Ann Gr:Open": "0.0400",
                        "Sh Ann Gr:Closed": "0.0350",
                        "Seeded:Open": "0.0544",
                        "Sh Dpl:Closed": "0.0516",
                        "Ann Gr Mono:Open": "0.0926",
                        "Late:Closed": "0.0468",
                        "Crst Wht Gr:Open": "0.0550",
                        "Early:Open": "0.0580"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0530",
                        "Ann Gr:Open": "0.0466",
                        "Seeded:Open": "0.0522",
                        "Mid:Closed": "0.0556",
                        "Late:Closed": "0.0444",
                        "Tr Enc:Open": "0.0580",
                        "Tr Ann Gr:Closed": "0.0488",
                        "Late:Open": "0.0398",
                        "Early:Open": "0.0532",
                        "Mid 2:Open": "0.0530"
                    }
                },
                "4": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0638",
                        "Ann Gr:Open": "0.0366",
                        "Sh Ann Gr:Closed": "0.0284",
                        "Seeded:Open": "0.0544",
                        "Sh Dpl:Closed": "0.0518",
                        "Ann Gr Mono:Open": "0.1032",
                        "Late:Closed": "0.0426",
                        "Crst Wht Gr:Open": "0.0550",
                        "Early:Open": "0.0596"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0532",
                        "Ann Gr:Open": "0.0476",
                        "Seeded:Open": "0.0512",
                        "Mid:Closed": "0.0572",
                        "Late:Closed": "0.0438",
                        "Tr Enc:Open": "0.0594",
                        "Tr Ann Gr:Closed": "0.0492",
                        "Late:Open": "0.0390",
                        "Early:Open": "0.0514",
                        "Mid 2:Open": "0.0526"
                    }
                },
                "5": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0636",
                        "Ann Gr:Open": "0.0338",
                        "Sh Ann Gr:Closed": "0.0232",
                        "Seeded:Open": "0.0544",
                        "Sh Dpl:Closed": "0.0518",
                        "Ann Gr Mono:Open": "0.1120",
                        "Late:Closed": "0.0394",
                        "Crst Wht Gr:Open": "0.0550",
                        "Early:Open": "0.0622"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0534",
                        "Ann Gr:Open": "0.0480",
                        "Seeded:Open": "0.0510",
                        "Mid:Closed": "0.0588",
                        "Late:Closed": "0.0422",
                        "Tr Enc:Open": "0.0600",
                        "Tr Ann Gr:Closed": "0.0500",
                        "Late:Open": "0.0380",
                        "Early:Open": "0.0498",
                        "Mid 2:Open": "0.0534"
                    }
                },
                "6": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0650",
                        "Ann Gr:Open": "0.0306",
                        "Sh Ann Gr:Closed": "0.0186",
                        "Seeded:Open": "0.0542",
                        "Sh Dpl:Closed": "0.0508",
                        "Ann Gr Mono:Open": "0.1214",
                        "Late:Closed": "0.0364",
                        "Crst Wht Gr:Open": "0.0550",
                        "Early:Open": "0.0634"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0540",
                        "Ann Gr:Open": "0.0488",
                        "Seeded:Open": "0.0502",
                        "Mid:Closed": "0.0592",
                        "Late:Closed": "0.0410",
                        "Tr Enc:Open": "0.0632",
                        "Tr Ann Gr:Closed": "0.0506",
                        "Late:Open": "0.0366",
                        "Early:Open": "0.0486",
                        "Mid 2:Open": "0.0524"
                    }
                },
                "7": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0674",
                        "Ann Gr:Open": "0.0280",
                        "Sh Ann Gr:Closed": "0.0150",
                        "Seeded:Open": "0.0540",
                        "Sh Dpl:Closed": "0.0504",
                        "Ann Gr Mono:Open": "0.1284",
                        "Late:Closed": "0.0326",
                        "Crst Wht Gr:Open": "0.0550",
                        "Early:Open": "0.0646"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0536",
                        "Ann Gr:Open": "0.0498",
                        "Seeded:Open": "0.0492",
                        "Mid:Closed": "0.0622",
                        "Late:Closed": "0.0416",
                        "Tr Enc:Open": "0.0654",
                        "Tr Ann Gr:Closed": "0.0512",
                        "Late:Open": "0.0338",
                        "Early:Open": "0.0460",
                        "Mid 2:Open": "0.0518"
                    }
                },
                "8": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0682",
                        "Ann Gr:Open": "0.0248",
                        "Sh Ann Gr:Closed": "0.0136",
                        "Seeded:Open": "0.0540",
                        "Sh Dpl:Closed": "0.0504",
                        "Ann Gr Mono:Open": "0.1336",
                        "Late:Closed": "0.0314",
                        "Crst Wht Gr:Open": "0.0550",
                        "Early:Open": "0.0644"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0534",
                        "Ann Gr:Open": "0.0500",
                        "Seeded:Open": "0.0490",
                        "Mid:Closed": "0.0634",
                        "Late:Closed": "0.0408",
                        "Tr Enc:Open": "0.0664",
                        "Tr Ann Gr:Closed": "0.0520",
                        "Late:Open": "0.0334",
                        "Early:Open": "0.0448",
                        "Mid 2:Open": "0.0514"
                    }
                },
                "9": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0668",
                        "Ann Gr:Open": "0.0224",
                        "Sh Ann Gr:Closed": "0.0112",
                        "Seeded:Open": "0.0540",
                        "Sh Dpl:Closed": "0.0498",
                        "Ann Gr Mono:Open": "0.1398",
                        "Late:Closed": "0.0300",
                        "Crst Wht Gr:Open": "0.0548",
                        "Early:Open": "0.0666"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0538",
                        "Ann Gr:Open": "0.0504",
                        "Seeded:Open": "0.0486",
                        "Mid:Closed": "0.0638",
                        "Late:Closed": "0.0402",
                        "Tr Enc:Open": "0.0672",
                        "Tr Ann Gr:Closed": "0.0528",
                        "Late:Open": "0.0322",
                        "Early:Open": "0.0446",
                        "Mid 2:Open": "0.0510"
                    }
                },
                "10": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0678",
                        "Ann Gr:Open": "0.0212",
                        "Sh Ann Gr:Closed": "0.0094",
                        "Seeded:Open": "0.0540",
                        "Sh Dpl:Closed": "0.0488",
                        "Ann Gr Mono:Open": "0.1442",
                        "Late:Closed": "0.0276",
                        "Crst Wht Gr:Open": "0.0548",
                        "Early:Open": "0.0676"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0552",
                        "Ann Gr:Open": "0.0506",
                        "Seeded:Open": "0.0484",
                        "Mid:Closed": "0.0630",
                        "Late:Closed": "0.0394",
                        "Tr Enc:Open": "0.0674",
                        "Tr Ann Gr:Closed": "0.0536",
                        "Late:Open": "0.0312",
                        "Early:Open": "0.0444",
                        "Mid 2:Open": "0.0514"
                    }
                },
                "11": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0716",
                        "Ann Gr:Open": "0.0194",
                        "Sh Ann Gr:Closed": "0.0072",
                        "Seeded:Open": "0.0540",
                        "Sh Dpl:Closed": "0.0486",
                        "Ann Gr Mono:Open": "0.1488",
                        "Late:Closed": "0.0250",
                        "Crst Wht Gr:Open": "0.0548",
                        "Early:Open": "0.0660"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0556",
                        "Ann Gr:Open": "0.0514",
                        "Seeded:Open": "0.0476",
                        "Mid:Closed": "0.0654",
                        "Late:Closed": "0.0386",
                        "Tr Enc:Open": "0.0680",
                        "Tr Ann Gr:Closed": "0.0542",
                        "Late:Open": "0.0306",
                        "Early:Open": "0.0428",
                        "Mid 2:Open": "0.0504"
                    }
                },
                "12": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0714",
                        "Ann Gr:Open": "0.0188",
                        "Sh Ann Gr:Closed": "0.0056",
                        "Seeded:Open": "0.0540",
                        "Sh Dpl:Closed": "0.0472",
                        "Ann Gr Mono:Open": "0.1528",
                        "Late:Closed": "0.0232",
                        "Crst Wht Gr:Open": "0.0548",
                        "Early:Open": "0.0676"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0560",
                        "Ann Gr:Open": "0.0516",
                        "Seeded:Open": "0.0474",
                        "Mid:Closed": "0.0668",
                        "Late:Closed": "0.0376",
                        "Tr Enc:Open": "0.0686",
                        "Tr Ann Gr:Closed": "0.0554",
                        "Late:Open": "0.0294",
                        "Early:Open": "0.0418",
                        "Mid 2:Open": "0.0500"
                    }
                },
                "13": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0724",
                        "Ann Gr:Open": "0.0180",
                        "Sh Ann Gr:Closed": "0.0046",
                        "Seeded:Open": "0.0540",
                        "Sh Dpl:Closed": "0.0468",
                        "Ann Gr Mono:Open": "0.1558",
                        "Late:Closed": "0.0222",
                        "Crst Wht Gr:Open": "0.0548",
                        "Early:Open": "0.0668"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0556",
                        "Ann Gr:Open": "0.0526",
                        "Seeded:Open": "0.0466",
                        "Mid:Closed": "0.0698",
                        "Late:Closed": "0.0380",
                        "Tr Enc:Open": "0.0686",
                        "Tr Ann Gr:Closed": "0.0558",
                        "Late:Open": "0.0280",
                        "Early:Open": "0.0398",
                        "Mid 2:Open": "0.0498"
                    }
                },
                "14": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0734",
                        "Ann Gr:Open": "0.0170",
                        "Sh Ann Gr:Closed": "0.0040",
                        "Seeded:Open": "0.0540",
                        "Sh Dpl:Closed": "0.0460",
                        "Ann Gr Mono:Open": "0.1586",
                        "Late:Closed": "0.0210",
                        "Crst Wht Gr:Open": "0.0548",
                        "Early:Open": "0.0666"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0558",
                        "Ann Gr:Open": "0.0528",
                        "Seeded:Open": "0.0464",
                        "Mid:Closed": "0.0714",
                        "Late:Closed": "0.0376",
                        "Tr Enc:Open": "0.0698",
                        "Tr Ann Gr:Closed": "0.0560",
                        "Late:Open": "0.0278",
                        "Early:Open": "0.0386",
                        "Mid 2:Open": "0.0484"
                    }
                },
                "15": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0750",
                        "Ann Gr:Open": "0.0142",
                        "Sh Ann Gr:Closed": "0.0032",
                        "Seeded:Open": "0.0540",
                        "Sh Dpl:Closed": "0.0458",
                        "Ann Gr Mono:Open": "0.1626",
                        "Late:Closed": "0.0186",
                        "Crst Wht Gr:Open": "0.0548",
                        "Early:Open": "0.0672"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0556",
                        "Ann Gr:Open": "0.0534",
                        "Seeded:Open": "0.0458",
                        "Mid:Closed": "0.0722",
                        "Late:Closed": "0.0374",
                        "Tr Enc:Open": "0.0694",
                        "Tr Ann Gr:Closed": "0.0568",
                        "Late:Open": "0.0270",
                        "Early:Open": "0.0378",
                        "Mid 2:Open": "0.0492"
                    }
                },
                "16": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0776",
                        "Ann Gr:Open": "0.0130",
                        "Sh Ann Gr:Closed": "0.0026",
                        "Seeded:Open": "0.0538",
                        "Sh Dpl:Closed": "0.0454",
                        "Ann Gr Mono:Open": "0.1650",
                        "Late:Closed": "0.0182",
                        "Crst Wht Gr:Open": "0.0548",
                        "Early:Open": "0.0650"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0548",
                        "Ann Gr:Open": "0.0540",
                        "Seeded:Open": "0.0452",
                        "Mid:Closed": "0.0718",
                        "Late:Closed": "0.0364",
                        "Tr Enc:Open": "0.0712",
                        "Tr Ann Gr:Closed": "0.0570",
                        "Late:Open": "0.0264",
                        "Early:Open": "0.0392",
                        "Mid 2:Open": "0.0486"
                    }
                },
                "17": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0770",
                        "Ann Gr:Open": "0.0128",
                        "Sh Ann Gr:Closed": "0.0026",
                        "Seeded:Open": "0.0536",
                        "Sh Dpl:Closed": "0.0450",
                        "Ann Gr Mono:Open": "0.1662",
                        "Late:Closed": "0.0170",
                        "Crst Wht Gr:Open": "0.0548",
                        "Early:Open": "0.0664"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0556",
                        "Ann Gr:Open": "0.0542",
                        "Seeded:Open": "0.0450",
                        "Mid:Closed": "0.0734",
                        "Late:Closed": "0.0364",
                        "Tr Enc:Open": "0.0718",
                        "Tr Ann Gr:Closed": "0.0576",
                        "Late:Open": "0.0250",
                        "Early:Open": "0.0384",
                        "Mid 2:Open": "0.0472"
                    }
                },
                "18": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0778",
                        "Ann Gr:Open": "0.0116",
                        "Sh Ann Gr:Closed": "0.0018",
                        "Seeded:Open": "0.0536",
                        "Sh Dpl:Closed": "0.0446",
                        "Ann Gr Mono:Open": "0.1686",
                        "Late:Closed": "0.0162",
                        "Crst Wht Gr:Open": "0.0548",
                        "Early:Open": "0.0664"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0566",
                        "Ann Gr:Open": "0.0552",
                        "Seeded:Open": "0.0442",
                        "Mid:Closed": "0.0744",
                        "Late:Closed": "0.0362",
                        "Tr Enc:Open": "0.0718",
                        "Tr Ann Gr:Closed": "0.0582",
                        "Late:Open": "0.0246",
                        "Early:Open": "0.0362",
                        "Mid 2:Open": "0.0472"
                    }
                },
                "19": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0780",
                        "Ann Gr:Open": "0.0108",
                        "Sh Ann Gr:Closed": "0.0018",
                        "Seeded:Open": "0.0536",
                        "Sh Dpl:Closed": "0.0440",
                        "Ann Gr Mono:Open": "0.1704",
                        "Late:Closed": "0.0154",
                        "Crst Wht Gr:Open": "0.0548",
                        "Early:Open": "0.0666"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0574",
                        "Ann Gr:Open": "0.0552",
                        "Seeded:Open": "0.0442",
                        "Mid:Closed": "0.0744",
                        "Late:Closed": "0.0360",
                        "Tr Enc:Open": "0.0710",
                        "Tr Ann Gr:Closed": "0.0584",
                        "Late:Open": "0.0248",
                        "Early:Open": "0.0358",
                        "Mid 2:Open": "0.0474"
                    }
                },
                "20": {
                    "Basin Big Sagebrush Upland": {
                        "Mid:Open": "0.0808",
                        "Ann Gr:Open": "0.0102",
                        "Sh Ann Gr:Closed": "0.0014",
                        "Seeded:Open": "0.0534",
                        "Sh Dpl:Closed": "0.0442",
                        "Ann Gr Mono:Open": "0.1718",
                        "Late:Closed": "0.0142",
                        "Crst Wht Gr:Open": "0.0548",
                        "Early:Open": "0.0646"
                    },
                    "Curleaf Mountain Mahogany": {
                        "Mid:Open": "0.0582",
                        "Ann Gr:Open": "0.0558",
                        "Seeded:Open": "0.0440",
                        "Mid:Closed": "0.0760",
                        "Late:Closed": "0.0352",
                        "Tr Enc:Open": "0.0710",
                        "Tr Ann Gr:Closed": "0.0586",
                        "Late:Open": "0.0240",
                        "Early:Open": "0.0342",
                        "Mid 2:Open": "0.0476"
                    }
                }
            }
        }

        veg_type = 'Basin Big Sagebrush Upland'

        //Restructure Dictionary
        chart_dict = {}
        $.each(test_results[1], function (timestep, results_dict) {
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

        // Go through each veg type in the results
        chart_count=1
        $.each(chart_dict, function(veg_type,value) {

            chart_div_id="chart_" + chart_count

            //add a new chart div
            $("#area_charts").append("<div id='" + chart_div_id + "'></div>")

            createAreaChart(veg_type,chart_div_id)

            ac = $('#'+chart_div_id).highcharts()

            $.each(chart_dict[veg_type], function (state_class_name, values_array) {
                var veg_color = "blue"
                console.log(values_array)

                ac.addSeries({
                    name: state_class_name,
                    //color: veg_color,
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






