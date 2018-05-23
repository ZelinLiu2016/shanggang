var allBoat = [];
postData = {};

function InitLoadImport()
{
	project_submenu_selected = -1;
	CleanAll();
	$("#L1").attr("class", "LeftTextSelect");
	$("#L1L2").attr("class", "LeftTextSelect");
	
    $("#toolbar").show();
	$("#btn_backup").hide();
	$("#btn_add").show();
	$("#btn_edit").show();
	$("#btn_delete").show();
	$("#btn_show").hide();
	$("#toolbar_search").show();
	$("#btn_search").show();
	$("#import_project").show();
	$("#select_mmsi").hide();
	$("#import_project_label").hide();
	$("#select_mmsi_label").hide();
	$("#finish_checkbox").hide();
	$("#finish_checkbox_label").hide();
	
	$("#mapBody").hide();
	$("#data_clean").hide();
	$("#detail_information").hide();
	$("#detailtable").hide();
	$("#info_div").show();
	$("#monitor_search_modal").hide();
	$("#stat_start_end_time").hide();
	$("#project_progress").hide();
	$("#toolbar_search").val("");
	
	var select_project = document.getElementById("import_project");
	while(select_project.hasChildNodes()) 
	{
		select_project.removeChild(select_project.firstChild);
	}
	var entry = "";
	entry += '<option value=-1>所有工程</option>';
	for (var d in detailed) {
		entry += '<option value="'+d+'">'+ d+'---'+detailed[d].projectname +'</option>';
	}
	$("#import_project").append(entry);
	$("#import_project").off('change');
	$("#import_project").change(function(){project_changed();});
	
	$.ajax({
        method: "GET",
        url: "/shanggang/ship/list",
        success: function (data) {
			fillBoatData(data);
			fillMmsiData(data);
			project_filter();
            },
		error: function () {       
            alert("获取数据失败！");
        }  
    });
	
	var thead = document.getElementById("info_head");
	while(thead.hasChildNodes()) //当div下还存在子节点时 循环继续  
	{
		thead.removeChild(thead.firstChild);
	}
	entry = '<tr><th colspan="5">船舶详细信息</th></tr>';
	entry += '<tr><th width="20%">船老大</th><th width="20%">联系方式</th><th width="20%">船长</th><th width="20%">船宽</th><th width="20%">满载量</th></tr>';
	entry += '<tr><td></td><td></td><td></td><td></td><td></td></td>';
	entry += '<tr><th colspan="5">历史参建项目</th></tr>';
	entry += '<tr><th>工程名称</th><th>开始日期</th><th>结束日期</th><th></th><th></th></tr>';
	$("#info_head").append(entry);
	var tbody = document.getElementById("info_body");
	while(tbody.hasChildNodes()) //当div下还存在子节点时 循环继续  
	{
		tbody.removeChild(tbody.firstChild);
	}
	entry = '<tr><td></td><td></td><td></td><td></td><td></td></tr>';
	$("#info_body").append(entry);
}

function RefreshLoadImport()
{
	$.ajax({
        method: "GET",
        url: "/shanggang/ship/list",
        success: function (data) {
        	fillBoatData(data);
			fillMmsiData(data);
			project_filter_refresh();
            },
		error: function () {       
            alert("获取数据失败！");
        }  
    });
}

function InitImportTable() {
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allBoat,
    //height:380,
	pagination: false,
    pageSize: 5,
	clickToSelect: true,
	singleSelect:true,
	
	onClickRow: function (row, $element) {
		var mmsi = row.mmsi;
		var thead = document.getElementById("info_head");
		while(thead.hasChildNodes()) //当div下还存在子节点时 循环继续  
		{
			thead.removeChild(thead.firstChild);
		}
		entry = '<tr><th colspan="5">船舶详细信息</th></tr>';
		entry += '<tr><th width="20%">船老大</th><th width="20%">联系方式</th><th width="20%">船长</th><th width="20%">船宽</th><th width="20%">满载量</th></tr>';
		entry += '<tr><td>'+allMmsi[mmsi].boss;
		entry += '</td><td>'+allMmsi[mmsi].bossphone;
		entry += '</td><td>'+allMmsi[mmsi].length;
		entry += '</td><td>'+allMmsi[mmsi].width;
		entry += '</td><td>'+allMmsi[mmsi].capacity+'</td></tr>';
		entry += '<tr><th colspan="5">历史参建项目</th></tr>';
		entry += '<tr><th>工程名称</th><th>开始日期</th><th>结束日期</th><th></th><th></th></tr>';
		$("#info_head").append(entry);
		var tbody = document.getElementById("info_body");
		
		while(tbody.hasChildNodes()) //当div下还存在子节点时 循环继续  
		{
			tbody.removeChild(tbody.firstChild);
		}
		entry = "";
		var tmp_list = new Array();
		for(d in detailed)
		{
			if(hasvalue(detailed[d].mmsi.split(';'), mmsi))
			{
				tmp_list.push([d, detailed[d].startdate, detailed[d].enddate]);
			}
		}
		tmp_list.sort(
		    function(a,b){
				if(a[1]==b[1])
				{
					return a[2]>b[2];
				}
				else{
					return a[1]>b[1];
				}
			}
		);
		for(var i = 0; i<tmp_list.length;++i)
		{
			entry += '<tr><td>'+detailed[tmp_list[i][0]].projectname+'</td><td>'+detailed[tmp_list[i][0]].startdate+'</td><td>'+detailed[tmp_list[i][0]].enddate+'</td><td></td><td></td></tr>';
		}
		$("#info_body").append(entry);
		entry = "";
		for(var i = tbody.rows.length;i<4;++i)
		{
			entry+=('<tr><td></td><td></td><td></td><td></td><td></td></tr>');
		}
		$("#info_body").append(entry);
    },
	
    columns: [
	{checkbox: true},
	{
        field: 'mmsi',
        title: 'MMSl'
    }, 
	{
        field: 'fleetname',
        title: '施工单位'
    },
	{
        field: 'shipname',
        title: '船名'
    },
	{
        field: 'shiptype',
        title: '船舶类型'
    },
	{
        field: 'route_name',
        title: '航线'
    },
	{
        field: 'contact',
        title: '所有人'
    },
	{
        field: 'cellphone',
        title: '联系方式'
    }
	]});
    $('#datatable').show();
	$("#btn_search").off('click');
	$("#btn_search").click(function () {
		var search = $("#toolbar_search").val();
		postData = {"str": search};
		$.ajax({
			type: "POST",
			url: "/shanggang/ship/mohu",
			data: JSON.stringify(postData),
			contentType:"application/json",
			success: function (data) {
				console.log(data);
				allBoat = [];
				for(var i = 0;i<data.length;++i)
				{
					var info = {"capacity":allMmsi[data[i]].capacity,
					"fleetid":allMmsi[data[i]].fleetid,"imo":allMmsi[data[i]].IMO,"length":allMmsi[data[i]].length,
					"width":allMmsi[data[i]].width,"mmsi":data[i],"shipname":allMmsi[data[i]].shipname,
					"shiptype":allMmsi[data[i]].shiptype,"contact":allMmsi[data[i]].contact,"cellphone":allMmsi[data[i]].cellphone,
					"route_id":allMmsi[data[i]].route_id};
					if(info.fleetid in allCompany)
					{
						info.fleetname = allCompany[info.fleetid].name;
					}
					else{
						info.fleetname = "-";
					}
					if(info.route_id in allHangxian)
					{
						info.route_name = allHangxian[info.route_id].route_name;
					}
					else{
						info.route_name = "-";
					}
					allBoat.push(info);
				}
				project_filter_refresh();
			},       
			error: function () {       
				alert("获取数据失败！");       
			}       
		});
	});
	$("#btn_add").off('click');
	$("#btn_add").click(function () {
		document.getElementById("import_update_label").className = "modal-title glyphicon glyphicon-plus";
		var select_work = document.getElementById("import_fleetid");
		while(select_work.hasChildNodes()) 
		{
			select_work.removeChild(select_work.firstChild);
		}
		var entry = "";
		for (var c in allCompany) {
			entry += '<option value="'+c+'">'+ c+'---'+allCompany[c].name +'</option>';
		}
		$("#import_fleetid").append(entry);
		
		var select_route = document.getElementById("import_routeid");
		while(select_route.hasChildNodes()) 
		{
			select_route.removeChild(select_route.firstChild);
		}
		var entry = "";
		for (var h in allHangxian) {
			entry += '<option value="'+h+'">'+ h+'---'+allHangxian[h].route_name +'</option>';
		}
		$("#import_routeid").append(entry);
		
		$("#import_update_label").text("新增");
		$("#import_mmsl").val("");
		$("#import_fleetid").val("");
		$("#import_routeid").val("");
		$("#import_shipname").val("");
		$("#import_imo").val("");
		$("#import_length").val("");
		$("#import_width").val("");
		$("#import_shiptype").val("");
		$("#import_capacity").val("");
		$("#import_contact").val("");
		$("#import_cellphone").val("");
		$('#import_update').modal('show');
		$('#import_add_button').show();
		$('#import_edit_button').hide();
		$('#import_delete_button').hide();
		$("#import_owner").val("");
		$("#import_ownerphone").val("");
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
		document.getElementById("import_update_label").className = "modal-title glyphicon glyphicon-pencil";
		var select_work = document.getElementById("import_fleetid");
		while(select_work.hasChildNodes()) 
		{
			select_work.removeChild(select_work.firstChild);
		}
		var entry = "";
		for (var c in allCompany) {
			entry += '<option value="'+c+'">'+ c+'---'+allCompany[c].name +'</option>';
		}
		$("#import_fleetid").append(entry);
		
		var select_route = document.getElementById("import_routeid");
		while(select_route.hasChildNodes()) 
		{
			select_route.removeChild(select_route.firstChild);
		}
		var entry = "";
		for (var h in allHangxian) {
			entry += '<option value="'+h+'">'+ h+'---'+allHangxian[h].route_name +'</option>';
		}
		$("#import_routeid").append(entry);
		
		$("#import_fleetid").val(arrselections[0].fleetid);
		$("#import_routeid").val(arrselections[0].route_id);
		$("#import_update_label").text("编辑");
		$("#import_mmsl").val(arrselections[0].mmsi);
		$("#import_fleetid").val(arrselections[0].fleetid);
		$("#import_shipname").val(arrselections[0].shipname);
		$("#import_imo").val(arrselections[0].imo);
		$("#import_length").val(arrselections[0].length);
		$("#import_width").val(arrselections[0].width);
		$("#import_shiptype").val(arrselections[0].shiptype);
		$("#import_capacity").val(arrselections[0].capacity);
		$("#import_contact").val(arrselections[0].contact);
		$("#import_cellphone").val(arrselections[0].cellphone);
		$("#import_owner").val(arrselections[0].owner);
		$("#import_ownerphone").val(arrselections[0].ownerphone);
		$('#import_update').modal('show');
		$('#import_add_button').hide();
		$('#import_edit_button').show();
		$('#import_delete_button').hide();
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
		if(confirm("确定要删除吗？")){
			import_delete(arrselections[0].mmsi);
		}
		/*$("#import_update_label").text("删除");
		$("#import_mmsl").val(arrselections[0].mmsi);
		$("#import_fleetid").val(arrselections[0].fleetid);
		$("#import_shipname").val(arrselections[0].shipname);
		$("#import_imo").val(arrselections[0].imo);
		$("#import_length").val(arrselections[0].length);
		$("#import_width").val(arrselections[0].width);
		$("#import_shiptype").val(arrselections[0].shiptype);
		$("#import_capacity").val(arrselections[0].capacity);
		$('#import_update').modal('show');
		$('#import_add_button').hide();
		$('#import_edit_button').hide();
		$('#import_delete_button').show();*/
    });
}

function RefreshImportTable() {
	$('#datatable').hide();
	$('#table').bootstrapTable('load', allBoat); 
	$('#datatable').show();
}

function fillBoatData(data)
{
	allBoat = [];
	for(var i = 0;i<data.length;++i){
		var info = {"capacity":data[i].capacity,
			"fleetid":data[i].fleet_id,"imo":data[i].imo,"length":data[i].length,
			"width":data[i].width,"mmsi":data[i].mmsi,"shipname":data[i].shipname,
			"shiptype":data[i].shiptype,"contact":data[i].contact,"cellphone":data[i].cellphone,
			"owner":data[i].owner, "ownerphone":data[i].owner_phone,"route_id":data[i].route_id};
		
		if(info.fleetid in allCompany){
			info.fleetname = allCompany[info.fleetid].name;
		}
		else{
			info.fleetname = "-";
		}
		if(info.route_id in allHangxian)
		{
			info.route_name = allHangxian[info.route_id].route_name;
		}
		else{
			info.route_name = "-";
		}
		allBoat.push(info);
	}
}

function import_add()
{
	postData["mmsi"] = $("#import_mmsl").val();
	postData["shipname"] = $("#import_shipname").val();
	postData["imo"] = $("#import_imo").val();
	postData["length"] = $("#import_length").val();
	postData["width"] = $("#import_width").val();
	postData["shiptype"] =	$("#import_shiptype").val();
	postData["capacity"] = $("#import_capacity").val();
	postData["fleet_id"] = $("#import_fleetid").val();
	postData["contact"] = $("#import_contact").val();
	postData["cellphone"] = $("#import_cellphone").val();
	postData["owner"] = $("#import_owner").val();
	postData["owner_phone"] = $("#import_ownerphone").val();
	postData["route_id"] = $("#import_routeid").val();
	$.ajax({
         type: "POST",
         url: "/shanggang/ship/add",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("新增数据成功！");
			 $("#import_update").modal('hide');
         	 RefreshLoadImport();
               },       
         error: function () {       
                alert("新增数据失败！");       
           }       
     });
}

function import_edit()
{
	postData["mmsi"] = $("#import_mmsl").val();
	postData["shipname"] = $("#import_shipname").val();
	postData["imo"] = $("#import_imo").val();
	postData["length"] = $("#import_length").val();
	postData["width"] = $("#import_width").val();
	postData["shiptype"] =	$("#import_shiptype").val();
	postData["capacity"] = $("#import_capacity").val();
	postData["fleet_id"] = $("#import_fleetid").val();
	postData["contact"] = $("#import_contact").val();
	postData["cellphone"] = $("#import_cellphone").val();
	postData["owner"] = $("#import_owner").val();
	postData["owner_phone"] = $("#import_ownerphone").val();
	postData["route_id"] = $("#import_routeid").val();
	$.ajax({
         type: "POST",
         url: "/shanggang/ship/update",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("修改数据成功！");
			 $("#import_update").modal('hide');
         	 RefreshLoadImport();
               },       
         error: function () {       
                alert("修改数据失败！");       
           }       
     });
}

function import_delete(mmsi)
{
	//postData["mmsi"] = $("#import_mmsl").val();
	postData["mmsi"] = mmsi;
	$.ajax({
         type: "POST",
         url: "/shanggang/ship/delete",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("删除数据成功！");
			 $("#import_update").modal('hide');
         	 RefreshLoadImport();
               },       
         error: function () {       
                alert("删除数据失败！");       
           }       
     });
}

function project_filter()
{
	tmp_allBoat = [];
	var pro = $("#import_project").val();
	if (pro < 0){
		InitImportTable();
	}
	else{
		postData["project_id"] = pro;
		$.ajax({
			type: "POST",
			url: "/shanggang/ship/listbyprojectid",
			data: JSON.stringify(postData),
			contentType:"application/json",
			success: function (data) {
				console.log(data);
				var mmsis = {};
				for (var i = 0;i<data.length;++i)
				{
					var mmsi = data[i].mmsi;
					mmsis[mmsi] = "";
				}
				for (var i = 0;i<allBoat.length;++i)
				{
					if (allBoat[i].mmsi in mmsis){
						tmp_allBoat.push(allBoat[i]);
					}
				}
				allBoat = tmp_allBoat;
				InitImportTable();
			},
			error: function () {       
				alert("获取数据失败！ ")
			}       
		 });
	}
}

function project_filter_refresh()
{
	tmp_allBoat = [];
	var pro = $("#import_project").val();
	if (pro < 0){
		InitImportTable();
	}
	else{
		postData["project_id"] = pro;
		$.ajax({
			type: "POST",
			url: "/shanggang/ship/listbyprojectid",
			data: JSON.stringify(postData),
			contentType:"application/json",
			success: function (data) {
				console.log(data);
				var mmsis = {};
				for (var i = 0;i<data.length;++i)
				{
					var mmsi = data[i].mmsi;
					mmsis[mmsi] = "";
				}
				for (var i = 0;i<allBoat.length;++i)
				{
					if (allBoat[i].mmsi in mmsis){
						tmp_allBoat.push(allBoat[i]);
					}
				}
				allBoat = tmp_allBoat;
				RefreshImportTable();
			},
			error: function () {       
				alert("获取数据失败！ ")
			}       
		 });
	}
}

function project_changed()
{
	$.ajax({
        method: "GET",
        url: "/shanggang/ship/list",
        success: function (data) {
			fillBoatData(data);
			fillMmsiData(data);
			project_filter();
            },
		error: function () {       
            alert("获取数据失败！");
        }  
    });
}