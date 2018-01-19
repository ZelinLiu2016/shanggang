var allRoute = [];
var allBoats = {};
var postData = {};
var routeCoorDict = {};
var allDredging = {};
var allDumping = {};
var routeDict = {};
var coorNum = 4;
function SetRouteTable() {
	CleanAll();
	$("#L1").attr("class", "LeftTextSelect");
	$("#L1L6").attr("class", "LeftTextSelect");
	
	$("#toolbar").show();
	$("#btn_backup").hide();
	$("#btn_add").show();
	$("#btn_edit").show();
	$("#btn_delete").show();
	$("#btn_show").show();
	$("#toolbar_search").hide();
	$("#btn_search").hide();
	
	$("#mapBody").show();
	$("#data_clean").hide();
	$("#detail_information").hide();
	$("#detailtable").hide();
	$("#info_div").hide();
	$("#monitor_search_modal").hide();
	$("#project_progress").hide();
	
	delete_object();
	API_DelAllShips();
	ClearPlayShipInfo();
    $.ajax({
            method: "GET",
            url: "/shanggang/route/listall",
            success: function (data) {    
            	    fillAllRoute(data);
            	    InitRouteTable();
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

function RefreshLoadRoute()
{
    $.ajax({
            type: "GET",
            url: "/shanggang/route/listall",
            success: function (data) {    
            	    fillAllRoute(data);
            	    RefreshRouteTable();
                  },       
            error: function () {       
                   alert("获取数据失败！");       
              }       
        });
}
function InitRouteTable()
{
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allRoute,
    //height:380,
	pagination: true,
    pageSize: 5,
	clickToSelect: true,
	singleSelect:true,

    columns: [
	{checkbox: true},
	{
        field: 'routeid',
        title: '航线编号'
    }, 
	{
        field: 'harbor',
        title: '施工区域'
    },
	{
        field: 'dumping',
        title: '抛泥区域'
    },
	{
        field: 'speed',
        title: '最高时速'
    }
	]});
	$('#datatable').show();
	$("#btn_add").off('click');
	$("#btn_add").click(function () {
		var select_work = document.getElementById("route_work");
		while(select_work.hasChildNodes()) 
		{
			select_work.removeChild(select_work.firstChild);
		}
		var entry = "";
		for (var d in allDredging) {
			entry += '<option value="'+d+'">'+ d+'---'+allDredging[d].dredgingname +'</option>';
		}
		$("#route_work").append(entry);
		//$("#route_work").val(arrselections[0].harbor);
		var select_dump = document.getElementById("route_paoni");
		while(select_dump.hasChildNodes()) 
		{
			select_dump.removeChild(select_dump.firstChild);
		}
		var entry = "";
		for (var d in allDumping) {
			entry += '<option value="'+d+'">'+ d+'---'+allDumping[d].areaname +'</option>';
		}
		$("#route_paoni").append(entry);
		//$("#route_paoni").val(arrselections[0].dumping);
		var body = document.getElementById("route_update_body");
		while(body.hasChildNodes()) //当div下还存在子节点时 循环继续  
		{  
			body.removeChild(body.firstChild); 
		}
		$("#route_id").val("");
		$("#route_work").val("");
		$("#route_paoni").val("");
		$("#route_speed").val("");
		coorNum = 1;
		var entry = "";
		entry += '<div id="hd'+coorNum+'" class="row" style="margin:0;height:13%;">';
		entry += '<div class="col-sm-2 nopadding">坐标点'+coorNum+'经度</div>';
		entry += '<div class="col-sm-4 nopadding"><input type="text" name="hangdaox" id="hangdaox'+coorNum+'"style="width:145px;height:25px" /></div>';
		entry += '<div class="col-sm-2 nopadding">坐标点'+coorNum+'纬度</div>';
		entry += '<div class="col-sm-4 nopadding"><input type="text" name="hangdaoy" id="hangdaoy'+coorNum+'"style="width:145px;height:25px" /></div></div>';
		$("#route_update_body").append(entry);
		document.getElementById("route_update_label").className = "modal-title glyphicon glyphicon-plus";
        $("#route_update_label").text("新增");
		$('#route_update').modal('show');
		$("#route_add_point_button").show();
		$("#route_delete_point_button").show();
		$('#route_add_button').show();
		$('#route_edit_button').hide();
		$('#route_delete_button').hide();
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
			route_id = arrselections[0].routeid;
			harbor = routeDict[route_id].harbor;
			dumping_area = routeDict[route_id].dumping;
			speed = routeDict[route_id].speed;
			$("#route_id").val(route_id);
			$("#route_speed").val(speed);
			
			var select_work = document.getElementById("route_work");
			while(select_work.hasChildNodes()) 
			{
				select_work.removeChild(select_work.firstChild);
			}
			var entry = "";
			for (var d in allDredging) {
				entry += '<option value="'+d+'">'+ d+'---'+allDredging[d].dredgingname +'</option>';
			}
			$("#route_work").append(entry);
			$("#route_work").val(harbor);
			var select_dump = document.getElementById("route_paoni");
			while(select_dump.hasChildNodes()) 
			{
				select_dump.removeChild(select_dump.firstChild);
			}
			var entry = "";
			for (var d in allDumping) {
				entry += '<option value="'+d+'">'+ d+'---'+allDumping[d].areaname +'</option>';
			}
			$("#route_paoni").append(entry);
			$("#route_paoni").val(dumping_area);
			
			var body = document.getElementById("route_update_body");
			while(body.hasChildNodes()) //当div下还存在子节点时 循环继续  
			{  
				body.removeChild(body.firstChild); 
			}
			var buttomPoint = routeCoorDict[route_id];
			coorNum = buttomPoint.length;
			var entry = "";
			for (var i = 1; i < coorNum + 1; i++) {
				entry += '<div id="hd'+i+'" class="row" style="margin:0;height:13%;">';
				entry += '<div class="col-sm-2 nopadding">坐标点'+i+'经度</div>';
				entry += '<div class="col-sm-4 nopadding"><input type="text" name="hangdaox" id="hangdaox'+i+'"style="width:145px;height:25px" /></div>';
				entry += '<div class="col-sm-2 nopadding">坐标点'+i+'纬度</div>';
				entry += '<div class="col-sm-4 nopadding"><input type="text" name="hangdaoy" id="hangdaoy'+i+'"style="width:145px;height:25px" /></div></div>';
			}
			$("#route_update_body").append(entry);
			for (var i = 1;i<coorNum + 1;++i){ 
				$('#hangdaox' + i).val(buttomPoint[i - 1].x)
				$('#hangdaoy' + i).val(buttomPoint[i - 1].y)
			}
			document.getElementById("route_update_label").className = "modal-title glyphicon glyphicon-pencil";
            $("#route_update_label").text("编辑");
			$('#route_update').modal('show');
			$("#route_add_point_button").show();
			$("#route_delete_point_button").show();
			$('#route_add_button').hide();
			$('#route_edit_button').show();
			$('#route_delete_button').hide();
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
			route_id = arrselections[0].routeid;
			if(confirm("确定要删除吗？")){
				route_delete(route_id);
			}
			/*harbor = arrselections[0].harbor;
			dumping_area = arrselections[0].dumping;
			speed = arrselections[0].speed;
			$("#route_id").val(route_id);
			$("#route_work").val(harbor);
			$("#route_paoni").val(dumping_area);
			$("#route_speed").val(speed);
			var body = document.getElementById("route_update_body");
			while(body.hasChildNodes()) //当div下还存在子节点时 循环继续 
			{  
				body.removeChild(body.firstChild); 
			}
			var buttomPoint = routeCoorDict[route_id];
			routeCoorNum = buttomPoint.length;
			var entry = "";
			for (var i = 1; i < coorNum + 1; i++) {
				entry += '<div id="hd'+i+'" class="row" style="margin:0;height:13%;">';
				entry += '<div class="col-sm-2 nopadding">坐标点'+i+'经度</div>';
				entry += '<div class="col-sm-4 nopadding"><input type="text" name="hangdaox" id="hangdaox'+i+'"style="width:145px;height:25px" /></div>';
				entry += '<div class="col-sm-2 nopadding">坐标点'+i+'纬度</div>';
				entry += '<div class="col-sm-4 nopadding"><input type="text" name="hangdaoy" id="hangdaoy'+i+'"style="width:145px;height:25px" /></div></div>';
			}
			$("#route_update_body").append(entry);
			for (var i = 1;i<coorNum + 1;++i){ 
				$('#hangdaox' + i).val(buttomPoint[i - 1].x)
				$('#hangdaoy' + i).val(buttomPoint[i - 1].y)
			}
            $("#route_update_label").text("编辑");
			$('#route_update').modal('show');
			$("#route_add_point_button").hide();
			$("#route_delete_point_button").hide();
			$('#route_add_button').hide();
			$('#route_edit_button').hide();
			$('#route_delete_button').show();*/
        });
	$("#btn_show").off('click');
	$("#btn_show").click(function () {
		var arrselections = $("#table").bootstrapTable('getSelections');
		if (arrselections.length > 1) {
			return;
		}
		if (arrselections.length <= 0) {
			return;
		}
		delete_object();
		area_id = arrselections[0].dumpingid;
		var arrObjPo = [];
		for(var i = 0;i<coorDict[area_id].length;++i)
		{
			arrObjPo.push({x:convertToLatitu(coorDict[area_id][i].x),y:convertToLatitu(coorDict[area_id][i].y)})
		}
		draw_area(arrObjPo);
		
		dredging_id = arrselections[0].dredgingid;
		var arrObjPo = [];
		for(var i = 0;i<sj_coorDict[dredging_id].length;++i)
		{
			arrObjPo.push({x:convertToLatitu(sj_coorDict[dredging_id][i].x),y:convertToLatitu(sj_coorDict[dredging_id][i].y)})
		}
		draw_area(arrObjPo);
		
		AddNewLine();
		
		$('html, body').animate({
        scrollTop: $("#mapBody").offset().top
		}, 100);
    });
}

function RefreshRouteTable() {
	$('#datatable').hide();
	$('#table').bootstrapTable('load', allRoute); 
	$('#datatable').show();
}

function fillAllRoute(data) {
	allRoute = [];
	allHangxian = {};
	for(var i = 0;i<data.length;++i)
	{
		allHangxian[data[i].route_id] = {"dredgingid":data[i].harbor,"dumpingid":data[i].dumping_area};
		allRoute.push({"routeid":data[i].route_id,"harbor":allDredging[data[i].harbor].dredgingname,
		"dumping": allDumping[data[i].dumping_area].areaname, "speed": data[i].speedlimit,"dredgingid":data[i].harbor,"dumpingid":data[i].dumping_area});
		var locationstr = data[i].location;
		var point = locationstr.split("-");
		coor = [];
		for (var j = 0;j<point.length;++j)
		{	
		    var p = point[j].split(",");
		    coor.push({x:p[1],y:p[0]});
		}
		routeCoorDict[data[i].route_id] = coor;
		routeDict[data[i].route_id] = {"harbor":data[i].harbor,"dumping":data[i].dumping_area,"speed":data[i].speedlimit};
	}
	
}

function route_add()
{
	route_id = $("#route_id").val();
	harbor = $("#route_work").val();
	dumping_area = $("#route_paoni").val();
	speed = $("#route_speed").val();
    var locationstr = "";
    for (var i = 1; i < coorNum + 1; i++) {
        locationstr += $("#hangdaoy" + i).val()+","+$("#hangdaox" + i).val()+"-"; 
    }
    locationstr = locationstr.substr(0,locationstr.length-1);
	postData = {"route_id":route_id,"harbor":harbor,"dumping_area":dumping_area,"speedlimit":speed,"location":locationstr};
	$.ajax({
         type: "POST",
         url: "/shanggang/route/add",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("新增数据成功！");
			 $('#route_update').modal('hide');
         	 RefreshLoadRoute();
               },       
         error: function () {       
                alert("新增数据失败！");       
           }       
     });
}

function route_edit()
{
	route_id = $("#route_id").val();
	harbor = $("#route_work").val();
	dumping_area = $("#route_paoni").val();
	speed = $("#route_speed").val();
    var locationstr = "";
    for (var i = 1; i < coorNum + 1; i++) {
        locationstr += $("#hangdaoy" + i).val()+","+$("#hangdaox" + i).val()+"-"; 
    }
    locationstr = locationstr.substr(0,locationstr.length-1);
	postData = {"route_id":route_id,"harbor":harbor,"dumping_area":dumping_area,"speedlimit":speed,"location":locationstr};
	$.ajax({
         type: "POST",
         url: "/shanggang/route/update",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("修改数据成功！");
			 $('#route_update').modal('hide');
         	 RefreshLoadRoute();
               },       
         error: function () {       
                alert("修改数据失败！");       
           }       
     });
}

function route_delete(id)
{
	//route_id = $("#route_id").val();
	route_id = id;
	postData = {"route_id":route_id}; 
	$.ajax({
         type: "POST",
         url: "/shanggang/route/delete",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("删除数据成功！");
			 $('#route_update').modal('hide');
         	 RefreshLoadRoute();
               },       
         error: function () {       
                alert("删除数据失败！");       
           }       
     });
}

function route_add_button()
{
	$("#route_work").val(4);
	coorNum++;
	var entry = "";
	entry += '<div id="hd'+coorNum+'" class="row" style="margin:0;height:13%;">';
	entry += '<div class="col-sm-2 nopadding">坐标点'+coorNum+'经度</div>';
	entry += '<div class="col-sm-4 nopadding"><input type="text" name="hangdaox" id="hangdaox'+coorNum+'"style="width:145px;height:25px" /></div>';
	entry += '<div class="col-sm-2 nopadding">坐标点'+coorNum+'纬度</div>';
	entry += '<div class="col-sm-4 nopadding"><input type="text" name="hangdaoy" id="hangdaoy'+coorNum+'"style="width:145px;height:25px" /></div></div>';
	$("#route_update_body").append(entry);
}

function route_delete_button()
{
	if (coorNum>1)
	{
		var parent=document.getElementById("route_update_body");
		var childx=document.getElementById("hd" + coorNum);
		parent.removeChild(childx);
		coorNum--;
	}	
}

function AddNewLine()
{
	API_SetCurDrawDynamicUseType(DynamicSymbolType.drawLine);
	var objType = DynamicSymbolType.drawLine;
    var objName = "";
	var arrselections = $("#table").bootstrapTable('getSelections');
	routeid = arrselections[0].routeid;
	var buttomPoint = routeCoorDict[routeid];
	var coorNum = buttomPoint.length;
	API_SetMapViewCenter(convertToLatitu(buttomPoint[0].x)/10000000, convertToLatitu(buttomPoint[0].y)/10000000, 80000);
	var arrObjPo = [];
	for (var i = 0; i < coorNum; i++) {
		arrObjPo.push({x:convertToLatitu(buttomPoint[i].x),y:convertToLatitu(buttomPoint[i].y)});
	}
    //var arrObjPo = [{ x: 1222647000, y: 305556000 },{ x: 1222922000, y: 305956000 },{ x: 1223219000, y: 305556000 }];
	//API_SetMapViewCenter(122.2647, 30.5556, 160000);
    var drawObjPoNum = arrObjPo.length;
    if (objType == "2" && drawObjPoNum < parseInt(2)) {
        alert("绘制的点数量不够组成一个线物标，请再添加绘制点。");
        return;
    }

    var layerStylePos = 0;
    var layerPos = -1;

	
    //添加线
        layerPos = API_GetLayerPosById(g_iLineLayerId); //获取线图层的pos
        layerStylePos = g_iLineStylePos;
    

    var bAddResult = false;
    if (layerPos > -1) {
        g_iAddObjId++;
        var objInfo = [];
        var arrExpAttrValue = []; //扩展字段，假如没有可以传入null

        objInfo.layerPos = layerPos;
        objInfo.objId = g_iAddObjId;
        objInfo.name = objName;
        objInfo.showText = objName;
        objInfo.layerStylePos = layerStylePos;
        arrExpAttrValue.push("来一个扩展字段");

        lineobjPos = API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);
        if (lineobjPos > -1) {
            bAddResult = true;
        }
    }


        API_ReDrawLayer();

		API_SetCurDrawDynamicUseType(DynamicSymbolType.none);

};