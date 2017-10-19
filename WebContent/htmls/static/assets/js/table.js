data = [
		{"pk":0,"id":"1","name":"meetweb","price":"100"},
		{"pk":1,"id":"2","name":"learn bootstrap table","price":"200"},
		{"pk":2,"id":"3","name":"meetweb","price":"100"},
		{"pk":3,"id":"4","name":"learn bootstrap table","price":"200"},
		{"pk":4,"id":"5","name":"meetweb","price":"100"},
		{"pk":5,"id":"6","name":"learn bootstrap table","price":"200"},
		{"pk":6,"id":"7","name":"meetweb","price":"100"},
		{"pk":7,"id":"8","name":"learn bootstrap table","price":"200"},
		{"pk":8,"id":"9","name":"meetweb","price":"100"}
		]
data1 = []
maxPK = 8;
selectedPK = -1;
$(document).ready(function() {
	$('#table').bootstrapTable({
    data: data,
	pagination: true,
    pageSize: 5,
    search: true,
	toolbar:"#toolbar",
	clickToSelect: true,
	singleSelect:true,

    columns: [
	{checkbox: true},
	{
        field: 'pk',
        title: 'primary key'
    }, 
	{
        field: 'id',
        title: '船舶 ID'
    }, 
	{
        field: 'name',
        title: 'Item Name'
    }, 
	{
        field: 'price',
        title: 'Item Price'
    } 
	]
	
});
$('#table').bootstrapTable('hideColumn', 'pk');
$("#btn_add").click(function () {
            $("#myModalLabel").text("新增");
			$("#edit-id").val("");
            $("#edit-name").val("");
            $("#edit-price").val("");
			$('#update').modal('show');
        });
		 
$("#btn_edit").click(function () {
            var arrselections = $("#table").bootstrapTable('getSelections');
			console.log(arrselections);
            if (arrselections.length > 1) {
                return;
            }
            if (arrselections.length <= 0) {
                return;
            }
            $("#myModalLabel").text("编辑");
            $("#edit-id").val(arrselections[0].id);
            $("#edit-name").val(arrselections[0].name);
            $("#edit-price").val(arrselections[0].price);
			selectedPK = arrselections[0].pk;
			$('#update').modal('show');
        });
	$("#btn_delete").click(function () {	 
		var arrselections = $("#table").bootstrapTable('getSelections');
        if (arrselections.length <= 0) {
             return;
            }
		var index = parseInt(arrselections[0].pk);
        data[index] = {};
		$('#table').bootstrapTable('load', data);
        });
});

function refresh()
{
	$("#myModalLabel").text("新增");
            $("#myModal").find(".form-control").val("");
            $('#myModal').modal('show')
	data1 = [{"id":"1","name":"meetweb","price":"100"}]
	$('#table').bootstrapTable('load', data1);  
}

function edit()
{
	var pk = selectedPK;
	var id = $('#edit-id').val();
    var name = $('#edit-name').val();
    var price = $('#edit-price').val();
	data[pk] = {"pk":pk,"id":id,"name":name,"price":price};
	$('#table').bootstrapTable('load',data);
	$('#update').modal('hide');
}

function add()
{
	var pk = maxPK + 1;
	var id = $('#edit-id').val();
    var name = $('#edit-name').val();
    var price = $('#edit-price').val();
	data[pk] = {"pk":pk,"id":id,"name":name,"price":price};
	$('#table').bootstrapTable('load',data);
	maxPK = maxPK + 1;
	$('#update').modal('hide');
}

