var g_iDepthLayerId = 10000;
var g_iDepthStylePos = [];
var faceLayerPos = 100;
var lineLayerPos2 = 23445;
var g_iDashpos = 1234;
var dashLineOn = 0;
var dashButtom = [];
function AddFaces(data, h, w1, w2, w3) {
    w1 = typeof w1 !== 'undefined' ? w1 : 7;
    w2 = typeof w2 !== 'undefined' ? w2 : 8;
    w3 = typeof w3 !== 'undefined' ? w3 : 9;
    var depData = [];
    for (var i = 0; i < data.length; i++) {
        depData.push(data[i]);
    }
    h.push(100);
    // var t = level2%2;
    // if( t == 1) {
    //     level2 = level2 + 1;
    // }
    // level2 = level2 -1;
    // var h=[];
    // for (var i=0;i<level2+1;++i){
    //     var x = (h3-h1)/(level2 - 1);
    //     x = x.toFixed(1);
    //     h.push(h[0]+i*x);
    //     // console.log(h[i]);
    // }
    level2 = h.length - 1
    for(var i = 0; i < 14; i++) {
        $("#ranktext" + i).text(15);
    }
    var rankNum = Math.ceil(h[level2 - 1] / 1.5) - level2 - 3;
    console.log(rankNum)
    $("#ranktext" + rankNum).text("小于" + h[0]);
    rankNum++;
    for(var i = 0; i < level2 - 1; i++) {
        $("#ranktext" + rankNum).text(h[i] + "～" + h[i + 1]);
        rankNum++;  
    }
    $("#ranktext" + rankNum).text("大于" + h[level2 - 1]);
    DIV_VALUES = [5.0];
    $("#ranktext" + 14).text("小于" + (h[0]+2*(h[level2 - 1]-h[0])/7).toFixed(1));
    for (var i = 2; i < 7; i++) {
        var y = (h[level2 - 1]-h[0])/7;
        DIV_VALUES.push(-1*h[level2 - 1] + i*y);
    }
    for (var i = 2; i < 6; i++) {
        var y = (h[level2 - 1]-h[0])/7;
        var z = 13+i
        var a = h[0] + i*y
        var b = h[0] + (i+1)*y
        $("#ranktext" + z).text(b.toFixed(1)+"～"+a.toFixed(1));
    }
    $("#ranktext" + 19).text("大于" + (h[0]+6*(h[level2 - 1]-h[0])/7).toFixed(1));
    for (var i = 0; i < 10; i++) {
        DIV_VALUES.push(-1);
    }
    // console.log(data[0]);
    // console.log(faceLayerPos);
    AddLayers(level2 + 1,h[level2 - 1]);
    // console.log(faceLayerPos);
    // g_iDepthLayerId++;
    // console.log(g_iDepthLayerId);
    var layerPos = API_GetLayerPosById(g_iDepthLayerId);
    // console.log(g_iDepthLayerId);
    // for (var i = 0; i < depData.length; i++) {
    //     depData[i][0] = depData[i][0]*10000000;
    //     depData[i][1] = depData[i][1]*10000000;
    // }
    
    // console.log(w);
    // console.log(depData[0]);
    var triangles = Delaunay.triangulate(depData);
    // console.log(data);
    var surfaces = getSurface(triangles, depData, h);
    var buttomNow = allButtom[chooseHarbor - 1];
    var blength = buttomNow.length;
    var maxdepth = 0;
    for(var i = 0; i < blength; i++) {
        maxdepth = buttomNow[i].d > maxdepth ? buttomNow[i].d : maxdepth;
    }
    // var w = [maxdepth + warninglevel[0], maxdepth + warninglevel[1], w3];
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
    var warningsurfaces = getWarnSurface(triangles, depData, h, maxdepth, buttomNow);

    var warninglevel = 2;
    warningNow = 2;
    waring(2);
    var warny = 0;
    caculateEarthWork = getEarthWork(depthData, slope[2 * chooseHarbor - 1], slope[2 * chooseHarbor],
     superDW[2 * chooseHarbor - 1], superDW[2 * chooseHarbor], 0, buttomNow);
    for (var i = 0; i < warningsurfaces.length; ++i) {
        if(warningsurfaces[i].level == 1 && warningsurfaces[i].surface.length > 30){
            // console.log(latituConverTo(depData[warningsurfaces[i].surface[0]][1]))
            // console.log(latituConverTo(depData[warningsurfaces[i].surface[0]][0]))
            // console.log(warningsurfaces[i].surface.length)
            warny = warny + 1;
            if(warny > 0) {

            waring(1);
            warningNow = 1;
            }
         }
    }
     if(caculateEarthWork > warnlevel[3]) {
        waring(1);
        warningNow = 1;
     }
    var warnlen = 0;
    for (var i = 0; i < warningsurfaces.length; ++i) {
         // warnlen = warnlen + warningsurfaces[i].surface.length;
         var warninglength = data.length / warningsurfaces[i].surface.length;
         if (chooseHarbor == 6) {
            var warningratio = 50;
         }
         else {
            var warningratio = 100;
         }
        if(warningsurfaces[i].level == 1) warnlen = warnlen + 1;
        if(warningsurfaces[i].level == 0 && warninglength < warningratio){
            // var wb = warnPoint(depData, warningsurfaces[i], chooseHarbor);
            // wrr.push(wb);
            // console.log("!!!");
            waring(0);
            warningNow = 0;
        }

        // warninglength = data.length / warnlen;
        if(warnlen > 50) {
            // console.log(warninglength)
            waring(0);
            warningNow = 0;
        }
        // console.log(warnlen)
        // console.log(data.length)
    }
    
     if(caculateEarthWork > warnlevel[2]) {
        waring(0);
        warningNow = 0;
     }
    
    // data = [];
    // for(var i = 0; i < data2.length; ++i){
    //     data.push(data2[i][0],data2[i][1]);
    // }
    // for (var i = 0; i < depData.length; i++) {
    //     depData[i][0] = depData[i][0]/10000000;
        // depData[i][1] = depData[i][1]/10000000;
    // }

   

    var p = h.pop()
    // AddWarnPoints(wrr);
    API_ReDrawLayer();
    // level.pop();
   
    // API_ReDrawLayer();
}

function AddLayers(h, m) {

    for (var i = 0; i < 20; i++)
        $("#rank" + i).hide();
    g_iDepthStylePos = [];
    // console.log(h%2);
    var faceLayerInfo = [];
    g_iDepthLayerId++;
    faceLayerInfo.id = g_iDepthLayerId;
    faceLayerInfo.type = 3; //类型：1=点图层，2=线图层，3=面图层
    faceLayerInfo.name = "水深"; //图层名称
    faceLayerInfo.bShow = true; //显示
    var colorNum = Math.ceil(m / 1.5) - 2;
    // console.log(colorNum)
    faceLayerPos = API_AddNewLayer(faceLayerInfo, null); //添加图层，得到图层的pos
    var colors = ["#FFFD92", "#CBFD85",  " #8BFF8D", " #8DFEC4", " #1AFFC6","#8DFFE3",
    " #19FFFF", " #1AC6FF", " #1193FD", "#1455FD", "#161DFB", " #1A1AE0", " #191BC0", "#191A9F", " #1B1A82"];   
    if (faceLayerPos > -1) {
        for (var i = h - 1; i > -1; i--) {
            var faceStyle = [];
            
            faceStyle.borderWith = 2; //线的粗细
            faceStyle.borderColor = colors[colorNum-i]; //线的颜色
            r = colorNum - i - 1;
            $("#rank" + r).show();
            // console.log(r)
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

    if(switchView == 1) {
        for(var i = 0; i < 14; i++) {
            $("#rank" + i).hide();
        }
        for(var i = 14; i < 20; i++) {
            $("#rank" + i).show();
        }
    }
}

function AddFace(layerPos, objName, arrObjPo, layerStylePos) {
    var objType = DynamicSymbolType.drawFace;
    
    var drawObjPoNum = arrObjPo.length;

    
    var bAddResult = false;
    if (layerPos > -1) {
        g_iAddObjId++;
        var objInfo = [];
        var arrExpAttrValue = []; //扩展字段，假如没有可以传入null

        objInfo.layerPos = layerPos;
        objInfo.objId = g_iAddObjId;
        objInfo.name = objName;
        objInfo.layerStylePos = layerStylePos;
        objInfo.objType = 3;
        // arrExpAttrValue.push("来一个扩展字段");
        // console.log(arrObjPo);
        var objPos = API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);
        if (objPos > -1) {
            bAddResult = true;
            return objPos;
        }
    }

}

function AddLine(layerPos, objName, arrObjPo, layerStylePos) {
    var objType = DynamicSymbolType.drawLine;
    
    var drawObjPoNum = arrObjPo.length;

    
    var bAddResult = false;
    if (layerPos > -1) {
        g_iAddObjId++;
        var objInfo = [];
        var arrExpAttrValue = []; //扩展字段，假如没有可以传入null

        objInfo.layerPos = layerPos;
        objInfo.objId = g_iAddObjId;
        objInfo.name = objName;
        objInfo.layerStylePos = layerStylePos;
        objInfo.objType = 2;
        // arrExpAttrValue.push("来一个扩展字段");
        // console.log(arrObjPo);
        var objPos = API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);
        if (objPos > -1) {
            bAddResult = true;
            return objPos;
        }
    }

}

function dashLine(point) {
    g_iDashpos++;
    AddBorder(g_iDashpos, "#000000")
    // g_iLineLayerId++;
    lineLayerPos2 = API_GetLayerPosById(g_iLineLayerId);
    // console.log(lineLayerPos2)  
        for (var i = 0; i < point.length; i++) {
            var deltax = (point[(i + 1) % point.length].x - point[i].x) / 10
            var deltay = (point[(i + 1) % point.length].y - point[i].y) / 10
            for (var j = 0; j < 5; j++) {
            var arr = [];
            var ob = {x: point[i].x + 2 * j * deltax, y:point[i].y + 2 * j * deltay}
            arr.push(ob);
            var ob = {x: point[i].x + (2 * j + 1) * deltax, y:point[i].y + (2 * j + 1) * deltay}
            arr.push(ob);
            var a = point.length + i;
            var test = AddLine(lineLayerPos2, a, arr, g_iLineStylePos);
            }
    }

        API_ReDrawLayer();

}

function deletaLine(lineLayerPos) {
    var del = API_DelLayerByPos(lineLayerPos);
    while(del == true) {
        del = API_DelLayerByPos(lineLayerPos)
    }
    // console.log(faceLayerPos);
    // faceLayerPos = 100;
    console.log(del);
    API_ReDrawLayer();
}

function changeDashLine() {
    if (dashLineOn == 0) {
        dashLine(dashButtom[chooseHarbor - 1].co)
        dashLineOn = 1;
    }
    else {
        dashLineOn = 0;
        deletaLine(lineLayerPos2)
    }
}

function dashDefult() {
     dashButtom.push({co:[{x: convertToLatitu(waiLatitu1[0].x), y: convertToLatitu(waiLatitu1[0].y)},
        {x: convertToLatitu(waiLatitu1[4].x), y: convertToLatitu(waiLatitu1[4].y)},
        {x: convertToLatitu(waiLatitu1[5].x), y: convertToLatitu(waiLatitu1[5].y)},
        {x: convertToLatitu(waiLatitu1[8].x), y: convertToLatitu(waiLatitu1[8].y)}]});
    dashButtom.push({co:[{x: convertToLatitu(waiLatitu4[0].x), y: convertToLatitu(waiLatitu4[0].y)},
        {x: convertToLatitu(waiLatitu4[8].x), y: convertToLatitu(waiLatitu4[8].y)},
        {x: convertToLatitu(waiLatitu4[10].x), y: convertToLatitu(waiLatitu4[10].y)},
        {x: convertToLatitu(waiLatitu4[17].x), y: convertToLatitu(waiLatitu4[17].y)}]});
    dashButtom.push({co:[{x: convertToLatitu(yangLatitu1[0].x), y: convertToLatitu(yangLatitu1[0].y)},
        {x: convertToLatitu(yangLatitu1[1].x), y: convertToLatitu(yangLatitu1[1].y)},
        {x: convertToLatitu(yangLatitu1[3].x), y: convertToLatitu(yangLatitu1[3].y)},
        {x: convertToLatitu(yangLatitu1[2].x), y: convertToLatitu(yangLatitu1[2].y)}]})
    dashButtom.push({co:[{x: convertToLatitu(yangLatitu2[0].x), y: convertToLatitu(yangLatitu2[0].y)},
        {x: convertToLatitu(yangLatitu2[1].x), y: convertToLatitu(yangLatitu2[1].y)},
        {x: convertToLatitu(yangLatitu2[3].x), y: convertToLatitu(yangLatitu2[3].y)},
        {x: convertToLatitu(yangLatitu2[4].x), y: convertToLatitu(yangLatitu2[4].y)},
        {x: convertToLatitu(yangLatitu2[5].x), y: convertToLatitu(yangLatitu2[5].y)}], d: 15.5});
    dashButtom.push({co:[{x: convertToLatitu(luoLatitu[0].x), y: convertToLatitu(luoLatitu[0].y)},
        {x: convertToLatitu(luoLatitu[1].x), y: convertToLatitu(luoLatitu[1].y)},
        {x: convertToLatitu(luoLatitu[2].x), y: convertToLatitu(luoLatitu[2].y)},
        {x: convertToLatitu(luoLatitu[3].x), y: convertToLatitu(luoLatitu[3].y)},
        {x: convertToLatitu(luoLatitu[4].x), y: convertToLatitu(luoLatitu[4].y)},
        {x: convertToLatitu(luoLatitu[5].x), y: convertToLatitu(luoLatitu[5].y)},
        {x: convertToLatitu(luoLatitu[6].x), y: convertToLatitu(luoLatitu[6].y)},
        {x: convertToLatitu(luoLatitu[7].x), y: convertToLatitu(luoLatitu[7].y)},
        {x: convertToLatitu(luoLatitu[8].x), y: convertToLatitu(luoLatitu[8].y)},
        {x: convertToLatitu(luoLatitu[9].x), y: convertToLatitu(luoLatitu[9].y)},
        ]});
}

