var allManage = [];
postData = {};

function InitLoadManage() 
{
	CleanAll();
	$("#L1").attr("class", "LeftTextSelect");
	$("#L1L3").attr("class", "LeftTextSelect");
	
	$("#toolbar").show();
	$("#btn_backup").hide();
	$("#btn_add").show();
	$("#btn_edit").show();
	$("#btn_delete").show();
	$("#btn_show").hide();
	$("#toolbar_search").hide();
	$("#btn_search").hide();
	
	$("#mapBody").hide();
	$("#data_clean").hide();
	$("#detail_information").hide();
	$("#detailtable").hide();
	$("#info_div").show();
	$("#monitor_search_modal").hide();
	$("#project_progress").hide();
	$.ajax({
        method: "GET",
        url: "/shanggang/company/listall",
        success: function (data) {
			fillManageData(data);
			InitManageTable();
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
	entry = '<tr><th width="40%">工程名称</th><th width="30%">开始日期</th><th width="30%">结束日期</th></tr>';
	$("#info_head").append(entry);
	var tbody = document.getElementById("info_body");
	while(tbody.hasChildNodes()) //当div下还存在子节点时 循环继续  
	{
		tbody.removeChild(tbody.firstChild);
	}
	entry = '<tr><td></td><td></td><td></td></tr>'
	$("#info_body").append(entry);
}

function RefreshLoadManage()
{
	$.ajax({
        method: "GET",
        url: "/shanggang/company/listall",
        success: function (data) {
        	fillManageData(data);
			RefreshManageTable();
            },
		error: function () {       
            alert("获取数据失败！");
        }  
    });
}

function hasvalue(arr, obj){
	var i = arr.length;  
    while (i--) {  
        if (arr[i] === obj) {  
            return true;  
        }  
    }  
    return false;  
}

function InitManageTable() {
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allManage,
    //height:280,
	pagination: true,
    pageSize: 5,
	clickToSelect: true,
	singleSelect:true,
	
	onClickRow: function (row, $element) {
		var tbody = document.getElementById("info_body");
		while(tbody.hasChildNodes()) //当div下还存在子节点时 循环继续  
		{
			tbody.removeChild(tbody.firstChild);
		}
		entry = "";
		var companyid = row.fleetid;
		for(d in detailed)
		{
			if(hasvalue(detailed[d].sggs.split(';'), companyid)||hasvalue(detailed[d].sjgs.split(';'), companyid)||hasvalue(detailed[d].jlgs.split(';'), companyid))
			{
				entry += '<tr><td>'+detailed[d].projectname+'</td><td>'+detailed[d].startdate+'</td><td>'+detailed[d].enddate+'</td></tr>';
			}
		}
		for(var i = tbody.rows.length;i<4;++i)
		{
			entry+=('<tr><td></td><td></td><td></td></tr>');
		}
		$("#info_body").append(entry);
    },
	
    columns: [
	{checkbox: true},
	{
        field: 'fleetid',
        title: '公司编号'
    }, 
	{
        field: 'name',
        title: '公司名称'
    }, 
	{
        field: 'companytype',
        title: '公司类型'
    }, 
	{
        field: 'address',
        title: '公司地址'
    }, 
	{
        field: 'contact',
        title: '联系人'
    },
	{
        field: 'cellphone',
        title: '联系方式'
    }
	]});
    $('#datatable').show();
	$("#btn_add").off('click');
	$("#btn_add").click(function () {
			document.getElementById("manage_update_label").className = "modal-title glyphicon glyphicon-plus";
            $("#manage_update_label").text("新增");
			$("#manage_fleetid").val("");
			$("#manage_name").val("");
			$("#manage_address").val("");
			$("#manage_contact").val("");
			$("#manage_cellphone").val("");
			$("#manage_type").val("");
			$('#manage_update').modal('show');
			$('#manage_add_button').show();
			$('#manage_edit_button').hide();
			$('#manage_delete_button').hide();
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
			document.getElementById("manage_update_label").className = "modal-title glyphicon glyphicon-pencil";
            $("#manage_update_label").text("编辑");
			$("#manage_fleetid").val(arrselections[0].fleetid);
			$("#manage_name").val(arrselections[0].name);
			$("#manage_address").val(arrselections[0].address);
			$("#manage_contact").val(arrselections[0].contact);
			$("#manage_cellphone").val(arrselections[0].cellphone);
			$("#manage_type").val(arrselections[0].companytype);
			$('#manage_update').modal('show');
			$('#manage_add_button').hide();
			$('#manage_edit_button').show();
			$('#manage_delete_button').hide();
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
			if(isCompanyInUse(arrselections[0].fleetid))
			{
				confirm("该公司属于某在建项目，不能删除！")
			}
			else{
				if(confirm("确定要删除吗？")){
					manage_delete(arrselections[0].fleetid);
				}
			}
			
            /*$("#manage_update_label").text("删除");
			$("#manage_fleetid").val(arrselections[0].fleetid);
			$("#manage_name").val(arrselections[0].name);
			$("#manage_address").val(arrselections[0].address);
			$("#manage_contact").val(arrselections[0].contact);
			$("#manage_cellphone").val(arrselections[0].cellphone);
			$('#manage_update').modal('show');
			$('#manage_add_button').hide();
			$('#manage_edit_button').hide();
			$('#manage_delete_button').show();*/
        });
}

function RefreshManageTable() {
	$('#datatable').hide();
	$('#table').bootstrapTable('load', allManage); 
	$('#datatable').show();
}

function fillManageData(data)
{
	allManage = [];
	for(var i = 0;i<data.length;++i)
	{
		allManage.push({"fleetid":data[i].company_id,"name":data[i].company_name,
		"contact":data[i].contact,"address":data[i].address,
		"cellphone":data[i].cellphone,"companytype":data[i].company_type});
	}
	fillCompanyData(data);
}

function manage_add()
{
	postData["company_id"] = $("#manage_fleetid").val();
	postData["company_name"] = $("#manage_name").val();
	postData["address"] = $("#manage_address").val();
	postData["contact"] = $("#manage_contact").val();
	postData["cellphone"] = $("#manage_cellphone").val();
	postData["company_type"] = $("#manage_type").val();
	$.ajax({
         type: "POST",
         url: "/shanggang/company/add",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("新增数据成功！");
			 $("#manage_update").modal('hide');
         	 RefreshLoadManage();
               },       
         error: function () {       
                alert("新增数据失败！");       
           }       
     });
}

function manage_edit()
{
	postData["company_id"] = $("#manage_fleetid").val();
	postData["company_name"] = $("#manage_name").val();
	postData["address"] = $("#manage_address").val();
	postData["contact"] = $("#manage_contact").val();
	postData["cellphone"] = $("#manage_cellphone").val();
	postData["company_type"] = $("#manage_type").val();
	$.ajax({
         type: "POST",
         url: "/shanggang/company/update",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("修改数据成功！");
			 $("#manage_update").modal('hide');
         	 RefreshLoadManage();
               },       
         error: function () {       
                alert("修改数据失败！");       
           }       
     });
}

function isCompanyInUse(id)
{
	for(var i = 0;i<allParam.length;++i)
	{
		if(allParam[i].inprogress=="是" && allParam[i].projectid in detailed)
		{
			var shigong = detailed[allParam[i].projectid].sggs;
			if(shigong!="")
			{
				var tmp = shigong.split(";");
				for(var j = 0;j<tmp.length;++j)
				{
					if(tmp[j] == id)
					{return true;}
				}
			}
			var jianli =  detailed[allParam[i].projectid].jlgs;
			if(jianli!="")
			{
				var tmp = jianli.split(";");
				for(var j = 0;j<tmp.length;++j)
				{
					if(tmp[j] == id)
					{return true;}
				}
			}
			var sheji =  detailed[allParam[i].projectid].sjgs;
			if(sheji!="")
			{
				var tmp = sheji.split(";");
				for(var j = 0;j<tmp.length;++j)
				{
					if(tmp[j] == id)
					{return true;}
				}
			}
		}
	}
	return false;
}

function manage_delete(id)
{
	//postData["fleet_id"] = $("#manage_fleetid").val();
	postData["company_id"] = id;
	$.ajax({
         type: "POST",
         url: "/shanggang/company/delete",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("删除数据成功！");
			 $("#manage_update").modal('hide');
         	 RefreshLoadManage();
               },       
         error: function () {       
                alert("删除数据失败！");       
           }       
     });
}