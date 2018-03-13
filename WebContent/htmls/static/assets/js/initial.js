var switchView = 0;
var chooseHarbor = 0;
var caculateEarthWork = 0;
var harborTitle = ["全景",  "外高桥1-3","外高桥4-6" , "洋山进港航道" ,"洋山港前水域", "罗泾","黄浦江" ];
var level = [12,4,20];
var leveltmp = [0,0,0,0,0,0,0,0,0,0]
var levels = [[12,3,20],[9,3,14],[14,3,20],[12,4,20],[11,3,15],[6,3,14]];
var warnlevel = [8, 9, 20000000, 1000000];
var warnlevels = [[12, 13, 14],[9, 10, 11],[14, 15, 16],[12, 13, 14],[11, 12, 13],[6, 7, 8]];
var hpjpositon = [[121.511050931509,31.37903832946622,20000]
,[121.53504942432423,31.34965284513733,20000],
[121.56891591053557, 31.315144962153127,20000],
[121.57002532991142, 31.283507593720937, 20000],
[121.53569171975244, 31.247720791190773, 40000],
[121.50334338637123, 31.214680394667507,20000],
[121.48857059152388, 31.189661754882742, 40000],
[121.47216286285945,31.14816467149127,20000],
[121.47181251989863,31.116822609231114, 20000],
[121.46863023800468, 31.09349756237542, 10000]];
var mouse = 1;
var allPorts = ["外高桥1-3", "外高桥4-6" , "洋山进港航道" , "洋山港内水域", "罗泾", "黄浦江"];
var allPortsID = ["waigaoqiao1_dropdown", "waigaoqiao2_dropdown", "yangshan1_dropdown", "yangshan2_dropdown", "luojing_dropdown", "huangpujiangI_dropdown"];
var project_selected = -1;
var project_submenu_selected = -1;
var port_project = {};


var allParam = [];
var detailed = {};
var allSgdw = {};
var allSjdw = {};
var allJldw = {};
var allCompany = {};
var allMmsi = {};
var allDredging = {};
var allDumping = {};
var allHangxian = {};
var coorDict = {};
var sj_coorDict = {};
var allDumping = {};
postData = {};

$(document).ready(function() {
	// init();
    // $("#webgl3d").hide();
    // $("#hud").hide();
    // $("#plotForTransection1").hide();
    // $("#plotForTransection2").hide();
	//authority();
	//preWarning();
	AddBorder();
	// getDepthLevel();
	//$("#quanjing").click();
	pfullView();
	$("#mapBody").show();
	$("#setbuttom").hide();
	// $("#ranklevel").hide();
	// $("#earthwork-form").hide();
	//AddLayers(15);
	//waigaoqiao4Defult();
	//waigaoqiao1Defult();
	//yangshan1Defult()
	//yangshan2Defult()
	//LuojingDefult()
	//HuangpujiangDefult()
	setButtom();
	//dashDefult();
	$("#setbuttommodule").hide();
	$("#earthwork-form").hide();
	$("#dirt-form").hide();
	$("#monitor_search_modal").hide();
	$("#data_clean").hide();
	$("#detail_information").hide();
	$("#project_progress").hide();
	$("#datatable").hide();
	$("#detailtable").hide();
	$("#stat_start_end_time").hide();
	// waigaoqiao4Defult()
	$.ajax({
        method: "GET",
        url: "/shanggang/project/list",
        success: function (data) {
			fillParamData(data);
			fillMmsiProjectData(data);
			set_port_menu();
            },
		error: function () {       
            alert("获取数据失败！");
        }  
    });
	$.ajax({
        method: "GET",
        url: "/shanggang/company/listall",
        success: function (data) {
        	fillCompanyData(data);
            },
		error: function () {       
            alert("获取数据失败！");
        }  
    });
	$.ajax({
        method: "GET",
        url: "/shanggang/ship/list",
        success: function (data) {
        	fillMmsiData(data);
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
			$.ajax({
				method: "GET",
				url: "/shanggang/dumping_area/list",
				success: function (data) {
					fillAllPaoni(data);
					$.ajax({
						method: "GET",
						url: "/shanggang/route/listall",
						success: function (data) {    
								fillAllRoute(data);
							  },       
						error: function () {       
							   alert("获取数据失败！");       
						  }       
					});
				},
				error: function () {       
					alert("获取数据失败！");
				}  
			});
        },
		error: function () {       
            alert("获取数据失败！");
        }  
    });
	
	/*$.ajax({
        method: "GET",
        url: "/shanggang/abnormalinfo/exceedspeedfre",
        success: function (data) {
			data=[];
        	fillSpeedfre(data);
            },
		error: function () {       
            alert("fail");
        }  
    });*/
	$.ajax({
        method: "GET",
        url: "/shanggang/workrecord/abnormal",
        success: function (data) {
        	fillAreafre(data);
            },
		error: function () {       
            alert("获取数据失败");
        }  
    });
	/*$.ajax({
        method: "GET",
        url: "/shanggang/abnormalinfo/routefre",
        success: function (data) {
			data=[];
        	fillRoutefre(data);
            },
		error: function () {       
            alert("fail");
        }  
    });*/
	$("#monitor_select").datepicker({
		showOtherMonths: true,
		selectOtherMonths: true,
		changeMonth: true,
		changeYear: true,
		dateFormat: "yy-mm-dd"});
	$("#stat_start").datepicker({
		showOtherMonths: true,
		selectOtherMonths: true,
		changeMonth: true,
		changeYear: true,
		dateFormat: "yy-mm-dd"});
	$("#stat_end").datepicker({
		showOtherMonths: true,
		selectOtherMonths: true,
		changeMonth: true,
		changeYear: true,
		dateFormat: "yy-mm-dd"});
});

function fillMmsiProjectData(data)
{
	mmsi_project = {};
	for(var i = 0;i<data.length;++i)
	{
		ships = data[i].mmsilist.split(';');
		for(var j = 0;j<ships.length;++j)
		{
			mmsi_project[ships[j]] = {"dredging":data[i].harborName.split(';')[0],
			"dumping":data[i].dumpingArea.split(';')[0]};
		}
	}
}

function fillSpeedfre(data)
{
	speedfre = {};
	for(var i = 0;i<data.length;++i)
	{
		speedfre[data[i].mmsi] = data[i].frequency;
	}
}

function fillAreafre(data)
{
	areafre = {};
	for(var i = 0;i<data.length;++i)
	{
		if(!(data[i].mmsi in areafre))
		{
			areafre[data[i].mmsi] = 0;
		}
		areafre[data[i].mmsi] += 1;
	}
}

function fillRoutefre(data)
{
	routefre = {};
	for(var i = 0;i<data.length;++i)
	{
		routefre[data[i].mmsi] = data[i].frequency;
	}
}

function setMouse() {
	if(mouse == 0) {
		API_SetMousePoInfoDivPosition(true, 70, 30);
		mouse = 1;
	}
	else {
		API_SetMousePoInfoDivPosition(true, 270, 30);
		mouse = 0;
	}
	
}

function authority(){

	// for(var i = 0; i < 5; i++) {
	// 	warningStatusNow.push(sessionStorage.warningStatus[i]);
	// }
	$("#dataInput").hide();
	$("#dataOutput").hide();
	$("#fourD-show").hide();
	$("#bar-contain").hide();
	$("#time-contain").hide();
	$("#fourD-view").hide();
	$("#rank14").hide();
	$("#rank15").hide();
	$("#rank16").hide();
	$("#all-show").hide();


	if(sessionStorage.privilege!="admin"){
		$("#user-control").hide();
		$("#user-add").hide();
		$("#system-backup").hide();
	}
	if(sessionStorage.privilege[0]=="N"){
		$("#yangshan1").hide();
		$("#yangshan2").hide();
	}
	if(sessionStorage.privilege[7]=="N"){
		$("#luojing").hide();
	}
	if(sessionStorage.privilege[14]=="N"){
		$("#waigaoqiao1").hide();
		$("#waigaoqiao2").hide();
	}
	if(sessionStorage.privilege[21]=="N"){
		$("#huangpujiang").hide();
	}
	if(sessionStorage.privilege !="admin"){
		$("#data-delete").hide();
	}
	for(var i = 0; i < 4; ++i) {
		if(sessionStorage.privilege[3 + i*7]=="Y" || sessionStorage.privilege == "admin") {
			$("#dataInput").show();
		}
		if(sessionStorage.privilege[4 + i*7]=="Y" || sessionStorage.privilege == "admin") {
			$("#dataOutput").show();
		}
	}
	
}

function pfullView() {
	dredging_area = "";
	project_submenu_selected = -1;
	dashLineOn = 0;
	$("#ranklevel").hide();
	// $("#show-time").hide();
	$("#huangpujiangI").html("<img id = 'huangpujiang_waring' src = 'img/green.png' height='15' width='15'>&#160;&#160;黄浦江");
	hpjn = 0;
	// if(chooseHarbor==1){
	// 	$("#waigaoqiao1").button('toggle');
	// }
	// if(chooseHarbor==2){
	// 	$("#waigaoqiao2").button('toggle');
	// }
	// if(chooseHarbor==3){
	// 	$("#yangshan").button('toggle');
	// }
	// if(chooseHarbor==5){
	// 	$("#luojing").button('toggle');
	// }
	$(".change").removeClass('Current');
	$("#quanjing").addClass('Current');
	// $("waigaoqiao1").addClass('Current');
	// if(chooseHarbor==4){
	// 	$("#huangpujiang").button('toggle');
	// }

	chooseHarbor=0;
	//$("#harbor-title").text(harborTitle[0]);
	API_SetMapViewCenter(121.668, 31.338, 160000);
	$("#switch-show").hide();
	$("#history-data").hide();
	$("#future-data").hide();
	$("#tufang-caculate").hide();
	$("#set-buttom-depth").hide();
	$("#set-buttom-depth2").hide();
	$("#set-warn-level").hide();
	$("#set-view-level").hide();
	$("#part-warn-level").hide();
}

function pchooseWaigaoqiao(n){
	dashLineOn = 0;
	// $("#part-warn-level").hide();
	$("#ranklevel").show();
	$("#switch-show").hide();
	$("#history-data").hide();
	$("#future-data").hide();
	$("#tufang-caculate").hide();
	$("#set-warn-level").hide();
	$("#part-warn-level").hide();
	times = [];
	datas = [];
	$("#huangpujiangI").html("<img id = 'huangpujiang_waring' src = 'img/green.png' height='15' width='15'>&#160;&#160;黄浦江");
	hpjn = 0;
	$(".change").removeClass('Current');
	// $("#quanjing").addClass('Current');
	// if(chooseHarbor==3){
	// 	$("#yangshan1").button('toggle');
	// }
	// if(chooseHarbor==4){
	// 	$("#yangshan2").button('toggle');
	// }
	// if(chooseHarbor==5){
	// 	$("#luojing").button('toggle');
	// }
	// // if(chooseHarbor==4){
	// // 	$("#huangpujiang").button('toggle');
	// // }
	// if(chooseHarbor==0){
	// 	$("#quanjing").button('toggle');
	// }
	

	switch (n) {
		case 1:
			dredging_area="外高桥1-3";
			// $("#waigaoqiaoI").html("&#160;&#160;外高桥 1-3&#160;&#160;");
			// if(chooseHarbor==2){
			// 	$("#waigaoqiao2").button('toggle');
			// }
			level = levels[0];
			warnlevel = warnlevels[0];
			$("#waigaoqiao1").addClass('Current');
			// console.log(warnlevel[0]);
			chooseHarbor=1;
			API_SetMapViewCenter(121.59665274129951, 31.377866868906267, 20000);
			//deleteFaces();
			//getWarningLevel();
			//getDepthLevel();
			//getRecentDate();
			break;
		case 2:
			dredging_area="外高桥4-6";
			// $("#waigaoqiaoI").html("&#160;&#160;外高桥 4-6&#160;&#160;");
			level = levels[1];
			warnlevel = warnlevels[1];
			// if(chooseHarbor==1){
			// 	$("#waigaoqiao1").button('toggle');
			// }
			$("#waigaoqiao2").addClass('Current');
			chooseHarbor=2;
			API_SetMapViewCenter(121.668, 31.338, 20000);
			// $("#harbor-title").text(harborTitle[1]);
			//deleteFaces();
			//getWarningLevel();
			//getDepthLevel();
			//getRecentDate();
			break;
		default:

	}

	$("#show-time").show();
	$("#switch-show").show();
	$("#history-data").show();
	$("#set-dirt-table").show();
	$("#set-sealine").show();
	$("#set-view-level").show();
	$("#set-project-param").show();
	$("#boat-import").show();
	$("#boat-management").show();
	$("monitor").show();
	// $("#fourD-show").show();
	// $("#fourD-view").show();
	/*if(sessionStorage.privilege[15]=="Y"||sessionStorage.privilege=="admin"){
		$("#future-data").show();
	}
	if(sessionStorage.privilege[19]=="Y"||sessionStorage.privilege=="admin"){
		$("#tufang-caculate").show();
	}
	if(sessionStorage.privilege[16]=="Y"||sessionStorage.privilege=="admin"){
		$("#set-warn-level").show();
		// $("#part-warn-level").show();
	}*/
	var buttomNow = allButtom[chooseHarbor - 1];
    
    var blength = buttomNow.length;
    defaultDepth = 0;
    for(var i = 0; i < blength; i++) {
        defaultDepth = buttomNow[i].d > defaultDepth ? buttomNow[i].d : defaultDepth;
    }
	rangedThreshold = allButtom[chooseHarbor - 1];
	 $("#rank20").hide();
    $("#rank21").hide();
    $("#xianshi").click();
}

function pchooseYangshan(n){
	dashLineOn = 0;
	$("#set-view-level").show();
	$("#ranklevel").show();
	$("#switch-show").hide();
	$("#history-data").hide();
	$("#future-data").hide();
	$("#tufang-caculate").hide();
	$("#set-warn-level").hide();
	$("#part-warn-level").hide();
	$("#set-buttom-depth").show();
	$("#set-buttom-depth2").show();
	times = [];
	datas = [];
	$("#huangpujiangI").html("<img id = 'huangpujiang_waring' src = 'img/green.png' height='15' width='15'>&#160;&#160;黄浦江");
	hpjn = 0;
	// if(chooseHarbor==1){
	// 	$("#waigaoqiao1").button('toggle');
	// }
	// if(chooseHarbor==2){
	// 	$("#waigaoqiao2").button('toggle');
	// }

	// if(chooseHarbor==5){
	// 	$("#luojing").button('toggle');
	// }
	// if(chooseHarbor==4){
	// 	$("#huangpujiang").button('toggle');
	// }
	// if(chooseHarbor==0){
	// 	$("#quanjing").button('toggle');
	// }
	$(".change").removeClass('Current');
	
	//deleteFaces();
	switch (n) {
		case 1:
			dredging_area="洋山进港航道";
			// $("#waigaoqiaoI").html("&#160;&#160;外高桥 1-3&#160;&#160;");
			// if(chooseHarbor==4){
			// 	$("#yangshan2").button('toggle');
			// }
			$("#yangshan1").addClass('Current');
			level = levels[2];
			warnlevel = warnlevels[2];
			// console.log('1');
			chooseHarbor=3;
			API_SetMapViewCenter(122.24250827924453, 30.556957174180525, 160000);
			//getWarningLevel();
			//getDepthLevel();
			//getRecentDate();
			break;
		case 2:
			dredging_area="洋山港前水域";
			// $("#waigaoqiaoI").html("&#160;&#160;外高桥 4-6&#160;&#160;");
			level = levels[3];
			warnlevel = warnlevels[3];
			// if(chooseHarbor==3){
			// 	$("#yangshan1").button('toggle');
			// }
			$("#yangshan2").addClass('Current');
			chooseHarbor=4;
			API_SetMapViewCenter(122.0806550090706, 30.614947206150408, 160000);
			//getWarningLevel();
			// $("#harbor-title").text(harborTitle[1]);
			//getDepthLevel();
			//getRecentDate();
			break;
		default:

	}
	$("#show-time").show();
	$("#switch-show").show();
	$("#history-data").show();
	// $("#fourD-show").show();
	// $("#fourD-view").show();
	// $("#time-contain").show();
	/*if(sessionStorage.privilege[1]=="Y"||sessionStorage.privilege=="admin"){
		$("#future-data").show();
	}
	if(sessionStorage.privilege[5]=="Y"||sessionStorage.privilege=="admin"){
		$("#tufang-caculate").show();
	}
	if(sessionStorage.privilege[2]=="Y"||sessionStorage.privilege=="admin"){
		$("#set-warn-level").show();
		// $("#part-warn-level").show();
	}*/
	var buttomNow = allButtom[chooseHarbor - 1];
    
    var blength = buttomNow.length;
    defaultDepth = 0;
    for(var i = 0; i < blength; i++) {
        defaultDepth = buttomNow[i].d > defaultDepth ? buttomNow[i].d : defaultDepth;
    }
	rangedThreshold = allButtom[chooseHarbor - 1];
 $("#rank20").hide();
    $("#rank21").hide();
    $("#xianshi").click();
}


function pchooseLuojing(){
	dredging_area = "罗泾";
	dashLineOn = 0;
	$("#set-view-level").show();
	$("#ranklevel").show();
	$("#switch-show").hide();
	$("#history-data").hide();
	$("#future-data").hide();
	$("#tufang-caculate").hide();
	$("#set-warn-level").hide();
	$("#part-warn-level").hide();
	$("#set-buttom-depth").show();
	$("#set-buttom-depth2").show();
	times = [];
	datas = [];
	$("#huangpujiangI").html("<img id = 'huangpujiang_waring' src = 'img/green.png' height='15' width='15'>&#160;&#160;黄浦江");
	hpjn = 0;
	// if(chooseHarbor==1){
	// 	$("#waigaoqiao1").button('toggle');
	// }
	// if(chooseHarbor==2){
	// 	$("#waigaoqiao2").button('toggle');
	// }
	// if(chooseHarbor==3){
	// 	$("#yangshan1").button('toggle');
	// }
	// if(chooseHarbor==4){
	// 	$("#yangshan2").button('toggle');
	// }
	// if(chooseHarbor==4){
	// 	$("#huangpujiang").button('toggle');
	// }
	// if(chooseHarbor==0){
	// 	$("#quanjing").button('toggle');
	// }
	$(".change").removeClass('Current');
	$("#luojing").addClass('Current');
	level = levels[4];
	warnlevel = warnlevels[4];
	//deleteFaces();	
	chooseHarbor=5;
	API_SetMapViewCenter(121.42, 31.49, 40000);
	//getWarningLevel();
	//getDepthLevel();
	//getRecentDate();
	$("#show-time").show();	
	$("#switch-show").show();
	$("#history-data").show();
	// $("#fourD-show").show();
	// $("#fourD-view").show();
	/*if(sessionStorage.privilege[8]=="Y"||sessionStorage.privilege=="admin"){
		$("#future-data").show();
	}
	if(sessionStorage.privilege[12]=="Y"||sessionStorage.privilege=="admin"){
		$("#tufang-caculate").show();
	}
	if(sessionStorage.privilege[9]=="Y"||sessionStorage.privilege=="admin"){
		$("#set-warn-level").show();
		// $("#part-warn-level").show();
	}*/
	var buttomNow = allButtom[chooseHarbor - 1];
    
    var blength = buttomNow.length;
    defaultDepth = 0;
    for(var i = 0; i < blength; i++) {
        defaultDepth = buttomNow[i].d > defaultDepth ? buttomNow[i].d : defaultDepth;
    }
	rangedThreshold = allButtom[chooseHarbor - 1];
 $("#rank20").hide();
    $("#rank21").hide();
    $("#xianshi").click();
}

function pchooseHuangpujiang() {
	dredging_area = "黄浦江";
	dashLineOn = 0;
	$("#set-view-level").show();
	$("#set-warn-level").hide();
	$("#part-warn-level").hide();
	$("#ranklevel").show();
	$("#switch-show").hide();
	$("#history-data").hide();
	$("#future-data").hide();
	$("#tufang-caculate").hide();
	$("#set-buttom-depth").show();
	$("#set-buttom-depth2").show();
	times = [];
	datas = [];
	hpjn = 0;
	// if(chooseHarbor==1){
	// 	$("#waigaoqiao1").button('toggle');
	// }
	// if(chooseHarbor==2){
	// 	$("#waigaoqiao2").button('toggle');
	// }
	// if(chooseHarbor==3) {
	// 	$("#yangshan1").button('toggle');
	// }
	// if(chooseHarbor==4) {
	// 	$("#yangshan2").button('toggle');
	// }
	// if(chooseHarbor==5) {
	// 	$("#luojing").button('toggle');
	// }
	// if(chooseHarbor==0) {
	// 	$("#quanjing").button('toggle');
	// }
	$(".change").removeClass('Current');
	$("#huangpujiangI").addClass('Current');
	level = levels[5];
	warnlevel = warnlevels[5];
	//deleteFaces();
	chooseHarbor=6;
	API_SetMapViewCenter(hpjpositon[0][0],hpjpositon[0][1],hpjpositon[0][2]);
	// $("#harbor-title").text(harborTitle[2]);
	//getDepthLevel();
	/*switch (n) {
		case n:
			hpjn = n;
			$("#huangpujiangI").html("<img id = 'huangpujiang_waring' src = 'img/green.png' height='15' width='15'>&#160;&#160;黄浦江"+n+"&#160;&#160;");
			// console.log(n);
			//getWarningLevel();
			//getRecentDate(hpjn);
			break;
		default:

	}*/
	$("#show-time").show();
	$("#switch-show").show();
	$("#history-data").show();
	// $("#fourD-show").show();
	// $("#fourD-view").show();
	/*if(sessionStorage.privilege[22]=="Y"||sessionStorage.privilege=="admin"){
		$("#future-data").show();
	}
	if(sessionStorage.privilege[26]=="Y"||sessionStorage.privilege=="admin"){
		$("#tufang-caculate").show();
	}
	if(sessionStorage.privilege[23]=="Y"||sessionStorage.privilege=="admin"){
		$("#set-warn-level").show();
		// $("#part-warn-level").show();
	}*/
	$("#rank20").hide();
    $("#rank21").hide();
    $("#xianshi").click();
}

function set_port_menu()
{
	for(var i = 0;i<allPorts.length;++i)
	{
		var tbody = document.getElementById(allPortsID[i]);
		while(tbody.hasChildNodes())
		{
			tbody.removeChild(tbody.firstChild);
		}
		var entry = "";
		for(var j = 0;j<port_project[allPorts[i]].length;++j)
		{
			var pid = port_project[allPorts[i]][j];
			if(pid in detailed)
			{
				if (detailed[pid].isworking == 1){
					var pname = detailed[pid].projectname;
					entry+='<li class="Last"><a style="padding:0px;" href="#" onclick = '+ 'choose_menu_project('+pid+')>' + pname + '</a></li>';
				}
			}
		}
		$("#"+allPortsID[i]).append(entry);
	}
}

function choose_menu_project(i)
{
	project_selected = i;
	if(project_selected in detailed)
	{
		var pname = detailed[project_selected].projectname;
		$("#project_label").text(pname);
	}
	switch(project_submenu_selected)
	{
	case 1:
		InitLoadParam_Project();
		break;
	case 21:
		FleetStatsInit();
		break;
	case 22:
		ProjectStatsInit();
		break;
	case 31:
		RTMonInit();
		break;
	case 32:
		HSMonInit();
		break;
	case 33:
		DTMonInit();
		break;
	case 41:
		DirtError(1);
		break;
	case 42:
		DirtError(2);
		break;
	case 43:
		DirtError(3);
		break;
	case 44:
		DirtError(4);
		break;
	case 45:
		DirtError(5);
		break;
	case 46:
		SpeedError();
	default:
		InitLoadParam_Project();
	}
}

function reset_select()
{
	project_selected = -1;
	$("#project_label").text("");
}

function RefreshOrNot()
{
	if(confirm("确定要回到初始界面吗？")){
				window.location.reload();
	}
}

function GetShujunNameByID(id)
{
	if(id in allDredging)
	{
		return allDredging[id].dredgingname;
	}
	else
	{
		return "-";
	}
}
function GetPaoniNameByID(id)
{
	if(id in allDumping)
	{
		return allDumping[id].areaname;
	}
	else
	{
		return "-";
	}
}

function GetRouteNameByID(id)
{
	return "-";
}

function GetCompanyNameByID(id)
{
	if(id in allCompany)
	{
		return allCompany[id].name;
	}
	else
	{
		return "-";
	}
}

function GetShujunNameStrByID(id_str)
{
	var sj_name = "";
	if(id_str != "")
	{
		var id_tmp = id_str.split(";");
		if(id_tmp.length != 0)
		{
			sj_name = GetShujunNameByID(id_tmp[0]);
			for(var j = 1;j<id_tmp.length;++j)
			{
				sj_name += ";";
				sj_name += GetShujunNameByID(id_tmp[j]);
			}
		}
	}
	return sj_name;
}

function GetPaoniNameStrByID(id_str)
{
	var pn_name = "";
	if(id_str != "")
	{
		var id_tmp = id_str.split(";");
		if(id_tmp.length != 0)
		{
			pn_name = GetPaoniNameByID(id_tmp[0]);
			for(var j = 1;j<id_tmp.length;++j)
			{
				pn_name += ";";
				pn_name += GetPaoniNameByID(id_tmp[j]);
			}
		}
	}
	return pn_name;
}

function GetCompanyNameStrByID(id_str)
{
	var company_name = "";
	if(id_str != "")
	{
		var id_tmp = id_str.split(";");
		if(id_tmp.length != 0)
		{
			company_name = GetCompanyNameByID(id_tmp[0]);
			for(var j = 1;j<id_tmp.length;++j)
			{
				company_name += ";";
				company_name += GetCompanyNameByID(id_tmp[j]);
			}
		}
	}
	return company_name;
}