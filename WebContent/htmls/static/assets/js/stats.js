allBoatWork = [{"mmsi":"412375620","day":1,"week":10,"month":10,"companyname":"中港建务三公司","companyid":"1","shipname":"远洋号"},
           {"mmsi":"412380310","day":2,"week":13,"month":13,"companyname":"中港建务三公司","companyid":"1","shipname":"远洋号"},
           {"mmsi":"413770463","day":4,"week":6,"month":6,"companyname":"中港建务三公司","companyid":"1","shipname":"远洋号"},
           {"mmsi":"413370410","day":6,"week":17,"month":17,"companyname":"中交水运","companyid":"3","shipname":"远洋号"},
           {"mmsi":"413765442","day":3,"week":15,"month":15,"companyname":"中交水运","companyid":"3","shipname":"远洋号"},
           {"mmsi":"413373880","day":5,"week":16,"month":16,"companyname":"中交水运","companyid":"3","shipname":"远洋号"},
          ];
allFleet = [{"fleetid":"中港建务三公司","day":10,"week":60,"month":200}];
allPort = [{"port":"2017洋山港前航道疏浚","day":10,"week":60,"month":200}];

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
	InitFleetStatsTable();
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
			if(allBoatWork[i].companyname==companyid)
			{
				tmp.push(allBoatWork[i]);
			}
		}
		$('#dtable').bootstrapTable('load', tmp); 
		$('#detailtable').show();
    },

    columns: [
	{checkbox: true},
	{
        field: 'fleetid',
        title: '单位'
    }, 
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
	{checkbox: true},
	{
        field: 'mmsi',
        title: 'MMSI'
    }, 
	{
        field: 'shipname',
        title: '船名'
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
    $('#detailtable').show();
}
function PortStatsInit()
{
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
	InitPortStatsTable();
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
		if(arrselections.length==1)
		{
			$("#project_progress").show();
			real = 46;
			plan = 50;
			var real_span = document.getElementById("real_progress");
			var plan_span = document.getElementById("plan_progress");
			real_span.style.width=real+"%";
			plan_span.style.width=plan+"%";
			real_span.innerHTML=real+"%";
			plan_span.innerHTML=plan+"%";
		}
    },
	onUncheck: function (row, $element) {
		$("#project_progress").hide();
    },
    columns: [
	{checkbox: true},
	{
        field: 'port',
        title: '工程名称'
    }, 
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
	]});
    $('#datatable').show();
}