var allParam = [];
var detailed = {};
var allSgdw = {};
var allSjdw = {};
var allJldw = {};
var allCompany = {};
var allMmsi = {};
var allDredging = {};
var allDumping = {};
postData = {};

function InitLoadParam()
{
	$("#toolbar").show();
	$("#btn_backup").hide();
	$("#btn_add").show();
	$("#btn_edit").show();
	$("#btn_delete").show();
	$("#btn_show").hide();
	$("#detail_information").show();
	
	$("#mapBody").hide();
	$("#data_clean").hide();
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
	
	if (dredging_area == "")
	{
		$.ajax({
        method: "GET",
        url: "/shanggang/project/list",
        success: function (data) {
        	fillParamData(data);
			InitParamTable();
            },
		error: function () {       
            alert("fail");
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
			InitParamTable();
            },
		error: function () {       
            alert("fail");
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
            alert("fail");
        }  
    });
	$.ajax({
        method: "GET",
        url: "/shanggang/ship/list",
        success: function (data) {
        	fillMmsiData(data);
            },
		error: function () {       
            alert("fail");
        }  
    });
	$.ajax({
        method: "GET",
        url: "/shanggang/dredging_area/listall",
        success: function (data) {
        	fillDredgingData(data);
            },
		error: function () {       
            alert("fail");
        }  
    });
	$.ajax({
        method: "GET",
        url: "/shanggang/dumping_area/list",
        success: function (data) {
        	fillDumpingData(data);
            },
		error: function () {       
            alert("fail");
        }  
    });
	$.ajax({
		type: "GET",
		url: "/shanggang/route/listall",
		success: function (data) {    
				fillAllRoute(data);
			  },
		error: function () {       
			   alert("fail");       
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
			RefreshParamTable();
            },
		error: function () {       
            alert("fail");
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
			RefreshParamTable();
            },
		error: function () {       
            alert("fail");
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
            alert("fail");
        }  
    });
	$.ajax({
        method: "GET",
        url: "/shanggang/ship/list",
        success: function (data) {
        	fillMmsiData(data);
            },
		error: function () {       
            alert("fail");
        }  
    });
	$.ajax({
        method: "GET",
        url: "/shanggang/dredging_area/listall",
        success: function (data) {
        	fillDredgingData(data);
            },
		error: function () {       
            alert("fail");
        }  
    });
	$.ajax({
        method: "GET",
        url: "/shanggang/dumping_area/list",
        success: function (data) {
        	fillDumpingData(data);
            },
		error: function () {       
            alert("fail");
        }  
    });
}

function InitParamTable() {
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allParam,
    height:280,
	pagination: true,
    pageSize: 5,
	clickToSelect: true,
	singleSelect:true,
	
	onClickRow: function (row, $element) {
		var tbody = document.getElementById("company-tbody");
		var selected = detailed[row.projectid];
		while(tbody.hasChildNodes()) //当div下还存在子节点时 循环继续  
		{
			tbody.removeChild(tbody.firstChild);
		}
		var entry = "";
		if(selected.sggs != null)
		{
			sggs = selected.sggs.split(';');
			for (var i = 0; i < sggs.length; i++) {
				entry += '<tr><td>'+"施工公司"+'</td><td>'+allSgdw[sggs[i]].name+'</td><td>'+allSgdw[sggs[i]].contact+'</td><td>'+allSgdw[sggs[i]].cellphone+'</td></tr>';
			}
		}
		if(selected.sjgs != null)
		{
			sjgs = selected.sjgs.split(';');
			for (var i = 0; i < sjgs.length; i++) {
				entry += '<tr><td>'+"设计公司"+'</td><td>'+allSjdw[sjgs[i]].name+'</td><td>'+allSjdw[sjgs[i]].contact+'</td><td>'+allSjdw[sjgs[i]].cellphone+'</td></tr>';
			}
		}
		if(selected.jlgs != null)
		{
			jlgs = selected.jlgs.split(';');
			for (var i = 0; i < jlgs.length; i++) {
				entry += '<tr><td>'+"监理公司"+'</td><td>'+allJldw[jlgs[i]].name+'</td><td>'+allJldw[jlgs[i]].contact+'</td><td>'+allJldw[jlgs[i]].cellphone+'</td></tr>';
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
		if(selected.mmsi != null)
		{
			mmsilist = selected.mmsi.split(';');
			for (var i = 0; i < mmsilist.length; i++) {
				entry += '<tr><td>'+mmsilist[i]+'</td><td>'+allMmsi[mmsilist[i]].shipname+'</td><td>'+allMmsi[mmsilist[i]].contact+'</td><td>'+allMmsi[mmsilist[i]].cellphone+'</td></tr>';
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
        field: 'harborname',
        title: '施工区域'
    },
	{
        field: 'area',
        title: '抛泥区域'
    },
	{
        field: 'routeid',
        title: '抛泥航线'
    },
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
    } 
	]});
	
    $('#datatable').show();
	$("#btn_add").off('click');
	$("#btn_add").click(function () {
			document.getElementById("param_update_label").className = "modal-title glyphicon glyphicon-plus";
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
			$("#mmsi_input").val("");
			$("#param_mudratio").val("");
			$("#param_route").val("");
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
			document.getElementById("param_update_label").className = "modal-title glyphicon glyphicon-pencil";
            $("#param_update_label").text("编辑");
			$("#param_projectid").val(project_id);
			$("#param_projectname").val(arrselections[0].projectname);
			$("#param_harborname").val(arrselections[0].harborname);
			$("#param_area").val(arrselections[0].area);
			$("#param_capacity").val(arrselections[0].capacity);
			$("#param_shipnum").val(arrselections[0].shipnum);
			$("#param_startdate").val(arrselections[0].startdate);
			$("#param_enddate").val(arrselections[0].enddate);
			$("#param_mudratio").val(arrselections[0].mudratio);
			$("#param_route").val(arrselections[0].routeid);
			$("#sg_input").val(detailed[project_id].sggs);
			$("#sj_input").val(detailed[project_id].sjgs);
			$("#jl_input").val(detailed[project_id].jlgs);
			$("#mmsi_input").val(detailed[project_id].mmsi);
			
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
}

function fillParamData(data)
{
	allParam = [];
	detailed = {};
	for(var i = 0;i<data.length;++i)
		{
		allParam.push({"projectid":data[i].projectId,"projectname":data[i].projectName,
			"area":data[i].dumpingArea,"capacity":data[i].squareVolume,"startdate":data[i].beginDate,
			"enddate":data[i].endDate,"shipnum":data[i].boatNum,"harborname":data[i].harborName,
			"mudratio":data[i].mud_ratio, "routeid":data[i].route_id});
		detailed[data[i].projectId] = {"sggs":data[i].construction_company,"sjgs":data[i].design_company,
		"jlgs":data[i].supervision_company,"mmsi":data[i].mmsilist};
		}
}

function fillCompanyData(data)
{
	allSgdw = {};
	allSjdw = {};
	allJldw = {};
	allCompany = {};
	for(var i = 0;i<data.length;++i)
	{
		allCompany[data[i].company_id] = {"name":data[i].company_name,"contact":data[i].contact,"cellphone":data[i].cellphone};
		switch (data[i].company_type)
		{
			case "建设单位":
				allSgdw[data[i].company_id] = {"name":data[i].company_name,"contact":data[i].contact,"cellphone":data[i].cellphone};
				break;
			case "设计单位":
				allSjdw[data[i].company_id] = {"name":data[i].company_name,"contact":data[i].contact,"cellphone":data[i].cellphone};
				break;
			case "监理单位":
				allJldw[data[i].company_id] = {"name":data[i].company_name,"contact":data[i].contact,"cellphone":data[i].cellphone};
				break;
			default:
				alert("company_type not compatible")
		}
	}
}

function fillMmsiData(data)
{
	allMmsi = {};
	for(var i = 0;i<data.length;++i)
	{
		allMmsi[data[i].mmsi] = {"shipname":data[i].shipname,"contact":data[i].contact,"cellphone":data[i].cellphone,"fleetid": data[i].fleet_id};
	}
}

function fillDumpingData(data)
{
	allDumping = {};
	for(var i = 0;i<data.length;++i)
	{
		allDumping[data[i].area_id] = {"areaname":data[i].areaname};
	}
}

function fillDredgingData(data)
{
	allDredging = {};
	for(var i = 0;i<data.length;++i)
	{
		allDredging[data[i].dredging_id] = {"dredgingname":data[i].dredging_name};
	}
}


function param_add()
{
	postData["project_id"] = $("#param_projectid").val();
	postData["projectname"] = $("#param_projectname").val();
	postData["harborname"] = $("#param_harborname").val();
	postData["dumpingarea"] = $("#param_area").val();
	postData["squarevolume"] = $("#param_capacity").val();
	postData["boatnum"] = $("#param_shipnum").val();
	postData["begindate"] =	$("#param_startdate").val();
	postData["enddate"] = $("#param_enddate").val();
	postData["harborname"] = $("#param_harborname").val();
	postData["mud_ratio"] = $("#param_mudratio").val();
	postData["route_id"] = $("#param_route").val();
	postData["mmsilist"] = $("#mmsi_input").val();
	postData["construction_company"] = $("#sg_input").val();
	postData["design_company"] = $("#sj_input").val();
	postData["supervision_company"] = $("#jl_input").val();
	$.ajax({
         type: "POST",
         url: "/shanggang/project/add",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("success");
			 $("#param_update").modal('hide');
         	 RefreshLoadParam();
               },       
         error: function () {       
                alert("fail");       
           }       
     });
}

function param_edit()
{
	postData["project_id"] = $("#param_projectid").val();
	postData["projectname"] = $("#param_projectname").val();
	postData["harborname"] = $("#param_harborname").val();
	postData["dumpingarea"] = $("#param_area").val();
	postData["squarevolume"] = $("#param_capacity").val();
	postData["boatnum"] = $("#param_shipnum").val();
	postData["begindate"] =	$("#param_startdate").val();
	postData["enddate"] = $("#param_enddate").val();
	postData["harborname"] = $("#param_harborname").val();
	postData["mud_ratio"] = $("#param_mudratio").val();
	postData["route_id"] = $("#param_route").val();
	postData["mmsilist"] = $("#mmsi_input").val();
	postData["construction_company"] = $("#sg_input").val();
	postData["design_company"] = $("#sj_input").val();
	postData["supervision_company"] = $("#jl_input").val();
	$.ajax({
         type: "POST",
         url: "/shanggang/project/update",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("success");
			 $("#param_update").modal('hide');
         	 RefreshLoadParam();
               },       
         error: function () {       
                alert("fail");       
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
        	 alert("success");
			 $("#param_update").modal('hide');
         	 RefreshLoadParam();
               },       
         error: function () {       
                alert("fail");       
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
	$("#sg_input").val(result);
	$("#multiselect_modal").modal('hide');
	$("#mmsi_input").val("");
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
	if($("#sg_input").val()!="")
		selected = $("#sg_input").val().split(";");
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
	$("#sj_input").val(result);
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
	if($("#sj_input").val()!="")
		selected = $("#sj_input").val().split(";");
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
		entry += '<option>'+comp+'---'+allSjdw[comp].name+'</option>';
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
	$("#jl_input").val(result);
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
	if($("#jl_input").val()!="")
		selected = $("#jl_input").val().split(";");
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
		entry += '<option>'+comp+'---'+allJldw[comp].name+'</option>';
	}
	$("#multiselect_to").append(entry);
	$("#multiselect_label").text("监理单位");
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
		if(!(mmsi in s))
			entry += '<option>'+mmsi+'---'+allMmsi[mmsi].shipname+'</option>';
	}
	$("#multiselect").append(entry);
	entry = "";
	for (var mmsi in s) {
		entry += '<option>'+mmsi+'---'+allMmsi[mmsi].shipname+'</option>';
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
	$("#param_harborname").val(result);
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
	if($("#param_harborname").val()!="")
		selected = $("#param_harborname").val().split(";");
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
	$("#param_area").val(result);
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
	if($("#param_area").val()!="")
		selected = $("#param_area").val().split(";");
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