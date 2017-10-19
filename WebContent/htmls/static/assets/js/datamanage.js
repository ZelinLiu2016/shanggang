var allFile = [];
postData = {};

function DataManageInit()
{
	$("#toolbar").show();
	$("#btn_backup").show();
	$("#btn_add").hide();
	$("#btn_edit").hide();
	$("#btn_delete").hide();
	$("#btn_show").hide();
	
	$("#mapBody").hide();
	$("#data_clean").show();
	$("#monitor_search_modal").hide();
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