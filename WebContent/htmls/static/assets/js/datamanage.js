var allFile = [];
postData = {};

function DataManageInit()
{
	CleanAll();
	$("#L3").attr("class", "LeftTextSelect");
	$("#L3L1").attr("class", "LeftTextSelect");
	
	$("#toolbar").show();
	$("#import_project").hide();
	$("#select_mmsi").hide();
	$("#toolbar_search").hide();
	$("#btn_backup").show();
	$("#btn_add").hide();
	$("#btn_edit").hide();
	$("#btn_delete").hide();
	$("#btn_show").hide();
	$("#finish_checkbox").hide();
	$("#finish_checkbox_label").hide();
	
	$("#mapBody").hide();
	$("#data_clean").show();
	$("#monitor_search_modal").hide();
	$("#stat_start_end_time").hide();
	$("#detail_information").hide();
	$("#detailtable").hide();
	$("#info_div").hide();
	$("#project_progress").hide();
	$('#datamanage_clean_input').val(15);
	$.ajax({
        method: "GET",
        url: "/shanggang/restore/listbackupfile",
        success: function (data) {
        	fillFileData(data);
        	console.log(allFile);
			InitDataManageTable();
            },
		error: function () {       
            alert("fail");
        }  
    });
}

function fillFileData(data)
{
	allData = [];
	for(var i = 0;i<data.length;++i)
		{
		allFile.push({"filename":data[i]});
		}
}

function InitDataManageTable()
{
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allFile,
    height:380,
	pagination: true,
    pageSize: 5,
	toolbar:"#toolbar",
	clickToSelect: true,
	singleSelect:true,

    columns: [
	{checkbox: true},
	{
        field: 'filename',
        title: '备份文件'
    }
	]});
    $('#datatable').show();
}

function CleanData()
{
	cleanday = $('#datamanage_clean_input').val();
	postData = {"days":cleanday};
	$.ajax({
         type: "POST",
         url: "/shanggang/shipinfo/settimeperiod",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("设置成功");
               },       
         error: function () {       
                alert("设置失败");       
           }       
     });
}

function BackupData()
{
	var arrselections = $("#table").bootstrapTable('getSelections');
			console.log(arrselections);
            if (arrselections.length > 1) {
                return;
            }
            if (arrselections.length <= 0) {
                return;
            }
	postData = {"filename":arrselections[0].filename};
	alert("success");
}