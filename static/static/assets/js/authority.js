
var resentDate = [];
var switchView = 0;
var chooseHarbor = 0;
var caculateEarthWork = 0;
var harborTitle = ["全景",  "外高桥1-3","外高桥4-6" , "洋山进港航道" ,"洋山港前水域", "罗泾","黄浦江" ];
var level = [12,4,20];
var leveltmp = [0,0,0,0,0,0,0,0,0,0]
var levels = [[12,3,20],[9,3,14],[14,3,20],[12,4,20],[11,3,15],[6,3,14]];
var warnlevel = [8, 9, 20000000, 1000000];
var warnlevels = [[12, 13, 14],[9, 10, 11],[14, 15, 16],[12, 13, 14],[11, 12, 13],[6, 7, 8]];
var mouse = 1;
var isDreded = false;
var backupDevice = ['D:\\backup']
var hpjn = 0;
var g_iLineStylePos = 23456;
var g_iLineStylePos2 = 2345;
var g_iLineLayerId = 34567;
var linerLayerPos = 6789;
var defaultDepth = 15;
var changepart = 0;
// var lineLayerPos2 = API_GetLayerPosById(g_iLineLayerId2);
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
var datas = [];
var times = [];
var dates = [];
var warningStatusNow = sessionStorage.warningStatus;
var warningNow = 2;
var fourTime = 0;

var labelDepth = [];
var labelInfo = [];
// var depthdata2 = [];
// var axis = [0, 123, 122];
$(document).ready(function() {
	// init();
    // $("#webgl3d").hide();
    // $("#hud").hide();
    // $("#plotForTransection1").hide();
    // $("#plotForTransection2").hide();
	authority();
	preWarning();
	AddBorder();
	// getDepthLevel();
	$("#quanjing").click();
	$("#setbuttom").hide();
	// $("#ranklevel").hide();
	// $("#earthwork-form").hide();
	AddLayers(15);
	waigaoqiao4Defult();
	waigaoqiao1Defult();
	yangshan1Defult()
	yangshan2Defult()
	LuojingDefult()
	HuangpujiangDefult()
	setButtom();
	 dashDefult();
	$("#setbuttommodule").hide();
	$("#earthwork-form").hide();
	$("#dirt-form").hide();

	// waigaoqiao4Defult()
});



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
	$("#set-project-param").hide();
	$("#boat-import").hide();
	$("#boat-management").hide();
	$("#setdirtmodule").hide();
	$("#setparammodule").hide();
	$("#setdirt").hide();

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

function fullView() {
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
	$("#harbor-title").text(harborTitle[0]);
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
	$("#set-dirt-table").hide();
	$("#set-sealine").hide();
	$("#set-project-param").hide();
	$("#boat-import").hide();
	$("#boat-management").hide();
	$("#set-buttom-depth").show();
	$("#setdirtmodule").hide();
	$("#setparammodule").hide();
}

function chooseWaigaoqiao(n){
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
			// $("#waigaoqiaoI").html("&#160;&#160;外高桥 1-3&#160;&#160;");
			// if(chooseHarbor==2){
			// 	$("#waigaoqiao2").button('toggle');
			// }
			$("#waigaoqiao1").addClass('Current');
			level = levels[0];
			warnlevel = warnlevels[0];
			// console.log(warnlevel[0]);
			chooseHarbor=1;
			API_SetMapViewCenter(121.59665274129951, 31.377866868906267, 20000);
			deleteFaces();
			getWarningLevel();
			getDepthLevel();
			getRecentDate();
			break;
		case 2:
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
			deleteFaces();
			getWarningLevel();
			getDepthLevel();
			getRecentDate();
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
	// $("#fourD-show").show();
	// $("#fourD-view").show();
	if(sessionStorage.privilege[15]=="Y"||sessionStorage.privilege=="admin"){
		$("#future-data").show();
	}
	if(sessionStorage.privilege[19]=="Y"||sessionStorage.privilege=="admin"){
		$("#tufang-caculate").show();
	}
	if(sessionStorage.privilege[16]=="Y"||sessionStorage.privilege=="admin"){
		$("#set-warn-level").show();
		// $("#part-warn-level").show();
	}
	var buttomNow = allButtom[chooseHarbor - 1];
    
    var blength = buttomNow.length;
    defaultDepth = 0;
    for(var i = 0; i < blength; i++) {
        defaultDepth = buttomNow[i].d > defaultDepth ? buttomNow[i].d : defaultDepth;
    }
	rangedThreshold = allButtom[chooseHarbor - 1];
	 $("#rank20").hide();
    $("#rank21").hide();
    $("#xianshi").click()
}

function chooseYangshan(n){
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
	
	deleteFaces();
	switch (n) {
		case 1:
			// $("#waigaoqiaoI").html("&#160;&#160;外高桥 1-3&#160;&#160;");
			// if(chooseHarbor==4){
			// 	$("#yangshan2").button('toggle');
			// }
			$("#yangshan1").addClass('Current');
			level = levels[2];
			warnlevel = warnlevels[2];
			// console.log('1');
			chooseHarbor=3;
			API_SetMapViewCenter(122.24250827924453, 30.556957174180525, 40000);
			getWarningLevel();
			getDepthLevel();
			getRecentDate();
			break;
		case 2:
			// $("#waigaoqiaoI").html("&#160;&#160;外高桥 4-6&#160;&#160;");
			level = levels[3];
			warnlevel = warnlevels[3];
			// if(chooseHarbor==3){
			// 	$("#yangshan1").button('toggle');
			// }
			$("#yangshan2").addClass('Current');
			chooseHarbor=4;
			API_SetMapViewCenter(122.0806550090706, 30.614947206150408, 40000);
			getWarningLevel();
			// $("#harbor-title").text(harborTitle[1]);
			getDepthLevel();
			getRecentDate();
			break;
		default:

	}
	$("#show-time").show();
	$("#switch-show").show();
	$("#history-data").show();
	// $("#fourD-show").show();
	// $("#fourD-view").show();
	// $("#time-contain").show();
	if(sessionStorage.privilege[1]=="Y"||sessionStorage.privilege=="admin"){
		$("#future-data").show();
	}
	if(sessionStorage.privilege[5]=="Y"||sessionStorage.privilege=="admin"){
		$("#tufang-caculate").show();
	}
	if(sessionStorage.privilege[2]=="Y"||sessionStorage.privilege=="admin"){
		$("#set-warn-level").show();
		// $("#part-warn-level").show();
	}
	var buttomNow = allButtom[chooseHarbor - 1];
    
    var blength = buttomNow.length;
    defaultDepth = 0;
    for(var i = 0; i < blength; i++) {
        defaultDepth = buttomNow[i].d > defaultDepth ? buttomNow[i].d : defaultDepth;
    }
	rangedThreshold = allButtom[chooseHarbor - 1];
 $("#rank20").hide();
    $("#rank21").hide();
    $("#xianshi").click()


}


function chooseLuojing(){
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
	deleteFaces();	
	chooseHarbor=5;
	API_SetMapViewCenter(121.42, 31.49, 40000);
	getWarningLevel();
	getDepthLevel();
	getRecentDate();
	$("#show-time").show();	
	$("#switch-show").show();
	$("#history-data").show();
	// $("#fourD-show").show();
	// $("#fourD-view").show();
	if(sessionStorage.privilege[8]=="Y"||sessionStorage.privilege=="admin"){
		$("#future-data").show();
	}
	if(sessionStorage.privilege[12]=="Y"||sessionStorage.privilege=="admin"){
		$("#tufang-caculate").show();
	}
	if(sessionStorage.privilege[9]=="Y"||sessionStorage.privilege=="admin"){
		$("#set-warn-level").show();
		// $("#part-warn-level").show();
	}
	var buttomNow = allButtom[chooseHarbor - 1];
    
    var blength = buttomNow.length;
    defaultDepth = 0;
    for(var i = 0; i < blength; i++) {
        defaultDepth = buttomNow[i].d > defaultDepth ? buttomNow[i].d : defaultDepth;
    }
	rangedThreshold = allButtom[chooseHarbor - 1];
 $("#rank20").hide();
    $("#rank21").hide();
    $("#xianshi").click()
	
}

function chooseHuangpujiang(n) {
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
	deleteFaces();
	chooseHarbor=6;
	API_SetMapViewCenter(hpjpositon[n - 1][0],hpjpositon[n - 1][1],hpjpositon[n - 1][2]);
	// $("#harbor-title").text(harborTitle[2]);
	getDepthLevel();
	switch (n) {
		case n:
			hpjn = n;
			$("#huangpujiangI").html("<img id = 'huangpujiang_waring' src = 'img/green.png' height='15' width='15'>&#160;&#160;黄浦江"+n+"&#160;&#160;");
			// console.log(n);
			getWarningLevel();
			getRecentDate(hpjn);
			break;
		default:

	}
	$("#show-time").show();
	$("#switch-show").show();
	$("#history-data").show();
	// $("#fourD-show").show();
	// $("#fourD-view").show();
	if(sessionStorage.privilege[22]=="Y"||sessionStorage.privilege=="admin"){
		$("#future-data").show();
	}
	if(sessionStorage.privilege[26]=="Y"||sessionStorage.privilege=="admin"){
		$("#tufang-caculate").show();
	}
	if(sessionStorage.privilege[23]=="Y"||sessionStorage.privilege=="admin"){
		$("#set-warn-level").show();
		// $("#part-warn-level").show();
	}
	 $("#rank20").hide();
    $("#rank21").hide();
        $("#xianshi").click()
}



function getDepthData(thisform, n, f){
	n = typeof n !== 'undefined' ? n : 0;
	f = typeof f !== 'undefined' ? f : 0;
	// var waitingGIF = '<img src="img/loading.gif" id="loading-waiting" style="display:none" />';
	var year = $('.year-form').text();
	var month = $('.month-form').text();
	$('#show-time').text("数据来自：" + year + month);
	var date = year.substr(2, 2) + "-" + month.substr(0, 2);
	// BootstrapDialog.show({
	// 	title : '加载中',
	// 	message : waitingGIF,
	// 	onshown: function(dialog){
		$('#loadingModal').modal('show');
		
		$.ajax({
			url: "http://202.120.38.3:8091/getdepthdata",
			type:"GET",
			data:{date:date , harborId:chooseHarbor + n}
		}).fail(function(){
			$('#loadingModal').modal('hide');
			if(f == 1){
				alert("历史数据不足，无法预测！");
			}
			else{
				alert("未连接到服务器！");
			}
			
			
		}).done(function(data){
			$("#dif-view").html("标准显示");
			// depthData2 = [];
			// for (var i = 0 ; i < data.length; i++) {
			// 	depthdata2.push(data[i]);
			// // }
			depthData = data;
			for (var i = 0; i < depthData.length; i++) {
       			depthData[i][0] = depthData[i][0]*10000000;
       			depthData[i][1] = depthData[i][1]*10000000;
       			// depthData[i][2] = depthData[i][2].toFixed(1);
    		}
    		console.log(depthData[1][2])
    		deleteFaces();
			 // if(g_iDepthStylePos.length!=0) {
    //     		for (var i = 0; i < g_iDepthStylePos.length; ++ i){
    //     	   var del = API_DelLayerByPos(g_iDepthStylePos[0]);
    //     	   console.log(del);
    //         // for(var j=0; j<del; ++j){
    //         //     API_DelObjectByPos(g_iDepthStylePos[i],0);
    //         //     // console.log(j);
    //         }
    //   		    API_ReDrawLayer
    // 		}
			AddFaces(depthData,level, warnlevel[0],  warnlevel[1],  warnlevel[2]);
			// depthData = [];
			// for (var i = 0 ; i < data.length; i++) {
			// 	depthData.push(data[i]);
			// }
			AddPoints(depthData,level[0],level[1],level[2]);
			ThreeView(depthData, level[2]);
			if(switchView==0) {
						$("#hud").hide();
						$("#plotForTransection1").hide();
						$("#plotForTransection2").hide();
					}
					else{

					};
			// $("#hud").hide();
			$('#loadingModal').modal('hide');
		})
	// },
	// });
}

function getRecentDate(n){
	n = typeof n !== 'undefined' ? n : 0;
	changepart = 0;
	console.log(new Date().getTime());
	// var waitingGIF = '<img src="img/loading.gif" id="loading-waiting" style="display:none" />';
	// var formHead = '<form>';
	// var table = '<div style="height:60px"></div>'
	// var formTail = '</form>';
	// BootstrapDialog.show({
	// 	title : '加载中',
	// 	message : waitingGIF,
	// 	onshown: function(dialog){
		// document.onmousedown=loading;
		$('#loadingModal').modal('show');
		// $('#loadingModal').modal({backdrop: 'static'});
		// loaddisable();
		// $('#loadingDisable').show();
   	    $.ajax({
				url: "http://202.120.38.3:8091/getdate",
				type: "GET",
				data:{harborId:chooseHarbor},
				contentType: false   // tell jQuery not to set contentType
			}).fail(function() {
				$('#loadingModal').modal('hide');
				alert("未连接到服务器");
			}).done(function(date) {
				if(date.length != 0) {

				resentDate[0]=date[0];
				var year = getYears(resentDate);
				var month = getMonths(resentDate,year[0]);
				$('#show-time').text("数据来自：" + year +"年" + month + "月");
				// $("#show-date").text(date[0]);
				// console.log(date);
				$.ajax({
					url: "http://202.120.38.3:8091/getdepthdata",
					type:"GET",
					data:{date:date[0],harborId:chooseHarbor + n}
				}).fail(function(){
					$('#loadingModal').modal('hide');
					// document.onmousedown=loadingOk;	
					alert("未连接到服务器！");
				}).done(function(data){
					// console.log(data);
					$("#dif-view").html("标准显示");

					depthData = data;
					for (var i = 0; i < depthData.length; i++) {
    				    depthData[i][0] = depthData[i][0]*10000000;
   					    depthData[i][1] = depthData[i][1]*10000000;
    				}
					
					// console.log(depthData[0]);
					// console.log(depthData3);

					// depthdata2 = [];
					// for (var i = 0 ; i < data.length; i++) {
					// 	depthdata2.push(data[i]);
					// }
					// depthData = [];
					// for (var i = 0 ; i < data.length; i++) {
					// 	depthData.push(depthdata2[i]);
					// }
					// if(g_iDepthStylePos.length!=0) {
     // 				   for (var i = 0; i < g_iDepthStylePos.length; ++ i){
     //    			   var del = API_DelLayerByPos(g_iDepthStylePos[0]);
     //    			   console.log(del);
     //        // for(var j=0; j<del; ++j){
     //        //     API_DelObjectByPos(g_iDepthStylePos[i],0);
     //        //     // console.log(j);
     //   			     }
     //   					 API_ReDrawLayer
    	// 			}
    				console.log(new Date().getTime());
					AddFaces(depthData,level, warnlevel[0],  warnlevel[1],  warnlevel[2]);
					AddPoints(depthData,level[0],level[1],level[2]);
					// ReflashWarn(depthData, warnlevel[0], warnlevel[1], warnlevel[2]);
					console.log(new Date().getTime());
					if(chooseHarbor != 6) {
						if(warningNow == 0) {
							if (warningStatusNow[chooseHarbor - 1] != 'r') {
								warningStatusNow = replacePart(warningStatusNow, chooseHarbor - 1, 'r');
								// warningStatusNow[chooseHarbor - 1] = 'r';
								// console.log(warningStatusNow[chooseHarbor - 1]);
								setWarningStatus();
							}
						}
						else if(warningNow == 1) {
							if (warningStatusNow[chooseHarbor - 1] != 'y') {
								// warningStatusNow[chooseHarbor - 1] = 'y';
								warningStatusNow = replacePart(warningStatusNow, chooseHarbor - 1, 'y');
								setWarningStatus();
							}
						}
						else {
							if (warningStatusNow[chooseHarbor - 1] != 'g') {
								// warningStatusNow[chooseHarbor - 1] = 'g';
								warningStatusNow = replacePart(warningStatusNow, chooseHarbor - 1, 'g');
								setWarningStatus();
							}
						}
					}
					// console.log(depthData[0]);
					
					if(switchView==0) {
						$("#hud").hide();
						$("#plotForTransection1").hide();
						$("#plotForTransection2").hide();
					}
					else{

					};
					console.log(new Date().getTime());
					// AddWarnPoints(depthData);
					// $('#loadingDisable').hide();
					$('#loadingModal').modal('hide');
					// document.onmousedown=loadingOk;	

				})
			}else {
				$('#loadingModal').modal('hide');
				alert("未导入数据！");
			}
			})
			// document.onmousedown=loadingOk;	
	// 	},
	// });
}

function futureData(){
	var waitingGIF = '<img src="img/loading.gif" id="loading-indicator" style="display:none" />';

	var formHead = '<form id="getdepthForm" action="/getdepthdata" method="post">';

	var formBody =
		'<div class="row"><div class="col-lg-4 col-md-offset-4"><label>&#160;&#160;&#160;&#160;&#160;&#160;请选择对应的时间：</label></div></div>' +
		'<div class="row">' +
			'<div class="col-lg-3 col-lg-offset-3"><div class="input-group-btn">' +
				'<button type="button" class="btn SB btn-default  dropdown-toggle year-form" name="year" data-toggle="dropdown" style="width:100%">选择年份<span class="caret"></span></button>' +
				'<ul class="dropdown-menu dropdown-year" style="min-width: 0;width:100%"></ul>' +
			'</div></div>' +
			'<div class="col-lg-3" style="left:0px"><div class="input-group-btn">' +
				'<button type="button" class="btn SB btn-default dropdown-toggle month-form disabled" name="month" data-toggle="dropdown" style="width:100%">选择月份<span class="caret"></span></button>' +
				'<ul class="dropdown-menu dropdown-month" style="min-width: 0;width:100%"></ul>' +
			'</div></div>' +
		'</div>';


	var dummyInput = '<input type="text" name="date" style="display:none"/>';
	var formTail = '</form>';
	BootstrapDialog.show({
		title : '选择查看时间',
		message : formBody + formHead + dummyInput + formTail + waitingGIF,
		cssClass : 'dialog-border',
		onshown: function(dialog){
			var newDate = new Date();
			var date = new Array();
			var year = getYears(resentDate);
			// console.log(year[0]);
			var month = getMonths(resentDate,year[0]);
			// console.log(month[0]);
			for (i = 1; i < 4; i++) {
				newDate.setFullYear(year[0],month[0]-1+i,1);
				var x = newDate.Format("yyyy-MM");
				date[3-i] = x.substr(2,6);
		    }
				// console.log(date);
				var years = getYears(date);
				for (i = 0; i < years.length; i++) {
					$('.dropdown-year').append('<li><a href="#" style="text-align: center">' + years[i] +  '年</a></li>');
				}
				$('.dropdown-year li').click(function(e){
					e.preventDefault();
					var selected = $(this).text();
					$('.year-form').text(selected);
					$('.month-form').removeClass("disabled");
					$('.month-form').html('选择月份<span class="caret"></span>');
					dialog.getButton('btn-download').disable();
					var months = getMonths(date, selected);
					$('.dropdown-month').empty();
					for (i = 0; i < months.length; i++) {
						$('.dropdown-month').append('<li><a href="#" style="text-align: center">' + months[i] + '月</a></li>');
					}
					$('.dropdown-month li').click(function(e){
						e.preventDefault();
						var selected = $(this).text();
						$('.month-form').text(selected);
						dialog.getButton('btn-download').enable();
					});
				});


		},
		buttons : [{
			label : '取消',
			cssClass : 'Cancel',
			action : function(dialog) {
				dialog.close();
			}
		}, {
			id : 'btn-download',
			label : '确定',
			cssClass : 'Submit',
			action : function(dialog){
				getDepthData($('#getdepthForm')[0],hpjn,1);
				dialog.close();
			}
		}]
	});
}

function chooseDate(){
	var waitingGIF = '<img src="img/loading.gif" id="loading-indicator" style="display:none" />';

	var formHead = '<form id="getdepthForm" action="/getdepthdata" method="post">';

	var formBody =
		'<div class="row"><div class="col-lg-4 col-lg-offset-4"><label>&#160;&#160;&#160;&#160;&#160;&#160;请选择对应的时间：</label></div></div>' +
		'<div class="row">' +
			'<div class="col-lg-3 col-lg-offset-3"><div class="input-group-btn">' +
				'<button type="button" class="btn dialog btn-default dropdown-toggle year-form" name="year" data-toggle="dropdown" style="width:100%">选择年份<span class="caret"></span></button>' +
				'<ul class="dropdown-menu dropdown-year" style="min-width: 0;width:100%"></ul>' +
			'</div></div>' +
			'<div class="col-lg-3" style="left:0px"><div class="input-group-btn">' +
				'<button type="button" class="btn dialog btn-default dropdown-toggle month-form disabled" name="month" data-toggle="dropdown" style="width:100%">选择月份<span class="caret"></span></button>' +
				'<ul class="dropdown-menu dropdown-month" style="min-width: 0;width:100%"></ul>' +
			'</div></div>' +
		'</div>';


	var dummyInput = '<input type="text" name="date" style="display:none"/>';
	var formTail = '</form>';
	BootstrapDialog.show({
		title : '选择查看时间',
		message : formBody + formHead + dummyInput + formTail + waitingGIF,
		cssClass : 'dialog-border',
		onshown: function(dialog){
			$('#loading-indicator').show();
			dialog.setClosable(false);
			dialog.getButton('btn-download').disable();

			$.ajax({
				url: "http://202.120.38.3:8091/getdate",
				type: "GET",
				data:{harborId:chooseHarbor},
				contentType: false   // tell jQuery not to set contentType
			}).fail(function() {
				alert("未连接到服务器!");
				$('#loading-indicator').hide();
				dialog.setClosable(true);
			}).done(function(date) {
				$('#loading-indicator').hide();
				dialog.setClosable(true);
				// console.log(date);
				var years = getYears(date);
				for (i = 0; i < years.length; i++) {
					$('.dropdown-year').append('<li><a href="#" style="text-align: center">' + years[i] +  '年</a></li>');
				}
				$('.dropdown-year li').click(function(e){
					e.preventDefault();
					var selected = $(this).text();
					$('.year-form').text(selected);
					$('.month-form').removeClass("disabled");
					$('.month-form').html('选择月份<span class="caret"></span>');
					dialog.getButton('btn-download').disable();
					var months = getMonths(date, selected);
					$('.dropdown-month').empty();
					for (i = 0; i < months.length; i++) {
						$('.dropdown-month').append('<li><a href="#" style="text-align: center">' + months[i] + '月</a></li>');
					}
					$('.dropdown-month li').click(function(e){
						e.preventDefault();
						var selected = $(this).text();
						$('.month-form').text(selected);
						dialog.getButton('btn-download').enable();
					});
				});
			})


		},
		buttons : [{
			label : '取消',
			cssClass : 'Cancel',
			action : function(dialog) {
				dialog.close();
			}
		}, {
			id : 'btn-download',
			label : '确定',
			cssClass : 'Submit',
			action : function(dialog){
				getDepthData($('#getdepthForm')[0], hpjn);
				dialog.close();
			}
		}]
	});
}

function futureDate(month) {
    var d = new Date();
    var newMonth = d.getMonth() + month;
    var year = d.getYear();
    d.setFullYear(year,newMonth,1);
    var x = d.Format("yyyy-MM");
    return x.substr(1,5);
}

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function ThreeDShow(){
    $("#map").hide();
    $("#part-warn-level").hide();
    $("#webgl3d").show();
    $("#hud").show();
    $("#plotForTransection1").show();
    $("#plotForTransection2").show();
    // $("#fourD-show").show();
	$("#fourD-view").show();
	// $("#time-contain").show();
	$('#switch').text('二维显示');
	$("#modal-select").hide();
	for(var i = 0; i < 14; i++) {
		$("#rank" + i).hide();
	}
	for(var i = 14; i < 20; i++) {
		$("#rank" + i).show();
	}
	$("#all-show").show(); 
	$("#rank20").hide();
    $("#rank21").hide();
	// ThreeView(depthData);
    // console.log("1");
}

function TwoDShow(){
	if(changepart == 1) {
		 $("#rank20").show();
	    $("#rank21").show();
	    $("#part-warn-level").show();
	}
	$("#all-show").hide();
	$("#webgl3d").hide();
	$("#hud").hide();
	$("#plotForTransection1").hide();
	$("#plotForTransection2").hide();
	$("#fourD-show").hide();
	$("#bar").hide();
	$("#time-contain").hide();
	$("#fourD-view").hide();
	$("#map").show();
	$("#modal-select").show();
	$('#switch').text('三维显示');
	$("#quanjing").show();
	for(var i = 14; i < 20; i++) {
		$("#rank" + i).hide();
	}
	for(var i = 0; i < 13; i++) {
		// console.log($("#ranktext" + i).text());
		if($("#ranktext" + i).text() != 15)
		$("#rank" + i).show();
	} 
	// console.log("0");
}

function switchview() {
	if(switchView==0){
		
		ThreeDShow();
		$("#quanjing").hide();
		switchView=1;
	}else{
		TwoDShow();
		
		switchView=0;
	}
}
function addDepth() {
	// var table = $('#setDepthForm');
	// console.log(level.length);
	// level.push(0);
	// var entry = "";
	// entry += '<div class="row"><div class="col-lg-10 col-lg-offset-1"><div class="input-group">' +
	// 		'<span class="input-group-addon" id="sizing-addon2">' +
	// 			'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>水深' + level.length +
	// 		'</span>' +
	// 		'<input type="text" class="form-control" id="level'+ level.length +'" name="level '+ level.length +'" style="text-align: center">' +
	// 	'</div></div></div>';
	// // console.log(entry)
	// table.append(entry);
	level.push(0);
	$('#setDepthForm #leveld' + level.length).show();
}
function deleteDepth() {
	// var table = $('#setDepthForm');
	// console.log(level.length);
	// level.push(0);
	// var entry = "";
	// entry += '<div class="row"><div class="col-lg-10 col-lg-offset-1"><div class="input-group">' +
	// 		'<span class="input-group-addon" id="sizing-addon2">' +
	// 			'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>水深' + level.length +
	// 		'</span>' +
	// 		'<input type="text" class="form-control" id="level'+ level.length +'" name="level '+ level.length +'" style="text-align: center">' +
	// 	'</div></div></div>';
	// // console.log(entry)
	// table.append(entry);
	$('#setDepthForm #leveld' + level.length).hide();
	level.pop();
}
function setDepthDialog(){
	var formHead = '<form id="setDepthForm" >';

	var depthup =
		'<div class="row" id = "leveld1"><div class="col-lg-10 col-lg-offset-1"><div class="input-group">' +
			'<span class="input-group-addon" id="sizing-addon2">' +
				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>水深上限' +
			'</span>' +
			'<input type="text" class="form-control" id="depthup" name="depthup" style="text-align: center">' +
		'</div></div></div>';

	var depthdown =
		'<div class="row" id = "leveld2"><div class="col-lg-10 col-lg-offset-1"><div class="input-group">' +
			'<span class="input-group-addon" id="sizing-addon2">' +
				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>水深下限' +
			'</span>' +
			'<input type="text" class="form-control" id="depthdown" name="depthdown" style="text-align: center">' +
		'</div></div></div>';

	var depthlevel =
		'<div class="row" id = "leveld3"><div class="col-lg-10 col-lg-offset-1"><div class="input-group">' +
			'<span class="input-group-addon" id="sizing-addon2">' +
				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>层数' +
			'</span>' +
			'<input type="text" class="form-control" id="depthlevel" name="depthlevel" style="text-align: center">' +
		'</div></div></div>';

	var buttom1 =
		'<div class="row"><div class="col-lg-9"></div><div class="col-lg-3 "><button type="button"   class="Cancel" onclick="dividelevel();">均分</button></div>'

	var depth1 =
		'<div class="row" id = "leveld1"><div class="col-lg-10 col-lg-offset-1"><div class="input-group">' +
			'<span class="input-group-addon" id="sizing-addon2">' +
				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>水深1' +
			'</span>' +
			'<input type="text" class="form-control" id="level1" name="level1" style="text-align: center">' +
		'</div></div></div>';

	var depth2 =
		'<div class="row" id = "leveld2"><div class="col-lg-10 col-lg-offset-1"><div class="input-group">' +
			'<span class="input-group-addon" id="sizing-addon2">' +
				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>水深2' +
			'</span>' +
			'<input type="text" class="form-control" id="level2" name="level2" style="text-align: center">' +
		'</div></div></div>';

	var depth3 =
		'<div class="row" id = "leveld3"><div class="col-lg-10 col-lg-offset-1"><div class="input-group">' +
			'<span class="input-group-addon" id="sizing-addon2">' +
				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>水深3' +
			'</span>' +
			'<input type="text" class="form-control" id="level3" name="level3" style="text-align: center">' +
		'</div></div></div>';
	var depth4 =
		'<div class="row" id = "leveld4"><div class="col-lg-10 col-lg-offset-1"><div class="input-group">' +
			'<span class="input-group-addon" id="sizing-addon2">' +
				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>水深4' +
			'</span>' +
			'<input type="text" class="form-control" id="level4" name="level4" style="text-align: center">' +
		'</div></div></div>';
	var depth5 =
		'<div class="row" id = "leveld5"><div class="col-lg-10 col-lg-offset-1"><div class="input-group">' +
			'<span class="input-group-addon" id="sizing-addon2">' +
				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>水深5' +
			'</span>' +
			'<input type="text" class="form-control" id="level5" name="level5" style="text-align: center">' +
		'</div></div></div>';
	var depth6 =
		'<div class="row" id = "leveld6"><div class="col-lg-10 col-lg-offset-1"><div class="input-group">' +
			'<span class="input-group-addon" id="sizing-addon2">' +
				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>水深6' +
			'</span>' +
			'<input type="text" class="form-control" id="level6" name="level6" style="text-align: center">' +
		'</div></div></div>';
	var depth7 =
		'<div class="row" id = "leveld7"><div class="col-lg-10 col-lg-offset-1"><div class="input-group">' +
			'<span class="input-group-addon" id="sizing-addon2">' +
				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>水深7' +
			'</span>' +
			'<input type="text" class="form-control" id="level7" name="level7" style="text-align: center">' +
		'</div></div></div>';
	var depth8 =
		'<div class="row" id = "leveld8" ><div class="col-lg-10 col-lg-offset-1"><div class="input-group">' +
			'<span class="input-group-addon" id="sizing-addon2">' +
				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>水深8' +
			'</span>' +
			'<input type="text" class="form-control" id="level8" name="level8" style="text-align: center">' +
		'</div></div></div>';
	var depth9 =
		'<div class="row" id = "leveld9"><div class="col-lg-10 col-lg-offset-1"><div class="input-group">' +
			'<span class="input-group-addon" id="sizing-addon2">' +
				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>水深9' +
			'</span>' +
			'<input type="text" class="form-control" id="level9" name="level9" style="text-align: center">' +
		'</div></div></div>';
	var depth10 =
		'<div class="row" id = "leveld10"><div class="col-lg-10 col-lg-offset-1"><div class="input-group">' +
			'<span class="input-group-addon" id="sizing-addon2">' +
				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>水深10' +
			'</span>' +
			'<input type="text" class="form-control" id="level10" name="level10" style="text-align: center">' +
		'</div></div></div>';
	var buttom2 =
		'<div class="row"><div class="col-lg-7"></div><div class="col-lg-4 col-lg-offset-1"><button type="button"   class="Cancel" onclick="addDepth();">添加</button><button type="button"   class="Cancel" onclick="deleteDepth();">删除</button></div></div>'
	var formTail = '</form>';
	BootstrapDialog.show({
		title :'设置水深信息',
		message : formHead + depthup + depthdown + depthlevel + buttom1 + depth1 + depth2 + depth3 + depth4 + depth5 +depth6 + depth7 + depth8 + depth9 + depth10 +buttom2 + formTail,
		cssClass : 'setdepth-dialog',
		onshown: function(dialog){
			for(var i = 0; i < 10; i++) $('#setDepthForm #leveld' + (i + 1)).hide();
			var l = level.length;
			for(var i = 0; i < l; i++) {
				$('#setDepthForm #leveld' + (i + 1)).show();
				$('#setDepthForm #level' + (i + 1)).val(getRideOfNullAndEmpty(level[i]));
			}

		},
		buttons : [{
			label : '取消',
			cssClass : 'Cancel',
			action : function(dialog) {
				dialog.close();
			}
		}, 
		
			{
			label : '提交',
			cssClass : 'Submit',
			action : function(dialog){
				var l = level.length;
				for(var i = 0; i < l; i++) {
					level[i] = $('#setDepthForm #level' + (i + 1)).val();
				}
				setDepthLevel($('#setDepthForm')[0]);
				dialog.close();
			}
		}]
	});
}

function setWarningDialog() {
var formHead = '<form id="setWarningForm" >';

	var depth1 =
		'<p><div class="row"><div class="col-lg-10 col-lg-offset-1"><div class="input-group">' +
			'<span class="input-group-addon" id="sizing-addon2">' +
				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>红色预警水深(m)' +
			'</span>' +
			'<input type="text" class="form-control" id="level1" name="level1" style="text-align: center">' +
		'</div></div></div></p>';

	var depth2 =
		'<p><div class="row"><div class="col-lg-10 col-lg-offset-1"><div class="input-group">' +
			'<span class="input-group-addon" id="sizing-addon2">' +
				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>黄色预警水深(m)' +
			'</span>' +
			'<input type="text" class="form-control" id="level2" name="level2" style="text-align: center">' +
		'</div></div></div></p>';
	var depth3 =
		'<p><div class="row"><div class="col-lg-10 col-lg-offset-1"><div class="input-group">' +
			'<span class="input-group-addon" id="sizing-addon2">' +
				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>红色预警方量(m³)' +
			'</span>' +
			'<input type="text" class="form-control" id="level3" name="level3" style="text-align: center">' +
		'</div></div></div></p>';
	var depth4 =
		'<p><div class="row"><div class="col-lg-10 col-lg-offset-1"><div class="input-group">' +
			'<span class="input-group-addon" id="sizing-addon2">' +
				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>黄色预警方量(m³)' +
			'</span>' +
			'<input type="text" class="form-control" id="level4" name="level4" style="text-align: center">' +
		'</div></div></div></p>';


	var formTail = '</form>';
	BootstrapDialog.show({
		title :'设置预警信息',
		message : formHead + depth1 + depth2 + depth3 + depth4 + formTail,
		cssClass : 'setdepth-dialog',
		onshown: function(dialog){
			// console.log(warnlevel[0])
			$('#setWarningForm #level1').val(getRideOfNullAndEmpty(warnlevel[0]));
 	 	    $('#setWarningForm #level2').val(getRideOfNullAndEmpty(warnlevel[1]));
 	 	    $('#setWarningForm #level3').val(getRideOfNullAndEmpty(warnlevel[2]));
 	 	    $('#setWarningForm #level4').val(getRideOfNullAndEmpty(warnlevel[3]));

		},
		buttons : [{
			label : '取消',
			cssClass : 'Cancel',
			action : function(dialog) {
				dialog.close();
			}
		}, {
			label : '提交',
			cssClass : 'Submit',
			action : function(dialog){
				setWarningLevel($('#setWarningForm')[0]);
				dialog.close();
			}
		}]
	});
}

function setWarningLevel(thisform) {
	with(thisform){
		// console.log(level1.value + "," + level2.value +"," +level3.value);
		console.log(level2.value);
		$.ajax({
			url: "http://202.120.38.3:8091/setwarninglevel",
			type:"POST",
			data:{userId:sessionStorage.userId, harborId:chooseHarbor, 
				redWarning: level1.value, yellowWarning: level2.value, redWarning2: level3.value, yellowWarning2: level4.value}
		}).fail(function(){
			alert("未连接到服务器");
		}).done(function(data){
			// console.log(data);
			// console.log('6');
			getWarningLevel(1);
			// console.log(level[1])
			// AddFaces(depthData,level[0],level[1],level[2]);
		})
	}
}

function getWarningLevel(n) {
	 n = typeof n !== 'undefined' ? n : 0;
	$.ajax({
		url: "http://202.120.38.3:8091/getwarninglevel",
		type:"GET",
		data:{userId:sessionStorage.userId, harborId:chooseHarbor}
	}).fail(function(){
		alert("未连接到服务器");
	}).done(function(data){
		console.log(data);
		if(data.length != 0) {
			warnlevel[0] = data.redWarning;
			warnlevel[1] = data.yellowWarning;
			warnlevel[2] = data.redWarning2;
			warnlevel[3] = data.yellowWarning2;
			if(n == 1) {
				waring(2);
				// ReflashWarn(depthData, warnlevel[0], warnlevel[1], warnlevel[2])
			}
			
		}
		else{
			// console.log("!");
		}
		
	})
}

function EarthWorkDialog(){
	var checkValue = (chooseHarbor-1)*7+6;
	if(sessionStorage.privilege[checkValue]=="Y"||sessionStorage.privilege=="admin") {
	var formHead = ' <form id="earth-work-form">';

	var earthWorkDepth = '<div class="row"><div class="col-lg-10 col-lg-offset-1"><div class="input-group">' +
			'<span class="input-group-addon" id="sizing-addon2">' +
				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>预留水深' +
			'</span>' +
			'<input type="text" class="form-control" id="earthWorkDepth" name="level2" style="text-align: center">' +
		'</div></div></div>';
    var result = '<div class="row earth-work" style="display:none;"><div class="col-lg-10 col-lg-offset-1">'+
                 '<div class="input-group"><span class="input-group-addon " >'+
                 '<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>土方量值'+
            '</span><input type = "text" class = "form-control" id="earthWork" disabled = "true" name = "earthWork" style="text-align: center">'+
            '</div></div></div>';

    var formTail = '</form>';
	BootstrapDialog.show({
		title :'土方计算',
		message : formHead + earthWorkDepth + result + formTail,
		cssClass : 'earthwork-dialog',
		onshown: function(dialog){
			 $('#earth-work-form #learthWorkDepth').val("");
    		 $('#earth-work-form .earth-work').hide();
		},
		buttons : [{
			label : '取消',
			cssClass : 'Cancel',
			action : function(dialog) {
				dialog.close();
			}
		}, {
			label : '计算',
			cssClass : 'Submit',
			action : function(dialog){
				returnEarthWork($('#earth-work-form')[0]);
			}
		}]
	});
	}
else {
	// console.log("1");
	}
}

function returnEarthWork(thisform) {
	with(thisform){
		// console.log(depthData)
			waigaoqiao4Defult();
			console.log(waiButtom4.length);
			caculateEarthWork = getEarthWork(depthData, 30, 0, 0.5, 11.5, waiButtom4);
			// console.log(caculateEarthWork);
			// console.log(earthWorkDepth.value);
			$(".earth-work").css("display", "block");
			$("#earth-work-form #earthWork").val(caculateEarthWork+'m³');

	}
	
}

function getDepthLevel(n) {
	n = typeof n !== 'undefined' ? n : 0;
   	    $.ajax({
				url: "http://202.120.38.3:8091/getdepthlevel",
				type: "GET",
				cache:false,
				data:{userId:sessionStorage.userId, harborId:chooseHarbor},
				contentType: false   // tell jQuery not to set contentType
			}).fail(function() {
				alert("未连接到服务器");
			}).done(function(data) {
				console.log(data)
				level = [];
				for(var i=0;i<data.length;i++){
					if(data[i]!=null){
					// alert("未设置分界");
					level.push(data[i]);
					// console.log(data[i])
					// console.log(level[i])
				};
			};
		
			
			// // console.log(depthdata2);
			// for (var i = 0 ; i < depthdata2.length; i++) {
			// 	depthData.push(depthdata2[i]);
			// }
			// // console.log(level);
			if (n == 1) {
			   //  if(g_iDepthStylePos.length!=0) {
      //   		for (var i = 0; i < g_iDepthStylePos.length; ++ i){
      //   	   var del = API_DelLayerByPos(g_iDepthStylePos[0]);
      //   	   console.log(del);
      //       // for(var j=0; j<del; ++j){
      //       //     API_DelObjectByPos(g_iDepthStylePos[i],0);
      //       //     // console.log(j);
      //       }
      // 		     API_ReDrawLayer
    		// }
   				deleteFaces();
				AddFaces(depthData,level, warnlevel[0],  warnlevel[1],  warnlevel[2]);
				AddPoints(depthData,level[0],level[1],level[2]);
				ThreeView(depthData, level[2]);
				if (switchView == 0) {
			$("#webgl3d").hide();
			$("#hud").hide();
			}
			}
			
			// AddPoints(depthdata2,level[0],level[1],level[2]);
			})	
			
}

function depthLevelShow() {

}

function deleteFaces() {
   
	// console.log(faceLayerPos);

  	var del = API_DelLayerByPos(faceLayerPos);
  	while(del == true) {
  		del = API_DelLayerByPos(faceLayerPos)
  	}
  	// console.log(faceLayerPos);
  	// faceLayerPos = 100;
    console.log(del);
    API_ReDrawLayer();
}

function setDepthLevel(thisform) {
	var leveltext = "";
	leveltext += level1.value;
	// console.log(level6.value);
	for(var i = 0; i < level.length - 1; i++) {
		leveltext +=',';
		leveltext += level[i + 1];
	}
	console.log(leveltext);
	with(thisform){
		// console.log(level1.value + "," + level2.value +"," +level3.value);
		// console.log(sessionStorage.userId);
		$.ajax({
			url: "http://202.120.38.3:8091/setdepthlevel",
			type:"POST",
			data:{userId:sessionStorage.userId, harborId:chooseHarbor, depthLevel:leveltext}
		}).fail(function(){
			alert("未连接到服务器");
		}).done(function(data){
			// console.log(data);
			getDepthLevel(1);

		})
	}
	
}


function center(){
	var center = API_GetCurMapCenterLonLatPo();
	// console.log(center);
	// console.log(3/2);
}

function loading(){
	return false;
}
function loadingOk(){
	return true;
}
function loaddisable(){
	$("#loadingModal").modal({backdrop:"static"})
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

function dataDelete() {
	var waitingGIF = '<img src="img/loading.gif" id="loading-indicator" style="display:none" />';

	var formHead = '<form id="dataDeleteForm" action="/deleteharbor" method="post">';

	var formBody =
		'<div class="row"><div class="col-lg-5 col-md-offset-4"><label>请选择删除的港口和时间：</label></div></div>' +
		'<div class="row">' +
		'<div class="col-lg-3 col-md-offset-1" style="left:0px"><div class="input-group-btn">'+
			'<button type="button" class="btn dialog btn-default dropdown-toggle harbor-form" name="harbor" data-toggle="dropdown" style="width:100%">选择港口<span class="caret"></span></button>' +
		'<ul class="dropdown-menu dropdown-harbor" style="min-width: 0;width:100%"></ul></div></div>'+
			'<div class="col-lg-3 "><div class="input-group-btn">' +
				'<button type="button" class="btn  dropdown-toggle dialog year-form disabled" name="year" data-toggle="dropdown" style="width:100%">选择年份<span class="caret"></span></button>' +
				'<ul class="dropdown-menu dropdown-year" style="min-width: 0;width:100%"></ul>' +
			'</div></div>' +
			'<div class="col-lg-3 " style="right:0px"><div class="input-group-btn">' +
				'<button type="button" class="btn dialog btn-default dropdown-toggle dialog month-form disabled" name="month" data-toggle="dropdown" style="width:100%">选择月份<span class="caret"></span></button>' +
				'<ul class="dropdown-menu dropdown-month" style="min-width: 0;width:100%"></ul>' +
			'</div></div>' +
			
		'</div>';


	var dummyInput = '<input type="text" name="date" style="display:none"/>';
	var userIdInput = '<input type="text" name="userId" style="display:none"/>';
	var harborIdInput = '<input type="text" name="harborId" style="display:none"/>';
	var formTail = '</form>';
	BootstrapDialog.show({
		title : '删除水深数据',
		message : formBody + formHead + dummyInput + userIdInput + harborIdInput + formTail + waitingGIF,
		cssClass : 'download-dialog',
		onshown: function(dialog){
		
			dialog.getButton('btn-delete').disable();
								// console.log(i);
			$('.dropdown-harbor').append('<li><a href="#" style="text-align: center">' + harborTitle[1] +  '</a></li>');
			$('.dropdown-harbor').append('<li><a href="#" style="text-align: center">' + harborTitle[2] +  '</a></li>');
			$('.dropdown-harbor').append('<li><a href="#" style="text-align: center">' + harborTitle[3] +  '</a></li>');
			$('.dropdown-harbor').append('<li><a href="#" style="text-align: center">' + harborTitle[4] +  '</a></li>');
			$('.dropdown-harbor').append('<li><a href="#" style="text-align: center">' + harborTitle[5] +  '</a></li>');
			$('.dropdown-harbor').append('<li><a href="#" style="text-align: center">' + harborTitle[6] +  '</a></li>');
			// for (i = 0; i < harborTitle.length-2; i++){				
			// 	if(sessionStorage.privilege[3+7*i]=="Y"||sessionStorage.privilege=='admin'){
			// 		$('.dropdown-harbor').append('<li><a href="#" style="text-align: center">' + harborTitle[i+1] +  '</a></li>');
			// 	}
			// }
			$('.dropdown-harbor li').click(function(e){
				e.preventDefault();
				var selected = $(this).text();
				$('.harbor-form').text(selected);
				for(i = 0; i < harborTitle.length-1; i++) {
					if (selected == harborTitle[i+1]){
						loadId = i+1;
						$('#loading-indicator').show();
						dialog.setClosable(false);
					$.ajax({
							url: "http://202.120.38.3:8091/getdate",
							type: "GET",
							data:{harborId:loadId},
							contentType: false   // tell jQuery not to set contentType
						}).fail(function() {
							alert("未连接到服务器!");
							dialog.setClosable(true);
							$('#loading-indicator').hide();
						}).done(function(date) {
							$('#loading-indicator').hide();
							dialog.setClosable(true);	
							// console.log(date);
							var years = getYears(date);
							$('.dropdown-year').empty();
							$('.dropdown-month').empty();
							$('.year-form').removeClass("disabled");
							$('.year-form').html('选择年份<span class="caret"></span>');
							$('.month-form').html('选择月份<span class="caret"></span>');
							for (i = 0; i < years.length; i++) {
								$('.dropdown-year').append('<li><a href="#" style="text-align: center">' + years[i] +  '年</a></li>');
							}
							$('.dropdown-year li').click(function(e){
								e.preventDefault();
								var selected = $(this).text();
								$('.year-form').text(selected);
								$('.month-form').removeClass("disabled");
								$('.month-form').html('选择月份<span class="caret"></span>');
								dialog.getButton('btn-delete').disable();
								var months = getMonths(date, selected);
								$('.dropdown-month').empty();
								for (i = 0; i < months.length; i++) {
									$('.dropdown-month').append('<li><a href="#" style="text-align: center">' + months[i] + '月</a></li>');
								}
								$('.dropdown-month li').click(function(e){
									e.preventDefault();
									var selected = $(this).text();
									$('.month-form').text(selected);
										dialog.getButton('btn-delete').enable();			
								});
							});
						})
					}
					
				}
				 
			});
			


		},
		buttons : [{
			label : '取消',
			cssClass : 'Cancel',
			action : function(dialog) {
				dialog.close();
			}
		}, {
			id : 'btn-delete',
			label : '删除',
			cssClass : 'Submit',
			action : function(dialog){
				dataDeleteHandler($('#dataDeleteForm')[0]);
				// dialog.close();
			}
		}]
	});
}

function dataDeleteHandler() {
	var year = $('.year-form').text();
	var month = $('.month-form').text();
	var date = year.substr(2, 2) + "-" + month.substr(0, 2);
		$('#loadingModal').modal('show');
		$.ajax({
			url: "http://202.120.38.3:8091/deleteharbor",
			type:"POST",
			data:{date:date , harborId:loadId}
		}).fail(function(){
			$('#loadingModal').modal('hide');
			alert("未连接到服务器！");
			
		}).done(function(data){
			$('#loadingModal').modal('hide');
			alert("数据删除成功！");
		})
}

function dataBackup() {
	var waitingGIF = '<img src="img/loading.gif" id="loading-indicator" style="display:none" />';

	var formHead = '<form id="dataBackupForm" action="/backup" method="post">';

	var formBody =
		'<div class="row"><div class="col-lg-12"><label>请选择备份地址：</label></div></div>' +
		'<div class="row">' +
			'<div class="col-lg-12" style="right:0px"><div class="input-group-btn">' +
				'<button type="button" class="btn dialog btn-default dropdown-toggle backup-form" name="backup" data-toggle="dropdown" style="width:100%">选择地址<span class="caret"></span></button>' +
				'<ul class="dropdown-menu dropdown-backup" style="min-width: 0;width:100%"></ul>' +
			'</div></div>' +
			
		'</div>';
	var formTail = '</form>';
	BootstrapDialog.show({
		title : '备份数据',
		message : formBody + formHead + formTail + waitingGIF,
		cssClass : 'backup-dialog',
		onshown: function(dialog){
		
			dialog.getButton('btn-backup').disable();
								// console.log(i);
			$('.dropdown-backup').append('<li><a href="#" style="text-align: center">' + backupDevice[0] +  '</a></li>');
			// for (i = 0; i < harborTitle.length-2; i++){				
			// 	if(sessionStorage.privilege[3+7*i]=="Y"||sessionStorage.privilege=='admin'){
			// 		$('.dropdown-harbor').append('<li><a href="#" style="text-align: center">' + harborTitle[i+1] +  '</a></li>');
			// 	}
			// }
			$('.dropdown-backup li').click(function(e){
				e.preventDefault();
				var selected = $(this).text();
				$('.backup-form').text(selected);
				for(i = 0; i < backupDevice.length; i++) {
					if (selected == backupDevice[i]){
						loadId = i+1;
						dialog.getButton('btn-backup').enable();
					}
					
				}
				 
			});
			


		},
		buttons : [{
			label : '取消',
			cssClass : 'Cancel',
			action : function(dialog) {
				dialog.close();
			}
		}, {
			id : 'btn-backup',
			label : '备份',
			cssClass : 'Submit',
			action : function(dialog){
				dataBackupHandler($('#dataBackupForm')[0]);
				// dialog.close();
			}
		}]
	});
}

function dataBackupHandler() {
	// console.log('backup');
		$('#loadingModal').modal('show');
		$.ajax({
			url: "http://202.120.38.3:8091/backup",
			type:"POST",
			data:{deviceId:loadId}
		}).fail(function(){
			$('#loadingModal').modal('hide');
			alert("未连接到服务器！");
			
		}).done(function(data){
			$('#loadingModal').modal('hide');
			alert("数据备份成功！");
		})
}

function sleep(sleepTime) {
       for(var start = Date.now(); Date.now() - start <= sleepTime; ) { } 
}

function fourViewDialog() {

	var waitingGIF = '<img src="img/loading.gif" id="loading-indicator" style="display:none" />';

	var formHead = '<form id="getfourDForm" action="/getdepthdata" method="post">';

	var formBody =
		'<div class="row"><div class="col-lg-6 col-lg-offset-2"><label class="pull-right">请选择对应的开始时间和结束时间：</label></div></div>' +
		'<div class="row">' +
			'<div class="col-lg-3"><div class="input-group-btn">' +
				'<button type="button" class="btn dialog btn-default dropdown-toggle year1-form" name="year" data-toggle="dropdown" style="width:100%">选择年份<span class="caret"></span></button>' +
				'<ul class="dropdown-menu dropdown-year1" style="min-width: 0;width:100%"></ul>' +
			'</div></div>' +
			'<div class="col-lg-3" style="left:0px"><div class="input-group-btn">' +
				'<button type="button" class="btn dialog btn-default dropdown-toggle month1-form disabled" name="month" data-toggle="dropdown" style="width:100%">选择月份<span class="caret"></span></button>' +
				'<ul class="dropdown-menu dropdown-month1" style="min-width: 0;width:100%"></ul>' +

			'</div>'+

			'</div>' +
			'<div class="col-lg-3"><div class="input-group-btn">' +
				'<button type="button" class="btn dialog btn-default dropdown-toggle year2-form disabled" name="year" data-toggle="dropdown" style="width:100%">选择年份<span class="caret"></span></button>' +
				'<ul class="dropdown-menu dropdown-year2" style="min-width: 0;width:100%"></ul>' +
			'</div></div>' +
			'<div class="col-lg-3" style="left:0px"><div class="input-group-btn">' +
				'<button type="button" class="btn dialog btn-default dropdown-toggle month2-form disabled" name="month" data-toggle="dropdown" style="width:100%">选择月份<span class="caret"></span></button>' +
				'<ul class="dropdown-menu dropdown-month2" style="min-width: 0;width:100%"></ul>' +

			'</div>'+
			
			'</div>' +
		'</div>';


	var dummyInput = '<input type="text" name="date" style="display:none"/>';
	var formTail = '</form>';
	BootstrapDialog.show({
		title : '选择查看时间',
		message : formBody + formHead + dummyInput + formTail + waitingGIF,
		cssClass : 'dialog-border',
		onshown: function(dialog){
			$('#loading-indicator').show();
			dialog.setClosable(false);
			dialog.getButton('btn-download').disable();

			$.ajax({
				url: "http://202.120.38.3:8091/getdate",
				type: "GET",
				data:{harborId:chooseHarbor},
				contentType: false   // tell jQuery not to set contentType
			}).fail(function() {
				alert("未连接到服务器!");
				$('#loading-indicator').hide();
				dialog.setClosable(true);
			}).done(function(date) {
				$('#loading-indicator').hide();
				if(date.length == 1) {
					alert("数据不足，无法显示四维动画")
				}
				else {
					// var fyear = getYears(resentDate);
					// // console.log(year[0]);
					// var fmonth = getMonths(resentDate,fyear[0]);
					// // console.log(month[0]);
					// var fdate = [];
					// for (i = 1; i < 4; i++) {
					// 	newDate.setFullYear(fyear[0],fmonth[0]-1+i,1);
					// 	var x = newDate.Format("yyyy-MM");
					// 	fdate[3-i] = x.substr(2,6);
		   // 			 }
					// dialog.setClosable(true);
					// for(var i = 0; i < date.length; i++) {
					// 	fdate.push(date[i]);
					// }
					// date = [];
					// date = fdate;
				// console.log(date);
				var years = getYears(date);
				for (var i = 0; i < years.length; i++) {
					$('.dropdown-year1').append('<li><a href="#" style="text-align: center">' + years[i] +  '年</a></li>');
				}
				$('.dropdown-year1 li').click(function(e){
					e.preventDefault();
					var selected = $(this).text();
					var beginYear = $(this).text()
					$('.year1-form').text(selected);
					$('.month1-form').removeClass("disabled");
					$('.month1-form').html('选择月份<span class="caret"></span>');
					// dialog.getButton('btn-download').disable();
					var months = getMonths(date, selected);
					$('.dropdown-month1').empty();
					for (i = 0; i < months.length; i++) {
						$('.dropdown-month1').append('<li><a href="#" style="text-align: center">' + months[i] + '月</a></li>');
					}
					$('.dropdown-month1 li').click(function(e){
						e.preventDefault();
						var selected = $(this).text();
						$('.month1-form').text(selected);
						$('.year2-form').removeClass("disabled");
						var beginMonth = $(this).text();
						// console.log(finalYear);
						var date2 = beginYear.substr(2, 2) + "-" + beginMonth.substr(0, 2);
				var beginDate = 0;
				var finalDate = 0;
				// console.log(date2)
				for(var i = 0; i < date.length; i++) {
					if(date[i] == date2) {
						beginDate = i;
						// console.log(i);
					} 
				
				}
				// console.log(finalYear);
				var date3 = [];
				for (var i = 0; i < beginDate ; i++) date3.push(date[i]);
					console.log(date3)
				var years = getYears(date3);
				$('.dropdown-year2').empty();
				for (var i = 0; i < years.length; i++) {
					$('.dropdown-year2').append('<li><a href="#" style="text-align: center">' + years[i] +  '年</a></li>');
				}
				$('.dropdown-year2 li').click(function(e){
					e.preventDefault();
					var selected = $(this).text();
					var finalYear = $(this).text();
					$('.year2-form').text(selected);
					$('.month2-form').removeClass("disabled");
					$('.month2-form').html('选择月份<span class="caret"></span>');
					dialog.getButton('btn-download').disable();
					var months = getMonths(date3, selected);
					$('.dropdown-month2').empty();
					for (var i = 0; i < months.length; i++) {
						$('.dropdown-month2').append('<li><a href="#" style="text-align: center">' + months[i] + '月</a></li>');
					}
					$('.dropdown-month2 li').click(function(e){
						e.preventDefault();
						var selected = $(this).text();
						var finalMonth = $(this).text();
						$('.month2-form').text(selected);
						dialog.getButton('btn-download').enable();
						var date4 = finalYear.substr(2, 2) + "-" + finalMonth.substr(0, 2);
						for(var i = 0; i < date.length; i++) {
							if(date[i] == date4) finalDate = i;
							
						// console.log(i);
					} 
					dates = [];
					for (var i = finalDate; i < beginDate + 1; i ++) dates.push(date[i]);
					});
				});
	
					});
				});
				}
				

				
		
			})


		},
		buttons : [{
			label : '取消',
			cssClass : 'Cancel',
			action : function(dialog) {
				dialog.close();
			}
		}, {
			id : 'btn-download',
			label : '确定',
			cssClass : 'Submit',
			action : function(dialog){
			$("#fourD-show").show();
			$("#time-contain").show();
			$("#bar-contain").show();
				getfourData(dates, hpjn);
				dialog.close();
			}
		}]
	});
}

function getfourData(date, n) {
	n = typeof n !== 'undefined' ? n : 0;
	dates = [];
	times = [];
	$('#loadingModal').modal('show');
	for (var i = date.length - 1; i > 0; i--) {
		var x = (date[i -1].substr(0, 2) - date[i].substr(0, 2))*12 + (date[i - 1].substr(3, 2) - date[i].substr(3, 2));
		times.push(x);
		// console.log(x);
	}
	// console.log(times);
	for (var i = 0; i < date.length; i++) {
		$.ajax({
			url: "http://202.120.38.3:8091/getdepthdata",
			type:"GET",
			data:{date:date[date.length - i - 1] , harborId:chooseHarbor + n}
		}).fail(function(){
			$('#loadingModal').modal('hide');
			// if(f == 1){
			// 	alert("历史数据不足，无法预测！");
			// }
			// else{
				
			// }
			alert("未连接到服务器！");
			
		}).done(function(data){
			for (var i = 0; i < data.length; i++) {
       			data[i][0] = data[i][0]*10000000;
       			data[i][1] = data[i][1]*10000000;
    		}
    		// console.log(data.length);
			datas.push(data);
		})
	}
	// draw4D(datas, times);
	$('#loadingModal').modal('hide');
}

function fourDshow() {

	if(datas.length == 0) {
		alert("请选择时间");
	}
	else {
		var duringTime = document.getElementById("four-time").value;
		duringTime = duringTime !== '' ? duringTime : 5;
		// console.log(duringTime);
		duringTime = duringTime * 1000;
		draw4D(datas, times, duringTime);
	}
	
}

function preWarning() {
	for (var i = 0; i < 5; ++i) {
		if (sessionStorage.warningStatus[i] == "r") {
		document.getElementById(warnHarbor[i]).src="img/red.png";
		}else if(sessionStorage.warningStatus[i] == "y") {
			document.getElementById(warnHarbor[i]).src="img/yellow.png";
		}
		else {

		}

	}
}

function setWarningStatus() {
	// console.log(warningStatusNow);
	$.ajax({
				url: "http://202.120.38.3:8091/setwarningstatus",
				type: "POST",
				data:{userId:sessionStorage.userId, warningStatus: warningStatusNow},
				// contentType: false   // tell jQuery not to set contentType
			}).fail(function() {
				alert("未连接到服务器");
			}).done(function() {
			})
}

function replacePart(text, s,r){
	return text.slice(0,s)+r+text.slice(s+1);
}

function run(){  
        var bar = document.getElementById("bar"); 
        // var total = document.getElementById("total"); 
    	bar.style.width=parseInt(bar.style.width) + 1 + "%";  
    	// total.innerHTML = bar.style.width; 
    	if(bar.style.width == "100%"){  
     		window.clearTimeout(timeout); 
      	return; 
    } 
    var timeout=window.setTimeout("run()",fourTime); 
} 

// function setButtomDialog() {

// 	var formHead = '<form id="setDepthForm" >';

// 	var coor1 =
// 		'<div class="row"><div class="col-lg-7 col-lg-offset-1"><div class="input-group">' +
// 			'<span class="input-group-addon" id="sizing-addon2">' +
// 				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>水深上限' +
// 			'</span>' +
// 			'<input type="text" class="form-control" id="level1" name="level1" style="text-align: center">' +
// 		'</div></div></div>';

// 	var coor2 =
// 		'<div class="row"><div class="col-lg-7 col-lg-offset-1"><div class="input-group">' +
// 			'<span class="input-group-addon" id="sizing-addon2">' +
// 				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>水深下限' +
// 			'</span>' +
// 			'<input type="text" class="form-control" id="level3" name="level3" style="text-align: center">' +
// 		'</div></div></div>';

// 	var coor3 =
// 		'<div class="row"><div class="col-lg-7 col-lg-offset-1"><div class="input-group">' +
// 			'<span class="input-group-addon" id="sizing-addon2">' +
// 				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>水深下限' +
// 			'</span>' +
// 			'<input type="text" class="form-control" id="level3" name="level3" style="text-align: center">' +
// 		'</div></div></div>';

// 	var coor4 =
// 		'<div class="row"><div class="col-lg-7 col-lg-offset-1"><div class="input-group">' +
// 			'<span class="input-group-addon" id="sizing-addon2">' +
// 				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>水深下限' +
// 			'</span>' +
// 			'<input type="text" class="form-control" id="level3" name="level3" style="text-align: center">' +
// 		'</div></div></div>';	

// 	var depth =
// 		'<div class="row"><div class="col-lg-7 col-lg-offset-1"><div class="input-group">' +
// 			'<span class="input-group-addon" id="sizing-addon2">' +
// 				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>层数' +
// 			'</span>' +
// 			'<input type="text" class="form-control" id="level2" name="level2" style="text-align: center">' +
// 		'</div></div></div>';

// 	var formTail = '</form>';
// 	BootstrapDialog.show({
// 		title :'设置水深信息',
// 		message : formHead + depth1 + depth2 + depth3 + formTail,
// 		cssClass : 'setbuttom-dialog',
// 		onshown: function(dialog){
// 			$('#setDepthForm #level1').val(getRideOfNullAndEmpty(level[0]));
//  	 	    $('#setDepthForm #level2').val(getRideOfNullAndEmpty(level[1]));
//   		    $('#setDepthForm #level3').val(getRideOfNullAndEmpty(level[2]));

// 		},
// 		buttons : [{
// 			label : '取消',
// 			action : function(dialog) {
// 				dialog.close();
// 			}
// 		}, {
// 			label : '提交',
// 			cssClass : 'btn-primary',
// 			action : function(dialog){
// 				setDepthLevel($('#setDepthForm')[0]);
// 				dialog.close();
// 			}
// 		}]
// 	});
// }

