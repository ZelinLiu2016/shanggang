var tmp_pngq_id_str = "";
var tmp_sjgq_id_str = "";
var tmp_sgdw_id_str = "";
var tmp_sjdw_id_str = "";
var tmp_jldw_id_str = "";
var tmp_cldw_id_str = "";
var tmp_cwdw_id_str = "";


function InitLoadParam_Project()
{
	if(project_selected<0)
	{
		alert("请在页面顶部选择需要查看的工程！ ");
		return;
	}
	project_submenu_selected = 1;
	CleanAll();
	$("#L4").attr("class", "LeftTextSelect");
	$("#toolbar").hide();
	$("#toolbar_search").hide();
	$("#btn_search").hide();
	
	$("#mapBody").hide();
	$("#data_clean").hide();
	$("#datatable").show();
	$("#detailtable").hide();
	$("#detail_information").show();
	$("#info_div").hide();
	$("#monitor_search_modal").hide();
	$("#stat_start_end_time").hide();
	$("#project_progress").hide();
	//document.getElementById("btn_show").removeAttribute("disabled");

	var tbody = document.getElementById("company-tbody");
	while(tbody.hasChildNodes())
	{
		tbody.removeChild(tbody.firstChild);
	}
	for(var i = 0;i<4;++i)
	{
		$("#company-tbody").append('<tr><td></td><td></td><td></td><td></td></tr>');
	}
	tbody = document.getElementById("mmsi-tbody");
	while(tbody.hasChildNodes())
	{
		tbody.removeChild(tbody.firstChild);
	}
	for(var i = 0;i<4;++i)
	{
		$("#mmsi-tbody").append('<tr><td></td><td></td><td></td><td></td></tr>');
	}
	
	$.ajax({
        method: "GET",
        url: "/shanggang/project/list",
        success: function (data) {
        	fillParamDataProject(data, project_selected);
			InitParamTable();
            },
		error: function () {       
            alert("获取数据失败！");
        }  
	});
}

function InitLoadParam()
{
	project_submenu_selected = -1;
	CleanAll();
	$("#L1").attr("class", "LeftTextSelect");
	$("#L1L1").attr("class", "LeftTextSelect");
	$("#toolbar").show();
	$("#btn_backup").hide();
	$("#btn_add").show();
	$("#btn_edit").show();
	$("#btn_delete").show();
	$("#btn_show").hide();
	$("#import_project").hide();
	$("#select_mmsi").hide();
	$("#finish_checkbox").show();
	$("#finish_checkbox_label").show();
	$("#finish_checkbox_label").text("显示已完成工程");
	document.getElementById('finish_checkbox').checked = false;
	$("#finish_checkbox").off('click');
	$("#finish_checkbox").click(function () {
		show_finished();
	});
	$("#toolbar_search").hide();
	$("#btn_search").hide();
	
	$("#mapBody").hide();
	$("#data_clean").hide();
	$("#datatable").show();
	$("#detailtable").hide();
	$("#detail_information").show();
	$("#stat_start_end_time").hide();
	$("#info_div").hide();
	$("#monitor_search_modal").hide();
	$("#project_progress").hide();
	//document.getElementById("btn_show").removeAttribute("disabled");

	var tbody = document.getElementById("company-tbody");
	while(tbody.hasChildNodes())
	{
		tbody.removeChild(tbody.firstChild);
	}
	for(var i = 0;i<4;++i)
	{
		$("#company-tbody").append('<tr><td></td><td></td><td></td><td></td></tr>');
	}
	tbody = document.getElementById("mmsi-tbody");
	while(tbody.hasChildNodes())
	{
		tbody.removeChild(tbody.firstChild);
	}
	for(var i = 0;i<4;++i)
	{
		$("#mmsi-tbody").append('<tr><td></td><td></td><td></td><td></td></tr>');
	}
	
	dredging_area = "";
	if (dredging_area == "")
	{
		$.ajax({
        method: "GET",
        url: "/shanggang/project/list",
        success: function (data) {
        	fillParamData(data);
			set_port_menu();
			finish_filter();
			InitParamTable();
            },
		error: function () {       
            alert("获取数据失败！");
        }  
    });
	}
	else{
		$.ajax({
        method: "POST",
        url: "/shanggang/project/listbyharbor",
		data: JSON.stringify({"harbor_name":dredging_area}),
		contentType:"application/json",
        success: function (data) {
			fillParamData(data);
			set_port_menu();
			finish_filter();
			InitParamTable();
            },
		error: function () {       
            alert("获取数据失败！");
        }  
    });
	}
	
	$.ajax({
        method: "GET",
        url: "/shanggang/company/listall",
        success: function (data) {
        	fillCompanyData(data);
            },
		error: function () {       
            alert("获取数据失败！");
        }  
    });
	$.ajax({
        method: "GET",
        url: "/shanggang/ship/list",
        success: function (data) {
        	fillMmsiData(data);
            },
		error: function () {       
            alert("获取数据失败！");
        }  
    });
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
		type: "GET",
		url: "/shanggang/route/listall",
		success: function (data) {    
				fillAllRoute(data);
			  },
		error: function () {       
			   alert("获取数据失败！");       
		  }       
    });
}

function RefreshLoadParam()
{
	if (dredging_area == "")
	{
		$.ajax({
        method: "GET",
        url: "/shanggang/project/list",
        success: function (data) {
        	fillParamData(data);
			set_port_menu();
			finish_filter();
			RefreshParamTable();
            },
		error: function () {       
            alert("获取数据失败！");
        }  
    });
	}
	else{
		$.ajax({
        method: "POST",
        url: "/shanggang/project/listbyharbor",
		data: JSON.stringify({"harbor_name":dredging_area}),
		contentType:"application/json",
        success: function (data) {
			fillParamData(data);
			set_port_menu();
			finish_filter();
			RefreshParamTable();
            },
		error: function () {       
            alert("获取数据失败！");
        }  
    });
	}
	$.ajax({
        method: "GET",
        url: "/shanggang/company/listall",
        success: function (data) {
        	fillCompanyData(data);
            },
		error: function () {       
            alert("获取数据失败！");
        }  
    });
	$.ajax({
        method: "GET",
        url: "/shanggang/ship/list",
        success: function (data) {
        	fillMmsiData(data);
            },
		error: function () {       
            alert("获取数据失败！");
        }  
    });
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
}

function InitParamTable() {
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allParam,
    //height:80,
	pagination: true,
    pageSize: 5,
	clickToSelect: true,
	singleSelect:true,
	pageList: [10, 25, 50, 100],
	
	onCheck: function (row, $element) {
		var tbody = document.getElementById("company-tbody");
		var selected = detailed[row.projectid];
		while(tbody.hasChildNodes()) //当div下还存在子节点时 循环继续  
		{
			tbody.removeChild(tbody.firstChild);
		}
		var entry = "";
		if(selected.sggs != "")
		{
			sggs = selected.sggs.split(';');
			for (var i = 0; i < sggs.length; i++) {
				if(sggs[i] in allSgdw){
					entry += '<tr><td>'+"施工单位"+'</td><td>'+allSgdw[sggs[i]].name+'</td><td>'+allSgdw[sggs[i]].contact+'</td><td>'+allSgdw[sggs[i]].cellphone+'</td></tr>';
				}
			}
		}
		if(selected.sjgs != "")
		{
			sjgs = selected.sjgs.split(';');
			for (var i = 0; i < sjgs.length; i++) {
				if(sjgs[i] in allSjdw){
					entry += '<tr><td>'+"设计单位"+'</td><td>'+allSjdw[sjgs[i]].name+'</td><td>'+allSjdw[sjgs[i]].contact+'</td><td>'+allSjdw[sjgs[i]].cellphone+'</td></tr>';
				}
			}
		}
		if(selected.jlgs != "")
		{
			jlgs = selected.jlgs.split(';');
			for (var i = 0; i < jlgs.length; i++) {
				if(jlgs[i] in allJldw){
				entry += '<tr><td>'+"监理单位"+'</td><td>'+allJldw[jlgs[i]].name+'</td><td>'+allJldw[jlgs[i]].contact+'</td><td>'+allJldw[jlgs[i]].cellphone+'</td></tr>';
				}
			}
		}
		if(selected.clgs != "")
		{
			clgs = selected.clgs.split(';');
			for (var i = 0; i < clgs.length; i++) {
				if(clgs[i] in allCldw){
				entry += '<tr><td>'+"测量单位"+'</td><td>'+allCldw[clgs[i]].name+'</td><td>'+allCldw[clgs[i]].contact+'</td><td>'+allCldw[clgs[i]].cellphone+'</td></tr>';
				}
			}
		}
		if(selected.cwgs != "")
		{
			cwgs = selected.cwgs.split(';');
			for (var i = 0; i < cwgs.length; i++) {
				if(cwgs[i] in allCwdw){
				entry += '<tr><td>'+"财务监理单位"+'</td><td>'+allCwdw[cwgs[i]].name+'</td><td>'+allCwdw[cwgs[i]].contact+'</td><td>'+allCwdw[cwgs[i]].cellphone+'</td></tr>';
				}
			}
		}
		$("#company-tbody").append(entry);
		for(var i = tbody.rows.length;i<4;++i)
		{
			$("#company-tbody").append('<tr><td></td><td></td><td></td><td></td></tr>');
		}
		
		tbody = document.getElementById("mmsi-tbody");
		while(tbody.hasChildNodes()) //当div下还存在子节点时 循环继续  
		{
			tbody.removeChild(tbody.firstChild);
		}
		entry = "";
		if(selected.mmsi != "")
		{
			mmsilist = selected.mmsi.split(';');
			for (var i = 0; i < mmsilist.length; i++) {
				if(mmsilist[i] in allMmsi){
					entry += '<tr><td>'+mmsilist[i]+'</td><td>'+allMmsi[mmsilist[i]].shipname+'</td><td>'+allMmsi[mmsilist[i]].contact+'</td><td>'+allMmsi[mmsilist[i]].cellphone+'</td></tr>';	
				}
			}
		}
		$("#mmsi-tbody").append(entry);
		for(var i = tbody.rows.length;i<4;++i)
		{
			$("#mmsi-tbody").append('<tr><td></td><td></td><td></td><td></td></tr>');
		}
        // row: the record corresponding to the clicked row, 
        // $element: the tr element.
    },
    columns: [
	{checkbox: true},
	{
        field: 'projectid',
        title: '工程编号'
    }, 
	{
        field: 'projectname',
        title: '工程名称'
    }, 
	{
        field: 'harbor_name',
        title: '施工区域'
    },
	{
        field: 'area_name',
        title: '抛泥区域'
    },
	/*{
        field: 'routeid',
        title: '抛泥航线'
    },*/
	{
        field: 'capacity',
        title: '抛泥方量'
    },
	{
        field: 'shipnum',
        title: '船只数量'
    },
	{
        field: 'mudratio',
        title: '泥浆比'
    },
	{
        field: 'startdate',
        title: '开始日期'
    },
	{
        field: 'enddate',
        title: '结束日期'
    },
	{
        field: 'inprogress',
        title: '是否在建'
    }
	]});
	
    $('#datatable').show();
	$("#btn_add").off('click');
	$("#btn_add").click(function () {
			document.getElementById("param_update_label").className = "modal-title glyphicon glyphicon-plus";
			tmp_pngq_id_str = "";
			tmp_sjgq_id_str = "";
			tmp_sgdw_id_str = "";
			tmp_sjdw_id_str = "";
			tmp_jldw_id_str = "";
            $("#param_update_label").text("新增");
			$("#param_projectid").val("");
			$("#param_projectname").val("");
			$("#param_harborname").val("");
			$("#param_area").val("");
			$("#param_capacity").val("");
			$("#param_shipnum").val("");
			$("#param_startdate").val("");
			$("#param_enddate").val("");
			$("#sg_input").val("");
			$("#sj_input").val("");
			$("#jl_input").val("");
			$("#cl_input").val("");
			$("#cw_input").val("");
			$("#mmsi_input").val("");
			$("#param_mudratio").val("");
			$("#param_route").val("");
			$("#param_inprogress").val(1);
			$('#param_port').val("");
			$('#param_update').modal('show');
			$('#param_add_button').show();
			$('#param_edit_button').hide();
			$('#param_delete_button').hide();
        });
	$("#btn_edit").off('click');
	$("#btn_edit").click(function () {
            var arrselections = $("#table").bootstrapTable('getSelections');
			console.log(arrselections);
            if (arrselections.length > 1) {
                return;
            }
            if (arrselections.length <= 0) {
                return;
            }
			project_id = arrselections[0].projectid;
			tmp_pngq_id_str = arrselections[0].area;
			tmp_sjgq_id_str = arrselections[0].harborname;
			document.getElementById("param_update_label").className = "modal-title glyphicon glyphicon-pencil";
            $("#param_update_label").text("编辑");
			$("#param_projectid").val(project_id);
			$("#param_projectname").val(arrselections[0].projectname);
			$("#param_harborname").val(arrselections[0].harbor_name);
			$("#param_area").val(arrselections[0].area_name);
			$("#param_capacity").val(arrselections[0].capacity);
			$("#param_shipnum").val(arrselections[0].shipnum);
			$("#param_startdate").val(arrselections[0].startdate);
			$("#param_enddate").val(arrselections[0].enddate);
			$("#param_mudratio").val(arrselections[0].mudratio);
			$("#param_route").val(arrselections[0].routeid);
			tmp_sgdw_id_str = detailed[project_id].sggs;
			tmp_sjdw_id_str = detailed[project_id].sjgs;
			tmp_jldw_id_str = detailed[project_id].jlgs;
			tmp_cldw_id_str = detailed[project_id].clgs;
			tmp_cwdw_id_str = detailed[project_id].cwgs;
			$("#sg_input").val(GetCompanyNameStrByID(tmp_sgdw_id_str));
			$("#sj_input").val(GetCompanyNameStrByID(tmp_sjdw_id_str));
			$("#jl_input").val(GetCompanyNameStrByID(tmp_jldw_id_str));
			$("#cl_input").val(GetCompanyNameStrByID(tmp_cldw_id_str));
			$("#cw_input").val(GetCompanyNameStrByID(tmp_cwdw_id_str));
			$("#mmsi_input").val(detailed[project_id].mmsi);
			$("#param_inprogress").val(arrselections[0].isworking);
			$("#param_port").val(arrselections[0].toparea);
			
			$('#param_update').modal('show');
			$('#param_add_button').hide();
			$('#param_edit_button').show();
			$('#param_delete_button').hide();
        });
	$("#btn_delete").off('click');
	$("#btn_delete").click(function () {
            var arrselections = $("#table").bootstrapTable('getSelections');
			console.log(arrselections);
            if (arrselections.length > 1) {
                return;
            }
            if (arrselections.length <= 0) {
                return;
            }
			project_id = arrselections[0].projectid;
			if(confirm("确定要删除吗？")){
				param_delete(project_id);
			}
            //$("#param_update_label").text("删除");
			//$("#param_projectid").val(project_id);
			//$("#param_projectname").val(arrselections[0].projectname);
			//$("#param_harborname").val(arrselections[0].harborname);
			//$("#param_area").val(arrselections[0].area);
			//$("#param_capacity").val(arrselections[0].capacity);
			//$("#param_shipnum").val(arrselections[0].shipnum);
			//$("#param_startdate").val(arrselections[0].startdate);
			//$("#param_enddate").val(arrselections[0].enddate);
			//$("#param_mudratio").val(arrselections[0].mudratio);
			//$("#param_route").val(arrselections[0].routeid);
			
			//$("#sg_input").val(detailed[project_id].sggs);
			//$("#sj_input").val(detailed[project_id].sjgs);
			//$("#jl_input").val(detailed[project_id].jlgs);
			//$("#mmsi_input").val(detailed[project_id].mmsi);
			//$('#param_update').modal('show');
			//$('#param_add_button').hide();
			//$('#param_edit_button').hide();
			//$('#param_delete_button').show();
        });
}

function RefreshParamTable() {
	$('#datatable').hide();
	$('#table').bootstrapTable('load', allParam); 
	$('#datatable').show();
	set_port_menu();
}

function fillParamDataProject(data, p_s)
{
	allParam = [];
	for(var i = 0;i<data.length;++i)
	{
		if (data[i].projectId==p_s)
		{
			var info = {"projectid":data[i].projectId,"projectname":data[i].projectName,
			"area":data[i].dumpingArea,"capacity":data[i].squareVolume,"startdate":data[i].beginDate,
			"enddate":data[i].endDate,"shipnum":data[i].boatNum,"harborname":data[i].harborName,
			"mudratio":data[i].mud_ratio, "routeid":data[i].route_id,"isworking":data[i].isworking,"toparea":data[i].toparea};
			if(data[i].isworking == 0)
			{
				info.inprogress = "否";
			}
			else{
				info.inprogress = "是";
			}
			info["area_name"] = GetPaoniNameStrByID(info["area"]);
			info["harbor_name"] = GetShujunNameStrByID(info["harborname"]);
			allParam.push(info);
		}
	}
}

function fillParamData(data)
{
	console.log(data);
	allParam = [];
	detailed = {};
	port_project = {};
	for(var i = 0;i<allPorts.length;++i)
	{
		port_project[allPorts[i]] = [];
	}
	for(var i = 0;i<data.length;++i)
		{
			var info = {"projectid":data[i].projectId,"projectname":data[i].projectName,
			"area":data[i].dumpingArea,"capacity":data[i].squareVolume,"startdate":data[i].beginDate,
			"enddate":data[i].endDate,"shipnum":data[i].boatNum,"harborname":data[i].harborName,
			"mudratio":data[i].mud_ratio, "routeid":data[i].route_id,"isworking":data[i].isworking,"toparea":data[i].toparea};
			if(data[i].isworking == 0)
			{
				info.inprogress = "否";
			}
			else{
				info.inprogress = "是";
			}
			info["area_name"] = GetPaoniNameStrByID(info["area"]);
			info["harbor_name"] = GetShujunNameStrByID(info["harborname"]);
			allParam.push(info);
			detailed[data[i].projectId] = {"sggs":data[i].construction_company,"sjgs":data[i].design_company,
			"jlgs":data[i].supervision_company,"mmsi":data[i].mmsilist,"projectname":data[i].projectName,
			"startdate":data[i].beginDate, "enddate":data[i].endDate,"isworking":data[i].isworking,
			"clgs":data[i].measuring_company,"cwgs":data[i].finacial_supervision,};
			if (detailed[data[i].projectId].sggs == null)
			{
				detailed[data[i].projectId].sggs ="";
			}
			if (detailed[data[i].projectId].jlgs == null)
			{
				detailed[data[i].projectId].jlgs ="";
			}
			if (detailed[data[i].projectId].sjgs == null)
			{
				detailed[data[i].projectId].sjgs ="";
			}
			if (detailed[data[i].projectId].cwgs == null)
			{
				detailed[data[i].projectId].cwgs ="";
			}
			if (detailed[data[i].projectId].clgs == null)
			{
				detailed[data[i].projectId].clgs ="";
			}
			if(data[i].toparea in port_project)
			{
				port_project[data[i].toparea].push(data[i].projectId);		
			}
		}
}

function fillCompanyData(data)
{
	allSgdw = {};
	allSjdw = {};
	allJldw = {};
	allCldw = {};
	allCwdw = {};
	
	allCompany = {};
	for(var i = 0;i<data.length;++i)
	{
		allCompany[data[i].company_id] = {"name":data[i].company_name,"contact":data[i].contact,"cellphone":data[i].cellphone};
		switch (data[i].company_type)
		{
			case "施工单位":
				allSgdw[data[i].company_id] = {"name":data[i].company_name,"contact":data[i].contact,"cellphone":data[i].cellphone};
				break;
			case "设计单位":
				allSjdw[data[i].company_id] = {"name":data[i].company_name,"contact":data[i].contact,"cellphone":data[i].cellphone};
				break;
			case "监理单位":
				allJldw[data[i].company_id] = {"name":data[i].company_name,"contact":data[i].contact,"cellphone":data[i].cellphone};
				break;
			case "测量单位":
				allCldw[data[i].company_id] = {"name":data[i].company_name,"contact":data[i].contact,"cellphone":data[i].cellphone};
				break;
			case "财务监理单位":
				allCwdw[data[i].company_id] = {"name":data[i].company_name,"contact":data[i].contact,"cellphone":data[i].cellphone};
				break;
			default:
				alert("company_type not compatible")
		}
	}
}

function fillMmsiData(data)
{
	//allMmsi = {};
	for(var i = 0;i<data.length;++i)
	{
		allMmsi[data[i].mmsi] = {"shipname":data[i].shipname,"contact":data[i].contact,"cellphone":data[i].cellphone,"fleetid": data[i].fleet_id,
		"IMO":data[i].imo, "length":data[i].length, "width":data[i].width, "capacity":data[i].capacity, "shiptype":data[i].shiptype,
		"boss":data[i].owner,"bossphone":data[i].owner_phone,"route_id":data[i].route_id};
	}
}

function check_param(data)
{
	if (data["project_id"] == "")
		return false;
	if (data["projectname"] == "")
		return false;
	if (data["dumpingarea"] == "")
		return false;
	if (data["harborname"] == "")
		return false;
	if (data["squarevolume"] == "")
		return false;
	if (data["route_id"] == "")
		return false;
	if (data["mmsilist"] == "")
		return false;
	if (data["begindate"] == "")
		return false;
	if (data["enddate"] == "")
		return false;
	if (data["top_area"] == "")
		return false;
	return true;
}

function param_add()
{
	postData["project_id"] = $("#param_projectid").val();
	postData["projectname"] = $("#param_projectname").val();
	postData["harborname"] = tmp_sjgq_id_str;
	postData["dumpingarea"] = tmp_pngq_id_str;
	postData["squarevolume"] = $("#param_capacity").val();
	postData["boatnum"] = $("#param_shipnum").val();
	postData["begindate"] =	$("#param_startdate").val();
	postData["enddate"] = $("#param_enddate").val();
	postData["mud_ratio"] = $("#param_mudratio").val();
	postData["route_id"] = $("#param_route").val();
	postData["mmsilist"] = $("#mmsi_input").val();
	postData["construction_company"] = tmp_sgdw_id_str;
	postData["design_company"] = tmp_sjdw_id_str;
	postData["supervision_company"] = tmp_jldw_id_str;
	postData["measuring_company"] = tmp_cldw_id_str;
	postData["finacial_supervision"] = tmp_cwdw_id_str;
	postData["isworking"] = $("#param_inprogress").val();
	postData["top_area"] = $("#param_port").val();
	if(check_param(postData)){
		$.ajax({
         type: "POST",
         url: "/shanggang/project/add",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("新增数据成功！");
			 $("#param_update").modal('hide');
         	 RefreshLoadParam();
               },       
         error: function () {       
                alert("新增数据失败！");       
           }       
     	});
	}
	else{
		alert("数据不完整！");
	}
	
}

function param_edit()
{
	postData["project_id"] = $("#param_projectid").val();
	postData["projectname"] = $("#param_projectname").val();
	postData["dumpingarea"] = tmp_pngq_id_str;
	postData["squarevolume"] = $("#param_capacity").val();
	postData["boatnum"] = $("#param_shipnum").val();
	postData["begindate"] =	$("#param_startdate").val();
	postData["enddate"] = $("#param_enddate").val();
	postData["harborname"] = tmp_sjgq_id_str;
	postData["mud_ratio"] = $("#param_mudratio").val();
	postData["route_id"] = $("#param_route").val();
	postData["mmsilist"] = $("#mmsi_input").val();
	postData["construction_company"] = tmp_sgdw_id_str;
	postData["design_company"] = tmp_sjdw_id_str;
	postData["supervision_company"] = tmp_jldw_id_str;
	postData["measuring_company"] = tmp_cldw_id_str;
	postData["finacial_supervision"] = tmp_cwdw_id_str;
	postData["isworking"] = $("#param_inprogress").val();
	postData["top_area"] = $("#param_port").val();
	$.ajax({
         type: "POST",
         url: "/shanggang/project/update",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("修改数据成功！");
			 $("#param_update").modal('hide');
         	 RefreshLoadParam();
               },       
         error: function () {       
                alert("修改数据失败！");       
           }       
     });
}

function param_delete(id)
{
	//postData["project_id"] = $("#param_projectid").val();
	postData["project_id"] = id;
	$.ajax({
         type: "POST",
         url: "/shanggang/project/delete",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("删除数据成功！");
			 $("#param_update").modal('hide');
         	 RefreshLoadParam();
               },       
         error: function () {       
                alert("删除数据失败！");       
           }       
     });
}

function sgdw_multiselected()
{
	var result = "";
	childs = document.getElementById("multiselect_to").childNodes;
	if (childs.length>0)
	{
		for(var i = 0;i<childs.length-1;++i)
		{
			result = result+(childs[i].innerHTML).split("---")[0]+";";
		}
		result+=childs[childs.length-1].innerHTML.split("---")[0];
	}
	tmp_sgdw_id_str = result;
	$("#sg_input").val(GetCompanyNameStrByID(result));
	$("#multiselect_modal").modal('hide');
}

function choose_sgdw()
{
	$("#multiselect_confirm").off('click');
	$("#multiselect_confirm").click(function () {sgdw_multiselected();});
	var mst = document.getElementById("multiselect");
	while(mst.hasChildNodes()) 
	{
		mst.removeChild(mst.firstChild);
	}
	var mst_to= document.getElementById("multiselect_to");
	while(mst_to.hasChildNodes()) 
	{
		mst_to.removeChild(mst_to.firstChild);
	}
	var s = {};
	var selected = [];
	if(tmp_sgdw_id_str!="")
		selected = tmp_sgdw_id_str.split(";");
	for(var i=0;i<selected.length;++i)
	{
		s[selected[i]] = {};
	}
	var entry = "";
	for (var comp in allSgdw) {
		if(!(comp in s))
			entry += '<option>'+comp+'---'+allSgdw[comp].name+'</option>';
	}
	$("#multiselect").append(entry);
	entry = "";
	for (var comp in s) {
		entry += '<option>'+comp+'---'+allSgdw[comp].name+'</option>';
	}
	$("#multiselect_to").append(entry);
	$("#multiselect_label").text("施工单位");
	$("#multiselect_modal").modal('show');
}

function sjdw_multiselected()
{
	var result = "";
	childs = document.getElementById("multiselect_to").childNodes;
	if (childs.length>0)
	{
		for(var i = 0;i<childs.length-1;++i)
		{
			result = result+childs[i].innerHTML.split("---")[0]+";";
		}
		result+=childs[childs.length-1].innerHTML.split("---")[0];
	}
	tmp_sjdw_id_str = result;
	$("#sj_input").val(GetCompanyNameStrByID(result));
	$("#multiselect_modal").modal('hide');
}

function choose_sjdw()
{
	$("#multiselect_confirm").off('click');
	$("#multiselect_confirm").click(function () {sjdw_multiselected();});
	var mst = document.getElementById("multiselect");
	while(mst.hasChildNodes()) 
	{
		mst.removeChild(mst.firstChild);
	}
	var mst_to= document.getElementById("multiselect_to");
	while(mst_to.hasChildNodes()) 
	{
		mst_to.removeChild(mst_to.firstChild);
	}
	var s = {};
	var selected = [];
	if(tmp_sjdw_id_str!="")
		selected = tmp_sjdw_id_str.split(";");
	for(var i=0;i<selected.length;++i)
	{
		s[selected[i]] = {};
	}
	var entry = "";
	for (var comp in allSjdw) {
		if(!(comp in s))
			entry += '<option>'+comp+'---'+allSjdw[comp].name+'</option>';
	}
	$("#multiselect").append(entry);
	entry = "";
	for (var comp in s) {
		if(comp in allSjdw)
		{
			entry += '<option>'+comp+'---'+allSjdw[comp].name+'</option>';
		}	
	}
	$("#multiselect_to").append(entry);
	$("#multiselect_label").text("设计单位");
	$("#multiselect_modal").modal('show');
}

function jldw_multiselected()
{
	var result = "";
	childs = document.getElementById("multiselect_to").childNodes;
	if (childs.length>0)
	{
		for(var i = 0;i<childs.length-1;++i)
		{
			result = result+childs[i].innerHTML.split("---")[0]+";";
		}
		result+=childs[childs.length-1].innerHTML.split("---")[0];
	}
	tmp_jldw_id_str = result;
	$("#jl_input").val(GetCompanyNameStrByID(result));
	$("#multiselect_modal").modal('hide');
}

function choose_jldw()
{
	$("#multiselect_confirm").off('click');
	$("#multiselect_confirm").click(function () {jldw_multiselected();});
	var mst = document.getElementById("multiselect");
	while(mst.hasChildNodes()) 
	{
		mst.removeChild(mst.firstChild);
	}
	var mst_to= document.getElementById("multiselect_to");
	while(mst_to.hasChildNodes()) 
	{
		mst_to.removeChild(mst_to.firstChild);
	}
	var s = {};
	var selected = [];
	if(tmp_jldw_id_str!="")
		selected = tmp_jldw_id_str.split(";");
	for(var i=0;i<selected.length;++i)
	{
		s[selected[i]] = {};
	}
	var entry = "";
	for (var comp in allJldw) {
		if(!(comp in s))
			entry += '<option>'+comp+'---'+allJldw[comp].name+'</option>';
	}
	$("#multiselect").append(entry);
	entry = "";
	for (var comp in s) {
		if(comp in allJldw)
		{
			entry += '<option>'+comp+'---'+allJldw[comp].name+'</option>';
		}
	}
	$("#multiselect_to").append(entry);
	$("#multiselect_label").text("监理单位");
	$("#multiselect_modal").modal('show');
}

function cldw_multiselected()
{
	var result = "";
	childs = document.getElementById("multiselect_to").childNodes;
	if (childs.length>0)
	{
		for(var i = 0;i<childs.length-1;++i)
		{
			result = result+childs[i].innerHTML.split("---")[0]+";";
		}
		result+=childs[childs.length-1].innerHTML.split("---")[0];
	}
	tmp_cldw_id_str = result;
	$("#cl_input").val(GetCompanyNameStrByID(result));
	$("#multiselect_modal").modal('hide');
}

function choose_cldw()
{
	$("#multiselect_confirm").off('click');
	$("#multiselect_confirm").click(function () {cldw_multiselected();});
	var mst = document.getElementById("multiselect");
	while(mst.hasChildNodes()) 
	{
		mst.removeChild(mst.firstChild);
	}
	var mst_to= document.getElementById("multiselect_to");
	while(mst_to.hasChildNodes()) 
	{
		mst_to.removeChild(mst_to.firstChild);
	}
	var s = {};
	var selected = [];
	if(tmp_cldw_id_str!="")
		selected = tmp_cldw_id_str.split(";");
	for(var i=0;i<selected.length;++i)
	{
		s[selected[i]] = {};
	}
	var entry = "";
	for (var comp in allCldw) {
		if(!(comp in s))
			entry += '<option>'+comp+'---'+allCldw[comp].name+'</option>';
	}
	$("#multiselect").append(entry);
	entry = "";
	for (var comp in s) {
		if(comp in allCldw)
		{
			entry += '<option>'+comp+'---'+allCldw[comp].name+'</option>';
		}
	}
	$("#multiselect_to").append(entry);
	$("#multiselect_label").text("测量单位");
	$("#multiselect_modal").modal('show');
}

function cwdw_multiselected()
{
	var result = "";
	childs = document.getElementById("multiselect_to").childNodes;
	if (childs.length>0)
	{
		for(var i = 0;i<childs.length-1;++i)
		{
			result = result+childs[i].innerHTML.split("---")[0]+";";
		}
		result+=childs[childs.length-1].innerHTML.split("---")[0];
	}
	tmp_cwdw_id_str = result;
	$("#cw_input").val(GetCompanyNameStrByID(result));
	$("#multiselect_modal").modal('hide');
}

function choose_cwdw()
{
	$("#multiselect_confirm").off('click');
	$("#multiselect_confirm").click(function () {cwdw_multiselected();});
	var mst = document.getElementById("multiselect");
	while(mst.hasChildNodes()) 
	{
		mst.removeChild(mst.firstChild);
	}
	var mst_to= document.getElementById("multiselect_to");
	while(mst_to.hasChildNodes()) 
	{
		mst_to.removeChild(mst_to.firstChild);
	}
	var s = {};
	var selected = [];
	if(tmp_cwdw_id_str!="")
		selected = tmp_cwdw_id_str.split(";");
	for(var i=0;i<selected.length;++i)
	{
		s[selected[i]] = {};
	}
	var entry = "";
	for (var comp in allCwdw) {
		if(!(comp in s))
			entry += '<option>'+comp+'---'+allCwdw[comp].name+'</option>';
	}
	$("#multiselect").append(entry);
	entry = "";
	for (var comp in s) {
		if(comp in allCwdw)
		{
			entry += '<option>'+comp+'---'+allCwdw[comp].name+'</option>';
		}
	}
	$("#multiselect_to").append(entry);
	$("#multiselect_label").text("财务监理单位");
	$("#multiselect_modal").modal('show');
}

function mmsi_multiselected()
{
	var result = "";
	childs = document.getElementById("multiselect_to").childNodes;
	if (childs.length>0)
	{
		for(var i = 0;i<childs.length-1;++i)
		{
			result = result+childs[i].innerHTML.split("---")[0]+";";
		}
		result+=childs[childs.length-1].innerHTML.split("---")[0];
	}
	$("#mmsi_input").val(result);
	$("#multiselect_modal").modal('hide');
	$("#param_shipnum").val(childs.length);
}

function choose_mmsi()
{
	$("#multiselect_confirm").off('click');
	$("#multiselect_confirm").click(function () {mmsi_multiselected();});
	var mst = document.getElementById("multiselect");
	while(mst.hasChildNodes()) 
	{
		mst.removeChild(mst.firstChild);
	}
	var mst_to= document.getElementById("multiselect_to");
	while(mst_to.hasChildNodes()) 
	{
		mst_to.removeChild(mst_to.firstChild);
	}
	var s = {};
	var selected = [];
	if($("#mmsi_input").val()!="")
		selected = $("#mmsi_input").val().split(";");
	for(var i=0;i<selected.length;++i)
	{
		s[selected[i]] = {};
	}
	var entry = "";
	for (var mmsi in allMmsi) {
		if(!(mmsi in s)){
			entry += '<option>'+mmsi+'---'+allMmsi[mmsi].shipname+'</option>';
		}
	}
	$("#multiselect").append(entry);
	entry = "";
	for (var mmsi in s) {
		if(mmsi in allMmsi){
			entry += '<option>'+mmsi+'---'+allMmsi[mmsi].shipname+'</option>';
		}
	}
	$("#multiselect_to").append(entry);
	$("#multiselect_label").text("选择船舶");
	$("#multiselect_modal").modal('show');
}

function gq_multiselected()
{
	var result = "";
	childs = document.getElementById("multiselect_to").childNodes;
	if (childs.length>0)
	{
		for(var i = 0;i<childs.length-1;++i)
		{
			result = result+childs[i].innerHTML.split("---")[0]+";";
		}
		result+=childs[childs.length-1].innerHTML.split("---")[0];
	}
	tmp_sjgq_id_str = result;
	$("#param_harborname").val(GetShujunNameStrByID(result));
	$("#multiselect_modal").modal('hide');
}

function choose_gq()
{
	$("#multiselect_confirm").off('click');
	$("#multiselect_confirm").click(function () {gq_multiselected();});
	var mst = document.getElementById("multiselect");
	while(mst.hasChildNodes()) 
	{
		mst.removeChild(mst.firstChild);
	}
	var mst_to= document.getElementById("multiselect_to");
	while(mst_to.hasChildNodes()) 
	{
		mst_to.removeChild(mst_to.firstChild);
	}
	var s = {};
	var selected = [];
	if(tmp_sjgq_id_str!="")
		selected = tmp_sjgq_id_str.split(";");
	for(var i=0;i<selected.length;++i)
	{
		s[selected[i]] = {};
	}
	var entry = "";
	for (var d in allDredging) {
		if(!(d in s))
			entry += '<option>'+d+'---'+allDredging[d].dredgingname+'</option>';
	}
	$("#multiselect").append(entry);
	entry = "";
	for (var d in s) {
		entry += '<option>'+d+'---'+allDredging[d].dredgingname+'</option>';
	}
	$("#multiselect_to").append(entry);
	$("#multiselect_label").text("选择港区");
	$("#multiselect_modal").modal('show');
}

function pnqy_multiselected()
{
	var result = "";
	childs = document.getElementById("multiselect_to").childNodes;
	if (childs.length>0)
	{
		for(var i = 0;i<childs.length-1;++i)
		{
			result = result+childs[i].innerHTML.split("---")[0]+";";
		}
		result+=childs[childs.length-1].innerHTML.split("---")[0];
	}
	tmp_pngq_id_str = result;
	$("#param_area").val(GetPaoniNameStrByID(tmp_pngq_id_str));
	$("#multiselect_modal").modal('hide');
}

function choose_pnqy()
{
	$("#multiselect_confirm").off('click');
	$("#multiselect_confirm").click(function () {pnqy_multiselected();});
	var mst = document.getElementById("multiselect");
	while(mst.hasChildNodes()) 
	{
		mst.removeChild(mst.firstChild);
	}
	var mst_to= document.getElementById("multiselect_to");
	while(mst_to.hasChildNodes()) 
	{
		mst_to.removeChild(mst_to.firstChild);
	}
	var s = {};
	var selected = [];
	if(tmp_pngq_id_str!="")
		selected = tmp_pngq_id_str.split(";");
	for(var i=0;i<selected.length;++i)
	{
		s[selected[i]] = {};
	}
	var entry = "";
	for (var d in allDumping) {
		if(!(d in s))
		entry += '<option>'+d+'---'+allDumping[d].areaname+'</option>';
	}
	$("#multiselect").append(entry);
	entry = "";
	for (var d in s) {
		entry += '<option>'+d+'---'+allDumping[d].areaname+'</option>';
	}
	$("#multiselect_to").append(entry);
	$("#multiselect_label").text("选择抛泥区域");
	$("#multiselect_modal").modal('show');
}

function pnhx_multiselected()
{
	var result = "";
	childs = document.getElementById("multiselect_to").childNodes;
	if (childs.length>0)
	{
		for(var i = 0;i<childs.length-1;++i)
		{
			result = result+childs[i].innerHTML.split("---")[0]+";";
		}
		result+=childs[childs.length-1].innerHTML.split("---")[0];
	}
	$("#param_route").val(result);
	$("#multiselect_modal").modal('hide');
}

function choose_route()
{
	$("#multiselect_confirm").off('click');
	$("#multiselect_confirm").click(function () {pnhx_multiselected();});
	var mst = document.getElementById("multiselect");
	while(mst.hasChildNodes()) 
	{
		mst.removeChild(mst.firstChild);
	}
	var mst_to= document.getElementById("multiselect_to");
	while(mst_to.hasChildNodes()) 
	{
		mst_to.removeChild(mst_to.firstChild);
	}
	var s = {};
	var selected = [];
	if($("#param_route").val()!="")
		selected = $("#param_route").val().split(";");
	for(var i=0;i<selected.length;++i)
	{
		s[selected[i]] = {};
	}
	var entry = "";
	for (var d in routeDict) {
		if(!(d in s))
		entry += '<option>'+d+'---'+allDredging[routeDict[d].harbor].dredgingname+'->'+allDumping[routeDict[d].dumping].areaname+'</option>';
	}
	$("#multiselect").append(entry);
	entry = "";
	for (var d in s) {
		entry += '<option>'+d+'---'+allDredging[routeDict[d].harbor].dredgingname+'->'+allDumping[routeDict[d].dumping].areaname+'</option>';
	}
	$("#multiselect_to").append(entry);
	$("#multiselect_label").text("选择抛泥航线");
	$("#multiselect_modal").modal('show');
}

function finish_filter()
{
	tmp_allParam = [];
	var is_checked = $("#finish_checkbox").is(":checked");
	if (is_checked)
	{
		return;
	}
	else{
		for (var i = 0;i<allParam.length;++i)
		{
			if (allParam[i].isworking == 1){
				tmp_allParam.push(allParam[i]);
			}
		}
	}
	allParam = tmp_allParam;
	
}

function show_finished()
{
	$.ajax({
        method: "GET",
        url: "/shanggang/project/list",
        success: function (data) {
        	fillParamData(data);
			set_port_menu();
			finish_filter();
			InitParamTable();
            },
		error: function () {       
            alert("获取数据失败！");
        }
	});
}