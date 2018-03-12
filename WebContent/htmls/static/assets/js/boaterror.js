var allBoatError = [];
var allError = [];
var postData = {};
var abtype = "";
var dirt_abnormal_type = {0:"正常",1:"未驶入抛泥区",2:"抛泥区错误", 3:"船舶位置异常", 4:"抛泥区内时间异常", 5:"作业区内时间异常"};
var dirt_type_selected = 0;
function BoatErrorInit()
{
	$('#data_clean').hide();
	$('#mapBody').hide();
	$("#monitor_search_modal").show();
	$('#toolbar').show();
	$.ajax({
        method: "GET",
        url: "/shanggang/abnormalinfo/listallabnormal",
        success: function (data) {
        	fillBoatError(data);
			InitBoatErrorTable();
            },
		error: function () {       
            alert("fail");
        }  
    });
}

function fillBoatError(data)
{
	console.log(data);
	allBoatError = [];
	for(var i = 0;i<data.length;++i)
		{
		allBoatError.push(
		{"mmsi":data[i].mmsi,"type":data[i].abnormal_type,
			"lon":data[i].lon,"lat":data[i].lat,
			"time":data[i].time,"level":1}
		);
		}
}

function InitBoatErrorTable() {
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allBoatError,
    height:280,
	pagination: true,
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
        field: 'type',
        title: '异常类型'
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
        field: 'time',
        title: '异常时间'
    },
	{
        field: 'level',
        title: '评级'
    }
	]});
    $('#datatable').show();
}

function DirtError(i)
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
	dirt_type_selected = i;
	project_submenu_selected = 40+i;
	CleanAll();
	$("#L2").attr("class", "LeftTextSelect");
	$("#L2L3").attr("class", "LeftTextSelect");
	$("#L2L3L"+i).attr("class", "LeftTextSelect");
	
	API_DelAllShips();
	delete_object();
	ClearPlayShipInfo();
	abtype = "Dumping_area Abnormal";
	$("#toolbar").hide();
	$("#btn_backup").hide();
	$("#btn_add").hide();
	$("#btn_edit").hide();
	$("#btn_delete").hide();
	$("#btn_show").hide();
	$("#detailtable").hide();
	$("#info_div").hide();
	
	$("#monitor_button").off('click');
	$("#monitor_show").off('click');
	$("#monitor_show").click(function(){
		//draw_all_paoni();
		var arrselections = $("#table").bootstrapTable('getSelections');
			console.log(arrselections);
            if (arrselections.length > 1) {
                return;
            }
            if (arrselections.length <= 0) {
                return;
            }
		delete_object();
		ClearPlayShipInfo();
		postData["starttime"] = arrselections[0].indred;
		postData["endtime"] = arrselections[0].exitdump;
		postData["mmsi"]=arrselections[0].mmsi;
		$.ajax({
			method: "POST",
			url: "/shanggang/shipinfo/listinfoduring",
			data: JSON.stringify(postData),
			contentType:"application/json",
			success: function (data) {
				console.log(data);
				fillMonitorData(data);
				$('html, body').animate({
					scrollTop: $("#mapBody").offset().top
				}, 100);
				if (historyData.length>0)
				{
					PlayShipHistoryTracks('ship', historyData);
					return false;
				}
				else{
					alert("数据库中没有这段时间关于该船的记录！ ");
				}
			},
			error: function () {       
				alert("查询失败！");
			}  
		});
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
			draw_area(arrObjPo);
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
	})

	$("#mapBody").show();
	$("#data_clean").hide();
	$("#detail_information").hide();
	$("#monitor_search_modal").show();
	$("#stat_start_end_time").hide();
	$("#project_progress").hide();
	$("#monitor_search").hide();
	$("#monitor_button").hide();
	$("#history_time").hide();
	$("#monitor_show").show();
	$("#error_mark").show();
	$("#error_handle").show();
	$("#handle_checkbox").off('click');
	$("#handle_checkbox").click(function () {show_dirt_handled();});
	document.getElementById('handle_checkbox').checked = false;
	$("#handle_checkbox").show();
	$("#handle_checkbox_label").show();
	$.ajax({
        method: "GET",
        url: "/shanggang/dredging_area/listall",
        success: function (data) {
        	fillAllShujun(data);
            },
		error: function () {       
            alert("获取数据失败！");
        }  
    });
	$.ajax({
        method: "GET",
        url: "/shanggang/dumping_area/list",
        success: function (data) {
        	fillAllPaoni(data);
            },
		error: function () {       
            alert("获取数据失败！");
        }  
    });
	$.ajax({
            method: "GET",
            url: "/shanggang/route/listall",
            success: function (data) {    
            	    fillAllRoute(data);
                  },       
            error: function () {       
                   alert("获取数据失败！");       
              }       
        });
	$.ajax({
        method: "GET",
        url: "/shanggang/workrecord/abnormal",
        success: function (data) {
			console.log(data);
        	fillDirtError(data);
			handle_filter();
			InitDirtTable();
            },
		error: function () {       
            alert("获取数据失败！");
        }  
    });
}

function fillDirtError(data)
{
	allError = [];
	mmsi_project_selected = get_mmsi_selected();
	for(var i = 0;i<data.length;++i){
		if(data[i].mmsi in mmsi_project_selected)
		{
			if (data[i].state == dirt_type_selected)
			{
				var info = {"mmsi":data[i].mmsi,"date":data[i].date,"indred":data[i].indred,
					"exitdred":data[i].exitdred,"indump":data[i].indump,"exitdump":data[i].exitdump,
					"state":data[i].state,"dredging_id":data[i].work_area,"dumping_id":data[i].dumping_area,
					"route_id":data[i].route_id,"ishandled":data[i].ishandled,"handlerecord":data[i].handlerecord};
				
			if(data[i].mmsi in allMmsi)
			{
				info.name = allMmsi[data[i].mmsi].shipname;
				if(allMmsi[data[i].mmsi].fleetid in allCompany)
				{
					info.company=allCompany[allMmsi[data[i].mmsi].fleetid].name;
				}
				else{
					info.company="-";
				}
			}
			else{
				info.name = "-";
				info.company="-";
			}
			info.type = dirt_abnormal_type[data[i].state];
			if (info.ishandled == 1)
			{
				info.handle = "是";
			}
			else{
				info.handle = "否";
			}
			info.dredging_name = GetShujunNameByID(info.dredging_id);
			info.dumping_name = GetPaoniNameByID(info.dumping_id);
			allError.push(info);
			}
		}
	}
}

function InitDirtTable()
{
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allError,
    //height:380,
	pagination: true,
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
        field: 'name',
        title: '船名'
    }, 
	{
        field: 'company',
        title: '施工单位'
    }, 
	{
        field: 'dredging_name',
        title: '施工区域'
    }, 
	{
        field: 'dumping_name',
        title: '抛泥区域'
    },
	{
        field: 'route_id',
        title: '抛泥航线'
    }, 	
	{
        field: 'type',
        title: '异常类型',
		sortable : true,
    },
	{
        field: 'date',
        title: '日期'
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
    },
	{
        field: 'handle',
        title: '是否处理'
    },
	{
        field: 'handlerecord',
        title: '处理意见'
    }
	]});
    $('#datatable').show();	
}

function RunError()
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
	project_submenu_selected = 42;
	CleanAll();
	$("#L2").attr("class", "LeftTextSelect");
	$("#L2L3").attr("class", "LeftTextSelect");
	$("#L2L3L2").attr("class", "LeftTextSelect");
	
	API_DelAllShips();
	abtype = "Route Abnormal";
	$("#toolbar").hide();
	$("#btn_backup").hide();
	$("#btn_add").hide();
	$("#btn_edit").hide();
	$("#btn_delete").hide();
	$("#btn_show").hide();
	$("#monitor_button").off('click');
	$("#monitor_show").off('click');
	$("#monitor_show").click(function(){
		$('html, body').animate({
        scrollTop: $("#mapBody").offset().top
		}, 100);
		var arrselections = $("#table").bootstrapTable('getSelections');
			console.log(arrselections);
            if (arrselections.length > 1) {
                return;
            }
            if (arrselections.length <= 0) {
                return;
            }
        postData = {"mmsi":arrselections[0].mmsi,"time":arrselections[0].time};
		$.ajax({
         type: "POST",
         url: "/shanggang/abnormalinfo/locationplayback",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {
			if (data.length == 0)
			{
				alert("No Data");
				return false;
			}
			PlayAbnormalShipHistoryTracks(data);
			return false;
               },       
         error: function () {       
                alert("fail");       
           }       
     });
	})
	$("#mapBody").show();
	$("#data_clean").hide();
	$("#detail_information").hide();
	$("#monitor_search_modal").show();
	$("#stat_start_end_time").hide();
	$("#project_progress").hide();
	$("#monitor_search").hide();
	$("#monitor_button").hide();
	$("#history_time").hide();
	$("#monitor_show").show();
	$("#error_mark").show();
	$("#error_handle").show();
	$("#detailtable").hide();
	$("#info_div").hide();
	$.ajax({
        method: "GET",
        url: "/shanggang/abnormalinfo/listallabnormal",
        success: function (data) {
			data=[];
        	fillRunError(data);
			InitRunTable();
            },
		error: function () {       
            alert("fail");
        }  
    });
}

function fillRunError(data)
{
	allError = [];
	for(var i = 0;i<data.length;++i)
		{
			if(data[i].abnormal_type=="Route Abnormal")
			{
				if(data[i].mmsi in allMmsi){
					var dr = "-";
					var du = "-";
					if(data[i].mmsi in mmsi_project)
					{
						dr = mmsi_project[data[i].mmsi].dredging;
						du = mmsi_project[data[i].mmsi].dumping;
					}
						
					allError.push(
					{"mmsi":data[i].mmsi,"type":data[i].abnormal_type,
					"lon":data[i].lon,"lat":data[i].lat,
					"time":data[i].time,"handle":data[i].handle,"name":allMmsi[data[i].mmsi].shipname,"company":allMmsi[data[i].mmsi].fleetid,
					"dredging":dr,"dumping":du}
					);
				}
				
			}
		}
}

function InitRunTable()
{
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allError,
    height:380,
	pagination: true,
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
        field: 'name',
        title: '船名'
    }, 
	{
        field: 'company',
        title: '施工单位'
    }, 
	{
        field: 'dredging',
        title: '施工区域'
    }, 
	{
        field: 'dumping',
        title: '抛泥区域'
    }, 
	{
        field: 'time',
        title: '异常时间'
    },
	{
        field: 'handle',
        title: '处理意见'
    }
	]});
    $('#datatable').show();	
}

function SpeedError()
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
	project_submenu_selected = 46;
	CleanAll();
	$("#L2").attr("class", "LeftTextSelect");
	$("#L2L3").attr("class", "LeftTextSelect");
	$("#L2L3L6").attr("class", "LeftTextSelect");
	
	abtype = "Exceed the speed limit Abnormal";
	$("#toolbar").hide();
	$("#btn_backup").hide();
	$("#btn_add").hide();
	$("#btn_edit").hide();
	$("#btn_delete").hide();
	$("#btn_show").hide();
	$("#btn_edit").off('click');
	$("#btn_show").off('click');

	$("#mapBody").hide();
	$("#data_clean").hide();
	$("#detail_information").hide();
	$("#monitor_search_modal").show();
	$("#project_progress").hide();
	$("#monitor_search").hide();
	$("#monitor_button").hide();
	$("#history_time").hide();
	$("#monitor_show").hide();
	$("#error_mark").show();
	$("#error_handle").show();
	$("#handle_checkbox").off('click');
	$("#handle_checkbox").click(function () {show_speed_handled();});
	document.getElementById('handle_checkbox').checked = false;
	$("#handle_checkbox").show();
	$("#handle_checkbox_label").show();
	$("#detailtable").hide();
	$("#info_div").hide();
	
	$.ajax({
        method: "GET",
        url: "/shanggang/workrecord/exceed_speed",
        success: function (data) {
        	fillSpeedError(data);
			handle_filter();
			InitSpeedTable();
            },
		error: function () {       
            alert("fail");
        }  
    });
}

function fillSpeedError(data)
{
	allError = [];
	for(var i = 0;i<data.length;++i)
		{
			var info = {"mmsi":data[i].mmsi,"date":data[i].date,"indred":data[i].indred,
					"exitdred":data[i].exitdred,"indump":data[i].indump,"exitdump":data[i].exitdump,
					"ishandled":data[i].ishandled,"handlerecord":data[i].handlerecord,"speed":data[i].exceed_speed};
			if(data[i].mmsi in allMmsi)
			{
				info.name = allMmsi[data[i].mmsi].shipname;
				if(allMmsi[data[i].mmsi].fleetid in allCompany)
				{
					info.company=allCompany[allMmsi[data[i].mmsi].fleetid].name;
				}
				else{
					info.company="-";
				}
			}
			else{
				info.name = "-";
				info.company="-";
			}
			if (info.ishandled == 1)
			{
				info.handle = "是";
			}
			else{
				info.handle = "否";
			}
			allError.push(info);
		}
}

function InitSpeedTable()
{
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allError,
    //height:380,
	pagination: true,
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
        field: 'name',
        title: '船名'
    }, 
	{
        field: 'company',
        title: '施工单位'
    }, 
	{
        field: 'date',
        title: '日期'
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
        field: 'speed',
        title: '航行速度'
    },
	{
        field: 'exitdump',
        title: '离开抛泥区域'
    },
	{
        field: 'handle',
        title: '是否处理'
    },
	{
        field: 'handlerecord',
        title: '处理意见'
    }
	]});
    $('#datatable').show();	
}

function WeatherError()
{
	CleanAll();
	$("#L2").attr("class", "LeftTextSelect");
	$("#L2L3").attr("class", "LeftTextSelect");
	$("#L2L3L4").attr("class", "LeftTextSelect");
	
	abtype = "Weather abnormal";
	$("#toolbar").show();
	$("#btn_backup").hide();
	$("#btn_add").hide();
	$("#btn_edit").hide();
	$("#btn_delete").hide();
	$("#btn_show").hide();
	$("#btn_edit").off('click');
	$("#btn_show").off('click');

	$("#mapBody").hide();
	$("#data_clean").hide();
	$("#detail_information").hide();
	$("#monitor_search_modal").show();
	$("#project_progress").hide();
	$("#monitor_search").hide();
	$("#monitor_button").hide();
	$("#history_time").hide();
	$("#monitor_show").hide();
	$("#error_mark").show();
	$("#error_handle").show();
	$("#detailtable").hide();
	$("#info_div").hide();
	
	$.ajax({
        method: "GET",
        url: "/shanggang/abnormalinfo/listallabnormal",
        success: function (data) {
			data=[];
			console.log(data);
        	fillWeatherError(data);
			InitWeatherTable();
            },
		error: function () {       
            alert("fail");
        }  
    });
}

function fillWeatherError(data)
{
	allError = [];
	for(var i = 0;i<data.length;++i)
		{
			if(data[i].abnormal_type=="Weather abnormal")
			{
				if(data[i].mmsi in allMmsi){
				var dr = "-";
				var du = "-";
				if(data[i].mmsi in mmsi_project)
				{
					dr = mmsi_project[data[i].mmsi].dredging;
					du = mmsi_project[data[i].mmsi].dumping;
				}
					
				allError.push(
				{"mmsi":data[i].mmsi,"type":data[i].abnormal_type,
				"lon":data[i].lon,"lat":data[i].lat,
				"time":data[i].time,"handle":data[i].handle,"name":allMmsi[data[i].mmsi].shipname,"company":allMmsi[data[i].mmsi].fleetid,
				"dredging":dr,"dumping":du,"windspeed":data[i].windspeed}
				);}
			}
		}
}

function InitWeatherTable()
{
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allError,
    height:380,
	pagination: true,
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
        field: 'name',
        title: '船名'
    }, 
	{
        field: 'company',
        title: '施工单位'
    }, 
	{
        field: 'dredging',
        title: '施工区域'
    }, 
	{
        field: 'dumping',
        title: '抛泥区域'
    }, 
	{
        field: 'time',
        title: '异常时间'
    },
	{
        field: 'windspeed',
        title: '风速'
    },
	{
        field: 'handle',
        title: '处理意见'
    }
	]});
    $('#datatable').show();	
}

function InitErrorTable()
{
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allError,
    height:380,
	pagination: true,
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
        field: 'name',
        title: '船名'
    }, 
	{
        field: 'company',
        title: '施工单位'
    }, 
	{
        field: 'dredging',
        title: '施工区域'
    }, 
	{
        field: 'dumping',
        title: '抛泥区域'
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
        field: 'time',
        title: '异常时间'
    },
	{
        field: 'level',
        title: '评级'
    }
	]});
    $('#datatable').show();	
}

function error_mark()
{
	var arrselections = $("#table").bootstrapTable('getSelections');
	if (arrselections.length > 1) {
		return;
	}
	if (arrselections.length <= 0) {
		return;
	}
	$("#error_mark_info").modal('show');
}

function error_mark_confirm()
{
	postData = {};
	var arrselections = $("#table").bootstrapTable('getSelections');
	postData["mmsi"] = arrselections[0].mmsi;
	postData["indred"] = arrselections[0].indred;
	postData["handle_content"] = $("#error_mark_text").val();
	$.ajax({
        method: "POST",
        url: "/shanggang/workrecord/handleabnormal",
		data: JSON.stringify(postData),
		contentType:"application/json",
        success: function (data) {
			alert("评价成功");
			$("#error_mark_info").modal('hide');
			RefreshError();
            },
		error: function () {       
            alert("评价失败");
        }
	});		
}

function error_handle()
{
	var arrselections = $("#table").bootstrapTable('getSelections');
	if (arrselections.length > 1) {
		return;
	}
	if (arrselections.length <= 0) {
		return;
	}
	if(confirm("确定要处理该异常吗？")){
		postData = {};
		postData["mmsi"] = arrselections[0].mmsi;
		postData["indred"] = arrselections[0].indred;
		postData["handle_content"] = "已处理";
		$.ajax({
        method: "POST",
        url: "/shanggang/workrecord/handleabnormal",
		data: JSON.stringify(postData),
		contentType:"application/json",
        success: function (data) {
			alert("处理成功");
			RefreshError();
            },
		error: function () {       
            alert("处理失败");
        }
	});		
	}
}

function RefreshError()
{
	switch (abtype){
		case "Dumping_area Abnormal":
			show_dirt_handled();
			break;
		case "Route Abnormal":
			RunError();
			break;
		case "Exceed the speed limit Abnormal":
			show_speed_handled();
			break;
		case "Weather abnormal":
			WeatherError();
			break;
		default:
	}
}

function draw_all_paoni()
{
	return;
	deleteButtomFace()
	labelInfo = [];
	AddButtomLayer();
	buttomFaces = 1000;
	var buttomPoint = coorDict["1_1"];
	var coorNum = buttomPoint.length;
	API_SetMapViewCenter(convertToLatitu(buttomPoint[0].x)/10000000, convertToLatitu(buttomPoint[0].y)/10000000, 80000);
	for (var i = 0; i < coorNum; i++) {
		var ob = [];
		ob.push(convertToLatitu(buttomPoint[i].y));
		ob.push(convertToLatitu(buttomPoint[i].x));
		labelInfo.push(ob);
	}
	AddButtomFaces(labelInfo);
	AddButtomLayer();
	labelInfo = [];
	buttomPoint = coorDict["1_2"];
	coorNum = buttomPoint.length;
	API_SetMapViewCenter(convertToLatitu(buttomPoint[0].x)/10000000, convertToLatitu(buttomPoint[0].y)/10000000, 80000);
	for (var i = 0; i < coorNum; i++) {
		var ob = [];
		ob.push(convertToLatitu(buttomPoint[i].y));
		ob.push(convertToLatitu(buttomPoint[i].x));
		labelInfo.push(ob);
	}
	AddButtomFaces(labelInfo);
}


function AddRedNode()
{
	API_SetCurDrawDynamicUseType(DynamicSymbolType.drawPoint);
	
	var objType = DynamicSymbolType.drawPoint;
    var objName = "";
	//坐标的数组
    var arrObjPo = [{ x: 1222922000, y: 305556000  }];
	API_SetMapViewCenter(122.2647, 30.5556, 160000);
	
	
    var drawObjPoNum = arrObjPo.length;



    var layerStylePos = 0;
    var layerPos = -1;

	
    //添加点
        layerPos = API_GetLayerPosById(g_iPointLayerId); //获取点图层的pos
        layerStylePos = g_iPointStylePos;
    

    var bAddResult = false;
    if (layerPos > -1) {
        g_iAddObjId++;
        var objInfo = [];
        var arrExpAttrValue = []; //扩展字段，假如没有可以传入null

        objInfo.layerPos = layerPos;
        objInfo.objId = g_iAddObjId;
        objInfo.name = objName;
        objInfo.showText = objName;
        objInfo.layerStylePos = layerStylePos;
        arrExpAttrValue.push("来一个扩展字段");

        lineobjPos = API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);
        if (lineobjPos > -1) {
            bAddResult = true;
        }
    }


        API_ReDrawLayer();

		API_SetCurDrawDynamicUseType(DynamicSymbolType.none);
};

function handle_filter()
{
	tmp_allError = [];
	var is_handled = $("#handle_checkbox").is(":checked");
	if (is_handled)
	{
		return;
	}
	else{
		for (var i = 0;i<allError.length;++i)
		{
			if (allError[i].ishandled == 0){
				tmp_allError.push(allError[i]);
			}
		}
	}
	allError = tmp_allError;
}

function show_dirt_handled()
{
	$.ajax({
        method: "GET",
        url: "/shanggang/workrecord/abnormal",
        success: function (data) {
			console.log(data);
        	fillDirtError(data);
			handle_filter();
			InitDirtTable();
            },
		error: function () {       
            alert("获取数据失败！");
        }  
    });
}

function show_speed_handled()
{
	$.ajax({
        method: "GET",
        url: "/shanggang/workrecord/exceed_speed",
        success: function (data) {
			console.log(data);
        	fillSpeedError(data);
			handle_filter();
			InitSpeedTable();
            },
		error: function () {       
            alert("获取数据失败！");
        }  
    });
}
