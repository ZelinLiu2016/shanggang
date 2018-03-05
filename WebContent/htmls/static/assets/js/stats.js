var allProject = [];
var allBoatWork = [];
var allFleet = [];
var tmpBoatWork = [];
var timespan = "-";
var postData = {}

function FleetStatsSearch()
{
	postData["begindate"] = $("#stat_start").val();
	postData["enddate"] = $("#stat_end").val();
	postData["project_id"] = project_selected;
	timespan = $("#stat_start").val() + '~' + $("#stat_end").val();
	$.ajax({
         type: "POST",
         url: "/shanggang/workload/getprojectproduring",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {
			fillBoatWork(data);
         	InitFleetStatsTable();
               },       
         error: function () {       
                alert("获取数据失败！");       
           }       
     });
}

// init danwei shuju tongji
function FleetStatsInit()
{
	if(project_selected<0)
	{
		alert("请在页面顶部选择需要查看的工程！ ");
		return;
	}
	project_submenu_selected = 21;
	CleanAll();
	$("#L2").attr("class", "LeftTextSelect");
	$("#L2L1").attr("class", "LeftTextSelect");
	$("#L2L1L1").attr("class", "LeftTextSelect");
	
	$("#toolbar").hide();
	
	$("#mapBody").hide();
	$("#data_clean").hide();
	
	$("#monitor_search_modal").hide();
	$("#stat_start_end_time").show();
	$("#stat_search_company").show();
	$("#stat_search_project").hide();
	$("#stat_start").val("");
	$("#stat_end").val("");
	
	$("#detail_information").hide();
	$("#detailtable").hide();
	$("#info_div").hide();
	$("#project_progress").hide();
	allBoatWork = [];
	allFleet = [];
	timespan = "-";
	InitFleetStatsTable();
}

function fillBoatWork(data)
{
	console.log(data);
	allBoatWork = [];
	tmpBoatWork = [];
	allFleet = [];
	tmpFleetDict = {};
	for(var i = 0;i<data.length;++i)
	{
		var tmpstr = data[i];
		if(tmpstr == ""){
			continue;
		}
		var tmplist = tmpstr.split(",");
		if (tmplist.length<3){
			continue;
		}
		var mmsi = tmplist[0].split(':')[1];
		var ship_number = tmplist[2].split(':')[1];
		var ship_volumn = tmplist[3].split(':')[1];
		var com_id = tmplist[1].split(":")[1];
		var companyname = com_id;
		if(mmsi in allMmsi)
		{
			var info = {"mmsi":mmsi,"number":ship_number,"volumn":ship_volumn,"shipname":allMmsi[mmsi].shipname,"companyid":com_id};
			allBoatWork.push(info);
		}		
		if (!(com_id in tmpFleetDict))
		{
			tmpFleetDict[com_id] = [companyname, 0, 0];
		}
		tmpFleetDict[com_id][1] += ship_number;
		tmpFleetDict[com_id][2] += ship_volumn;
	}
	tmpBoatWork = allBoatWork;
	for(comid in tmpFleetDict)
	{
		allFleet.push({"fleetid":comid,"fleetname":tmpFleetDict[0],"number":tmpFleetDict[1],"volumn":tmpFleetDict[2]});
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
		var tmpBoatWork = [];
		companyid = row.fleetid;
		console.log(companyid);
		for(var i = 0;i<allBoatWork.length;++i)
		{
			if(allBoatWork[i].companyid==companyid)
			{
				tmp.push(allBoatWork[i]);
			}
		}
		$('#dtable').bootstrapTable('load', tmpBoatWork); 
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
			colspan:2,
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
			field: 'number',
			title: '船舶往返（次）'
		}, 
		{
			field: 'volumn',
			title: '疏浚方量（万方）'
		},
	]
	]});
	$('#datatable').show();
	
	$('#detailtable').hide();
	$('#dtable').bootstrapTable('destroy');
    $('#dtable').bootstrapTable({
    data: tmpBoatWork,
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
			colspan:2,
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
			field: 'number',
			title: '日船舶往返（次）'
		}, 
		{
			field: 'volumn',
			title: '疏浚方量（万方）'
		}
	]
	]});
    $('#detailtable').show();
}




function ProjectStatsInit()
{
	if(project_selected<0)
	{
		alert("请在页面顶部选择需要查看的工程！ ");
		return;
	}
	project_submenu_selected = 22;
	CleanAll();
	$("#L2").attr("class", "LeftTextSelect");
	$("#L2L1").attr("class", "LeftTextSelect");
	$("#L2L1L2").attr("class", "LeftTextSelect");
	
	$("#toolbar").hide();
	
	$("#mapBody").hide();
	$("#data_clean").hide();
	
	$("#monitor_search_modal").hide();
	$("#stat_start_end_time").show();
	$("#stat_search_company").hide();
	$("#stat_search_project").show();
	$("#stat_start").val("");
	$("#stat_end").val("");
	
	$("#detail_information").hide();
	$("#detailtable").hide();
	$("#info_div").hide();
	$("#project_progress").hide();
	allProject = [];
	timespan = "-";
	InitProjectStatsTable();
}

function ProjectStatsSearch()
{
	postData = {};
	postData["begindate"] = $("#stat_start").val();
	postData["enddate"] = $("#stat_end").val();
	postData["project_id"] = project_selected;
	timespan = $("#stat_start").val() + '~' + $("#stat_end").val();
	$.ajax({
        method: "POST",
        url: "/shanggang/workload/getprojectproduring",
		data: JSON.stringify(postData),
		contentType:"application/json",
        success: function (data) {
        	fillProjectWork(data);
			InitProjectStatsTable();
            },
		error: function () {       
            alert("获取数据失败");
        }  
	});	
}

function InitProjectStatsTable()
{
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allProject,
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
			id = project_selected;
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
			colspan:2,
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
			field: 'number',
			title: '船舶往返（次）'
		}, 
		{
			field: 'volumn',
			title: '疏浚方量（万方）'
		}
	]
	]});
    $('#datatable').show();
}

function RefreshProjectStatsTable()
{
	$('#datatable').hide();
	$('#table').bootstrapTable('load', allProject); 
	$('#datatable').show();
}

function fillProjectWork(data)
{
	console.log(data);
	allProject = [];
	if(data.length == 0)
	{
		alert("工程进度数据异常！ ")
	}
	else{
		if(project_selected in detailed)
		{
			var pname = detailed[project_selected].projectname;
			var project_stat = data[data.length - 1].split(",");
			var number = parseInt(project_stat[0].split(":")[1]);
			var volumn = parseFloat(project_stat[1].split(":")[1]);
			var info = {"project":pname,"number":number,"volumn":volumn};
			allProject.push(info);
		}
		else{
			alert("选中工程数据异常！ ");
		}
	}
}