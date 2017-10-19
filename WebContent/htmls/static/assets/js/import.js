var allBoat = [];
postData = {};

function InitLoadImport()
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
        url: "/shanggang/ship/list",
        success: function (data) {
        	console.log(data);
			fillBoatData(data);
        	console.log(allBoat);
			InitImportTable();
            },
		error: function () {       
            alert("fail");
        }  
    });
}

function RefreshLoadImport()
{
	$.ajax({
        method: "GET",
        url: "/shanggang/ship/list",
        success: function (data) {
        	fillBoatData(data);
        	console.log(allBoat);
			RefreshImportTable();
            },
		error: function () {       
            alert("fail");
        }  
    });
}

function InitImportTable() {
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allBoat,
    //height:380,
	toolbar:'#toolbar',
	pagination: true,
	search: true,
    pageSize: 5,
	clickToSelect: true,
	singleSelect:true,

    columns: [
	{checkbox: true},
	{
        field: 'mmsi',
        title: 'MMSl'
    }, 
	{
        field: 'fleetid',
        title: '施工单位'
    },
	{
        field: 'shipname',
        title: '船名'
    },
	{
        field: 'imo',
        title: 'IMO 编号'
    },
	{
        field: 'length',
        title: '船长'
    },
	{
        field: 'width',
        title: '船宽'
    },
	{
        field: 'shiptype',
        title: '船舶类型'
    },
	{
        field: 'capacity',
        title: '满载量'
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
			document.getElementById("import_update_label").className = "modal-title glyphicon glyphicon-plus";
            var select_work = document.getElementById("import_fleetid");
			while(select_work.hasChildNodes()) 
			{
				select_work.removeChild(select_work.firstChild);
			}
			var entry = "";
			for (var c in allCompany) {
				console.log(allCompany);
				entry += '<option value="'+c+'">'+ c+'---'+allCompany[c].name +'</option>';
			}
			$("#import_fleetid").append(entry);
			$("#import_update_label").text("新增");
			$("#import_mmsl").val("");
			$("#import_fleetid").val("");
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
			$("#import_fleetid").val(arrselections[0].fleetid);
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
	for(var i = 0;i<data.length;++i)
		{
		allBoat.push({"capacity":data[i].capacity,
			"fleetid":data[i].fleet_id,"imo":data[i].imo,"length":data[i].length,
			"width":data[i].width,"mmsi":data[i].mmsi,"shipname":data[i].shipname,
			"shiptype":data[i].shiptype,"contact":data[i].contact,"cellphone":data[i].cellphone});
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
	postData["contact"] = $("#import_contact").val();
	postData["cellphone"] = $("#import_cellphone").val();
	postData["route_id"] = "1";
	$.ajax({
         type: "POST",
         url: "/shanggang/ship/add",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("success");
			 $("#import_update").modal('hide');
         	 RefreshLoadImport();
               },       
         error: function () {       
                alert("fail");       
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
	postData["route_id"] = "1";
	$.ajax({
         type: "POST",
         url: "/shanggang/ship/update",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("success");
			 $("#import_update").modal('hide');
         	 RefreshLoadImport();
               },       
         error: function () {       
                alert("fail");       
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
        	 alert("success");
			 $("#import_update").modal('hide');
         	 RefreshLoadImport();
               },       
         error: function () {       
                alert("fail");       
           }       
     });
}
