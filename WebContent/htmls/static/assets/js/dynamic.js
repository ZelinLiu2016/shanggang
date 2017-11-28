/*
*文件：test.js，功能：主要是演示YimaEnc SDK的功能的方法，
*比如：添加船舶、绘制物标、显示气象等
*/

//-----------------------------------------------------------------------------------------------------------------------船舶功能演示
//添加船舶(这里加了定时器，这样船舶就会动了，数据是模拟的，仅供参考)

var rtmmsi = "";
var rtinfo = {};
function Test_AddShip(mmsi) {    
    var iCurShipCount = API_GetShipCountByState(-1); //演示获取船舶数量
    if (iCurShipCount > 0) {
        alert("已经添加过" + iCurShipCount + "艘测试船舶，这里就不再添加了。");
        API_SetMapViewCenter(121.4133, 31.2238, 80000);
        return;
    }
	rtmmsi = mmsi;
    API_SetShowShipInfoStyle("13px", "#FF0000", 80); //设置显示船舶信息的样式
    API_SetShowShipInfo(true,1280000,false,true);//设置显示船舶信息
    
    //添加船舶
    var strShipInfos = "";
    //添加或者更新100艘船舶

    var iAddShipCount = 1;
    for (var i = 0; i < iAddShipCount; i++) {
        var shipId = i;
        var shipMMSI = mmsi; //mmsi
        var shipName = allMmsi[mmsi].shipname; //船名
        //var shipGeoPoX = parseInt(1220000000) + parseInt(Math.random() * 30000000); //经度
        //var shipGeoPoY = parseInt(300000000) + parseInt(Math.random() * 30000000); //纬度

        var arrselections = $("#table").bootstrapTable('getSelections');
        var shipGeoPoX = parseInt(10000000*arrselections[0].lon); //经度
        var shipGeoPoY = parseInt(10000000*arrselections[0].lat); //纬度
        
        var shipCourse = arrselections[0].co; //航向
        var shipSpeed = arrselections[0].sp; //航速
        var shipLength = allMmsi[mmsi].length; //船长度
        var shipWidth = allMmsi[mmsi].width; //船宽度
        var shipTime = arrselections[0].ti; //时间
        var iShipState = i % 2; //船舶的状态，当前演示只设置了2种(状态值0和1),见Test_AddShipStyle方法
        var bOnlineOrNot = true;
        var bShowTrack = false;
        var arrExpAttrValue = []; //扩展字段
        /*if (iShipState == 0) {
            shipName = "远洋渔船" + i;
            bShowTrack = true;
        }
        else {
            shipName = "华东海运" + i;
        }
        
        arrExpAttrValue.push("远洋集团");
        arrExpAttrValue.push("渔船");*/

        var curShipInfo = [];//当前船舶的结构体信息
        curShipInfo.shipId = shipId;       //船舶的id
        curShipInfo.shipMMSI = shipMMSI;     //mmsi
        curShipInfo.shipName = shipName;     //船名名称
        curShipInfo.shipGeoPoX = shipGeoPoX;    //位置
        curShipInfo.shipGeoPoY = shipGeoPoY;    //位置
        curShipInfo.shipWidth = shipWidth;     //宽度
        curShipInfo.shipLength = shipLength;    //长度
        curShipInfo.shipSpeed = shipSpeed;     //速度
        curShipInfo.shipCourse = shipCourse;    //航向
        curShipInfo.shipTime = shipTime;     //时间
        curShipInfo.iShipState = iShipState;   //状态
        curShipInfo.bOnlineOrNot = bOnlineOrNot; //是否在线
        curShipInfo.bShowTrack = bShowTrack; //是否显示轨迹
        curShipInfo.arrExpAttrValue = arrExpAttrValue; //扩展字段

        API_AddOneShip(curShipInfo); //添加船舶
    }
    //API_ReDrawShips(); //添加完之后就重绘，这样就立刻显示出来，否则只能等拖动或者缩放激发绘制
    //API_SetMapViewCenter(123.5, 31.5, 640000); //切换到有船舶的区域,调用了这个接口，可以不再调用API_ReDrawShips
    API_SetMapViewCenter(arrselections[0].lon, arrselections[0].lat, 80000); //切换到有船舶的区域,调用了这个接口，可以不再调用API_ReDrawShips
	rtinfo["lon"] = arrselections[0].lon;
	rtinfo["lat"] = arrselections[0].lat;
	rtinfo["co"] = arrselections[0].co;
    var timerId = setInterval(Test_UpdateShipInfo,3000);//3秒更新一次船舶信息
}

function fillRTData(data)
{
	for(var i = 0;i<data.length;++i)
	{
		rtinfo["co"] = data[i].co;
		rtinfo["dest"] = data[i].dest;
		rtinfo["draft"] = data[i].draft;
		rtinfo["lat"] = data[i].lat;
		rtinfo["lon"] = data[i].lon;
		rtinfo["mmsi"] = data[i].mmsi;
		rtinfo["rot"] = data[i].rot;
		rtinfo["sp"] = data[i].sp;
		rtinfo["status"] = data[i].status;
		rtinfo["ti"] = data[i].ti;
	}
}

function Test_UpdateShipInfo() {
	var postData = {};
	postData["mmsi"] = rtmmsi;
	$.ajax({
        method: "POST",
        url: "/shanggang/shipinfo/listnewinfo",
		data: JSON.stringify(postData),
		contentType:"application/json",
        success: function (data) {
			fillRTData(data);
            },
		error: function () {       
            alert("fail");
        }  
    });
    for (var i = 0; i < 1; i++) {
        var shipId = i;
        var shipPos = API_GetShipPosById(shipId);
        var curShipInfo = API_GetShipInfoByPos(shipPos);
        if (curShipInfo) {
            //-----------------生成模拟数据-------------------------------     
            var iGeoPoX = curShipInfo.shipGeoPoX;//船舶的位置
            var iGeoPoY = curShipInfo.shipGeoPoY;
            var shipCourse = curShipInfo.shipCourse; //航向
            var iShipState = curShipInfo.iShipState; //状态
            var bOnlineOrNot = curShipInfo.bOnlineOrNot; //是否在线
            var shipSpeed = curShipInfo.shipSpeed; //航速
            var iAddGeoLen = Math.random() * 5000;
            var angle = (90 - shipCourse) * Math.PI / 180;
            var shipGeoPoX = parseInt(iGeoPoX + Math.cos(angle) * iAddGeoLen);
            var shipGeoPoY = parseInt(iGeoPoY + Math.sin(angle) * iAddGeoLen);
            var iRandom = parseInt(Math.random() * 20);

            //var cc = parseFloat(document.getElementById("cc").value);
            //if (cc > 0) {
            //    shipCourse = cc;
            //}

            //var ss = parseFloat(document.getElementById("speed").value);
            //if (ss > 0) {
            //    shipSpeed = ss;
            //}
            
            //document.getElementById("speed").value = "0";
            //document.getElementById("cc").value = "0";
            //----------------------------------------------------------------
            
            var curShipDynamicInfo = [];//更新的时候，只要把这些值设置好即可
            curShipDynamicInfo.shipGeoPoX = parseInt(10000000*rtinfo.lon);
            curShipDynamicInfo.shipGeoPoY = parseInt(10000000*rtinfo.lat);
			console.log(rtinfo);
            curShipDynamicInfo.shipSpeed = rtinfo.sp;
            curShipDynamicInfo.shipCourse = rtinfo.co;
            curShipDynamicInfo.shipTime = rtinfo.ti;
            curShipDynamicInfo.iShipState = iShipState;
            curShipDynamicInfo.bOnlineOrNot = bOnlineOrNot;
            API_UpdateOneShipDynamicInfoByPos(shipPos, curShipDynamicInfo); //更新一艘船舶动态信息
        }
    }

    API_ReDrawShips(); //更新完之后要立刻绘制，这样才能实时显示
};



//演示：更新船舶动态信息(这样船舶就动了)
function Test_UpdateShipInfoo() {
    for (var i = 0; i < 200; i++) {
        var shipId = i;
        var shipPos = API_GetShipPosById(shipId);
        var curShipInfo = API_GetShipInfoByPos(shipPos);
        if (curShipInfo) {
            //-----------------生成模拟数据-------------------------------     
            var iGeoPoX = curShipInfo.shipGeoPoX;//船舶的位置
            var iGeoPoY = curShipInfo.shipGeoPoY;
            var shipCourse = curShipInfo.shipCourse; //航向
            var iShipState = curShipInfo.iShipState; //状态
            var bOnlineOrNot = curShipInfo.bOnlineOrNot; //是否在线
            var shipSpeed = curShipInfo.shipSpeed; //航速
            var iAddGeoLen = Math.random() * 5000;
            var angle = (90 - shipCourse) * Math.PI / 180;
            var shipGeoPoX = parseInt(iGeoPoX + Math.cos(angle) * iAddGeoLen);
            var shipGeoPoY = parseInt(iGeoPoY + Math.sin(angle) * iAddGeoLen);
            var iRandom = parseInt(Math.random() * 20);

            var cc = parseFloat(document.getElementById("cc").value);
            if (cc > 0) {
                shipCourse = cc;
            }

            var ss = parseFloat(document.getElementById("speed").value);
            if (ss > 0) {
                shipSpeed = ss;
            }
            
            document.getElementById("speed").value = "0";
            document.getElementById("cc").value = "0";
            
            if(iRandom % 2 == 0)
            {
                shipCourse -= iRandom;
            }
            else
            {
                shipCourse += iRandom;
            }
             
            
            if (shipGeoPoX < 120000000 || shipGeoPoX > 1500000000 || shipGeoPoY < 200000000 || shipGeoPoY > 500000000) {
                shipCourse = parseInt(Math.random() * 100);
            }
            var nowTime = new Date();
            var shipTime = nowTime.getFullYear() + "/" + nowTime.getMonth() + "/" + nowTime.getDay() + " " + nowTime.getHours() + ":" + nowTime.getMinutes() + ":" + nowTime.getSeconds(); //时间
            //----------------------------------------------------------------
            
            var curShipDynamicInfo = [];//更新的时候，只要把这些值设置好即可
            curShipDynamicInfo.shipGeoPoX = shipGeoPoX;
            curShipDynamicInfo.shipGeoPoY = shipGeoPoY;
            curShipDynamicInfo.shipSpeed = 12;
            curShipDynamicInfo.shipCourse = shipCourse;
            curShipDynamicInfo.shipTime = shipTime;
            curShipDynamicInfo.iShipState = iShipState;
            curShipDynamicInfo.bOnlineOrNot = bOnlineOrNot;
            
            API_UpdateOneShipDynamicInfoByPos(shipPos, curShipDynamicInfo); //更新一艘船舶动态信息
        }
    }

    API_ReDrawShips(); //更新完之后要立刻绘制，这样才能实时显示
};

//--------------------------------------------------------------------------------------------------------------------------------标绘功能演示

function ShowDivBoxOrNot(objName, bShow) {
    if (bShow == true) {
        document.getElementById(objName).style.display = "block";
    }
    else {
        document.getElementById(objName).style.display = "none";
    }
};

//绘制图形
function DrawDynamicSymbol(type) {
    $('#switch-show').hide();
    ClearDrawObjTextInfo();
    switch (type) {
        case DynamicSymbolType.drawPoint: //绘制点
            API_SetCurDrawDynamicUseType(DynamicSymbolType.drawPoint);
            ShowDivBoxOrNot("drawObjBox", true);
            document.getElementById("drawObjType").value = 1;
            break;
            
        case DynamicSymbolType.drawLine: //绘制线
            API_SetCurDrawDynamicUseType(DynamicSymbolType.drawLine);
            ShowDivBoxOrNot("drawObjBox", true);
            document.getElementById("drawObjType").value = DynamicSymbolType.drawLine;
            break;
            
        case DynamicSymbolType.drawFace: //绘制面
            API_SetCurDrawDynamicUseType(DynamicSymbolType.drawFace);
            ShowDivBoxOrNot("drawObjBox", true);            
            document.getElementById("drawObjType").value = DynamicSymbolType.drawFace;
            break;
            
        case DynamicSymbolType.drawRect: //绘制矩形
            API_SetCurDrawDynamicUseType(DynamicSymbolType.drawRect);
            ShowDivBoxOrNot("DrawRectInfoDiv", true);
            break;
            
        case DynamicSymbolType.drawCircle: //绘制圆
            API_SetCurDrawDynamicUseType(DynamicSymbolType.drawCircle);
            ShowDivBoxOrNot("DrawCircleInfoDiv", true);
            break;
            
        case DynamicSymbolType.drawEllipse: //绘制椭圆
            API_SetCurDrawDynamicUseType(DynamicSymbolType.drawEllipse);
            ShowDivBoxOrNot("DrawEllipseInfoDiv", true);
            break;
            
        case DynamicSymbolType.measureDist: //测距
            API_SetCurDrawDynamicUseType(DynamicSymbolType.measureDist);
            ShowDivBoxOrNot("ShowMeasureDistDiv", true);
            break;
            
        case DynamicSymbolType.measureArea: //测面积
            API_SetCurDrawDynamicUseType(DynamicSymbolType.measureArea);
            break;
            
        case DynamicSymbolType.directionLine: //电子方位线
            API_SetCurDrawDynamicUseType(DynamicSymbolType.directionLine);
            break;
            
        default:
            break;    
    }
};

//清除上一次绘制物标的信息
var g_iDrawObjPoNum = 0;
function ClearDrawObjTextInfo() {
    //清空绘制物标的信息
    DelTableTrsByPos('DrawObjInfoTable', 2, 100);
    g_iDrawObjPoNum = 0;

}

function EndDrawObj() {
    ShowDivBoxOrNot("drawObjBox", false);
    API_SetCurDrawDynamicUseType(DynamicSymbolType.none);
    $('#switch-show').show();
}

//保存物标信息
function AddCurDrawObject() {
    var objType = document.getElementById("drawObjType").value;
    var objName = document.getElementById("drawObjName").value;
    var arrObjPo = API_GetCurDrawDynamicObjGeoPo(); //这里简单从组件中获取，假如要修改的话，就不能这样获取了，只能从物标信息面板中获取
    var drawObjPoNum = arrObjPo.length;

    var strHtmla = "";
    var strHtml1 = "";
    var arrStrHtml = [];
    var startTime = 498651500;
    for (var ii = 0; ii < drawObjPoNum - 1; ii++) {
        if (ii > 0 && ii % 50 == 0) {
            arrStrHtml.push(strHtml1);
            strHtml1 = "";
        }
        
        var cc = API_GetDegreesBetwTwoPoint(arrObjPo[ii].x, arrObjPo[ii].y, arrObjPo[parseInt(ii) + 1].x, arrObjPo[parseInt(ii) + 1].y);
        cc = cc * 10000;
        var speed = (10 + Math.random() * 10) * 10000;
        strHtml1 += "insert into shiphistorytrack(shipid,lon,lat,course,speed,reporttime)values(2161,";
        strHtml1 += parseInt(arrObjPo[ii].x) + ",";
        strHtml1 += parseInt(arrObjPo[ii].y) + ",";
        strHtml1 += parseInt(cc) + ",";
        strHtml1 += parseInt(speed) + ",";
        strHtml1 += parseInt(startTime) + ");";
        startTime = parseInt(startTime) + parseInt(Math.random() * 120);

        strHtmla += parseFloat(parseInt(arrObjPo[ii].x) / 10000000) + "," + parseFloat(parseInt(arrObjPo[ii].y) / 10000000);
        strHtmla += "_";
    }

    arrStrHtml.push(strHtml1);

        if (objName == "") {
        alert("请输入标注名称！");
        return;
    }

    if (objType == "3" && drawObjPoNum < parseInt(3)) {
        alert("绘制的点数量不够组成一个面物标，请再添加绘制点。");
        return;
    }
    else if (objType == "2" && drawObjPoNum < parseInt(2)) {
        alert("绘制的点数量不够组成一个线物标，请再添加绘制点。");
        return;
    }

    var layerStylePos = 0;
    var layerPos = -1;
    if (objType == 1) {
        //添加点
        layerPos = API_GetLayerPosById(g_iPointLayerId); //获取点图层的pos
        layerStylePos = g_iPointStylePos;
    }
    else if (objType == 2) {//添加线
    layerPos = API_GetLayerPosById(g_iLineLayerId); //获取线图层的pos
        layerStylePos = g_iLineStylePos;
    }
    else if (objType == 3) {
        //添加面
    layerPos = API_GetLayerPosById(g_iFaceLayerId); //获取面图层的pos
        layerStylePos = g_iFaceStylePos;
    }
    var bAddResult = false;
    if (layerPos > -1) {
        g_iAddObjId++;
        var objInfo = [];
        var arrExpAttrValue = []; //扩展字段，假如没有可以传入null

        objInfo.layerPos = layerPos; //图层索引
        objInfo.objId = g_iAddObjId; //物标id
        objInfo.name = objName;//物标名称
        objInfo.showText = "标注:" + objName;//显示内容
        objInfo.layerStylePos = layerStylePos;//使用样式索引
        arrExpAttrValue.push("来一个扩展字段");//扩展字段信息

        var objPos = API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);
        if (objPos > -1) {
            bAddResult = true;
        }
    }

    if (bAddResult == true) {
        alert("添加成功");
        API_ReDrawLayer();
        EndDrawObj();
        CloseDivBox("drawObjBox");
    }
    else {
        alert("添加失败");
    }    
}

//保存当前绘制的矩形
function AddCurDrawRectObject() {
    var strRectName = document.getElementById("curDrawRectName").value;
    var strGeoPos = document.getElementById("curDrawRectGeoPo").innerHTML;
    var hailiWidthDis = document.getElementById("curDrawRectWidthDis").innerHTML;
    var hailiHeightDis = document.getElementById("curDrawRectHeightDis").innerHTML;

    if (strRectName == "") {
        alert("请输入矩形的名称");
        return;
    }
    var bResult = false;
    var arrGeoPo = strGeoPos.split(",");
    if (arrGeoPo.length == 2) {
        var po = { x: arrGeoPo[0], y: arrGeoPo[1] };//矩形的左顶点坐标
        var w = hailiWidthDis / 0.5399568;//矩形的宽度(km)
        var h = hailiHeightDis / 0.5399568; //矩形的高度(km)

        var arrObjPo = [];
        arrObjPo.push(po);
        var objInfo = [];
        var arrExpAttrValue = []; //扩展字段，假如没有可以传入null

        var layerPos = API_GetLayerPosById(g_iFaceLayerId); //获取面图层的pos
        if (layerPos > -1) {
            objInfo.objType = DynamicSymbolType.drawRect; //矩形
            objInfo.w = w;//矩形宽度(km)
            objInfo.h = h;//矩形高度(km)
            objInfo.layerPos = layerPos;//所属图层
            g_iAddObjId++;
            objInfo.objId = g_iAddObjId;//矩形id
            objInfo.name = strRectName;//矩形名称
            objInfo.showText = "标注:" + strRectName;//显示内容
            objInfo.layerStylePos = g_iFaceStylePos;//使用样式
            arrExpAttrValue.push("来一个扩展字段");//扩展字段

            var objPos = API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);
            if (objPos > -1) {
                bResult = true;
            }
        }
        
    }

    if (bResult == true) {
        alert("添加成功");
        API_ReDrawLayer();
        EndDrawObj();
        CloseDivBox("DrawRectInfoDiv");
    }
    else {
        alert("添加失败");
    }
}

//保存当前的圆
function AddCurDrawCircleObject() {
    var strName = document.getElementById("curDrawCircleName").value;
    var strGeoPos = document.getElementById("curDrawCircleGeoPo").innerHTML;
    var hailiRDis = document.getElementById("curDrawCircleR").innerHTML;

    if (strName == "") {
        alert("请输入圆的名称");
        return;
    }
    var bResult = false;
    var arrGeoPo = strGeoPos.split(",");
    if (arrGeoPo.length == 2) {
        var po = { x: arrGeoPo[0], y: arrGeoPo[1] }; //矩形的左顶点坐标
        var r = hailiRDis / 0.5399568; //半径的海里转换成km(km)

        var arrObjPo = [];
        arrObjPo.push(po);
        var objInfo = [];
        var arrExpAttrValue = []; //扩展字段，假如没有可以传入null

        var layerPos = API_GetLayerPosById(g_iFaceLayerId); //获取面图层的pos
        if (layerPos > -1) {
            objInfo.objType = DynamicSymbolType.drawCircle; //物标类型：圆
            objInfo.r = r; //半径(km)
 
            objInfo.layerPos = layerPos; //所属图层
            g_iAddObjId++;
            objInfo.objId = g_iAddObjId; //圆id
            objInfo.name = strName; //名称
            objInfo.showText = "标注:" + strName; //显示内容
            objInfo.layerStylePos = g_iFaceStylePos; //使用样式
            arrExpAttrValue.push("来一个扩展字段"); //扩展字段

            var objPos = API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);
            if (objPos > -1) {
                bResult = true;
            }
        }

    }

    if (bResult == true) {
        alert("添加成功");
        API_ReDrawLayer();
        EndDrawObj();
        CloseDivBox("DrawCircleInfoDiv");
    }
    else {
        alert("添加失败");
    }
}


//----------------------------------------------------------------------------------------------------------气象演示
//添加一些气象信息
//这里添加气象前，要先创建图层以及图层的样式，参考Test_AddLayer方法
function AddSomeWeatherInfo() {
    //气象是一个点标注
    var iWeatherLayerPos = API_GetLayerPosById(g_iWeatherLayerId); //获取气象图层的pos
    if (iWeatherLayerPos > -1) {
        g_iAddObjId++;
        
        var arrExpAttrValue = []; //扩展字段
        var arrObjPo = [];//坐标信息
        arrObjPo.push({x:0,y:0});
        var objInfo = []; //对象信息
        objInfo.layerPos = iWeatherLayerPos; //气象图层
        
        objInfo.objId = 20000;//气象id
        objInfo.name = "上海沿岸";
        arrObjPo[0] ={ x: 1223000000, y: 310000000 };
        objInfo.layerStylePos = 0;//使用第1种样式，即晴天
        arrExpAttrValue.push("天气现象：多云 转 晴"); 
        arrExpAttrValue.push("风力：(4-5)级");
        arrExpAttrValue.push("风向：南风 转 东北风");
        arrExpAttrValue.push("能见度：3 转 5(海里)");
        arrExpAttrValue.push("预报时间：2015/5/29 12:13:60"); 
        var objPos1 = API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);

        objInfo.objId = 20001; //气象id
        objInfo.name = "浙江中部沿岸";
        arrObjPo[0] = { x: 1225000000, y: 285000000 };
        objInfo.layerStylePos = 0; //使用第1种样式，即阴天
        arrExpAttrValue = [];
        arrExpAttrValue.push("天气现象：多云 转 阴");
        arrExpAttrValue.push("风力：(5-6)级"); //风力
        arrExpAttrValue.push("风向：南风 转 东北风"); //风向
        arrExpAttrValue.push("能见度：3 转 2(海里)"); //能见度
        arrExpAttrValue.push("预报时间：2015/5/29 12:13:60"); //预报时间
        var objPos2 = API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);

        objInfo.objId = 20002; //气象id
        objInfo.name = "黄海南部";
        arrObjPo[0] = { x: 1235000000, y: 335000000 };
        objInfo.layerStylePos = 1; //使用第2种样式，即阵雨
        arrExpAttrValue = [];
        arrExpAttrValue.push("天气现象：中雨");
        arrExpAttrValue.push("风力：(5-6)级");
        arrExpAttrValue.push("风向：南风 转 东北风");
        arrExpAttrValue.push("能见度：2(海里)");
        arrExpAttrValue.push("预报时间：2015/5/29 12:13:60"); 
        var objPos2 = API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);

        objInfo.objId = 20002; //气象id
        objInfo.name = "东海南部";
        arrObjPo[0] = { x: 1228000000, y: 265000000 };
        objInfo.layerStylePos = 1; //使用第2种样式，即雷雨
        arrExpAttrValue = [];
        arrExpAttrValue.push("天气现象：雷阵雨"); 
        arrExpAttrValue.push("风力：(7-8)级"); 
        arrExpAttrValue.push("风向：南风 转 西北风"); 
        arrExpAttrValue.push("能见度：2(海里)"); 
        arrExpAttrValue.push("预报时间：2015/5/29 12:13:60"); 
        var objPos2 = API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);

        //API_ReDrawLayer(); //添加好之后，重绘图层让气象显示出来(以为下面接口API_SetMapViewCenter也会刷新，所以这里就不用调用了)

        API_SetMapViewCenter(123.5, 33.5, 5120000);//切换到有气象的区域
    }
}

//-------------------------------------------------------------------------------演示：添加台风
function AddTyphoon() {
    var objTyphoonStyle = [];//台风样式结构体
    objTyphoonStyle.strTropicalDepressionColor = "#ed910b"; //热带低压样式
    objTyphoonStyle.strTropicalStormColor = "#e65408"; //热带风暴
    objTyphoonStyle.strSevereTropicalStormColor = "#ec4d30"; //强热带风暴
    objTyphoonStyle.strTyphoonColor = "#ed3434"; //台风
    objTyphoonStyle.strSevereTyphoonColor = "#d50e0e"; //强台风
    objTyphoonStyle.strSuperTyphoonColor = "#b80c0c"; //超强台风
    objTyphoonStyle.sevenCircleColor = "#8001ec"; //7级圆样式
    objTyphoonStyle.tenCircleColor = "#082aee"; //10级圆样式


    API_SetTyphoonStyleColor(objTyphoonStyle); //设置台风样式
    //添加一个台风：一个台风由多个真实轨迹点组成，然后每个真实轨迹点包括多个预测轨迹点
    

    var curTrueTrackGeoPo = { x: 1250000000, y: 280000000 };
    var iTyphoonId = 100;
    var strTyphoonName = "美莎克";
    var strTyphoonTime = "2015/5/10 12:00:00";//开始时间
    var strEndTime = null; //结束时间（是为了查看或者回放以及发生过的）
    var arrExpAttrValue = null;//扩展字段

    var iAddCourse = 5;//方向改变
    for (var ii = 0; ii < 2; ii++) {
        if (ii == 1) {
            curTrueTrackGeoPo = { x: 1260000000, y: 290000000 };
            iTyphoonId = 101;
            strTyphoonName = "米克拉";
            iAddCourse = -3;
        }

        var curTyphoonInfo = [];
        curTyphoonInfo.id = iTyphoonId;
        curTyphoonInfo.name = strTyphoonName;
        curTyphoonInfo.startTime = "2015/5/10 13:00:00";
        curTyphoonInfo.endTime = "2015/5/15 13:00:00";

        var curTyphoonPos = API_AddTyphoon(curTyphoonInfo, arrExpAttrValue);
        API_SetTyphoonShowOrNotByPos(curTyphoonPos, true); //设置该台风显示
    
        var course = parseInt(Math.random() * 360);  //角度
        for (var iTrueTRackPos = 0; iTrueTRackPos < 20; iTrueTRackPos++) {
            var iAddGeoLen = Math.random() * 2000000;
            course += iAddCourse;
            var angle = (90 - course) * Math.PI / 180;
            curTrueTrackGeoPo.x = parseInt(curTrueTrackGeoPo.x + Math.cos(angle) * iAddGeoLen);
            curTrueTrackGeoPo.y = parseInt(curTrueTrackGeoPo.y + Math.sin(angle) * iAddGeoLen);

            var arrPredictTracks = [];
            var iPredictTrackCount = parseInt(Math.random() * 10);
            iPredictTrackCount = Math.min(iPredictTrackCount, 10);
            iPredictTrackCount = Math.max(iPredictTrackCount, 4);

            var curPredictTrackPo = { x: curTrueTrackGeoPo.x, y: curTrueTrackGeoPo.y };
            var curPredictCourse = course;
            for (var i = 0; i < iPredictTrackCount; i++) {
                var time = "2015/5/10 13:00:00"; //时间
                curPredictCourse -= 7;
                var angle1 = (90 - curPredictCourse) * Math.PI / 180;
                curPredictTrackPo.x = parseInt(curPredictTrackPo.x + Math.cos(angle1) * iAddGeoLen);
                curPredictTrackPo.y = parseInt(curPredictTrackPo.y + Math.sin(angle1) * iAddGeoLen);


                var windPower = parseInt(Math.random() * 10); //风力
                var windSpeed = parseInt(Math.random() * 60); //风速
                var airPressure = 900; //气压
                var strReportStation = "中央台"; //预报台
                var curPredictTrackInfo = [];
                curPredictTrackInfo.time = time;
                curPredictTrackInfo.po = { x: curPredictTrackPo.x, y: curPredictTrackPo.y };
                curPredictTrackInfo.windPower = windPower;
                curPredictTrackInfo.windSpeed = windSpeed;
                curPredictTrackInfo.airPressure = airPressure;
                curPredictTrackInfo.strReportStation = strReportStation;

                arrPredictTracks.push(curPredictTrackInfo);
            }

            var objTrackInfo = []; //轨迹点数据结构体
            objTrackInfo.po = { x: curTrueTrackGeoPo.x, y: curTrueTrackGeoPo.y };  //坐标
            objTrackInfo.time = "2015/5/10 12:00:00"; //时间
            objTrackInfo.windPower = parseInt(Math.random() * 10); //风力
            objTrackInfo.windSpeed = parseInt(Math.random() * 60); //风速
            objTrackInfo.airPressure = 990; //气压
            objTrackInfo.moveDirection = "西北"; //移向
            objTrackInfo.moveSpeed = parseInt(Math.random() * 100); //移速
            objTrackInfo.sevenRadius = parseInt(Math.random() * 20 + 30); //7级半径
            objTrackInfo.tenRadius = parseInt(Math.random() * 20 + 5); //10级半径

            API_AddOneTyphoonTrack(curTyphoonPos, objTrackInfo, arrPredictTracks); //添加一个真实轨迹点
        }
    }
    API_SetMapViewCenter(126, 29, 2560000); //切换到台风，这里切换过去的时候，会刷新海图，所以不用调用API_ReDrawLayer();

}

//---------------------------------------------------演示：添加港口，以及港口对应的潮汐数据
function AddSomePort() { 
    //港口是一个点标注
    var iPortLayerPos = API_GetLayerPosById(g_iPortLayerId); //获取港口图层的pos
    if (iPortLayerPos > -1) {
        g_iAddObjId++;

        var arrExpAttrValue = []; //扩展字段
        var arrObjPo = []; //坐标信息
        arrObjPo.push({ x: 0, y: 0 });
        var objInfo = []; //对象信息

        objInfo.layerPos = iPortLayerPos; //港口图层
        objInfo.objId = 1500; //港口id
        objInfo.name = "大连（老虎滩）";
        arrObjPo[0] = { x: 1216833000, y: 388633000 };
        objInfo.layerStylePos = 0; //使用第1种样式
        arrExpAttrValue.push("时区:东八区"); //时区
        arrExpAttrValue.push("省市:辽宁省大连市"); //省市
        arrExpAttrValue.push("潮高基准面:在平均海面下"); //潮高基准面
        arrExpAttrValue.push("潮汐性质:正规半日潮港"); //潮汐性质
        var objPos1 = API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);
         
        objInfo.layerPos = iPortLayerPos; //港口图层
        objInfo.objId = 1501; //港口id
        objInfo.name = "大窑湾(南大圈)";
        arrObjPo[0] = { x: 1219000000, y: 390167000 };
        objInfo.layerStylePos = 0; //使用第1种样式
        arrExpAttrValue = [];
        arrExpAttrValue.push("时区:东八区");
        arrExpAttrValue.push("省市:辽宁省大连市");
        arrExpAttrValue.push("潮高基准面:在平均海面下");
        arrExpAttrValue.push("潮汐性质:正规半日潮港"); 
        var objPos2 = API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);

        objInfo.layerPos = iPortLayerPos; //港口图层
        objInfo.objId = 1502; //港口id
        objInfo.name = "佘山岛";
        arrObjPo[0] = { x: 1222333000, y: 314167000 };
        objInfo.layerStylePos = 0; //使用第1种样式
        arrExpAttrValue = [];
        arrExpAttrValue.push("时区:东八区");
        arrExpAttrValue.push("省市:上海省上海市");
        arrExpAttrValue.push("潮高基准面:在平均海面下");
        arrExpAttrValue.push("潮汐性质:正规半日潮港"); 
        var objPos2 = API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);

        objInfo.layerPos = iPortLayerPos; //港口图层
        objInfo.objId = 1503; //港口id
        objInfo.name = "吴淞";
        arrObjPo[0] = { x: 1215000000, y: 314000000 };
        objInfo.layerStylePos = 0; //使用第1种样式
        arrExpAttrValue = [];
        arrExpAttrValue.push("时区:东八区");
        arrExpAttrValue.push("省市:上海省上海市");
        arrExpAttrValue.push("潮高基准面:在平均海面下");
        arrExpAttrValue.push("潮汐性质:正规半日潮港"); 
        var objPos2 = API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);

        objInfo.layerPos = iPortLayerPos; //港口图层
        objInfo.objId = 1504; //港口id
        objInfo.name = "高桥";
        arrObjPo[0] = { x: 1215667000, y: 313500000 };
        objInfo.layerStylePos = 0; //使用第1种样式
        arrExpAttrValue = [];
        arrExpAttrValue.push("时区:东八区");
        arrExpAttrValue.push("省市:上海省上海市");
        arrExpAttrValue.push("潮高基准面:在平均海面下");
        arrExpAttrValue.push("潮汐性质:正规半日潮港"); 
        var objPos2 = API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);

        objInfo.layerPos = iPortLayerPos; //港口图层
        objInfo.objId = 1505; //港口id
        objInfo.name = "金山嘴";
        arrObjPo[0] = { x: 1221833000, y: 302333000};
        objInfo.layerStylePos = 0; //使用第1种样式
        arrExpAttrValue = [];
        arrExpAttrValue.push("时区:东八区");
        arrExpAttrValue.push("省市:浙江省舟山市");
        arrExpAttrValue.push("潮高基准面:在平均海面下");
        arrExpAttrValue.push("潮汐性质:正规半日潮港"); 
        var objPos2 = API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);

        API_SetMapViewCenter(122.2333, 31.4167, 10240000); //切换到有港口的区域，这里切换过去的时候，会刷新海图，所以不用调用API_ReDrawLayer();
    }
}

//------------------------------------------演示截屏功能
function SaveMapToImg() {
    var bDrawCenterPo = false; //是否绘制中心点,true=显示，false=不显示
    var bDrawScale = false; //是否绘制比例尺,true=显示，false=不显示

    var arrCheckBoxObj = document.getElementsByName("checkBoxDrawOrNot");
    var iCheckBoxCount = arrCheckBoxObj.length;
    for (i = 0; i < iCheckBoxCount; i++) {
        if (arrCheckBoxObj[i].checked) {
            if (arrCheckBoxObj[i].value == "drawCenterPo") {
                bDrawCenterPo = true;
            }
            else if (arrCheckBoxObj[i].value == "drawScale") {
                bDrawScale = true;
            }
        }
    }

    var strDrawText = document.getElementById("saveMapContent").value;

    var imgDiv = "ShowCutMapViewImg";  //用于显示截屏后的img标签id
    var showImgSize = { w: 780, h: 420 }; //显示截屏后的img标签的尺寸，格式{w:800,h:500};
    API_CutMapViewToImg(bDrawCenterPo, bDrawScale, imgDiv, showImgSize, strDrawText);
    var imgObj = document.getElementById("imgDiv");
    if (imgObj) {
        imgObj.onload = function() { alert("截屏成功，右键图片选择‘图片另存为...’即可保存图片。"); };
    }
}

//------------------------------------------------------------------演示：轨迹回放功能
//添加一些轨迹回放船舶数据
function AddSomeAbnormalPlayHistoryTracksShipInfo(shipCount, bShowTrack, hisAbmData) {
    console.log(hisAbmData);
    for (var i = 0; i < shipCount; i++) {
        var shipId = i;
        var shipMMSI = i; //mmsi
        var shipName = ""; //船名        
        var shipLength = 30; //船长度
        var shipWidth = 10; //船宽度        
        var iShipState = i % 2; //船舶的状态，当前演示只设置了2种(状态值0和1),见Test_AddShipStyle方法
        var bOnlineOrNot = true;
        var bShowTrack = bShowTrack; //是否显示轨迹
        
        var arrExpAttrValue = []; //扩展字段

            shipName = "违规船" ;


        var curShipInfo = []; //当前船舶的结构体信息
        curShipInfo.shipId = shipId;       //船舶的id
        curShipInfo.shipMMSI = shipMMSI;     //mmsi
        curShipInfo.shipName = shipName;     //船名名称
        curShipInfo.shipWidth = shipWidth;     //宽度
        curShipInfo.shipLength = shipLength;    //长度
        curShipInfo.shipSpeed = parseInt(1.4);     //速度
        curShipInfo.iShipState = iShipState;   //状态
        curShipInfo.bShowTrack = bShowTrack;//是否显示轨迹
        
        var shipGeoPoX = parseInt(1222647000); //经度
        var shipGeoPoY = parseInt(305556000); //纬度
        var shipCourse = parseInt(123);    //航向
        var curTrackTime = { date: "2017/9/5", h: 12, m: 20, s: 20 };//当前时间

        var arrCurShipHistroryTracks = [];//保存轨迹点的数组
        //给每个船舶添加 个轨迹点

            

            //这里要注意轨迹添加的时间格式必须是"2015/5/31 12:1:3"
            for (var j = 0; j < hisAbmData.length; j++){
            var curHistroyTrack = [];
           
            curHistroyTrack.trackGeoPoX = parseInt(parseFloat(hisAbmData[j].lon)*10000000);//经度，例如1210000000
            curHistroyTrack.trackGeoPoY =parseInt(parseFloat(hisAbmData[j].lat)*10000000); //纬度，例如31000000
            curHistroyTrack.trackCourse =parseInt(60); //航向，单位度(int)
            curHistroyTrack.trackSpeed = parseInt(1); //航速
            curHistroyTrack.trackTime = hisAbmData[j].ti; //时间，格式例如"2015/5/31 12:1:3"
			
            arrCurShipHistroryTracks.push(curHistroyTrack);
			}

            var curHistroyTrack = [];
           
            curHistroyTrack.trackGeoPoX = parseInt(parseFloat(hisAbmData[0].lon)*10000000);//经度，例如1210000000
            curHistroyTrack.trackGeoPoY =parseInt(parseFloat(hisAbmData[0].lat)*10000000); //纬度，例如31000000
            curHistroyTrack.trackCourse =parseInt(60); //航向，单位度(int)
            curHistroyTrack.trackSpeed = parseInt(1); //航速
            curHistroyTrack.trackTime = "2017/9/6 00:00:0"; //时间，格式例如"2015/5/31 12:1:3"

            arrCurShipHistroryTracks.push(curHistroyTrack);
            //arrCurShipHistroryTracks.push(curHistroyTrack);
        API_AddOnePlayShipInfo(curShipInfo, arrCurShipHistroryTracks);
    }
}

function AddSomePlayHistoryTracksShipInfo(shipCount, bShowTrack, hisAbmData) {


    for (var i = 0; i < shipCount; i++) {
        var shipId = i;
        var shipMMSI = hisAbmData[0].mmsi; //mmsi
        var shipName = "-"; //船名
		if(shipMMSI in allMmsi)
		{
			shipName = allMmsi[shipMMSI].shipname;
		}
        var shipLength = allMmsi[shipMMSI].width; //船长度
        var shipWidth = allMmsi[shipMMSI].length; //船宽度        
        var iShipState = i % 2; //船舶的状态，当前演示只设置了2种(状态值0和1),见Test_AddShipStyle方法
        var bOnlineOrNot = true;
        var bShowTrack = bShowTrack; //是否显示轨迹
        
        var arrExpAttrValue = []; //扩展字段

        var curShipInfo = []; //当前船舶的结构体信息
        curShipInfo.shipId = shipId;       //船舶的id
        curShipInfo.shipMMSI = shipMMSI;     //mmsi
        curShipInfo.shipName = shipName;     //船名名称
        curShipInfo.shipWidth = shipWidth;     //宽度
        curShipInfo.shipLength = shipLength;    //长度
        curShipInfo.shipSpeed = 1;     //速度
        curShipInfo.iShipState = iShipState;   //状态
        curShipInfo.bShowTrack = bShowTrack;//是否显示轨迹
        
        var shipGeoPoX = parseInt(1222333000) + parseInt(Math.random() * 1000000); //经度
        var shipGeoPoY = parseInt(314167000) + parseInt(Math.random() *  1000000); //纬度
        var shipCourse = parseInt(Math.random() * 360);    //航向
        var curTrackTime = { date: "2015/5/31", h: 1, m: 1, s: 1 };//当前时间

        var arrCurShipHistroryTracks = [];//保存轨迹点的数组
        //给每个船舶添加200个轨迹点
        for (var j = 0; j < hisAbmData.length; j++){
            var curHistroyTrack = [];
           
            curHistroyTrack.trackGeoPoX = parseInt(parseFloat(hisAbmData[j].lon)*10000000);//经度，例如1210000000
            curHistroyTrack.trackGeoPoY =parseInt(parseFloat(hisAbmData[j].lat)*10000000); //纬度，例如31000000
            curHistroyTrack.trackCourse =parseInt(hisAbmData[j].co); //航向，单位度(int)
            curHistroyTrack.trackSpeed = parseFloat(hisAbmData[j].sp); //航速
            curHistroyTrack.trackTime = hisAbmData[j].ti; //时间，格式例如"2015/5/31 12:1:3"
            arrCurShipHistroryTracks.push(curHistroyTrack);
			}

		var curHistroyTrack = [];
	   
		curHistroyTrack.trackGeoPoX = parseInt(parseFloat(hisAbmData[0].lon)*10000000);//经度，例如1210000000
		curHistroyTrack.trackGeoPoY =parseInt(parseFloat(hisAbmData[0].lat)*10000000); //纬度，例如31000000
		curHistroyTrack.trackCourse =parseInt(60); //航向，单位度(int)
		curHistroyTrack.trackSpeed = parseInt(1); //航速
		curHistroyTrack.trackTime = "2017/9/6 00:00:0"; //时间，格式例如"2015/5/31 12:1:3"

		//arrCurShipHistroryTracks.push(curHistroyTrack);
            //arrCurShipHistroryTracks.push(curHistroyTrack);
        API_AddOnePlayShipInfo(curShipInfo, arrCurShipHistroryTracks);
    }
}

//根据区域进行回放轨迹
function PlayShipHistoryTracksByArea() {

}

function PlayShipHistoryTracks(strType, data) {
    if (document.getElementById("ShowPlayShipTrackDiv").style.display == "block") {
        alert("当前正在回放轨迹，不能重复演示。");
        return;
    }
    
    if (strType == "ship") {
        //船舶轨迹回放
        AddSomePlayHistoryTracksShipInfo(1,true, data); //添加 艘测试数据
		API_SetMapViewCenter(data[0].lon, data[0].lat, 160000);
        
    }
    else {
        //根据区域回放轨迹

        var objInfo1 = []; //区域对象
        var arrGeoPo1 = []; //区域的坐标
        objInfo1.showText = "东海捕鱼区";
        arrGeoPo1.push({ x: 1212641489, y: 351263316});
        arrGeoPo1.push({ x: 1217606270, y: 351964861 });
        arrGeoPo1.push({ x: 1220524674, y: 350122236 });
        arrGeoPo1.push({ x: 1214545487, y: 348216709 });

        var pos1 = API_AddPlayArea(objInfo1, arrGeoPo1); //添加一个区域


        var objInfo2 = []; //区域对象
        var arrGeoPo2 = []; //区域的坐标
        objInfo2.showText = "经济贸易区";

        arrGeoPo2.push({ x: 1211544590, y: 345815287 });
        arrGeoPo2.push({ x: 1212007230, y: 343147030 });
        arrGeoPo2.push({ x: 1209053325, y: 342851630 });
        arrGeoPo2.push({ x: 1205725534, y: 343722645 });
        arrGeoPo2.push({ x: 1204052856, y: 346536207 });
        arrGeoPo2.push({ x: 1205939103, y: 348416236 });
        
        var pos2 = API_AddPlayArea(objInfo2, arrGeoPo2); //添加一个区域
        
        AddSomePlayHistoryTracksShipInfo(200,false); //添加50艘测试数据
    }
    
    ShowDivBoxOrNot("ShowPlayShipTrackDiv", true);
    document.getElementById("StartPlayButton").disabled = ""; //“播放”按钮
    document.getElementById("StopPlayButton").disabled = "disabled"; //“暂停”按钮
    document.getElementById("ContinuePlayButton").disabled = "disabled"; //“继续”按钮
    document.getElementById("FastPlayButton").disabled = "disabled"; //“快进”按钮
    document.getElementById("GoBackPlayButton").disabled = "disabled"; //“后退”按钮
    document.getElementById("RePlayButton").disabled = "disabled"; //“重放”按钮
    document.getElementById("EndPlayButton").disabled = "disabled"; //“结束”按钮
    ShowDivBoxOrNot('ShowPlayShipTrackDiv', true);
}



function PlayAbnormalShipHistoryTracks(data) {
    if (document.getElementById("ShowPlayShipTrackDiv").style.display == "block") {
        alert("当前正在回放轨迹，不能重复演示。");
        return;
    }
    AddSomeAbnormalPlayHistoryTracksShipInfo(1,true,data);
	API_SetMapViewCenter(parseFloat(data[0].lon), parseFloat(data[0].lat), 80000);

    ShowDivBoxOrNot("ShowPlayShipTrackDiv", true);
    document.getElementById("StartPlayButton").disabled = ""; //“播放”按钮
    document.getElementById("StopPlayButton").disabled = "disabled"; //“暂停”按钮
    document.getElementById("ContinuePlayButton").disabled = "disabled"; //“继续”按钮
    document.getElementById("FastPlayButton").disabled = "disabled"; //“快进”按钮
    document.getElementById("GoBackPlayButton").disabled = "disabled"; //“后退”按钮
    document.getElementById("RePlayButton").disabled = "disabled"; //“重放”按钮
    document.getElementById("EndPlayButton").disabled = "disabled"; //“结束”按钮
    
    ShowDivBoxOrNot("ShowPlayShipTrackDiv", true);
}


//轨迹回放工具按钮处理
function PlayShipHistoryButton(strType) {

    if (strType == "start") {//开始
        API_SetPlayHistoryTrackTimeStep(3 * 60); //设置播放速度（3分钟/秒）
        //API_SetMapViewCenter(122.2647, 30.5556, 40000); //切换到有港口的区域，这里切换过去的时候，会刷新海图，所以不用调用API_ReDrawLayer();
        API_StartPlayShipHistoryTrack();
        
        document.getElementById("StartPlayButton").disabled = "disabled"; //“播放”按钮
        document.getElementById("StopPlayButton").disabled = ""; //“暂停”按钮
        document.getElementById("ContinuePlayButton").disabled = "disabled"; //“继续”按钮
        document.getElementById("FastPlayButton").disabled = ""; //“快进”按钮
        document.getElementById("GoBackPlayButton").disabled = ""; //“后退”按钮
        document.getElementById("RePlayButton").disabled = ""; //“重放”按钮
        document.getElementById("EndPlayButton").disabled = ""; //“结束”按钮
    }
    else if (strType == "stop")//暂停
    {
        API_StopPlayHistoryTrackOrNot(true);

        document.getElementById("StartPlayButton").disabled = "disabled"; //“播放”按钮
        document.getElementById("StopPlayButton").disabled = "disabled"; //“暂停”按钮
        document.getElementById("ContinuePlayButton").disabled = ""; //“继续”按钮
        document.getElementById("FastPlayButton").disabled = ""; //“快进”按钮
        document.getElementById("GoBackPlayButton").disabled = ""; //“后退”按钮
        document.getElementById("RePlayButton").disabled = ""; //“重放”按钮
        document.getElementById("EndPlayButton").disabled = ""; //“结束”按钮

    }
    else if (strType == "continue") {//继续
        API_StopPlayHistoryTrackOrNot(false);

        document.getElementById("StartPlayButton").disabled = "disabled"; //“播放”按钮
        document.getElementById("StopPlayButton").disabled = ""; //“暂停”按钮
        document.getElementById("ContinuePlayButton").disabled = "disabled"; //“继续”按钮
        document.getElementById("FastPlayButton").disabled = ""; //“快进”按钮
        document.getElementById("GoBackPlayButton").disabled = ""; //“后退”按钮
        document.getElementById("RePlayButton").disabled = ""; //“重放”按钮
        document.getElementById("EndPlayButton").disabled = ""; //“结束”按钮
    }
    else if (strType == "fast") { //快进
        API_FastPlayHistoryTrack(3);
    }
    else if (strType == "back") { //后退
        API_FastPlayHistoryTrack(-3);
    }
    else if (strType == "end") {//结束
        API_EndPlayHistoryTrack();
        document.getElementById("StartPlayButton").disabled = "disabled"; //“播放”按钮
        document.getElementById("StopPlayButton").disabled = "disabled"; //“暂停”按钮
        document.getElementById("ContinuePlayButton").disabled = "disabled"; //“继续”按钮
        document.getElementById("FastPlayButton").disabled = "disabled"; //“快进”按钮
        document.getElementById("GoBackPlayButton").disabled = ""; //“后退”按钮
        document.getElementById("RePlayButton").disabled = ""; //“重放”按钮
        document.getElementById("EndPlayButton").disabled = "disabled"; //“结束”按钮
    }
    else if (strType == "restart") {//重放
        API_ReStartPlayHistoryTrack();
        document.getElementById("EndPlayButton").disabled = ""; //“结束”按钮
    }
}

//设置回放的速度
function SelectPlayTimeStep(obj) {
    var iTimeStep = obj.value;
    API_SetPlayHistoryTrackTimeStep(iTimeStep);
}

//结束历史轨迹之后，就要清空组件里面轨迹回放数据：轨迹回放结束之后，必须要调用这个接口，要不然就会一直在轨迹回放模式，不绘制当前船舶
function ClearPlayShipInfo() {
    API_ClearPlayHistoryTrackInfo();
}

//添加洋流
var bAddOceanCirculation = false;
function AddOceanCirculation() {
    if (bAddOceanCirculation == true) {

        API_SetMapViewCenter(141, 10, 20480000); //切换到有洋流的区域
        return;
    }
    
    var iOcLayerPos = API_GetLayerPosById(g_iOceanCirculationLayerId); //获取洋流图层的pos
    if (iOcLayerPos > -1) {
        var arrExpAttrValue = []; //扩展字段
        var arrObjPo = []; //坐标信息
        arrObjPo.push({ x: 0, y: 0 });
        var objInfo = []; //对象信息
        //---------------------------------------------------------------------------------------------添加洋流，这个数据应该是从数据库中读取的，这里只是模拟数据
        objInfo.layerPos = iOcLayerPos; //洋流图层
        objInfo.objType = 1; //物标类型，1=点，2=线，3=面
        objInfo.name = "";
        objInfo.layerStylePos = 0; //使用第1种样式
        arrExpAttrValue.push("海流速度:2.00"); //扩展字段

        var fOcAngle = 290;
        var mStartGeoPo = { x: 1611334068, y: -18165887 };    
        objInfo.objId = 2000; //洋流id
        arrObjPo[0] = { x: mStartGeoPo.x, y: mStartGeoPo.y };        
        objPos = API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);
        API_SetPointObjRotation(iOcLayerPos, objPos, fOcAngle); //设置洋流方向

        for (var i = 1; i < 100; i++) {
            objInfo.objId = parseInt(objInfo.objId) + parseInt(1);  //洋流id
            //-----------------生成模拟数据-------------------------------     
 
            var iAddGeoLen = 5000000;
            var angle = (90 - fOcAngle) * Math.PI / 180;
            mStartGeoPo.x = parseInt(mStartGeoPo.x + Math.cos(angle) * iAddGeoLen);
            mStartGeoPo.y = parseInt(mStartGeoPo.y + Math.sin(angle) * iAddGeoLen);

            fOcAngle += 1.5;

            arrObjPo[0] = mStartGeoPo;
            objPos = API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);
            API_SetPointObjRotation(iOcLayerPos, objPos, fOcAngle); //设置洋流方向

        }

        fOcAngle = 290;
        mStartGeoPo = { x: 1411334068, y: -18165887 };
        objInfo.objId = 2000; //洋流id
        arrObjPo[0] = { x: mStartGeoPo.x, y: mStartGeoPo.y };
        objPos = API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);
        API_SetPointObjRotation(iOcLayerPos, objPos, fOcAngle); //设置洋流方向

        for (var i = 1; i < 150; i++) {
            objInfo.objId = parseInt(objInfo.objId) + parseInt(1);  //洋流id
            //-----------------生成模拟数据-------------------------------     

            var iAddGeoLen = 2000000;
            var angle = (90 - fOcAngle) * Math.PI / 180;
            mStartGeoPo.x = parseInt(mStartGeoPo.x + Math.cos(angle) * iAddGeoLen);
            mStartGeoPo.y = parseInt(mStartGeoPo.y + Math.sin(angle) * iAddGeoLen);

            fOcAngle += 0.8;

            arrObjPo[0] = mStartGeoPo;
            objPos = API_AddNewObject(objInfo, arrObjPo, arrExpAttrValue);
            API_SetPointObjRotation(iOcLayerPos, objPos, fOcAngle); //设置洋流方向
        }

        API_SetMapViewCenter(141, 10, 20480000); //切换到有洋流的区域
    }

    bAddOceanCirculation = true;
}