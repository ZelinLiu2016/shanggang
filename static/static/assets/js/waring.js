
$(document).ready(function(){
	// waring(0);
})
// var warnPointLayerId = [15000, 15001,15002,15003,15004,15005,15006,15007,15008];
// var warnPointStylePos = [];
// var warnLayerPoint = [];
var faceLayerPos3 = 678

var warnLayer = [];
var switchRed =0;
var warnHarbor = ["waigaoqiao_waring1", "waigaoqiao_waring2", "yangshan_waring1",
"yangshan_waring2","luojing_waring","huangpujiang_waring"]
function waring(level){
	if(level==0){
		redAlert();
	}
	else if(level == 1){
		yellowAlert();
	}
	else {
		greenAlert();
	}
}

function redAlert(){

		document.getElementById(warnHarbor[chooseHarbor - 1]).src="img/red.png";

	
}

function yellowAlert(){
		document.getElementById(warnHarbor[chooseHarbor - 1]).src="img/yellow.png";
}

function greenAlert(){
		document.getElementById(warnHarbor[chooseHarbor - 1]).src="img/green.png";
}

function warnPoint(wdata, surface, harbor){
	var wXMax = 0;
	var wXMin = 20000000000;
	var wYMax = 0;
	var wYMin = 20000000000;
	
	
	if (harbor == 6) {
	var wl = surface.surface.length
	wl = Math.ceil(wl/2);
	// console.log(surface.surface[0]);
	var wx1 = wdata[surface.surface[wl]][0]
	var wx2 = wdata[surface.surface[wl+1]][0]
	var wx3 = wdata[surface.surface[wl+2]][0]
	var wy1 = wdata[surface.surface[wl]][1]
	var wy2 = wdata[surface.surface[wl+1]][1]
	var wy3 = wdata[surface.surface[wl+2]][1]
	var wX = (wx1 + wx2 + wx3) / 3;
	var wY = (wy1 + wy2 + wy3) / 3;
	}
	else {
		if(surface.surface.length > 10){
		for(var i = 0; i < surface.surface.length; i++){
		if(wdata[surface.surface[i]][1] < wYMin){
			wYMin = wdata[surface.surface[i]][1];
			// console.log('1');
		}
		if(wdata[surface.surface[i]][1] > wYMax){
			wYMax = wdata[surface.surface[i]][1];
		}
		if(wdata[surface.surface[i]][0] < wXMin){
			wXMin = wdata[surface.surface[i]][0];
		}
		if(wdata[surface.surface[i]][0] > wXMax){
			wXMax = wdata[surface.surface[i]][0];
		}
	}
	}
		var wX = (wXMax + wXMin)/2;
		var wY = (wYMax + wYMin)/2;
	}
	
	var WPoint = new Object();
	WPoint[0] = wX;
	WPoint[1] = wY;
	// console.log(WPoint);
	return WPoint;
}

function AddWarnPoints(data) {
	// h1 = typeof h1 !== 'undefined' ? h1 : 10;
 //    h2 = typeof h2 !== 'undefined' ? h2 : 11;
	// console.log(data);
	var dapWarn = [];
	for (var i = 0; i < data.length; i++) {
		dapWarn.push(data[i]);
	}
	 // for (var i = 0; i < dapWarn.length; i++) {
  //       dapWarn[i][0] *= 10000000;
  //       dapWarn[i][1] *= 10000000;
  //   }
	AddWarnPointLayers();
	for (var i=0; i < warnPointLayerId.length;i++){
		warnLayerPoint[i] = API_GetLayerPosById(warnPointLayerId[i]);	
	}
	
	for (var i = 0; i < dapWarn.length; i++) {
		var pointPo = [];
		var ob = {x: dapWarn[i][1], y: dapWarn[i][0]};
		// pointPo.push(data[i][0]);
		// pointPo.push(data[i][1]);
		// var ob = [];
		// ob.x = 1216667044.9648354;
		// ob.y = 313312549.7664275;
		pointPo.push(ob);
		// console.log(pointPo);
		for (var j = 0; j<9; j++){
				AddWarnPoint(warnLayerPoint[j], i, pointPo, warnPointStylePos[0+2*j]);
				// console.log('578');
			}
		// if(data[i][2]<=h1){
			
	
			
		// }
		// else if(data[i][2]<=h2){
		// 	for (var j = 0; j<5; j++){
		// 		 AddWarnPoint(warnLayerPoint[j], i, pointPo, warnPointStylePos[2*j+1]);
		// 	}
		
		// }
		// else{

		// }
	}
	warnPointStylePos = [];
	API_ReDrawLayer();
}


function AddWarnPointLayers() {
	// if(warnLayerPoint.length!=0){
	// 	for (var i = 0; i < warnLayerPoint.length; ++i){

	// 		var del = API_GetLayerObjectCountByPos(warnLayerPoint[i]);
	// 		for(var j=0; j<del; ++j){
	// 			API_DelObjectByPos(warnLayerPoint[i],0);

	// 		}
			
	// }
	
	// }
	if(warnPointStylePos.length != 0) {
		for (var i = 0; i < 9; i++) {
			API_DelLayerByPos(warnPointStylePos[0])
		}
		
	}
	API_ReDrawLayer();
	warnPointStylePos = [];
	warnLayerPoint = [];

	var pointSize = ["5" , "5" , "5", "5", "10", "10", "20", "20", "20"];
	var showScale = [160000, 80000 ,40000, 20000, 10000, 5000 , 2500, 1250, 625];
	for (var j = 0; j < showScale.length ; j++){
		var pointLayerInfo = [];
		pointLayerInfo.id = warnPointLayerId[j];
		pointLayerInfo.type = 1;
		pointLayerInfo.name = "圆";
		pointLayerInfo.minShowScale = showScale[j];
		pointLayerInfo.maxShowScale = showScale[j];
		pointLayerInfo.bShow = true;
		var warnLayerPointPos = API_AddNewLayer(pointLayerInfo,null);
		var pointColor = ["#FF0000","#FFFF00"]
		if (warnLayerPointPos > -1) {
			for (var i = 0; i < pointColor.length; i++) {
				var pointStyle = [];
				// pointStyle.strImgSrc = "img/light.png"
				// pointStyle.iImgWidth = 0; //图片的宽度
	   //     	    pointStyle.iImgHeight = 0; //图片的高度
	   			pointStyle.iCircleR = pointSize[j];
				pointStyle.arrSymbolPo==null;
				pointStyle.bFilled = true;
				pointStyle.fillColor = pointColor[i];
				pointStyle.bShowText = false;
				pointStyle.iCheckDrawMinNearOtherLen = 200;
				// pointStyle.arrSymbolPo = true;
				
				// console.log(warnLayerPointPos);
				warnPointStylePos.push(API_AddPointLayerStyleByPos(warnLayerPointPos, pointStyle));
			}
	}
}
}

function AddWarnPoint(layerPo, objName, arrObjpo, warnPointStylePos) {
	var pAddResult = false;
	if (layerPo > -1) {
		g_iAddObjId++;
		var objInfo = [];
		var arrExpAttrValue = [];
		objInfo.objType = 5;
		objInfo.layerPos = layerPo;
		objInfo.objId = g_iAddObjId;
		objInfo.name = objName;
		objInfo.layerStylePos = warnPointStylePos;
		// objInfo.circle = 10; 
		var objPos = API_AddNewObject(objInfo, arrObjpo, arrExpAttrValue);
		if(objPos > -1){
		return objPos;
		}

	}
}

// function setWarnDialog(){
// 	var formHead = '<form id="setWarnForm" >';

// 	var warnStandard =
// 		'<div class="row"><div class="col-lg-10 col-lg-offset-1"><div class="input-group">' +
// 			'<span class="input-group-addon" id="sizing-addon2">' +
// 				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>水深一' +
// 			'</span>' +
// 			'<input type="text" class="form-control" id="warnStandard" name="warnStandard" style="text-align: center">' +
// 		'</div></div></div>';

// 	var redWarn =
// 		'<div class="row"><div class="col-lg-10 col-lg-offset-1"><div class="input-group">' +
// 			'<span class="input-group-addon" id="sizing-addon2">' +
// 				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>水深一' +
// 			'</span>' +
// 			'<input type="text" class="form-control" id="redWarn" name="redWarn" style="text-align: center">' +
// 		'</div></div></div>';

// 	var yellowWarn =
// 		'<div class="row"><div class="col-lg-10 col-lg-offset-1"><div class="input-group">' +
// 			'<span class="input-group-addon" id="sizing-addon2">' +
// 				'<span class="glyphicon glyphicon-file" aria-hidden="true" style="padding-right: 10px"></span>水深一' +
// 			'</span>' +
// 			'<input type="text" class="form-control" id="yellowWarn" name="yellowWarn" style="text-align: center">' +
// 		'</div></div></div>';

// 	var formTail = '</form>';
// 	BootstrapDialog.show({
// 		title :'预警设置',
// 		message : formHead + warnStandard + redWarn + yellowWarn + formTail,
// 		cssClass : 'setdepth-dialog',
// 		onshown: function(dialog){
// 			$('#setDepthForm #warnStandard').val(getRideOfNullAndEmpty(level[0]));
//  	 	    $('#setDepthForm #redWarn').val(getRideOfNullAndEmpty(level[1]));
//   		    $('#setDepthForm #yellowWarn').val(getRideOfNullAndEmpty(level[2]));

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
// 				// setDepthLevel($('#setWarnForm')[0]);
// 				dialog.close();
// 			}
// 		}]
// 	});
// }

// function setDepthLevel(thisform) {
// 	with(thisform){
// 		console.log(level1.value + "," + level2.value +"," +level3.value);
// 		console.log(sessionStorage.userId);
// 		$.ajax({
// 			url: "http://202.120.38.3:8090/setdepthlevel",
// 			type:"POST",
// 			data:{userId:sessionStorage.userId, depthLevel:level1.value + "," + level2.value +"," +level3.value}
// 		}).fail(function(){
// 			alert("未连接到服务器");
// 		}).done(function(data){
// 			console.log(data);
// 			getDepthLevel();
// 		})
// 	}
	
// }

function ReflashWarn(data, w1, w2, w3) {
   	warningNow = 2;
    w1 = typeof w1 !== 'undefined' ? w1 : 7;
    w2 = typeof w2 !== 'undefined' ? w2 : 8;
    w3 = typeof w3 !== 'undefined' ? w3 : 9;
    var depData = [];
    for (var i = 0; i < data.length; i++) {
        depData.push(data[i]);
    }
    var w = [w1, w2, w3]; 
    var triangles = Delaunay.triangulate(depData);
    // console.log(data);
    var warningsurfaces = getSurface(triangles, depData, w);
    var wrr = [];
    
    for (var i = 0; i < warningsurfaces.length; ++ i) {
    	 var warninglength = data.length / warningsurfaces[i].surface.length;
         // console.log(data.length);
         if (chooseHarbor == 6) {
            var warningratio = 50;
         }
         else {
            var warningratio = 100;
         }
        if(warningsurfaces[i].level == 1 && warninglength < warningratio){
            waring(1);
            warningNow = 1;
         }
    }
    for (var i = 0; i < warningsurfaces.length; ++ i) {
         var warninglength = data.length / warningsurfaces[i].surface.length;
         // console.log(data.length);
         if (chooseHarbor == 6) {
            var warningratio = 50;
         }
         else {
            var warningratio = 100;
         }
        if(warningsurfaces[i].level == 0 && warninglength < warningratio){
            var wb = warnPoint(depData, warningsurfaces[i], chooseHarbor);
            wrr.push(wb);
            // console.log("!!!");
            waring(0);
            warningNow = 0;
        }
    }
    
    // data = [];
    // for(var i = 0; i < data2.length; ++i){
    //     data.push(data2[i][0],data2[i][1]);
    // }
    // for (var i = 0; i < depData.length; i++) {
    //     depData[i][0] = depData[i][0]/10000000;
        // depData[i][1] = depData[i][1]/10000000;
    // }

    AddWarnPoints(wrr);
    API_ReDrawLayer();
   
    // API_ReDrawLayer();
}

function AddWarnFaces(data, h, w1) {
    w1 = typeof w1 !== 'undefined' ? w1 : 7;
    var depData = [];
    for (var i = 0; i < data.length; i++) {
        depData.push(data[i]);
    }
    h.push(100);
    // var t = h2%2;
    // if( t == 1) {
    //     h2 = h2 + 1;
    // }
    level2 = h.length - 1;
    var levelh = []
    levelh.push(w1)
    levelh.push(w1)
    for(var i = 0; i < h.length; i++) levelh.push(h[i])
    // console.log(levelh[levelh.length - 2])
    AddWarnLayers(level2 + 1, levelh[levelh.length - 2]);
    // g_iDepthLayerId++;
    // console.log(g_iDepthLayerId);
    var layerPos = API_GetLayerPosById(g_iDepthLayerId);

    var triangles = Delaunay.triangulate(depData);
    // console.log(data);
    var buttomNow = allButtom[chooseHarbor - 1];
    var blength = buttomNow.length;
    var maxdepth = 0;
    for(var i = 0; i < blength; i++) {
        maxdepth = buttomNow[i].d > maxdepth ? buttomNow[i].d : maxdepth;
    }
    var surfaces = getWarnSurface(triangles, depData, levelh, maxdepth, buttomNow);
    // var warningsurfaces = getSurface(triangles, depData, w);
    // var wrr = [];
    for (var i = 0; i < surfaces.length; i++) {
        var arr = [];
        for (var j = 0; j < surfaces[i].surface.length; j++) {
            var ob = {x: depData[surfaces[i].surface[j]][1],y: depData[surfaces[i].surface[j]][0]};
            arr.push(ob);
            // console.log(arr); 
        }
       
        AddFace(layerPos, i, arr, g_iDepthStylePos[surfaces[i].level]);
        
    }
 
    API_ReDrawLayer();
    var p = h.pop();
}

function AddWarnLayers(h, max) {
    g_iDepthStylePos = [];
    // console.log(h%2);
    var faceLayerInfo = [];
    g_iDepthLayerId++;
    faceLayerInfo.id = g_iDepthLayerId;
    faceLayerInfo.type = 3; //类型：1=点图层，2=线图层，3=面图层
    faceLayerInfo.name = "水深"; //图层名称
    faceLayerInfo.bShow = true; //显示
    var colorNum = Math.ceil(max / 1.5) - 2;
    faceLayerPos = API_AddNewLayer(faceLayerInfo, null); //添加图层，得到图层的pos
    var faceStyle = [];
            
    faceStyle.borderWith = 2; //线的粗细
    faceStyle.borderColor = "#FF0000"; //线的颜色
    faceStyle.bFilled = true; //是否填充颜色
    faceStyle.fillColor = "#FF0000"; //填充的颜色
    faceStyle.iOpacity = 100; //透明度
    faceStyle.bShowText = false; //是否显示名称
    g_iDepthStylePos.push(API_AddFaceLayerStyleByPos(faceLayerPos, faceStyle));
    faceStyle.borderWith = 2; //线的粗细
    faceStyle.borderColor = "#FFFF00"; //线的颜色
    faceStyle.bFilled = true; //是否填充颜色
    faceStyle.fillColor = "#FFFF00"; //填充的颜色
    faceStyle.iOpacity = 100; //透明度
    faceStyle.bShowText = false; //是否显示名称
    g_iDepthStylePos.push(API_AddFaceLayerStyleByPos(faceLayerPos, faceStyle));
    var colors = ["#FFFD92", "#CBFD85",  " #8BFF8D", " #8DFEC4", " #1AFFC6","#8DFFE3",
    " #19FFFF", " #1AC6FF", " #1193FD", "#1455FD", "#161DFB", " #1A1AE0", " #191BC0", "#191A9F", " #1B1A82"];   
    if (faceLayerPos > -1) {
        for (var i = h - 1; i > -1; i--) {
            var faceStyle = [];
            
            faceStyle.borderWith = 2; //线的粗细
            faceStyle.borderColor = colors[colorNum-i]; //线的颜色
            // r = colorNum - i - 1;
            // $("#rank" + r).show();
            // console.log("#rank" + r);
            // console.log((14-h)/2+i);
            faceStyle.bFilled = true; //是否填充颜色
            faceStyle.fillColor = colors[colorNum-i]; //填充的颜色
            faceStyle.iOpacity = 100; //透明度
            faceStyle.bShowText = false; //是否显示名称
            // console.log(API_AddFaceLayerStyleByPos(faceLayerPos, faceStyle))
            g_iDepthStylePos.push(API_AddFaceLayerStyleByPos(faceLayerPos, faceStyle));
        }    
    }
}

function testWarn() {
	deleteFaces();
	// console.log(warnlevel[0]);
	dashLine(allButtom[chooseHarbor - 1][0].co);
	AddPoints(data,level[0],level[1],level[level.length - 1]);
	// var str = " 31:20:31.89679";
	// str = convertToLatitu(str);
	// console.log(str);
	// console.log(data);
}



function standardView() {
    changepart = 0;
	deleteFaces();
	AddFaces(depthData,level, warnlevel[0],  warnlevel[1],  warnlevel[2]);
	AddPoints(depthData,level[0],level[1],level[level.length - 1]);
	$("#dif-view").html("标准显示");
     $("#rank20").hide();
    $("#rank21").hide();
    $("#part-warn-level").hide();
}

function partView() {
    changepart = 0;
	var buttomNow = allButtom[chooseHarbor - 1];
    
    var blength = buttomNow.length;
    var maxdepth = 0;
    for(var i = 0; i < blength; i++) {
        maxdepth = buttomNow[i].d > maxdepth ? buttomNow[i].d : maxdepth;
    }
	deleteFaces();

	// console.log(maxdepth);
	AddPartFaces(depthData,level, maxdepth);
	AddPoints(depthData,level[0],level[1],level[level.length - 1]);
	$("#dif-view").html("部分显示");
    $("#rank20").hide();
    $("#rank21").hide();
    $("#part-warn-level").hide();

}

function warnView() {
    changepart = 1;
	deleteFaces();
    $("#ranktext20").text("底高-" + warnlevel[0]);
    $("#ranktext21").text("底高-" + warnlevel[1]);
    $("#rank20").show();
    $("#rank21").show();
	// console.log(warnlevel[0]);
	AddWarnFaces(depthData,level, warnlevel[0]);
	AddPoints(depthData,level[0],level[1],level[level.length - 1]);
	$("#dif-view").html("预警显示");
    $("#part-warn-level").show();
}

function AddPartFaces(data, h, w1) {
    w1 = typeof w1 !== 'undefined' ? w1 : 7;
    var depData = [];
    for (var i = 0; i < data.length; i++) {
        depData.push(data[i]);
    }
    // var t = h2%2;
    // if( t == 1) {
    //     h2 = h2 + 1;
    // }
    // var showLevel = 0;
    
    var buttomNow = allButtom[chooseHarbor - 1];
    
    var blength = buttomNow.length;
    var maxdepth = 0;
    for(var i = 0; i < blength; i++) {
        maxdepth = buttomNow[i].d > maxdepth ? buttomNow[i].d : maxdepth;
    }
    h.push(100);

    // h.push(w1)
    // for (var i=0;i<h2+1;++i){
    //     var x = (h3-h1)/(h2 - 1);
    //     x = x.toFixed(1);
    //     h.push(h1+i*x);
    //     if((h1 + (i - 1) * x) < maxdepth ) {
    //     	showLevel++ ;
    //     }  
    //     // console.log(h[i]);
    // }
    // console.log(showLevel)
     level2 = h.length - 1
    AddLayers(level2 + 1 , h[h.length - 2]);
    // g_iDepthLayerId++;
    // console.log(g_iDepthLayerId);
    var layerPos = API_GetLayerPosById(g_iDepthLayerId);
    var lineLayerPos = API_GetLayerPosById(g_iLineLayerId);
    var triangles = Delaunay.triangulate(depData);
    // console.log(data);
    var surfaces = getPartSurface(triangles, depData, h, maxdepth, buttomNow);
    // var warningsurfaces = getSurface(triangles, depData, w);
    // var wrr = [];
    // console.log(surfaces);
    // AddBorder();
    for (var i = 0; i < surfaces.length; i++) {
        var arr = [];
        for (var j = 0; j < surfaces[i].surface.length; j++) {
            var ob = {x: depData[surfaces[i].surface[j]][1],y: depData[surfaces[i].surface[j]][0]};
            arr.push(ob);
            // console.log(arr); 
        }
        if(surfaces[i].level < (h.length - 1)) {
        	AddFace(layerPos, i, arr, g_iDepthStylePos[surfaces[i].level]);
        }
        
        }
        triangles = Delaunay.triangulate(depData);
        var borders = getBorder(depData, triangles);
        for (var i = 0; i < borders.length; i++) {
            var arr = [];
            var ob = {x: depData[borders[i].v1][1], y:depData[borders[i].v1][0]}
            arr.push(ob);
            ob = {x: depData[borders[i].v2][1], y:depData[borders[i].v2][0]}
            arr.push(ob);
            var a = surfaces.length + i;
            var test = AddLine(lineLayerPos, a, arr, g_iLineStylePos);
            // console.log(arr);
    }
 
    API_ReDrawLayer();
    var p = h.pop()
}

function AddBorder(posId, color) {
    posId = typeof posId !== 'undefined' ? posId : 23456;
    color = typeof color !== 'undefined' ? color : "#1193FD";
    g_iLineStylePos = posId;
    // console.log(h%2);
    var faceLayerInfo = [];
    g_iLineLayerId++;
    faceLayerInfo.id = g_iLineLayerId;
    faceLayerInfo.type = 2; //类型：1=点图层，2=线图层，3=面图层
    faceLayerInfo.name = "边框"; //图层名称
    faceLayerInfo.bShow = true; //显示
    linerLayerPos = API_AddNewLayer(faceLayerInfo, null); //添加图层，得到图层的pos
    if (linerLayerPos > -1) {
            var faceStyle = [];
            console.log(233);
            faceStyle.borderWith = 2; //线的粗细
            faceStyle.borderColor =color; //线的颜色

            // console.log("#rank" + r);
            // console.log((14-h)/2+i);
            // faceStyle.textColor = "#1193FD"
            // faceStyle.fontSize = "15px"
            faceStyle.iOpacity = 100; //透明度
            faceStyle.bShowText = false; //是否显示名称
            // console.log(API_AddFaceLayerStyleByPos(faceLayerPos, faceStyle))
            g_iLineStylePos = API_AddLineLayerStyleByPos(linerLayerPos, faceStyle);
            // console.log(g_iLineStylePos);
        }
            
}



function getPartSurface(triangle, vertex, levels, threshold, rangedThreshold) {
    var rangedArea = new Array(rangedThreshold.length);
    for (var i = 0; i < rangedThreshold.length; i++) {
        rangedArea[i] = 0.0;
        for (var j = 1; j < rangedThreshold[i].co.length - 1; j++) {
            rangedArea[i] += getTriangleArea(rangedThreshold[i].co[j], rangedThreshold[i].co[j + 1], rangedThreshold[i].co[0]);
        } 
        // console.log(rangedArea[i]);
    }
    extendVertices(triangle, vertex, levels);
    var dropTriangle = new Array(triangle.length / 3);
    dropIllegalTriangle(triangle, vertex, dropTriangle);
    var vertexToTriangle = getLinkedListOfVertexToTriangle(triangle, vertex);
    var surfaces = [];
    var visited = new Array(triangle.length / 3);
    for (var i = triangle.length; i >= 3; i-=3) {
        if (!visited[i / 3 - 1] && !dropTriangle[i / 3 - 1]) {
            var bfsEdges = generatePartSurface(surfaces, vertex, 
                    triangle[i - 1], triangle[i - 2], triangle[i - 3], 
                    levels, rangedThreshold, rangedArea, threshold);
            visited[i / 3 - 1] = true;
            var contains = new Array(vertex.length);
            contains[triangle[i - 1]] = true;
            contains[triangle[i - 2]] = true;
            contains[triangle[i - 3]] = true;
            var u1 = {x: vertex[triangle[i - 1]][1],y: vertex[triangle[i - 1]][0]};
            var u2 = {x: vertex[triangle[i - 2]][1],y: vertex[triangle[i - 2]][0]};
            var u3 = {x: vertex[triangle[i - 3]][1],y: vertex[triangle[i - 3]][0]};
            //determine range
            var t1 = determinePolyArea(u1, rangedThreshold, rangedArea, threshold, i / 3 - 1);
            var t2 = determinePolyArea(u2, rangedThreshold, rangedArea, threshold, i / 3 - 1);
            var t3 = determinePolyArea(u3, rangedThreshold, rangedArea, threshold, i / 3 - 1);
            //depth
            var d = (t1 + t2 + t3) / 3;

            applyBFSPart(bfsEdges, contains, visited, dropTriangle, vertexToTriangle, levels, surfaces, vertex, triangle, d);
            // console.log(bfsEdges.length)
        }
    }
    // console.log(surfaces);
    return surfaces;
}

function generatePartSurface(surfaces, vertex, v1, v2, v3, levels, rangedThreshold, rangedArea, threshold) {
    var u1 = {x: vertex[v1][1],y: vertex[v1][0]};
    var u2 = {x: vertex[v2][1],y: vertex[v2][0]};
    var u3 = {x: vertex[v3][1],y: vertex[v3][0]};
        //determine range
    var t1 = determinePolyArea(u1, rangedThreshold, rangedArea, threshold, i / 3 - 1);
    var t2 = determinePolyArea(u2, rangedThreshold, rangedArea, threshold, i / 3 - 1);
    var t3 = determinePolyArea(u3, rangedThreshold, rangedArea, threshold, i / 3 - 1);
        //depth
    var surface = [v1, v2, v3];
    var d = (t1 + t2 + t3) / 3;
    var c = (vertex[v1][2] + vertex[v2][2] + vertex[v3][2]) / 3;
    surfaces.push({surface: surface, level: getLevelPart(levels, c, d)});
    var re = [];
    re.push({x: v1, y: v2});
    re.push({x: v2, y: v3});
    re.push({x: v3, y: v1});
    return re;
}

function getLevelPart(levels, depth, d) {
        if(depth > d) {
           // console.log(d)
           return levels.length - 1;
        }else {
        for (var i = 0; i < levels.length; i++) {
        if (depth < levels[i]) {
            // console.log(depth,i)
             return i;
        }
        }
    }
    return levels.length - 1;
}

function applyBFSPart(bfsEdges, contains, visited, dropTriangle, vertexToTriangle, levels, surfaces, vertex, triangle, d) {
    
    var left = 0;
    var right = bfsEdges.length - 1;
    while (left <= right) {
        var v1 = bfsEdges[left].x;
        var v2 = bfsEdges[left].y;
        var v3 = 0;
        for (var i = 0; i < vertexToTriangle[v1].length; i++) {
            if (!visited[vertexToTriangle[v1][i].t] && !dropTriangle[vertexToTriangle[v1][i].t] && Math.abs(getLevelPart(levels, vertexToTriangle[v1][i].d, d) - surfaces[surfaces.length - 1].level) < 1) {

                for (var j = 0; j < vertexToTriangle[v2].length; j++) {
                    if (vertexToTriangle[v2][j].t == vertexToTriangle[v1][i].t) {
                        for (var k = vertexToTriangle[v1][i].t * 3; k < vertexToTriangle[v1][i].t * 3 + 3; k++) {
                            if (triangle[k] != v1 && triangle[k] != v2) {
                                v3 = triangle[k];
                                // console.log(v1, v2, v3);
                            }
                        }
                        
                        if (getType(contains, v1, v2, v3) == 2) {
                            if (doubleIntersect(surfaces[surfaces.length - 1], v1, v2, v3)) {
                                visited[vertexToTriangle[v1][i].t] = true;
                                contains[v3] = true;
                                if (getLevelPart(levels, vertexToTriangle[v1][i].d, d) == surfaces[surfaces.length - 1].level) {
                                    bfsEdges.push({x: v1, y: v3});
                                    bfsEdges.push({x: v3, y: v2});
                                    right+=2;
                                }
                                
                            }
                        } else {
                            var index = tripleIntersect(surfaces[surfaces.length - 1], v1, v2, v3);
                            if (index != -1) {
                                visited[vertexToTriangle[v1][i].t] = true;
                                bfsEdges.push({x: surfaces[surfaces.length - 1].surface[index], 
                                               y: surfaces[surfaces.length - 1].surface[(index + 1) % surfaces[surfaces.length - 1].surface.length]});
                                right++;
                            }   
                        }
                        
                    }
                }
            }
        }
        left++;
    }
}

function applyBFSWarn(bfsEdges, contains, visited, dropTriangle, vertexToTriangle, levels, surfaces, vertex, triangle, rangedThreshold, rangedArea) {
    
    var left = 0;
    var right = bfsEdges.length - 1;
    while (left <= right) {
        var v1 = bfsEdges[left].x;
        var v2 = bfsEdges[left].y;
        var u1 = {x: vertex[v1][1], y: vertex[v1][0]};
        var t1 = determinePolyArea(u1, rangedThreshold, rangedArea, 0, 1, 1);
        var u2 = {x: vertex[v2][1], y: vertex[v2][0]};
        var t2 = determinePolyArea(u2, rangedThreshold, rangedArea, 0, 1, 1);
        // console.log(vertexToTriangle[v1]);
        var v3 = 0;
        for (var i = 0; i < vertexToTriangle[v1].length; i++) {
            if (!visited[vertexToTriangle[v1][i].t] && !dropTriangle[vertexToTriangle[v1][i].t] && Math.abs(getLevelWarn(levels, vertexToTriangle[v1][i].d, t1) - surfaces[surfaces.length - 1].level) < 1) {

                for (var j = 0; j < vertexToTriangle[v2].length; j++) {
                    if (vertexToTriangle[v2][j].t == vertexToTriangle[v1][i].t) {
                        for (var k = vertexToTriangle[v1][i].t * 3; k < vertexToTriangle[v1][i].t * 3 + 3; k++) {
                            if (triangle[k] != v1 && triangle[k] != v2) {
                                v3 = triangle[k];
                                // console.log(v1, v2, v3);
                            }
                        }
                        
                        if (getType(contains, v1, v2, v3) == 2) {
                            if (doubleIntersect(surfaces[surfaces.length - 1], v1, v2, v3)) {
                                visited[vertexToTriangle[v1][i].t] = true;
                                contains[v3] = true;
                                var u3 = {x: vertex[v2][1], y: vertex[v2][0]};
                                var t3 = determinePolyArea(u3, rangedThreshold, rangedArea, 0, 1, 1);
                                var dd = (vertex[v1][2] + vertex[v2][2] + vertex[v3][2]) / 3
                                var tt = (t1 + t2 + t3) / 3;
                                if (getLevelWarn(levels, vertexToTriangle[v1][i].d, tt) == surfaces[surfaces.length - 1].level) {
                                    bfsEdges.push({x: v1, y: v3});
                                    bfsEdges.push({x: v3, y: v2});
                                    right+=2;
                                }
                                
                            }
                        } else {
                            var index = tripleIntersect(surfaces[surfaces.length - 1], v1, v2, v3);
                            if (index != -1) {
                                visited[vertexToTriangle[v1][i].t] = true;
                                bfsEdges.push({x: surfaces[surfaces.length - 1].surface[index], 
                                               y: surfaces[surfaces.length - 1].surface[(index + 1) % surfaces[surfaces.length - 1].surface.length]});
                                right++;
                            }   
                        }
                        
                    }
                }
            }
        }
        left++;
    }
}

function testPartEarthwork() {
    // for(i = 0; i < depthData.length; i += 100)
    // partEarthwork(depthData, level[0], level[1], level[2], depthData[i]);
    DrawDynamicSymbol(1)
    // console.log(depthData[0])
}

function partEarthwork(vertex, obj) {
    var depData = [];
    for (var i = 0; i < vertex.length; i++) {
        depData.push(vertex[i]);
    }
    var buttomNow = allButtom[chooseHarbor - 1];
    var blength = buttomNow.length;
    level.push(100);
    var h=[];
    h.push(1)
    h.push(2)
    for (var i=0;i < level.length;++i){
            h.push(level[i]);
    }
    var p = level.pop()
    console.log(h)
     var rangedArea = new Array(rangedThreshold.length);
    for (var i = 0; i < rangedThreshold.length; i++) {
        rangedArea[i] = 0.0;
        for (var j = 1; j < rangedThreshold[i].co.length - 1; j++) {
            rangedArea[i] += getTriangleArea(rangedThreshold[i].co[j], rangedThreshold[i].co[j + 1], rangedThreshold[i].co[0]);
        } 
        // console.log(rangedArea[i]);
    }
    var layerPos = API_GetLayerPosById(g_iDepthLayerId);
    var triangles = Delaunay.triangulate(depData);
    var buttomNow = allButtom[chooseHarbor - 1];
    var blength = buttomNow.length;
    // console.log(depData.length)
    var targetTriangle = determineTriangle(obj, triangles, depData, h, buttomNow);
    console.log(targetTriangle.length)
    var maxdepth = 0;
    var dropTriangle = new Array(triangles.length / 3);
    dropIllegalTriangle(triangles, depData, dropTriangle);
    var vertexToTriangle = getLinkedListOfVertexToTriangle(triangles, depData);
    var visited = new Array(triangles.length / 3);
    // console.log(targetTriangle);
    visited[targetTriangle / 3 - 1] = true;
    var contains = new Array(depData.length);
    contains[triangles[targetTriangle - 1]] = true;
    contains[triangles[targetTriangle - 2]] = true;
    contains[triangles[targetTriangle - 3]] = true;
    var u1 = {x: depData[triangles[targetTriangle - 1]][1], y: depData[triangles[targetTriangle - 1]][0]};
    var u2 = {x: depData[triangles[targetTriangle - 2]][1], y: depData[triangles[targetTriangle - 2]][0]};
    var u3 = {x: depData[triangles[targetTriangle - 3]][1], y: depData[triangles[targetTriangle - 3]][0]};
    var ftri = [];
    ftri.push({x: triangles[targetTriangle - 1], y: triangles[targetTriangle - 2]});
    ftri.push({x: triangles[targetTriangle - 2], y: triangles[targetTriangle - 3]});
    ftri.push({x: triangles[targetTriangle - 3], y: triangles[targetTriangle - 1]});
    var c = (depData[triangles[targetTriangle - 1]][2] + depData[triangles[targetTriangle - 2]][2] + depData[triangles[targetTriangle - 3]][2]) / 3;
    var t1 = determinePolyArea(u1, buttomNow, rangedArea, maxdepth, 1, 1);
    var t2 = determinePolyArea(u2, buttomNow, rangedArea, maxdepth, 1, 1);
    var t3 = determinePolyArea(u3, buttomNow, rangedArea, maxdepth, 1, 1);
    var d = (t1 + t2 + t3) / 3;
    console.log(c);
    console.log(d);
    var levelClick = getLevelWarn(h, c , d);
    // console.log(levelClick);
    // if(levelClick == 0 || levelClick == 1) {
    var surfaces = [];
    var bfsEdges = ftri;
    var surface = [triangles[targetTriangle - 1], triangles[targetTriangle - 2], triangles[targetTriangle - 3]];
    surfaces.push({surface: surface, level: getLevelWarn(h, c, d)});
    BfsWaringPoint(bfsEdges, contains, visited, dropTriangle, vertexToTriangle, h, surfaces, depData, triangles, rangedArea, buttomNow, levelClick);
    var partPoint = [];
    for(var i = 0; i < bfsEdges.length; i++) {
        partPoint.push(bfsEdges[i].x);
        partPoint.push(bfsEdges[i].y);
    }
    var partEarthPoint = [];
    partPoint.sort();
    // console.log(partPoint)
    var plength = partPoint.length;
    partEarthPoint.push(depData[partPoint[0]]);
    // console.log(depthData[partPoint[0]])
    // console.log(depthData.length)
    for(var i = 1; i < plength; i++) {
        if(partPoint[i] !== partPoint[i - 1]) partEarthPoint.push(depData[partPoint[i]]);
    }
    console.log(bfsEdges.length)
    // console.log(partEarthPoint);
    // for(var i = 0; i < 100; i++) partEarthPoint.push(depthData[i]);
    console.log(partEarthPoint);
    var caculatePartEarthWork = getEarthWork(partEarthPoint, 0, 0,
    superDW[2 * chooseHarbor - 1], superDW[2 * chooseHarbor], 0, buttomNow, 1);
    if(caculatePartEarthWork != 0)
    caculatePartEarthWork = caculatePartEarthWork.toFixed(0);
    $("#partearthwork").val(caculatePartEarthWork / 1000000 + '万方');
    var caculatePartArea = getPartArea(partEarthPoint);
    if(caculatePartArea != 0)
    caculatePartArea = caculatePartArea.toFixed(0);
    console.log(caculatePartArea)
    $("#partearthwork2").val(caculatePartArea / 100000 + '万平');
    max = 0;
    min = 100;
    for(var i = 0; i < partEarthPoint.length; i++) {
        max = max > partEarthPoint[i][2] ? max : partEarthPoint[i][2];
        min = min < partEarthPoint[i][2] ? min : partEarthPoint[i][2]
    }
    $("#partearthwork3").val(min.toFixed(1) + 'm');
    $("#partearthwork4").val(max.toFixed(1) + 'm');
    DrawDynamicSymbol(1)
    
    // console.log(partPoint);
    // }else {
    //     $("#partearthwork").val(0 + 'm³');
    //     $("#partearthwork2").val(0 'm²');
    //     $("#partearthwork3").val(0 + 'm');
    //     $("#partearthwork4").val(0 + 'm');
    // }

}

function getPartArea(vertex) {
    console.log(vertex);
    var triangle = Delaunay.triangulate(vertex);
    console.log(triangle)
    var area = 0;
    for (var i = triangle.length; i >= 3; i -= 3) {
        var p1 ={x: vertex[triangle[i - 1]][1], y: vertex[triangle[i - 1]][0]};
        var p2 ={x: vertex[triangle[i - 2]][1], y: vertex[triangle[i - 2]][0]};
        var p3 ={x: vertex[triangle[i - 3]][1], y: vertex[triangle[i - 3]][0]};
        area += getTriangleArea(p1, p2, p3);
        // console.log(area)
    }
    return area;
}

function BfsWaringPoint(bfsEdges, contains, visited, dropTriangle, vertexToTriangle, levels, surfaces, vertex, triangle, rangedArea, rangedThreshold, levelClick) {
    var left = 0;
    var right = bfsEdges.length - 1;
    while(left <= right) {
        var v1 = bfsEdges[left].x;
        var v2 = bfsEdges[left].y;
        var u1 = {x: vertex[v1][1], y: vertex[v1][0]};
        var t1 = determinePolyArea(u1, rangedThreshold, rangedArea, 0, 1, 1);
        var u2 = {x: vertex[v2][1], y: vertex[v2][0]};
        var t2 = determinePolyArea(u2, rangedThreshold, rangedArea, 0, 1, 1);
        // console.log(vertexToTriangle[v1]);
        var v3 = 0;
        for(var i = 0; i < vertexToTriangle[v1].length; i++) {

            if(!visited[vertexToTriangle[v1][i].t] && !dropTriangle[vertexToTriangle[v1][i].t] && getLevelWarn(levels, vertexToTriangle[v1][i].d, t1) == levelClick) {
                // minlength = vertexToTriangle[v2].length < vertexToTriangle[v1].length ? vertexToTriangle[v2].length : vertexToTriangle[v1].length;
                for (var j = 0; j < vertexToTriangle[v2].length; j++) {
                    if (vertexToTriangle[v2][j].t == vertexToTriangle[v1][i].t) {
                        for (var k = vertexToTriangle[v1][i].t * 3; k < vertexToTriangle[v1][i].t * 3 + 3; k++) {
                            if (triangle[k] != v1 && triangle[k] != v2) {
                                v3 = triangle[k]
                            }
                        }
                        // console.log("test")
                        if(getType(contains, v1, v2, v3) == 2) {
                            if(doubleIntersect(surfaces[surfaces.length - 1], v1, v2, v3)) {
                                visited[vertexToTriangle[v1][i].t] = true;
                                contains[v3] = true;
                                var u3 = {x: vertex[v2][1], y: vertex[v2][0]};
                                var t3 = determinePolyArea(u3, rangedThreshold, rangedArea, 0, 1, 1);
                                var dd = (vertex[v1][2] + vertex[v2][2] + vertex[v3][2]) / 3
                                var tt = (t1 + t2 + t3) / 3;
                            
                                if(getLevelWarn(levels, vertexToTriangle[v1][i].d, tt) == levelClick) {
                                    bfsEdges.push({x: v1, y:v3});
                                    bfsEdges.push({x: v3, y:v2});
                                    right += 2;
                                }
                            }
                        }else {
                            var index = tripleIntersect(surfaces[surfaces.length - 1], v1, v2, v3);
                            if (index != -1) {
                                visited[vertexToTriangle[v1][i].t] = true;
                                bfsEdges.push({x: surfaces[surfaces.length - 1].surface[index], 
                                               y: surfaces[surfaces.length - 1].surface[(index + 1) % surfaces[surfaces.length - 1].surface.length]});
                                right++;
                        }
                    }
                }
        }
    }
}
    left++;
}
}
function determineTriangle(obj, triangle, vertex, levels, rangedThreshold) {
    var best = 1.0;
    var target = 1;
    var level2 = [];
    for (var i = 0; i < rangedThreshold.length; i++) {
        level2.push(rangedThreshold[i].d - warnlevel[0]);
        level2.push(rangedThreshold[i].d - warnlevel[1]);
    }
    for(var i = 0; i < levels.length; i++) level2.push(levels[i]);
    level2.sort();
    var level3 = [];
    level3.push[parseFloat(level2[0])];
    for(var i = 1; i < level2.length; i++) {
        if(level2[i] != level2[i - 1]) level3.push(parseFloat(level2[i]));
    }
    level3.sort(sortNumber);
    console.log(vertex.length)
    extendVertices(triangle, vertex, level3);
    console.log(vertex.length)
    var dropTriangle = new Array(triangle.length / 3);
    dropIllegalTriangle(triangle, vertex, dropTriangle);
    var vertexToTriangle = getLinkedListOfVertexToTriangle(triangle, vertex);
    var surfaces = [];
    var visited = new Array(triangle.length / 3);
    // console.log(triangle);
    for (var i = triangle.length; i >= 3; i -= 3) {
        var p1 ={x: vertex[triangle[i - 1]][1], y: vertex[triangle[i - 1]][0]};
        var p2 ={x: vertex[triangle[i - 2]][1], y: vertex[triangle[i - 2]][0]};
        var p3 ={x: vertex[triangle[i - 3]][1], y: vertex[triangle[i - 3]][0]};
        var p0 ={x: obj.x, y: obj.y};
        var areaT = getTriangleArea(p1, p2, p3);
        var area = 0;
        area += getTriangleArea(p1, p2, p0);
        area += getTriangleArea(p1, p3, p0);
        area += getTriangleArea(p2, p3, p0);
        // console.log(area)
        if (Math.abs(area - areaT) / area < best) {
            best = Math.abs(area - areaT) / area;
            target = i;
        }
    }
    return target;
}
