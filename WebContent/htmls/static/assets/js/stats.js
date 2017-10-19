allBoatWork = [{"mmsi":"412375620","day":1,"week":10,"month":10},
           {"mmsi":"412380310","day":2,"week":13,"month":13},
           {"mmsi":"413770463","day":4,"week":6,"month":6},
           {"mmsi":"413370410","day":6,"week":17,"month":17},
           {"mmsi":"413765442","day":3,"week":15,"month":15},
           {"mmsi":"413373880","day":5,"week":16,"month":16},
          ];
allFleet = [{"fleetid":"中港建务三公司","day":10,"week":60,"month":200}];
allPort = [{"port":"YANGSHAN","day":10,"week":60,"month":200}];

function BoatStatsInit()
{
	$("#toolbar").hide();
	
	$("#mapBody").hide();
	$("#data_clean").hide();
	$("#monitor_search_modal").hide();
	$("#detail_information").hide();
	$("#project_progress").hide();
	InitBoatStatsTable();
}

function InitBoatStatsTable()
{
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allBoatWork,
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
	$("#toolbar").hide();
	
	$("#mapBody").hide();
	$("#data_clean").hide();
	$("#monitor_search_modal").hide();
	$("#detail_information").hide();
	$("#project_progress").hide();
	InitFleetStatsTable();
}

function InitFleetStatsTable()
{
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allFleet,
    height:280,
	pagination: true,
    pageSize: 5,
	clickToSelect: true,
	singleSelect:true,

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
}
function PortStatsInit()
{
	$("#toolbar").hide();
	
	$("#mapBody").hide();
	$("#data_clean").hide();
	$("#monitor_search_modal").hide();
	$("#detail_information").hide();
	$("#project_progress").hide();
	InitPortStatsTable();
}

function InitPortStatsTable()
{
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allPort,
    height:280,
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
			var real = 9;
			var plan = 11;
			var realper = (real)/2;
			var planper = (plan)/2;
			var tbody = document.getElementById("gante-tbody");
			while(tbody.hasChildNodes()) //当div下还存在子节点时 循环继续  
			{
				tbody.removeChild(tbody.firstChild);
			}
			var entry = "<tr>";
			for(var i = 0;i<planper;++i)
			{
				entry+='<td style="background-color:red"></td>';
			}
			entry+='<td style="background-color:red;font-size:20px;color:black;">'+55+'%</td>';
			for(var i = planper+1;i<plan;++i)
			{
				entry+='<td style="background-color:red"></td>';
			}
			for(var i = plan;i<20;++i)
			{
				entry+='<td style="background-color:yellow"></td>';
			}
			entry+="</tr><tr>";
			
			for(var i = 0;i<realper;++i)
			{
				entry+='<td style="background-color:green"></td>';
			}
			entry+='<td style="background-color:green;font-size:20px;color:black;">'+45+'%</td>';
			for(var i = realper+1;i<real;++i)
			{
				entry+='<td style="background-color:green"></td>';
			}
			for(var i = real;i<plan;++i)
			{
				entry+='<td style="background-color:red"></td>';
			}
			for(var i = plan;i<20;++i)
			{
				entry+='<td style="background-color:yellow"></td>';
			}
			entry+="</tr>";
			$("#gante-tbody").append(entry);
			/*var real_span = document.getElementById("real_progress");
			var plan_span = document.getElementById("plan_progress");
			real_span.style.width=real+"%";
			plan_span.style.width=plan+"%";
			real_span.innerHTML=real+"%";
			plan_span.innerHTML=plan+"%";*/
		}
    },
	onUncheck: function (row, $element) {
		$("#project_progress").hide();
    },
    columns: [
	{checkbox: true},
	{
        field: 'port',
        title: '港区'
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