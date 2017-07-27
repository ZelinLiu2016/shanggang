var iPointLayerId = [20000, 20001, 20002];
var PointStylePos = [];
var layerPoint = [];
function AddPoints(data, h1, h2, h3) {
	h1 = typeof h1 !== 'undefined' ? h1 : 10;
    h2 = typeof h2 !== 'undefined' ? h2 : 11;
    h3 = typeof h3 !== 'undefined' ? h3 : 12;
	// console.log(data);
	var depPoint = [];
    for (var i = 0; i < data.length; i++) {
        depPoint.push(data[i]);
    }
	AddPointLayers();
	layerPoint[0] = API_GetLayerPosById(iPointLayerId[0]);
	layerPoint[1] = API_GetLayerPosById(iPointLayerId[1]);
	layerPoint[2] = API_GetLayerPosById(iPointLayerId[2]);
	 // for (var i = 0; i < depPoint.length; i++) {
  //       depPoint[i][0] *= 10000000;
  //       depPoint[i][1] *= 10000000;
  //   }
	for (var i = 0; i < depPoint.length; i++) {
		var pointPo = [];
		var ob = {x: depPoint[i][1], y: depPoint[i][0]};
		// pointPo.push(data[i][0]);
		// pointPo.push(data[i][1]);
		// var ob = [];
		// ob.x = 1216667044.9648354;
		// ob.y = 313312549.7664275;
		pointPo.push(ob);
		// console.log(pointPo);
		if(depPoint[i][2]<=h1){
			for (var j = 0; j<3; j++){
				var n = depPoint[i][2];
				n = n.toFixed(1);
				AddPoint(layerPoint[j], i, pointPo, PointStylePos[0+3*j], n);
			}
	
			
		}
		else if(depPoint[i][2]>=h3){
			for (var j = 0; j<3; j++){
				var n = depPoint[i][2];
				n = n.toFixed(1);
				 AddPoint(layerPoint[j], i, pointPo, PointStylePos[3*j+2], n);
			}
		
		}
		else{
			for (var j = 0; j<3; j++){
				var n = depPoint[i][2];
				n = n.toFixed(1);
				AddPoint(layerPoint[j], i, pointPo, PointStylePos[3*j+1], n);
			}

		}
	}
	PointStylePos = [];
	API_ReDrawLayer();
}


function AddPointLayers() {
	if(layerPoint.length!=0){
		for (var i = 0; i < layerPoint.length; ++i){
			// console.log(layerPoint[i]);
			var del = API_GetLayerObjectCountByPos(layerPoint[i]);
			for(var j=0; j<del; ++j){
				API_DelObjectByPos(layerPoint[i],0);
				// console.log(j);
			}
			
	}
	
	}
	
	

	var testSize = ["10px" , "15px" , "20px"];
	var showScale = [2500, 1250 , 625 ]
	for (var j = 0; j < 3 ; j++){
	var pointLayerInfo = [];
	pointLayerInfo.id = iPointLayerId[j];
	pointLayerInfo.type = 1;
	pointLayerInfo.name = "数字";
	pointLayerInfo.minShowScale = showScale[j];
	pointLayerInfo.maxShowScale = showScale[j];
	pointLayerInfo.bShow = true;
	var layerPointPos = API_AddNewLayer(pointLayerInfo,null);
	var textColor = ["#000000","#FFFF00","#FFFFFF"]
	if (layerPointPos > -1) {
		for (var i = 0; i < 3; i++) {
			var pointStyle = [];
			// pointStyle.strImgSrc = "img/light.png"
			// pointStyle.iImgWidth = 0; //图片的宽度
   //     	    pointStyle.iImgHeight = 0; //图片的高度
   			pointStyle.iCircleR = 1;
			pointStyle.textColor = textColor[i] ;
			pointStyle.fontSize = testSize[j]
			pointStyle.bShowText = true;
			// pointStyle.arrSymbolPo = true;
			pointStyle.iTextOpacity = 100;
			// console.log(layerPointPos);
			PointStylePos.push(API_AddPointLayerStyleByPos(layerPointPos, pointStyle));
		}
	}
}
}

function AddPoint(layerPo, objName, arrObjpo, PointStylePos, objText) {
	var pAddResult = false;
	if (layerPo > -1) {
		g_iAddObjId++;
		var objInfo = [];
		var arrExpAttrValue = [];
		objInfo.layerPos = layerPo;
		objInfo.objId = g_iAddObjId;
		objInfo.name = objName;
		objInfo.layerStylePos = PointStylePos;
		objInfo.showText = objText;

		var objPos = API_AddNewObject(objInfo, arrObjpo, arrExpAttrValue);
		if(objPos > -1){
		return objPos;
		}

	}
}