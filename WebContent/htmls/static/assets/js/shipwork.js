var allShipWork = [];

function InitShipWork()
{
	project_submenu_selected = -1;
	CleanAll();
	$("#L1").attr("class", "LeftTextSelect");
	$("#L1L7").attr("class", "LeftTextSelect");
	
    $("#toolbar").show();
	$("#btn_backup").hide();
	$("#btn_add").show();
	$("#btn_edit").show();
	$("#btn_delete").show();
	$("#btn_show").hide();
	$("#toolbar_search").hide();
	$("#btn_search").hide();
	$("#import_project").show();
	$("#import_project_label").show();
	$("#select_mmsi").show();
	$("#select_mmsi_label").show();
	$("#finish_checkbox").hide();
	$("#finish_checkbox_label").hide();
	
	$("#mapBody").hide();
	$("#data_clean").hide();
	$("#detail_information").hide();
	$("#detailtable").hide();
	$("#info_div").hide();
	$("#monitor_search_modal").hide();
	$("#stat_start_end_time").hide();
	$("#project_progress").hide();
	
	$("#import_project").off('change');
	$("#import_project").change(function(){shipwork_project_changed();});
	$("#select_mmsi").change(function(){shipwork_ship_changed();});
	var selected = document.getElementById("import_project");
	while(selected.hasChildNodes())
	{
		selected.removeChild(selected.firstChild);
	}
	var entry = "";
	for (var d in detailed) {
		if (detailed[d]["isworking"] == 1){
			entry += '<option value="'+d+'">'+ d+'---'+detailed[d].projectname +'</option>';
		}
	}
	$("#import_project").append(entry);
	$("#import_project").val("");
	var selected = document.getElementById("select_mmsi");
	while(selected.hasChildNodes())
	{
		selected.removeChild(selected.firstChild);
	}
	$("#select_mmsi").val("");
	allShipWork = [];
	InitShipWorkTable();
}

function shipwork_project_changed()
{
	var selected = document.getElementById("select_mmsi");
	while(selected.hasChildNodes())
	{
		selected.removeChild(selected.firstChild);
	}
	var mmsis = detailed[$("#import_project").val()].mmsi;
    var tmp_mmsi_list = mmsis.split(';');
	entry = "";
	for (var i = 0;i<tmp_mmsi_list.length;++i){
		var m = tmp_mmsi_list[i];
		entry += '<option value="'+m+'">'+ m+'---'+allMmsi[m].shipname +'</option>';
	}
	$("#select_mmsi").append(entry);
	$("#select_mmsi").val("");
}

function shipwork_ship_changed()
{
	postData["project_id"] = $("#import_project").val();
	postData["mmsi"] = $("#select_mmsi").val();
	$.ajax({
			type: "POST",
			url: "/shanggang/shipworkhistory/listbymmsi",
			data: JSON.stringify(postData),
			contentType:"application/json",
			success: function (data) {
				console.log(data);
				fillShipWorkData(data);
				RefreshShipWorkTable();
			},
			error: function () {       
				alert("获取数据失败！ ")
			}       
		 });
}

function fillShipWorkData(data)
{
	allShipWork = [];
	for (var i = 0;i<data.length;++i)
	{
		var info = {"mmsi":data[i].mmsi,"startdate":data[i].startdate, "enddate":data[i].enddate,"route_id":data[i].route_id,
					"fleetid":data[i].company_id, "project_id":data[i].project_id};
		info["company_name"] = GetCompanyNameByID(info.fleetid);
		info["route_name"] = GetRouteNameByID(info.route_id);
		allShipWork.push(info);
	}
}

function InitShipWorkTable()
{
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allShipWork,
	pagination: false,
	clickToSelect: true,
	singleSelect:true,
	
    columns: [
	{checkbox: true},
	{
        field: 'mmsi',
        title: '船舶编号'
    },
	{
        field: 'company_name',
        title: '单位名称'
    },
	{
        field: 'route_name',
        title: '航线名称'
    },
	{
        field: 'startdate',
        title: '开始日期'
    },
	{
        field: 'enddate',
        title: '结束日期'
    }
	]});
	$('#datatable').show();
	$("#btn_add").off('click');
	$("#btn_add").click(function () {
		if(sessionStorage.length == 0)
			{
				alert("会话过期，请重新登录！ ");
				self.location='index.html';
				return;
			}
			if(!authority_sys2(10, sessionStorage.privilege))
			{
				 alert("当前用户无权限进行该操作！ ");
			}
			else{
		document.getElementById("shipwork_update_label").className = "modal-title glyphicon glyphicon-plus";
		var select_work = document.getElementById("shipwork_fleetid");
		while(select_work.hasChildNodes()) 
		{
			select_work.removeChild(select_work.firstChild);
		}
		var entry = "";
		for (var c in allCompany) {
			entry += '<option value="'+c+'">'+ c+'---'+allCompany[c].name +'</option>';
		}
		$("#shipwork_fleetid").append(entry);
		
		var select_route = document.getElementById("shipwork_routeid");
		while(select_route.hasChildNodes()) 
		{
			select_route.removeChild(select_route.firstChild);
		}
		var entry = "";
		for (var h in allHangxian) {
			entry += '<option value="'+h+'">'+ h+'---'+allHangxian[h].route_name +'</option>';
		}
		$("#shipwork_routeid").append(entry);
		$("#shipwork_update_label").text("新增");
		$("#shipwork_mmsi").val($("#select_mmsi").val());
		$("#shipwork_projectid").val($("#import_project").val());
		$("#shipwork_fleetid").val("");
		$("#shipwork_routeid").val("");
		$("#shipwork_startdate").val("");
		$("#shipwork_enddate").val("");
		$('#shipwork_update').modal('show');
		$('#shipwork_add_button').show();
		$('#shipwork_edit_button').hide();
		$('#shipwork_delete_button').hide();
			}
        });
	$("#btn_edit").off('click');
	$("#btn_edit").click(function () {
		var arrselections = $("#table").bootstrapTable('getSelections');
		if (arrselections.length > 1) {
			return;
		}
		if (arrselections.length <= 0) {
			return;
		}
		document.getElementById("shipwork_update_label").className = "modal-title glyphicon glyphicon-pencil";
		var select_work = document.getElementById("shipwork_fleetid");
		while(select_work.hasChildNodes()) 
		{
			select_work.removeChild(select_work.firstChild);
		}
		var entry = "";
		for (var c in allCompany) {
			entry += '<option value="'+c+'">'+ c+'---'+allCompany[c].name +'</option>';
		}
		$("#shipwork_fleetid").append(entry);
		
		var select_route = document.getElementById("shipwork_routeid");
		while(select_route.hasChildNodes()) 
		{
			select_route.removeChild(select_route.firstChild);
		}
		var entry = "";
		for (var h in allHangxian) {
			entry += '<option value="'+h+'">'+ h+'---'+allHangxian[h].route_name +'</option>';
		}
		$("#shipwork_routeid").append(entry);
		$("#shipwork_update_label").text("编辑");
		$("#shipwork_mmsi").val(arrselections[0].mmsi);
		$("#shipwork_projectid").val(arrselections[0].project_id);
		$("#shipwork_fleetid").val(arrselections[0].fleetid);
		$("#shipwork_routeid").val(arrselections[0].route_id);
		$("#shipwork_startdate").val(arrselections[0].startdate);
		$("#shipwork_enddate").val(arrselections[0].enddate);
		$('#shipwork_update').modal('show');
		$('#shipwork_add_button').hide();
		$('#shipwork_edit_button').show();
		$('#shipwork_delete_button').hide();
    });
	$("#btn_delete").off('click');
	$("#btn_delete").click(function () {
		var arrselections = $("#table").bootstrapTable('getSelections');
		if (arrselections.length > 1) {
			return;
		}
		if (arrselections.length <= 0) {
			return;
		}
		if(sessionStorage.length == 0)
			{
				alert("会话过期，请重新登录！ ");
				self.location='index.html';
				return;
			}
			if(!authority_sys2(12, sessionStorage.privilege))
			{
				 alert("当前用户无权限进行该操作！ ");
			}
			else{
		var mmsi = arrselections[0].mmsi;
		var company_id = arrselections[0].company_id;
		var route_id = arrselections[0].route_id;
		var project_id = arrselections[0].project_id;
		var sdate = arrselections[0].startdate;
		var edate = arrselections[0].enddate;
		if(confirm("确定要删除吗？")){
			shipwork_delete();
		}
			}
    });
}

function RefreshLoadShipWork()
{
	postData["project_id"] = $("#import_project").val();
	postData["mmsi"] = $("#select_mmsi").val();
	$.ajax({
			type: "POST",
			url: "/shanggang/shipworkhistory/listbymmsi",
			data: JSON.stringify(postData),
			contentType:"application/json",
			success: function (data) {
				console.log(data);
				fillShipWorkData(data);
				RefreshShipWorkTable();
			},
			error: function () {       
				alert("获取数据失败！ ")
			}       
		 });
}

function RefreshShipWorkTable()
{
	$('#datatable').hide();
	$('#table').bootstrapTable('load', allShipWork); 
	$('#datatable').show();
}

function shipwork_add()
{
	mmsi = $("#shipwork_mmsi").val();
	project_id = $("#shipwork_projectid").val();
	route_id = $("#shipwork_routeid").val();
	company_id = $("#shipwork_fleetid").val();
	sdate = $("#shipwork_startdate").val();
	edate = $("#shipwork_enddate").val();
	postData = {"mmsi":mmsi,"company_id":company_id,"route_id":route_id,"project_id":project_id, "startdate":sdate, "enddate":edate};
	$.ajax({
         type: "POST",
         url: "/shanggang/shipworkhistory/add",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("新增数据成功！");
			 $('#shipwork_update').modal('hide');
         	 RefreshLoadShipWork();
               },       
         error: function () {       
                alert("新增数据失败！");       
           }       
     });
}

function shipwork_edit()
{
	if(sessionStorage.length == 0)
	{
		alert("会话过期，请重新登录！ ");
		self.location='index.html';
		return;
	}
	if(!authority_sys2(11, sessionStorage.privilege))
	{
		 alert("当前用户无权限进行该操作！ ");
	}
	else{
	mmsi = $("#shipwork_mmsi").val();
	project_id = $("#shipwork_projectid").val();
	route_id = $("#shipwork_routeid").val();
	company_id = $("#shipwork_fleetid").val();
	sdate = $("#shipwork_startdate").val();
	edate = $("#shipwork_enddate").val();
	postData = {"mmsi":mmsi,"company_id":company_id,"route_id":route_id,"project_id":project_id, "startdate":sdate, "enddate":edate};
	$.ajax({
         type: "POST",
         url: "/shanggang/shipworkhistory/add",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("修改数据成功！");
			 $('#shipwork_update').modal('hide');
         	 RefreshLoadShipWork();
               },       
         error: function () {       
                alert("修改数据失败！");       
           }       
     });
	}
}

function shipwork_delete()
{
	var arrselections = $("#table").bootstrapTable('getSelections');
	if (arrselections.length > 1) {
		alert("删除数据失败！"); 
		return;
	}
	if (arrselections.length <= 0) {
		alert("删除数据失败！"); 
		return;
	}
	var mmsi = arrselections[0].mmsi;
	var company_id = arrselections[0].company_id;
	var route_id = arrselections[0].route_id;
	var project_id = arrselections[0].project_id;
	var sdate = arrselections[0].startdate;
	var edate = arrselections[0].enddate;
	postData = {"mmsi":mmsi,"company_id":company_id,"route_id":route_id,"project_id":project_id, "startdate":sdate, "enddate":edate};
	$.ajax({
         type: "POST",
         url: "/shanggang/shipworkhistory/delete",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("删除数据成功！");
			 $('#shipwork_update').modal('hide');
         	 RefreshLoadShipWork();
               },       
         error: function () {       
                alert("删除数据失败！");       
           }       
     });
}