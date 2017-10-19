var allManage = [];
postData = {};

function InitLoadManage() 
{
	$("#toolbar").show();
	$("#btn_backup").hide();
	$("#btn_add").show();
	$("#btn_edit").show();
	$("#btn_delete").show();
	$("#btn_show").hide();
	
	$("#mapBody").hide();
	$("#data_clean").hide();
	$("#detail_information").hide();
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
            alert("fail");
        }  
    });
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
            alert("fail");
        }  
    });
}
function InitManageTable() {
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allManage,
    height:280,
	pagination: true,
    pageSize: 5,
	clickToSelect: true,
	singleSelect:true,

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
			if(confirm("确定要删除吗？")){
				manage_delete(arrselections[0].fleetid);
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
        	 alert("success");
			 $("#manage_update").modal('hide');
         	 RefreshLoadManage();
               },       
         error: function () {       
                alert("fail");       
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
        	 alert("success");
			 $("#manage_update").modal('hide');
         	 RefreshLoadManage();
               },       
         error: function () {       
                alert("fail");       
           }       
     });
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
        	 alert("success");
			 $("#manage_update").modal('hide');
         	 RefreshLoadManage();
               },       
         error: function () {       
                alert("fail");       
           }       
     });
}