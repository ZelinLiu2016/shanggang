var allShujun = [];
var postData = {};
var coorNum = 4;
function SetShujunTable() {
	project_submenu_selected = -1;
	CleanAll();
	$("#L1").attr("class", "LeftTextSelect");
	$("#L1L4").attr("class", "LeftTextSelect");
	
	$("#toolbar").show();
	$("#btn_backup").hide();
	$("#btn_add").show();
	$("#btn_edit").show();
	$("#btn_delete").show();
	$("#btn_show").show();
	$("#import_project").hide();
	$("#select_mmsi").hide();
	$("#import_project_label").hide();
	$("#select_mmsi_label").hide();
	$("#toolbar_search").hide();
	$("#btn_search").hide();
	$("#finish_checkbox").show();
	$("#finish_checkbox_label").show();
	$("#finish_checkbox_label").text("显示已竣工疏浚区域");
	document.getElementById('finish_checkbox').checked = false;
	$("#finish_checkbox").off('click');
	$("#finish_checkbox").click(function () {
		show_shujun_finished();
	});
	
	$("#mapBody").show();
	$("#startup_table_div").hide();
	$("#data_clean").hide();
	$("#detail_information").hide();
	$("#detailtable").hide();
	$("#info_div").hide();
	$("#monitor_search_modal").hide();
	$("#stat_start_end_time").hide();
	$("#project_progress").hide();
	
	delete_object();
	API_DelAllShips();
	ClearPlayShipInfo();
	API_ReDrawLayer();
    $.ajax({
		type: "GET",
		url: "/shanggang/dredging_area/listall",
		success: function (data) {    
			fillAllShujun(data);
			finish_shujun_filter();
			InitShujunTable();
		  },       
		error: function () {       
			   alert("获取数据失败！");       
		  }       
	});
}

function RefreshLoadShujun()
{
    $.ajax({
            type: "GET",
            url: "/shanggang/dredging_area/listall",
            success: function (data) {    
            	    fillAllShujun(data);
					finish_shujun_filter();
            	    RefreshShujunTable();
                  },       
            error: function () {       
                   alert("获取数据失败！");       
              }       
        });
}

function InitShujunTable()
{
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allShujun,
    //height:380,
	pagination: false,
    pageSize: 5,
	clickToSelect: true,
	singleSelect:true,
	onCheck: function (row, $element) {
		var arrselections = $("#table").bootstrapTable('getSelections');
		if (arrselections.length > 1) {
			return;
		}
		if (arrselections.length <= 0) {
			return;
		}
		dredging_id = arrselections[0].dredgingid;
		delete_object();
		var arrObjPo = [];
		for(var i = 0;i<sj_coorDict[dredging_id].length;++i)
		{
			arrObjPo.push({x:convertToLatitu(sj_coorDict[dredging_id][i].x),y:convertToLatitu(sj_coorDict[dredging_id][i].y)})
		}
		if(arrObjPo.length == 0 && (dredging_id<5 || dredging_id>8))
		{
			alert("疏浚区域位置数据缺失！ ")
		}
		else{
			draw_area(arrObjPo);
		}
		$('html, body').animate({
        scrollTop: $("#mapBody").offset().top
		}, 100);
    },
	
    columns: [
	{checkbox: true},
	{
        field: 'dredgingid',
        title: '疏浚区域编号'
    },
	{
        field: 'dredgingname',
        title: '疏浚区域名称'
    },
	{
        field: 'harbor',
        title: '所属港区'
    }
	]});
	$('#datatable').show();
	$("#btn_add").off('click');
	$("#btn_add").click(function () {
		if(sessionStorage.length == 0)
			{
				alert("会话过期，请重新登录！ ");
				self.location='index.html';
				return;
			}
			if(!authority_sys2(10, sessionStorage.privilege))
			{
				 alert("当前用户无权限进行该操作！ ");
			}
			else{
		var body = document.getElementById("shujun_update_body");
		while(body.hasChildNodes()) //当div下还存在子节点时 循环继续  
		{  
			body.removeChild(body.firstChild); 
		}
		$("#shujunquyu").val("");
		$("#shujungangqu").val("");
		$("#shujunmingcheng").val("");
		coorNum = 1;
		var entry = "";
		entry += '<div id="sj'+coorNum+'" class="row" style="margin:0;height:13%;">';
		entry += '<div class="col-sm-2 nopadding">坐标点'+coorNum+'经度</div>';
		entry += '<div class="col-sm-4 nopadding"><input type="text" name="shujundianx" id="shujundianx'+coorNum+'"style="width:145px;height:25px" /></div>';
		entry += '<div class="col-sm-2 nopadding">坐标点'+coorNum+'纬度</div>';
		entry += '<div class="col-sm-4 nopadding"><input type="text" name="shujundiany" id="shujundiany'+coorNum+'"style="width:145px;height:25px" /></div></div>';
		$("#shujun_update_body").append(entry);
		document.getElementById("shujun_update_label").className = "modal-title glyphicon glyphicon-plus";
        $("#shujun_update_label").text("新增");
		$('#shujun_update').modal('show');
		$("#shujun_add_point_button").show();
		$("#shujun_delete_point_button").show();
		$('#shujun_add_button').show();
		$('#shujun_edit_button').hide();
		$('#shujun_delete_button').hide();
			}
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
		dredging_id = arrselections[0].dredgingid;
		dredging_name = arrselections[0].dredgingname;
		dredging_harbor = arrselections[0].harbor;
		$("#shujunquyu").val(dredging_id);
		$("#shujungangqu").val(dredging_harbor);
		$("#shujunmingcheng").val(dredging_name);
		var body = document.getElementById("shujun_update_body");
		while(body.hasChildNodes()) //当div下还存在子节点时 循环继续  
		{  
			body.removeChild(body.firstChild); 
		}
		var buttomPoint = sj_coorDict[dredging_id];
		coorNum = buttomPoint.length;	
		var entry = "";
		for (var i = 1; i < coorNum + 1; i++) {
			entry += '<div id="sj'+i+'" class="row" style="margin:0;height:13%;">';
			entry += '<div class="col-sm-2 nopadding">坐标点'+i+'经度</div>';
			entry += '<div class="col-sm-4 nopadding"><input type="text" name="shujundianx" id="shujundianx'+i+'"style="width:145px;height:25px" /></div>';
			entry += '<div class="col-sm-2 nopadding">坐标点'+i+'纬度</div>';
			entry += '<div class="col-sm-4 nopadding"><input type="text" name="shujundiany" id="shujundiany'+i+'"style="width:145px;height:25px" /></div></div>';
		}
		$("#shujun_update_body").append(entry);
		for (var i = 1;i<coorNum + 1;++i){ 
			$('#shujundianx' + i).val(buttomPoint[i - 1].x)
			$('#shujundiany' + i).val(buttomPoint[i - 1].y)
		}
		document.getElementById("shujun_update_label").className = "modal-title glyphicon glyphicon-pencil";
		$("#shujun_update_label").text("编辑");
		$('#shujun_update').modal('show');
		$("#shujun_add_point_button").show();
		$("#shujun_delete_point_button").show();
		$('#shujun_add_button').hide();
		$('#shujun_edit_button').show();
		$('#shujun_delete_button').hide();
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
			if(sessionStorage.length == 0)
			{
				alert("会话过期，请重新登录！ ");
				self.location='index.html';
				return;
			}
			if(!authority_sys2(12, sessionStorage.privilege))
			{
				 alert("当前用户无权限进行该操作！ ");
			}
			else{
			dredging_id = arrselections[0].dredgingid;
			if(confirm("确定要删除吗？")){
				shujun_delete(dredging_id);
			}
			}
			/*$("#paoniquyu").val(area_id);
			$("#paonigangqu").val(port);
			var body = document.getElementById("paoni_update_body");
			while(body.hasChildNodes()) //当div下还存在子节点时 循环继续  
			{  
				body.removeChild(body.firstChild); 
			}
			var buttomPoint = coorDict[area_id];
			coorNum = buttomPoint.length;
			var entry = "";
			for (var i = 1; i < coorNum + 1; i++) {
				entry += '<div id="pn'+i+'" class="row" style="margin:0;height:13%;">';
				entry += '<div class="col-sm-2 nopadding">坐标点'+i+'经度</div>';
				entry += '<div class="col-sm-4 nopadding"><input type="text" name="paonidianx" id="paonidianx'+i+'"style="width:145px;height:25px" /></div>';
				entry += '<div class="col-sm-2 nopadding">坐标点'+i+'纬度</div>';
				entry += '<div class="col-sm-4 nopadding"><input type="text" name="paonidiany" id="paonidiany'+i+'"style="width:145px;height:25px" /></div></div>';
			}
			$("#paoni_update_body").append(entry);
			for (var i = 1;i<coorNum + 1;++i){ 
				$('#paonidianx' + i).val(buttomPoint[i - 1].x)
				$('#paonidiany' + i).val(buttomPoint[i - 1].y)
			}
            $("#paoni_update_label").text("编辑");
			$('#paoni_update').modal('show');
			$("#paoni_add_point_button").hide();
			$("#paoni_delete_point_button").hide();
			$('#paoni_add_button').hide();
			$('#paoni_edit_button').hide();
			$('#paoni_delete_button').show();*/
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
		dredging_id = arrselections[0].dredgingid;
		delete_object();
		var arrObjPo = [];
		for(var i = 0;i<sj_coorDict[dredging_id].length;++i)
		{
			arrObjPo.push({x:convertToLatitu(sj_coorDict[dredging_id][i].x),y:convertToLatitu(sj_coorDict[dredging_id][i].y)})
		}
		if(arrObjPo.length == 0 && (dredging_id<5 || dredging_id>8))
		{
			alert("疏浚区域位置数据缺失！ ")
		}
		else{
			draw_area(arrObjPo);
		}
		/*deleteButtomFace();
		labelInfo = [];
		AddButtomLayer();
		buttomFaces = 1000;
        var buttomPoint = sj_coorDict[dredging_id];
        var coorNum = buttomPoint.length;
        API_SetMapViewCenter(convertToLatitu(buttomPoint[0].x)/10000000, convertToLatitu(buttomPoint[0].y)/10000000, 80000);
        for (var i = 0; i < coorNum; i++) {
            var ob = [];
            ob.push(convertToLatitu(buttomPoint[i].y));
            ob.push(convertToLatitu(buttomPoint[i].x));
            labelInfo.push(ob);
        }
        AddButtomFaces(labelInfo);*/
		$('html, body').animate({
        scrollTop: $("#mapBody").offset().top
		}, 100);
        });
}

function RefreshShujunTable() {
	$('#datatable').hide();
	$('#table').bootstrapTable('load', allShujun); 
	$('#datatable').show();
}

function fillAllShujun(data) {
	allShujun = [];
	allDredging = {};
	for(var i = 0;i<data.length;++i)
	{
		allShujun.push({"dredgingid":data[i].dredging_id,"dredgingname":data[i].dredging_name,"harbor":data[i].harbor});
		var locationstr = data[i].location;	
		coor = [];
		if(locationstr != "")
		{
			var point = locationstr.split("-");
			for (var j = 0;j<point.length;++j)
			{	
				var p = point[j].split(",");
				coor.push({x:p[1],y:p[0]});
			}
		}
		allDredging[data[i].dredging_id] = {"dredgingname":data[i].dredging_name};
		sj_coorDict[data[i].dredging_id] = coor;
	}
}

function shujun_add()
{
	dredging_id = $("#shujunquyu").val();
	dredging_name = $("#shujunmingcheng").val();
	dredging_harbor = $("#shujungangqu").val();
    var locationstr = "";
    for (var i = 1; i < coorNum + 1; i++) {
        locationstr += $("#shujundiany" + i).val()+","+$("#shujundianx" + i).val()+"-"; 
    }
    locationstr = locationstr.substr(0,locationstr.length-1);
	postData = {"area_id":dredging_id,"location":locationstr,"name":dredging_name,"harbor":dredging_harbor};
	$.ajax({
         type: "POST",
         url: "/shanggang/dredging_area/add",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("新增数据成功！");
			 $('#shujun_update').modal('hide');
         	 RefreshLoadShujun();
               },       
         error: function () {       
                alert("删除数据失败！");       
           }       
     });
}

function shujun_edit()
{
	if(sessionStorage.length == 0)
	{
		alert("会话过期，请重新登录！ ");
		self.location='index.html';
		return;
	}
	if(!authority_sys2(11, sessionStorage.privilege))
	{
		 alert("当前用户无权限进行该操作！ ");
	}
	else{
	dredging_id = $("#shujunquyu").val();
	dredging_name = $("#shujunmingcheng").val();
	dredging_harbor = $("#shujungangqu").val();
    var locationstr = "";
    for (var i = 1; i < coorNum + 1; i++) {
        locationstr += $("#shujundiany" + i).val()+","+$("#shujundianx" + i).val()+"-"; 
    }
    locationstr = locationstr.substr(0,locationstr.length-1);
	postData = {"area_id":dredging_id,"location":locationstr,"name":dredging_name,"harbor":dredging_harbor};
	$.ajax({
         type: "POST",
         url: "/shanggang/dredging_area/update",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("修改数据成功！");
			 $('#shujun_update').modal('hide');
         	 RefreshLoadShujun();
               },       
         error: function () {       
                alert("修改数据失败！");
           }
     });
	}
}

function shujun_delete(id)
{
	//area_id = $("#paoniquyu").val();
	area_id = id;
	postData = {"area_id":area_id}; 
	$.ajax({
         type: "POST",
         url: "/shanggang/dredging_area/delete",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("删除数据成功！");
			 $('#shujun_update').modal('hide');
         	 RefreshLoadShujun();
               },       
         error: function () {       
                alert("删除数据失败！");       
           }       
     });
}

function shujun_add_button()
{
	coorNum++;
	var entry = "";
	entry += '<div id="sj'+coorNum+'" class="row" style="margin:0;height:13%;">';
	entry += '<div class="col-sm-2 nopadding">坐标点'+coorNum+'经度</div>';
	entry += '<div class="col-sm-4 nopadding"><input type="text" name="shujundianx" id="shujundianx'+coorNum+'"style="width:145px;height:25px" /></div>';
	entry += '<div class="col-sm-2 nopadding">坐标点'+coorNum+'纬度</div>';
	entry += '<div class="col-sm-4 nopadding"><input type="text" name="shujundiany" id="shujundiany'+coorNum+'"style="width:145px;height:25px" /></div></div>';
	$("#shujun_update_body").append(entry);
}

function shujun_delete_button()
{
	if (coorNum>1)
	{
		var parent=document.getElementById("shujun_update_body");
		var childx=document.getElementById("sj" + coorNum);
		parent.removeChild(childx);
		coorNum--;
	}	
}

function choosechangjiang(){
    dashLineOn = 0;   
    times = [];
    datas = [];
    $(".change").removeClass('Current');
    $("#waigaoqiao1").addClass('Current');
    level = levels[0];
    warnlevel = warnlevels[0];
    chooseHarbor=1;
    API_SetMapViewCenter(122.23333, 30.56667, 80000);
    deleteFaces();
    getWarningLevel();
    //getDepthLevel();
    //getRecentDate();
    
    $("#paoni").show();
    $("#set-project-param").show();
    $("#boat-import").show();
    $("#boat-management").show();
    $("#set-sealine").show();
	$("#monitor").show();
	$("#data-manage").show();
	$("#dirt-error").show();
	$("#run-error").show();
	$("#speed-error").show();
	$("#weather-error").show();
	$("#process-error").show();
	$("#boat-stats").show();
	$("#fleet-stats").show();
	$("#port-stats").show();	
		
    $("#xianshi").click()
}

function finish_shujun_filter()
{
	tmp_allShujun = [];
	var is_checked = $("#finish_checkbox").is(":checked");
	if (is_checked)
	{
		return;
	}
	else{
		var worked_shujun_id = {};
		for (var i = 0;i<allParam.length;++i)
		{
			if (allParam[i].isworking == 1){
				var shujun_list = allParam[i].harborname.split(';');
				for(var j = 0;j<shujun_list.length;++j)
				{
					worked_shujun_id[shujun_list[j]] = "";
				}
			}
		}
		for (var i = 0;i<allShujun.length;++i)
		{
			if(allShujun[i].dredgingid in worked_shujun_id)
			{
				tmp_allShujun.push(allShujun[i]);
			}
		}
	}
	allShujun = tmp_allShujun;
}

function show_shujun_finished()
{
	$.ajax({
		type: "GET",
		url: "/shanggang/dredging_area/listall",
		success: function (data) {    
			fillAllShujun(data);
			finish_shujun_filter();
			InitShujunTable();
		  },       
		error: function () {       
			   alert("获取数据失败！");       
		  }       
	});
}