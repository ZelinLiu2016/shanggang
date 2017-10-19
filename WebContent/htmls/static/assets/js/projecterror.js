var allProjectError = [{"projectid":10,"projectname":"test_pro","start":"2017-03-15","end":"2017-09-18","estimate":"40%","real":"45%"}];
postData = {};

function ProjectErrorInit()
{
	$("#toolbar").hide();
	
	$("#mapBody").hide();
	$("#data_clean").hide();
	$("#detail_information").hide();
	$("#monitor_search_modal").show();
	$("#project_progress").hide();
	$("#monitor_search").hide();
	$("#monitor_button").hide();
	$("#history_time").hide();
	$("#monitor_show").hide();
	$("#error_mark").show();
	$("#error_handle").show();
	
	InitProjectErrorTable();
}

function InitProjectErrorTable() {
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allProjectError,
    height:280,
	pagination: true,
    pageSize: 5,
	clickToSelect: true,
	singleSelect:true,

    columns: [
	{checkbox: true},
	{
        field: 'projectid',
        title: '项目编号'
    }, 
	{
        field: 'projectname',
        title: '项目名称'
    }, 
	{
        field: 'start',
        title: '开始日期'
    }, 
	{
        field: 'end',
        title: '结束日期'
    },
	{
        field: 'estimate',
        title: '预计进度'
    },
	{
        field: 'real',
        title: '实际进度'
    }
	]});
    $('#datatable').show();
}