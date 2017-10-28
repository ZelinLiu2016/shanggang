allMonitor = [];
postData = {};
historyData = [];

function RTMonInit()
{
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
				entry += '<option value="'+m+'">'+ m+'---'+allMmsi[m].shipname +'</option>';
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
	ClearPlayShipInfo();
	$("#toolbar").hide();
	$("#btn_backup").hide();
	$("#btn_add").hide();
	$("#btn_edit").hide();
	$("#btn_delete").hide();
	//document.getElementById("btn_delete").setAttribute("disabled", true)
	$("#btn_show").hide();
	
	$("#monitor_show").off('click');
	$("#monitor_show").click(function(){
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
	$("#data_clean").hide();
	$("#detail_information").hide();
	$("#monitor_search_modal").show();
	$("#project_progress").hide();
	$("#history_time").hide();
	$("#monitor_button").show();
	$("#monitor_show").show();
	$("#monitor_search").show();
	$("#error_mark").hide();
	$("#error_handle").hide();
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
				entry += '<option value="'+m+'">'+ m+'---'+allMmsi[m].shipname +'</option>';
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
	ClearPlayShipInfo();
	$("#toolbar").hide();
	$("#btn_backup").hide();
	$("#btn_add").hide();
	$("#btn_edit").hide();
	$("#btn_delete").hide();
	$("#btn_show").hide();
	$("#monitor_show").click(function(){
		var arrselections = $("#table").bootstrapTable('getSelections');
		$('html, body').animate({
        scrollTop: $("#mapBody").offset().top
		}, 100);
		if (historyData.length>0)
		{
			PlayShipHistoryTracks('ship', historyData);
			return false;
		}
	})
	
	$("#mapBody").show();
	$("#data_clean").hide();
	$("#detail_information").hide();
	$("#monitor_search_modal").show();
	$("#project_progress").hide();
	$("#history_time").show();
	$("#monitor_search").val("");
	$("#monitor_start").val("");
	$("#monitor_end").val("");
	$("#monitor_button").show();
	$("#monitor_show").show();
	$("#monitor_search").show();
	$("#error_mark").hide();
	$("#error_handle").hide();
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