function pfullView() {
	dredging_area = "";
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
	InitLoadParam();
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
			deleteFaces();
			getWarningLevel();
			getDepthLevel();
			getRecentDate();
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
	$("monitor").show();
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
    $("#xianshi").click();
	InitLoadParam();
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
	
	deleteFaces();
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
			API_SetMapViewCenter(122.24250827924453, 30.556957174180525, 40000);
			getWarningLevel();
			getDepthLevel();
			getRecentDate();
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
    $("#xianshi").click();
	InitLoadParam();


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
    $("#xianshi").click();
	InitLoadParam();
}

function pchooseHuangpujiang(n) {
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
        $("#xianshi").click();
		InitLoadParam();
}