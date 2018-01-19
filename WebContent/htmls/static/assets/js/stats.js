var allPort = [];
var timespan = "2017-12-11~2017-12-17";

function BoatStatsInit()
{	
	$("#toolbar").hide();
	$("#mapBody").hide();
	$("#data_clean").hide();
	$("#monitor_search_modal").hide();
	$("#detail_information").hide();
	$("#detailtable").hide();
	$("#info_div").hide();
	$("#project_progress").hide();
	InitBoatStatsTable();
}

function InitBoatStatsTable()
{
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allBoatWork,
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
        field: 'day',
        title: '日工程量（次）'
    }, 
	{
        field: 'week',
        title: '周工程量（次）'
    }, 
	{
        field: 'month',
        title: '月工程量（次）'
    }
	]});
    $('#datatable').show();
}

function FleetStatsInit()
{
	if(project_selected<0)
	{
		alert("请在页面顶部选择需要查看的工程！ ");
		return;
	}
	CleanAll();
	$("#L2").attr("class", "LeftTextSelect");
	$("#L2L1").attr("class", "LeftTextSelect");
	$("#L2L1L1").attr("class", "LeftTextSelect");
	
	$("#toolbar").hide();
	
	$("#mapBody").hide();
	$("#data_clean").hide();
	$("#monitor_search_modal").hide();
	$("#detail_information").hide();
	$("#detailtable").hide();
	$("#info_div").hide();
	$("#project_progress").hide();
	$.ajax({
        method: "GET",
        url: "/shanggang/workload/getallnewworkload",
        success: function (data) {
			console.log(data);
        	fillBoatWork(data);
			InitFleetStatsTable();
            },
		error: function () {       
            alert("获取数据失败");
        }  
	});
}

function fillBoatWork(data)
{
	var mmsi_project_selected = {};
	if(project_selected in detailed)
	{
		if(detailed[project_selected].mmsi.length>0)
		{
			var tmp = detailed[project_selected].mmsi.split(";");
			for (var i = 0;i <tmp.length;++i)
			{
				mmsi_project_selected[tmp[i]] = 0;
			}
		}
		console.log(mmsi_project_selected);
		allBoatWork = [];
		allFleet = [];
		allFleetDict = {};
		for(var i = 0;i<data.length;++i)
		{
			var s = data[i].substr(0,data[i].length);
			var c = s.split(",");
			var mm = c[0].split(":")[1];
			var d = parseInt(c[1].split(":")[1]);
			var w = parseInt(c[2].split(":")[1]);
			var m = parseInt(c[3].split(":")[1]);
			if(mm in mmsi_project_selected)
			{
				data[i] = {"mmsi":mm,"day":d,"week":w,"month":m};
				if(data[i].mmsi in allMmsi)
				{
					var ship = allMmsi[data[i].mmsi];
					var info = {"mmsi":data[i].mmsi,"day":data[i].day,"week":data[i].week,"month":data[i].month,
								"shipname":ship.shipname,"companyid":ship.fleetid};
					if(ship.fleetid in allCompany)
					{
						info.companyname = allCompany[ship.fleetid].name;
					}
					else{
						info.companyname = "其他公司";
					}
					allBoatWork.push(info);
					if(!(ship.fleetid in allFleetDict))
					{
						allFleetDict[ship.fleetid] = {"day":0,"week":0,"month":0,"name":info.companyname};
					}
					allFleetDict[ship.fleetid].day+=data[i].day;
					allFleetDict[ship.fleetid].week+=data[i].week;
					allFleetDict[ship.fleetid].month+=data[i].month;
				}
			}
			
		}
		for(var f in allFleetDict)
		{
			allFleet.push({"fleetid":f,"fleetname":allFleetDict[f].name,"day":allFleetDict[f].day,"week":allFleetDict[f].week,"month":allFleetDict[f].month});
		}
			
		}
	else{
		alert("选中工程数据异常！ ");
	}
}


function InitFleetStatsTable()
{
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allFleet,
    //height:280,
	pagination: true,
    pageSize: 5,
	clickToSelect: true,
	singleSelect:true,
	
	onClickRow: function (row, $element) {
		$('#detailtable').hide();
		var tmp = [];
		companyid = row.fleetid;
		console.log(companyid);
		for(var i = 0;i<allBoatWork.length;++i)
		{
			if(allBoatWork[i].companyid==companyid)
			{
				tmp.push(allBoatWork[i]);
			}
		}
		$('#dtable').bootstrapTable('load', tmp); 
		$('#detailtable').show();
    },

    columns: [
	[
		{checkbox:true,
			colspan: 1,
			rowspan: 3
		},
		{
			field: 'fleetname',
			title: '单位',
			valign:"middle",
			align:"center",
			colspan:1,
			rowspan:3
		}, 
		{
			title: '进度统计',
			valign:"middle",
			align:"center",
			colspan:3,
			rowspan:1
		}
	],
	[
		{
			title: '起始时间'
		}, 
		{
			title: timespan,
			align:"center",
			valign:"middle"
		}
	],
	[
		{
			field: 'day',
			title: '日工程量'
		}, 
		{
			field: 'week',
			title: '周工程量'
		}, 
		{
			field: 'month',
			title: '月工程量'
		}
	]
	]});
	$('#datatable').show();
	
	$('#detailtable').hide();
	$('#dtable').bootstrapTable('destroy');
    $('#dtable').bootstrapTable({
    data: allBoatWork,
	pagination: true,
    pageSize: 5,
	clickToSelect: true,
	singleSelect:true,

    columns: [
	//{checkbox: true},
	[
		{
			field: 'mmsi',
			title: 'MMSI',
			valign:"middle",
			align:"center",
			colspan:1,
			rowspan:3
		}, 
		{
			field: 'shipname',
			title: '船名',
			valign:"middle",
			align:"center",
			colspan:1,
			rowspan:3
		}, 
		{
			title: '进度统计',
			valign:"middle",
			align:"center",
			colspan:3,
			rowspan:1
		}
	],
	[
		{
			title: '起始时间'
		}, 
		{
			title: timespan,
			align:"center",
			valign:"middle"
		}
	],
	[
		{
			field: 'day',
			title: '日工程量（次）'
		}, 
		{
			field: 'week',
			title: '周工程量（次）'
		}, 
		{
			field: 'month',
			title: '月工程量（次）'
		}
	]
	]});
    $('#detailtable').show();
}
function PortStatsInit()
{
	if(project_selected<0)
	{
		alert("请在页面顶部选择需要查看的工程！ ");
		return;
	}
	CleanAll();
	$("#L2").attr("class", "LeftTextSelect");
	$("#L2L1").attr("class", "LeftTextSelect");
	$("#L2L1L2").attr("class", "LeftTextSelect");
	
	$("#toolbar").hide();
	
	$("#mapBody").hide();
	$("#data_clean").hide();
	$("#monitor_search_modal").hide();
	$("#detail_information").hide();
	$("#detailtable").hide();
	$("#info_div").hide();
	$("#project_progress").hide();
	$.ajax({
        method: "GET",
        url: "/shanggang/workload/projectworkload",
        success: function (data) {
        	fillProjectWork(data, project_selected);
			InitPortStatsTable();
            },
		error: function () {       
            alert("获取数据失败");
        }  
	});	
}

function InitPortStatsTable()
{
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allPort,
    //height:280,
	pagination: true,
    pageSize: 5,
	clickToSelect: true,
	singleSelect:true,
	onCheck: function (row, $element) {
		var arrselections = $("#table").bootstrapTable('getSelections');
		if(arrselections.length==0)
		{
			$("#project_progress").hide();
			return;
		}
		if(arrselections.length==1){
			var id =-1;
			for(var i in detailed)
			{
				if(detailed[i].projectname == arrselections[0].project)
				{
					id = i;
					break;
				}
			}
			postData = {"project_id":id};
			$.ajax({
				type: "POST",
				url: "/shanggang/workload/getprojectprocess",
				data: JSON.stringify(postData),
				contentType:"application/json",
				success: function (data) {
					console.log(data);
					$("#project_progress").show();
					real = parseInt(100*data["percent"]);
					plan = real;
					var real_span = document.getElementById("real_progress");
					var plan_span = document.getElementById("plan_progress");
					real_span.style.width=real+"%";
					plan_span.style.width=plan+"%";
					real_span.innerHTML=real+"%";
					plan_span.innerHTML=plan+"%";
               },       
				error: function () {
					alert("删除数据失败！");   
				}       
			});
		}
    },
	onUncheck: function (row, $element) {
		$("#project_progress").hide();
    },
    columns: [
	[
		{checkbox:true,
			colspan: 1,
			rowspan: 3
		},
		{
			field: 'project',
			title: '工程名称',
			valign:"middle",
			align:"center",
			colspan:1,
			rowspan:3
		}, 
		{
			title: '进度统计',
			valign:"middle",
			align:"center",
			colspan:3,
			rowspan:1
		}
	],
	[
		{
			title: '起始时间'
		}, 
		{
			title: timespan,
			valign:"middle",
			align:"center",
			valign:"middle"
		}
	],
	[
		{
			field: 'day',
			title: '日工程量'
		}, 
		{
			field: 'week',
			title: '周工程量'
		}, 
		{
			field: 'month',
			title: '月工程量'
		}
	]
	]});
    $('#datatable').show();
}

function fillProjectWork(data, p_s)
{
	console.log(data);
	if(p_s in detailed)
	{
		var pname = detailed[p_s].projectname;
		allPort = [];
		for(var i = 0;i<data.length;++i)
		{
			var s = data[i].substr(0,data[i].length);
			var c = s.split(",");
			var p = c[0];
			if(p==pname)
			{
				var d = parseInt(c[1].split(":")[1]);
				var w = parseInt(c[2].split(":")[1]);
				var m = parseInt(c[3].split(":")[1]);
				data[i] = {"project":p,"day":d,"week":w,"month":m};
				allPort.push(data[i]);
			}	
		}
	}
	else{
		alert("选中工程数据异常！ ");
	}
	
}