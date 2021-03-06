var allMonitor = [];
var allDetect = [];
var x_left = convertToLatitu("118:42:00");
var x_right = convertToLatitu("124:18:00");
var y_up = convertToLatitu("33:45:00");
var y_down = convertToLatitu("29:21:00");
var enableDays = [];
postData = {};
historyData = [];

function get_mmsi_selected()
{
	var ret = {};
	if(detailed[project_selected].mmsi.length>0)
	{
		var tmp = detailed[project_selected].mmsi.split(";");
		for (var i = 0;i <tmp.length;++i)
		{
			ret[tmp[i]] = 0;
		}
	}
	return ret;
}

function RTMonInit()
{
	if(project_selected<0)
	{
		alert("请在页面顶部选择需要查看的工程！ ");
		return;
	}
	if(!(project_selected in detailed))
	{
		alert("选中数据异常！");
		return;
	}
	project_submenu_selected = 31;
	CleanAll();
	$("#L2").attr("class", "LeftTextSelect");
	$("#L2L2").attr("class", "LeftTextSelect");
	$("#L2L2L1").attr("class", "LeftTextSelect");
	mmsi_project_selected = get_mmsi_selected();
	
	$.ajax({
        method: "GET",
        url: "/shanggang/ship/list",
        success: function (data) {
        	fillMmsiData(data);
			var select_mmsi = document.getElementById("monitor_search");
			while(select_mmsi.hasChildNodes()) 
			{
				select_mmsi.removeChild(select_mmsi.firstChild);
			}
			var entry = "";
			for (var m in allMmsi) {
				if(m in mmsi_project_selected){
					entry += '<option value="'+m+'">'+ m+'---'+allMmsi[m].shipname +'</option>';
				}
			}
			$("#monitor_search").append(entry);
			$("#monitor_search").val("");
            },
		error: function () {       
            alert("fail");
        }  
    });
	allMonitor = [];
	historyData = [];
	delete_object();
	//console.log(API_DelAllShips());
	ClearPlayShipInfo();
	$("#toolbar").hide();
	//document.getElementById("btn_delete").setAttribute("disabled", true)
	
	$("#monitor_show").off('click');
	$("#monitor_show").click(function(){
		delete_object();
		API_DelAllShips();
		ClearPlayShipInfo();
		var arrselections = $("#table").bootstrapTable('getSelections');
        if (arrselections.length > 1) {
            return;
        }
        if (arrselections.length <= 0) {
            return;
        }
		$('html, body').animate({
        scrollTop: $("#mapBody").offset().top
		}, 100);
		//PlayShipHistoryTracks('ship');
		Test_AddShip(arrselections[0].mmsi);
		return false;
	})
	
	$("#mapBody").show();
	$("#startup_table_div").hide();
	$("#data_clean").hide();
	$("#detail_information").hide();
	$("#detailtable").hide();
	$("#info_div").hide();
	$("#monitor_search_modal").show();
	$("#stat_start_end_time").hide();
	$("#project_progress").hide();
	$("#history_time").hide();
	$("#monitor_button").show();
	$("#monitor_show").show();
	$("#monitor_search").show();
	$("#error_mark").hide();
	$("#error_handle").hide();
	$("#handle_checkbox").hide();
	$("#handle_checkbox_label").hide();
	$("#monitor_search").off('change');
	$("#monitor_search").val("");
	$("#monitor_button").off('click');
	$("#monitor_button").click(function(){MonitorSearch();})

	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allMonitor,
	pagination: true,
    height: 380,
    pageSize: 5,
	clickToSelect: true,
	singleSelect:true,

    columns: [
	{checkbox: true},
	{
        field: 'mmsi',
        title: 'MMSI'
    }, 
	{
        field: 'lon',
        title: '经度'
    }, 
	{
        field: 'lat',
        title: '纬度'
    }, 
	{
        field: 'co',
        title: '航向'
    },
	{
        field: 'sp',
        title: '速度'
    },
	{
        field: 'ti',
        title: '时间'
    },
	{
        field: 'status',
        title: '航行状态'
    },
	{
        field: 'dest',
        title: '目的港'
    },
	{
        field: 'rot',
        title: '转向率'
    },
	{
        field: 'draft',
        title: '吃水'
    }
	]});
    $('#datatable').show();
}

function RefreshMonitorTable()
{
	$('#datatable').hide();
	$('#table').bootstrapTable('load', allMonitor); 
	$('#datatable').show();
}

function fillMonitorData(data)
{
	allMonitor = [];
	if (data.length>0){
		allMonitor.push({"mmsi":data[0].mmsi,"start_lon":data[0].lon,"start_lat":data[0].lat,
	"end_lon":data[data.length-1].lon,"end_lat":data[data.length-1].lat,"num":data.length});
	}
	historyData = [];
	for(var i = 0;i<data.length;++i)
		{
		historyData.push({"co":data[i].co,"dest":data[i].dest,
			"draft":data[i].draft,"lat":data[i].lat,"lon":data[i].lon,
			"mmsi":data[i].mmsi,"rot":data[i].rot,"sp":data[i].sp,
			"status":data[i].status,"ti":data[i].ti});
		}
}

function MonitorSearch()
{
	postData["mmsi"] = $('#monitor_search').val();
	$.ajax({
        method: "POST",
        url: "/shanggang/shipinfo/listnewinfo",
		data: JSON.stringify(postData),
		contentType:"application/json",
        success: function (data) {
			if (data.length>0)
			{
				allMonitor = [];
				allMonitor.push({"co":data[0].co,"dest":data[0].dest,
				"draft":data[0].draft,"lat":data[0].lat,"lon":data[0].lon,
				"mmsi":data[0].mmsi,"rot":data[0].rot,"sp":data[0].sp,
				"status":data[0].status,"ti":data[0].ti});
			}
			RefreshMonitorTable();
            },
		error: function () {       
            alert("fail");
        }  
    });
}

function HSMonInit()
{
	//API_SetMapViewCenter(121.668, 31.338, 160000);
	if(project_selected<0)
	{
		alert("请在页面顶部选择需要查看的工程！ ");
		return;
	}
	if(!(project_selected in detailed))
	{
		alert("选中数据异常！");
		return;
	}
	project_submenu_selected = 32;
	CleanAll();
	$("#L2").attr("class", "LeftTextSelect");
	$("#L2L2").attr("class", "LeftTextSelect");
	$("#L2L2L2").attr("class", "LeftTextSelect");
	mmsi_project_selected = get_mmsi_selected();
	
	$.ajax({
        method: "GET",
        url: "/shanggang/ship/list",
        success: function (data) {
        	fillMmsiData(data);
			var select_mmsi = document.getElementById("monitor_search");
			while(select_mmsi.hasChildNodes()) 
			{
				select_mmsi.removeChild(select_mmsi.firstChild);
			}
			var entry = "";
			for (var m in allMmsi) {
				if(m in mmsi_project_selected){
					entry += '<option value="'+m+'">'+ m+'---'+allMmsi[m].shipname +'</option>';
				}
			}
			$("#monitor_search").append(entry);
			$("#monitor_search").val("");
            },
		error: function () {       
            alert("fail");
        }  
    });
	allMonitor = [];
	historyData = [];
	delete_object();
	API_DelAllShips();
	ClearPlayShipInfo();
	$("#toolbar").hide();
	$("#btn_backup").hide();
	$("#btn_add").hide();
	$("#btn_edit").hide();
	$("#btn_delete").hide();
	$("#btn_show").hide();
	$("#monitor_show").off('click');
	$("#monitor_show").click(function(){
		delete_object();
		API_DelAllShips();
		ClearPlayShipInfo();
		var arrselections = $("#table").bootstrapTable('getSelections');
		
		if (historyData.length>0){
			if(is_data_valid(historyData))
			{
				$('html, body').animate({
				scrollTop: $("#mapBody").offset().top
				}, 100);
				PlayShipHistoryTracks('ship', historyData);
				return false;
			}
			else{
				alert("船舶位置不在上海海域！ ");
				return false;
			}
		}
		else{
			alert("数据库中没有这段时间关于该船的记录！ ");
		}
	})
	var today_str = GetTodayDate();
	$("#mapBody").show();
	$("#startup_table_div").hide();
	$("#data_clean").hide();
	$("#detail_information").hide();
	$("#detailtable").hide();
	$("#info_div").hide();
	$("#monitor_search_modal").show();
	$("#stat_start_end_time").hide();
	$("#project_progress").hide();
	$("#history_time").show();
	$("#monitor_start_label").show();
	$("#monitor_start").show();
	$("#monitor_end_label").show();
	$("#monitor_end").show();
	$("#monitor_select_label").hide();
	$("#monitor_select").hide();
	$("#monitor_search").off('change');
	$("#monitor_search").val("");
	$("#monitor_start").val(today_str+"T00:00");
	$("#monitor_end").val(today_str+"T23:59");
	$("#monitor_button").show();
	$("#monitor_show").show();
	$("#monitor_search").show();
	$("#error_mark").hide();
	$("#error_handle").hide();
	$("#handle_checkbox").hide();
	$("#handle_checkbox_label").hide();
	$("#monitor_button").off('click');
	$("#monitor_button").click(function(){HSMonitorSearch();})

	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allMonitor,
	pagination: true,
    height: 300,
    pageSize: 5,
	clickToSelect: true,
	singleSelect:true,

    columns: [
	{checkbox: true},
	{
        field: 'mmsi',
        title: 'MMSI'
    }, 
	{
        field: 'start_lon',
        title: '起点经度'
    }, 
	{
        field: 'start_lat',
        title: '起点纬度'
    },
	{
        field: 'end_lon',
        title: '终点经度'
    }, 
	{
        field: 'end_lat',
        title: '终点纬度'
    }, 
	{
        field: 'num',
        title: '轨迹点个数'
    }
	]});
    $('#datatable').show();
}

function HSMonitorSearch()
{
	postData["mmsi"] = $('#monitor_search').val();
	postData["starttime"] = $('#monitor_start').val();
	postData["endtime"] = $('#monitor_end').val();
	$.ajax({
        method: "POST",
        url: "/shanggang/shipinfo/listinfoduring",
		data: JSON.stringify(postData),
		contentType:"application/json",
        success: function (data) {
			console.log(data);
			fillMonitorData(data);
			RefreshMonitorTable();
            },
		error: function () {       
            alert("查询失败！");
        }  
    });
}

function DTMonInit()
{
	if(project_selected<0)
	{
		alert("请在页面顶部选择需要查看的工程！ ");
		return;
	}
	if(!(project_selected in detailed))
	{
		alert("选中数据异常！");
		return;
	}
	project_submenu_selected = 33;
	CleanAll();
	$("#L2").attr("class", "LeftTextSelect");
	$("#L2L2").attr("class", "LeftTextSelect");
	$("#L2L2L3").attr("class", "LeftTextSelect");
	mmsi_project_selected = get_mmsi_selected();
	
	$.ajax({
        method: "GET",
        url: "/shanggang/ship/list",
        success: function (data) {
        	fillMmsiData(data);
			var select_mmsi = document.getElementById("monitor_search");
			while(select_mmsi.hasChildNodes()) 
			{
				select_mmsi.removeChild(select_mmsi.firstChild);
			}
			var entry = "";
			for (var m in allMmsi) {
				if(m in mmsi_project_selected){
					entry += '<option value="'+m+'">'+ m+'---'+allMmsi[m].shipname +'</option>';
				}
			}
			$("#monitor_search").append(entry);
			$("#monitor_search").val("");
            },
		error: function () {       
            alert("查询失败！");
        }  
    });
	allDetect = [];
	delete_object();
	API_DelAllShips();
	ClearPlayShipInfo();
	$("#toolbar").hide();
	$("#btn_backup").hide();
	$("#btn_add").hide();
	$("#btn_edit").hide();
	$("#btn_delete").hide();
	$("#btn_show").hide();
	$("#monitor_show").off('click');
	$("#monitor_show").click(function(){
		delete_object();
		API_DelAllShips();
		ClearPlayShipInfo();
		var arrselections = $("#table").bootstrapTable('getSelections');
		postData["mmsi"] = arrselections[0].mmsi;
		//postData["starttime"] = arrselections[0].start_time;
		//postData["endtime"] = arrselections[0].end_time;
		postData["starttime"] = arrselections[0].indred;
		postData["endtime"] = arrselections[0].exitdump;
		$.ajax({
			method: "POST",
			url: "/shanggang/shipinfo/listinfoduring",
			data: JSON.stringify(postData),
			contentType:"application/json",
			success: function (data) {
				fillMonitorData(data);
				console.log(historyData);
				if (historyData.length>0)
				{
					if(is_data_valid(historyData))
					{
						var dredgingid = arrselections[0].dredging_id;
						if(dredgingid in allDredging)
						{
							var arrObjPo = [];
							for(var i = 0;i<sj_coorDict[dredgingid].length;++i)
							{
								arrObjPo.push({x:convertToLatitu(sj_coorDict[dredgingid][i].x),y:convertToLatitu(sj_coorDict[dredgingid][i].y)})
							}
							if(arrObjPo.length == 0){
								alert("疏浚区域位置数据缺失！ ")
							}
							draw_area_board(arrObjPo);
						}
		
						var dumpingid = arrselections[0].dumping_id;
						if(dumpingid in allDumping)
						{
							var arrObjPo = [];
							for(var i = 0;i<coorDict[dumpingid].length;++i)
							{
								arrObjPo.push({x:convertToLatitu(coorDict[dumpingid][i].x),y:convertToLatitu(coorDict[dumpingid][i].y)})
							}
							if(arrObjPo.length == 0){
								alert("抛泥区域位置数据缺失！ ")
							}
							draw_area(arrObjPo);
						}
		
						routeid = arrselections[0].route_id;
						var buttomPoint = routeCoorDict[routeid];
						var coorNum = buttomPoint.length;
						if(coorNum > 0){
							API_SetMapViewCenter(convertToLatitu(buttomPoint[0].x)/10000000, convertToLatitu(buttomPoint[0].y)/10000000, 80000);
							var arrObjPo = [];
							for (var i = 0; i < coorNum; i++) {
								arrObjPo.push({x:convertToLatitu(buttomPoint[i].x),y:convertToLatitu(buttomPoint[i].y)});
							}
							AddNewLine(arrObjPo);
						}
						else{
							alert("航线坐标点数据缺失！")
						}
						$('html, body').animate({
						scrollTop: $("#mapBody").offset().top
						}, 100);
						PlayShipHistoryTracks('ship', historyData);
						return false;
					}
					else{
						alert("船舶位置不在上海海域！ ");
						return false;
					}
					
				}
				else{
					alert("数据库中没有这段时间关于该船的记录！ ");
				}
			},
			error: function () {       
				alert("查询失败！");
			}  
		});
	})
	
	$("#mapBody").show();
	$("#startup_table_div").hide();
	$("#data_clean").hide();
	$("#detail_information").hide();
	$("#detailtable").hide();
	$("#info_div").hide();
	$("#monitor_search_modal").show();
	$("#stat_start_end_time").hide();
	$("#project_progress").hide();
	$("#history_time").show();
	$("#monitor_start_label").hide();
	$("#monitor_start").hide();
	$("#monitor_end_label").hide();
	$("#monitor_end").hide();
	$("#monitor_select_label").show();
	$("#monitor_select").show();
	$("#monitor_select").val("");
	$("#monitor_search").val("");
	$("#monitor_search").off('change');
	$("#monitor_search").change(function(){available_date();});
	$("#monitor_button").show();
	$("#monitor_show").show();
	$("#monitor_search").show();
	$("#error_mark").hide();
	$("#error_handle").hide();
	$("#handle_checkbox").hide();
	$("#handle_checkbox_label").hide();
	$("#monitor_button").off('click');
	$("#monitor_button").click(function(){DTMonitorSearch();})

	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allDetect,
	pagination: true,
    //height: 300,
    pageSize: 5,
	clickToSelect: true,
	singleSelect:true,

    columns: [
	{checkbox: true},
	{
        field: 'mmsi',
        title: 'MMSI'
    },
	{
        field: 'indred',
        title: '进入施工区域'
    }, 
	{
        field: 'exitdred',
        title: '离开施工区域'
    },
	{
        field: 'indump',
        title: '进入抛泥区域'
    }, 
	{
        field: 'exitdump',
        title: '离开抛泥区域'
    }
	]});
    $('#datatable').show();
}

function DTMonitorSearch()
{
	postData["mmsi"] = $('#monitor_search').val();
	/*postData["starttime"] = $('#monitor_start').val();
	postData["endtime"] = $('#monitor_end').val();
	$.ajax({
        method: "POST",
        url: "/shanggang/shipinfo/flowofday",
		data: JSON.stringify(postData),
		contentType:"application/json",
        success: function (data) {
			console.log(data);
			fillDetectData(data);
			RefreshDetectTable();
            },
		error: function () {       
            alert("查询失败！");
        }  
    });*/
	postData["date"] = $('#monitor_select').val();
	console.log(postData);
	$.ajax({
        method: "POST",
        url: "/shanggang/workrecord/daterecord",
		data: JSON.stringify(postData),
		contentType:"application/json",
        success: function (data) {
			console.log(data);
			//fillDetectData(data);
			fillDateData(data);
			RefreshDetectTable();
            },
		error: function () {       
            alert("查询失败！");
        }  
    });
}

function fillDateData(data)
{
	allDetect = [];
	for(var i = 0;i<data.length;++i){
		allDetect.push({"mmsi":data[i].mmsi,"exitdred":data[i].exitdred,"exitdump":data[i].exitdump,
		"indred":data[i].indred,"indump":data[i].indump, "route_id":data[i].route_id, "dredging_id":data[i].work_area,"dumping_id":data[i].dumping_area});
	}
}

function fillDetectData(data)
{
	allDetect = [];
	for(var i = 0;i<data.length;++i){
		allDetect.push({"mmsi":$('#monitor_search').val(),"start_lon":"-","start_lat":"-",
		"end_lon":"-","end_lat":"-","num":"-","start_time":data[i].split(';')[0],"end_time":data[i].split(';')[1]});
	}
}

function RefreshDetectTable()
{
	$('#datatable').hide();
	$('#table').bootstrapTable('load', allDetect); 
	$('#datatable').show();
}

function is_point_valid(x,y)
{
	var tmp_x = x*10000000;
	var tmp_y = y*10000000;
	
	return tmp_x>x_left && tmp_x<x_right && tmp_y>y_down && tmp_y<y_up;
}

function is_data_valid(data)
{
	for(var i = 0;i<data.length;++i)
	{
		if(!is_point_valid(parseFloat(data[i].lon), parseFloat(data[i].lat)))
		{
			console.log(data[i]);
			return false; 
		}
	}
	return true;
}

function GetTodayDate()
{
	var now = new Date();
	var str = now.getFullYear() + "-" + FormatNumber((now.getMonth() + 1),2) + "-" + FormatNumber(now.getDate(),2);
	return str;
}

function FormatNumber(num, length) {
  return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
}

function available_date()
{
	postData = {};
	postData["mmsi"] = $('#monitor_search').val();
	postData["project_id"] = project_selected;
	$.ajax({
        method: "POST",
        url: "/shanggang/workrecord/recorddate",
		data: JSON.stringify(postData),
		contentType:"application/json",
        success: function (data) {
			console.log(data);
			enableDays = [];
			for(var i = 0;i<data.length;++i){
				enableDays.push(data[i]);
			}
			$("#monitor_select").datepicker('destroy');
			$('#monitor_select').datepicker({dateFormat: 'yy-mm-dd', beforeShowDay: enableAllTheseDays});
			if (enableDays.length == 0)
			{
				alert("没有关于这艘船的轨迹检测数据！ ");
				$("#monitor_select").val("");
			}
			else{
				$("#monitor_select").val(enableDays[0]);
			}
        },
		error: function () {       
            alert("查询失败！");
        }  
    });
}

function enableAllTheseDays(date) {
	var sdate = $.datepicker.formatDate( 'yy-mm-dd', date)
	if($.inArray(sdate, enableDays) != -1) {
		return [true];
	}
	return [false];
}