var g_showSimpleInfoDiv = null;
var g_showDetailShipInfoDiv = null;
var g_iPointLayerId = 100; //点图层的id
var g_iPointStylePos = 0; //样式pos
var g_iLineLayerId = 200; //线图层的id
var g_iLineStylePos = 0;
var g_iFaceLayerId = 300; //面图层的id
var gg_iFaceLayerId = 301;
var g_iFaceStylePos = 0;
var gg_iFaceStylePos = 0;
var g_iAddObjId = 0;
var gg_iAddObjId = 0;
var g_iSimpleBoxOneLineSize = 20; //信息面板添加一行对应增加了多少高度

var g_iWeatherLayerId = 1000; //气象图层id
var g_iPortLayerId = 2000; //港口图层的id
var g_iOceanCirculationLayerId = 3000; //洋流图层
var g_strTestMsg = "";

function init() {
	console.log("INIT HERE");
    var objMapInfo = [];
    objMapInfo.div = "map"; //海图容器div的id
    objMapInfo.model = "pc"; //用于android环境
    API_SetMapMinMaxScale(625,640000);
    API_SetMapImgMode(0)
	
	//API_SetMapImgMode(1);
    //API_SetMapMinMaxLevel(5, 14);
	
    API_InitYimaMap(objMapInfo);

    g_showSimpleInfoDiv = document.getElementById("ShowSimpleInfoByMouseMoveDiv");
    g_showDetailShipInfoDiv = document.getElementById("ShowDetailShipInfoDiv");

    Test_AddLayer(); //添加图层
    Test_AddShipStyle(); //添加船舶样式
	API_SetShowShipInfoStyle("25px 宋体", "#FF0000",100);
	API_SetShowShipInfo(true, 100000, true, false);

    API_SetShowToolBarOrNot(true, 80, 50); //显示工具条

    API_SetMapImagesUrl("http://202.120.38.3:8091/www/");
    //API_SetMapImagesUrl("http://www.yimasoft.net/YimaChartImages/"); //设置海图显示的图片地址,这里可以设置相对路径或者绝对路径
    //API_SetMapImagesUrl("../");

    API_SetMapViewCenter(121.664, 31.338, 20000); //设置海图显示信息，假如不设置，那么海图可能不显示出来
	//API_SetMapLevel(8, {x:121.664, y:31.338});
    API_SetMousePoInfoDivPosition(true, 270, 30); //显示鼠标位置
    API_SetScaleInfoDivPosition(true, 20, 30); //显示比例尺位置
    API_SetScaleLenInfoPosition(true, 30, 85); //显示比例尺长度

    API_SetMapBackGroundStyle(null, "#abe6f3"); //设置了海图背景样式

        //以下是注册方法，假如没有注册，那么SDK就是试用版(有截止时间)，注册成功之后才是正式版本。
        var strUserId = API_GetMyUesrId(); //获取用户ID
        var strPermit = getValueByAjax("http://localhost:49737/Service1.asmx/API_RegisterUser", "iUserId:" + strUserId);
        var bRegister = API_SetMyLicenceKey(strPermit); //是否注册成功


    window.onresize = function() {
        //API_ReSizeMapView();
        //alert("页面大小改变");
    }
}

var ajaxType = "Post";
var ajaxAsync = false;
var ajaxContentType = "application/json; charset=utf-8";
var ajaxDataType = "json";

function getValueByAjax(requestUrl, paramsString) {
    var strRetValue = "";
    if (paramsString != null)
        paramsString = "{" + paramsString + "}";
    $.ajax({
        type: ajaxType,
        async: ajaxAsync,
        url: requestUrl,
        contentType: ajaxContentType,
        dataType: ajaxDataType,
        data: paramsString,
        success: function(data) {
            if (data) {
                strRetValue = data.d;
            }
            else {
                strRetValue = "";
            }

        },
        error: function(err) {
            strRetValue = "";
        }
    });
    return String(strRetValue);
}

//演示：添加船舶样式（一般添加一次就可以了）
//假如不添加船舶样式的话，船舶可能就绘制不出来（样式与船舶状态绑定的）
function Test_AddShipStyle() {
    //三边形船舶形状
    var arrThreeSymbolPo = [];
    arrThreeSymbolPo.push({ x: 0, y: -11 });
    arrThreeSymbolPo.push({ x: -6, y: 10 });
    arrThreeSymbolPo.push({ x: 6, y: 10 });

    //五变形船舶形状
    var arrFiveSymbolPo = [];
    arrFiveSymbolPo.push({ x: 0, y: -15 });
    arrFiveSymbolPo.push({ x: 5, y: -1 });
    arrFiveSymbolPo.push({ x: 5, y: 15 });
    arrFiveSymbolPo.push({ x: -5, y: 15 });
    arrFiveSymbolPo.push({ x: -5, y: -1 });

    //六边形船舶形状
    var arrSixSymbolPo = [];
    arrSixSymbolPo.push({ x: -8, y: 25 });
    arrSixSymbolPo.push({ x: 8, y: 25 });
    arrSixSymbolPo.push({ x: 8, y: -15 });
    arrSixSymbolPo.push({ x: 2, y: -25 });
    arrSixSymbolPo.push({ x: -2, y: -25 });
    arrSixSymbolPo.push({ x: -8, y: -15 });
    
    var objStateStyle11 = [];
    objStateStyle11.arrSymbolPo = arrThreeSymbolPo;
    objStateStyle11.minScale = 40000;
    objStateStyle11.maxScale = 1280000;
    objStateStyle11.borderSize = 2;
    objStateStyle11.borderColor = "#000000";
    objStateStyle11.fillColor = "#fff170";
    objStateStyle11.iOpacity = 90;

    var objStateStyle12 = [];
    objStateStyle12.arrSymbolPo = arrSixSymbolPo;
    objStateStyle12.minScale = 0;
    objStateStyle12.maxScale = 40000;
    objStateStyle12.borderSize = 2;
    objStateStyle12.borderColor = "#000000";
    objStateStyle12.fillColor = "#fff170";
    objStateStyle12.iOpacity = 90;

    var objStateStyle21 = [];
    objStateStyle21.arrSymbolPo = arrFiveSymbolPo;
    objStateStyle21.minScale = 40000;
    objStateStyle21.maxScale = 1280000;
    objStateStyle21.borderSize = 2;
    objStateStyle21.borderColor = "#000000";
    objStateStyle21.fillColor = "#466bf4";
    objStateStyle21.iOpacity = 90;

    var objStateStyle22 = [];
    objStateStyle22.arrSymbolPo = arrSixSymbolPo;
    objStateStyle22.minScale = 0;
    objStateStyle22.maxScale = 40000;
    objStateStyle22.borderSize = 2;
    objStateStyle22.borderColor = "#000000";
    objStateStyle22.fillColor = "#466bf4";
    objStateStyle22.iOpacity = 90;

    //设置船舶显示圆的样式
    API_SetShipStyleInSmallScale(1280000, null, 4); //这里设置填充颜色为null，即使用船舶状态本身的颜色(最小比例尺状态的那个样式)
    
    //添加第一种船舶状态，状态值0
    var iShipStatePos1 = API_AddNewShipState(0);
    var bResult1 = API_AddShipStateStyleByPos(iShipStatePos1, objStateStyle11); //船舶的状态0，在80000~2560000之间显示这个样式(不包括2560000)
    var bResult2 = API_AddShipStateStyleByPos(iShipStatePos1, objStateStyle12);

    //添加第二种船舶状态,状态值1
    var iShipStatePos2 = API_AddNewShipState(1);

    var bResult1 = API_AddShipStateStyleByPos(iShipStatePos2, objStateStyle21); //船舶的状态0，在80000~2560000之间显示这个样式(不包括2560000)
    var bResult2 = API_AddShipStateStyleByPos(iShipStatePos2, objStateStyle22);
}

function ShowInfoDivBox(objDiv,scrnPo) {
    if (objDiv) {
        //获取海图界面大小
        var offsetLen = 10;
        var divLeft = scrnPo.x + offsetLen;
        var divTop = scrnPo.y + offsetLen;
        var divSize = { w: objDiv.clientWidth, h: objDiv.clientHeight };
        var mapDiv = document.getElementById("map");
        if (mapDiv) {
            var mapWidth = mapDiv.clientWidth;
            var mapHeight = mapDiv.clientHeight;

            if (divLeft + divSize.w > mapWidth) {
                divLeft = scrnPo.x - divSize.w - offsetLen;
            }

            if (divTop + divSize.h > mapHeight) {
                divTop = scrnPo.y - divSize.h - offsetLen;
            }
        }

        objDiv.style.left = divLeft + "px";
        objDiv.style.top = divTop + "px";
        objDiv.style.display = "block";
    }
}

//--------------------------添加图层，添加物标前，必须先创建图层，这样才可以把物标添加到图层里面，一般初始化就添加好
function Test_AddLayer() {
    //这里演示添加3个图层，分别是点物标图层、线物标图层、面物标图层、气象图层

    //--------------------------添加点物标图层----------------------------------- 
    var pointLayerInfo = [];
    pointLayerInfo.id = g_iPointLayerId;
    pointLayerInfo.type = 1;//类型：1=点图层，2=线图层，3=面图层
    pointLayerInfo.name = "点图层";//图层名称
    pointLayerInfo.bShow = true; //显示

    pointLayerInfo.minShowScale = 1;//最大比例尺
    pointLayerInfo.maxShowScale = 2000000000;//最小比例尺
    pointLayerInfo.bShowTextOrNot = true;//是否显示名称
    pointLayerInfo.iStartShowTextScale = 5000000;//开始显示名称的最小比例尺
    
    var pointLayerPos = API_AddNewLayer(pointLayerInfo,null); //添加图层，得到图层的pos
    if (pointLayerPos > -1) {
        var pointStyle = [];


        //点图片样式           
        pointStyle.strImgSrc = "img/light.png"; //图片地址
        pointStyle.iImgWidth = 20; //图片的宽度
        pointStyle.iImgHeight = 30; //图片的高度
        pointStyle.offsetScrnPo = {x:0,y:-15};//显示的偏移量，(0,0)为图片中心

        
        /*
        //点矢量符号样式
        var arrSymbolPo = [];//矢量符号坐标
        arrSymbolPo.push({ x: 0, y: 15 });
        arrSymbolPo.push({ x: 15, y: -15 });
        arrSymbolPo.push({ x: -15, y: -15 });
        pointStyle.arrSymbolPo = arrSymbolPo;
        */
        
        
        //小圆符号样式
        //pointStyle.iCircleR = 5;//圆半径

        pointStyle.bShowImg = true;
        pointStyle.bShowText = true; //是否显示名称
        pointStyle.textColor = "#000000"; //名称颜色
        pointStyle.fontSize = "14px"; //名称字体大小
        pointStyle.iOpacity = 80;
        pointStyle.iTextOpacity = 80; //透明度
        pointStyle.bFilled = false; //是否填充颜色
        pointStyle.fillColor = "#ee5d72"; //填充的颜色
        g_iPointStylePos = API_AddPointLayerStyleByPos(pointLayerPos, pointStyle);

        API_SetLayerTextBackGroundColorByPos(pointLayerPos,false,"#FF0000",50);//设置文字背景颜色
    }

    //---------------------------------添加线物标图层----------------------------

    var lintLayerInfo = [];
    lintLayerInfo.id = g_iLineLayerId;
    lintLayerInfo.type = 2; //类型：1=点图层，2=线图层，3=面图层
    lintLayerInfo.name = "线图层"; //图层名称
    lintLayerInfo.bShow = true; //显示
    var lineLayerPos = API_AddNewLayer(lintLayerInfo, null); //添加图层，得到图层的pos

    if (lineLayerPos > -1) {
        var lineStyle = [];
        lineStyle.borderWith = 1; //线的粗细
        lineStyle.borderColor = "#0000FF"; //线的颜色
        lineStyle.iOpacity = 80; //透明度
        lineStyle.bShowText = true; //是否显示名称
        lineStyle.textColor = "#000000"; //名称颜色
        lineStyle.fontSize = "12px"; //名称字体大小
        lineStyle.iTextOpacity = 80; //透明度

        g_iLineStylePos = API_AddLineLayerStyleByPos(lineLayerPos, lineStyle);
        API_SetLayerTextBackGroundColorByPos(lineLayerPos,true, "#00FF00", 50); //设置文字背景颜色
    }

    //-------------------------------------添加面物标图层---------------------
    var faceLayerInfo = [];
    faceLayerInfo.id = g_iFaceLayerId;
    faceLayerInfo.type = 3; //类型：1=点图层，2=线图层，3=面图层
    faceLayerInfo.name = "面图层"; //图层名称
    faceLayerInfo.bShow = true; //显示
    var faceLayerPos = API_AddNewLayer(faceLayerInfo,null); //添加图层，得到图层的pos
    if (faceLayerPos > -1) {
        var faceStyle = [];
        faceStyle.borderWith = 1; //线的粗细
        faceStyle.borderColor = "#092ee8"; //线的颜色
        faceStyle.bFilled = true; //是否填充颜色
        //faceStyle.fillColor = "#FFFFFF"; //填充的颜色
        faceStyle.fillColor = "#FF0000"; //填充的颜色
        faceStyle.iOpacity = 50; //透明度
        faceStyle.bShowText = true; //是否显示名称
        faceStyle.textColor = "#000000"; //名称颜色
        faceStyle.fontSize = "12px"; //名称字体大小
        faceStyle.iTextOpacity = 80; //透明度
        faceStyle.iLineOpacity = 100;

        g_iFaceStylePos = API_AddFaceLayerStyleByPos(faceLayerPos, faceStyle);
        API_SetLayerTextBackGroundColorByPos(faceLayerPos,true, "#0000FF", 50); //设置文字背景颜色
    }
	
	 var faceLayerInfo = [];
    faceLayerInfo.id = gg_iFaceLayerId;
    faceLayerInfo.type = 3; //类型：1=点图层，2=线图层，3=面图层
    faceLayerInfo.name = "面框图层"; //图层名称
    faceLayerInfo.bShow = true; //显示
    var faceLayerPos = API_AddNewLayer(faceLayerInfo,null); //添加图层，得到图层的pos
    if (faceLayerPos > -1) {
        var faceStyle = [];
        faceStyle.borderWith = 1; //线的粗细
        faceStyle.borderColor = "#092ee8"; //线的颜色
        faceStyle.bFilled = false; //是否填充颜色
        //faceStyle.fillColor = "#FFFFFF"; //填充的颜色
        faceStyle.fillColor = "#FF0000"; //填充的颜色
        faceStyle.iOpacity = 50; //透明度
        faceStyle.bShowText = true; //是否显示名称
        faceStyle.textColor = "#000000"; //名称颜色
        faceStyle.fontSize = "12px"; //名称字体大小
        faceStyle.iTextOpacity = 80; //透明度
        faceStyle.iLineOpacity = 100;

        gg_iFaceStylePos = API_AddFaceLayerStyleByPos(faceLayerPos, faceStyle);
        API_SetLayerTextBackGroundColorByPos(faceLayerPos,true, "#0000FF", 50); //设置文字背景颜色
    }

    //--------------------------------------添加气象图层(也是点物标一种)--------------
    var weatherLayerInfo = [];
    weatherLayerInfo.id = g_iWeatherLayerId;
    weatherLayerInfo.type = 1; //类型：1=点图层，2=线图层，3=面图层
    weatherLayerInfo.name = "气象图层"; //图层名称
    weatherLayerInfo.bShow = true; //显示
    weatherLayerInfo.bShowImg = true;//显示图片
    weatherLayerInfo.minShowScale = 20000;//最小显示比例尺
    weatherLayerInfo.maxShowScale = 5120000; //最大显示比例尺
    var weatherLayerPos = API_AddNewLayer(weatherLayerInfo,null); //添加图层，得到图层的pos
    if (weatherLayerPos > -1) {
        //这里添加两种气象样式
        var weatherStyle1 = [];
        weatherStyle1.bShowImg = true;
        weatherStyle1.strImgSrc = "img/sunshine1.png"; //图片地址（晴天图片）
        weatherStyle1.iImgWidth = 30; //图片的宽度
        weatherStyle1.iImgHeight = 26; //图片的高度
        weatherStyle1.bShowText = false; //是否显示名称
        
        var pos1 = API_AddPointLayerStyleByPos(weatherLayerPos, weatherStyle1);//添加第一种气象样式,这里的pos1应该是0

        var weatherStyle2 = [];
        weatherStyle2.bShowImg = true;//显示图片
        weatherStyle2.strImgSrc = "img/raining1.png"; //图片地址（阴天图片）
        weatherStyle2.iImgWidth = 30; //图片的宽度
        weatherStyle2.iImgHeight = 26; //图片的高度
        weatherStyle2.bShowText = false; //是否显示名称
        var pos2 = API_AddPointLayerStyleByPos(weatherLayerPos, weatherStyle2); //添加第一种气象样式,这里的pos1应该是1
    }

    //--------------------------------------添加港口图层(也是点物标一种)--------------
    var portLayerInfo = [];
    portLayerInfo.id = g_iPortLayerId;
    portLayerInfo.type = 1; //类型：1=点图层，2=线图层，3=面图层
    portLayerInfo.name = "港口图层"; //图层名称
    portLayerInfo.bShow = true; //显示
    portLayerInfo.bShowImg = true;
    var portLayerPos = API_AddNewLayer(portLayerInfo,null); //添加图层，得到图层的pos
    if (portLayerPos > -1) {
        //这里一种样式
        var portStyle = [];
        portStyle.bShowImg = true; //显示图片
        portStyle.strImgSrc = "img/port.png"; //图片地址（晴天图片）
        portStyle.iImgWidth = 25; //图片的宽度
        portStyle.iImgHeight = 25; //图片的高度
        portStyle.bShowText = false; //是否显示名称
        var pos = API_AddPointLayerStyleByPos(portLayerPos, portStyle); //添加第一种港口样式,这里的pos应该是0
    }

    //---------------------------------------添加洋流图层(也是点物标，只是使用矢量符号来显示(箭头))-----------------------------------
    var ocLayerInfo = [];
    ocLayerInfo.id = g_iOceanCirculationLayerId; //洋流图层Id
    ocLayerInfo.type = 1; //类型：1=点图层，2=线图层，3=面图层
    ocLayerInfo.name = "洋流图层"; //图层名称
    ocLayerInfo.bShow = true; //显示
    var ocLayerPos = API_AddNewLayer(ocLayerInfo, null); //添加图层，得到图层的pos
    if (ocLayerPos > -1) {
        //这里一种样式
        var arrSymbolPo = [];//箭头符号
        arrSymbolPo.push({ x: -1, y: 10 });
        arrSymbolPo.push({ x: 1, y: 10 });
        arrSymbolPo.push({ x: 1, y: -3 });
        arrSymbolPo.push({ x: 3, y: -3 });
        arrSymbolPo.push({ x: 0, y: -10 });
        arrSymbolPo.push({ x: -3, y: -3 });
        arrSymbolPo.push({ x: -1, y: -3 });

        var ocStyle = [];
        ocStyle.bShowImg = false; //不使用图片，使用矢量符号
        ocStyle.arrSymbolPo = arrSymbolPo; //矢量符号顶点
        ocStyle.iImgWidth = 20; //符号的宽度
        ocStyle.iImgHeight = 50; //符号的高度
        ocStyle.bShowText = false; //是否显示名称
        ocStyle.borderWith = 1; //线的粗细
        ocStyle.borderColor = "#FF0000"; //线的颜色
        ocStyle.bFilled = false; //是否填充颜色
        ocStyle.fillColor = "#FF0000"; //填充的颜色
        ocStyle.iOpacity = 50; //透明度
        ocStyle.iCheckDrawMinNearOtherLen = 30;//该图层直接的物标间隙

        var pos = API_AddPointLayerStyleByPos(ocLayerPos, ocStyle); //添加第一种港口样式,这里的pos应该是0
    }    
}

//删除table的行
//tableName:table的id名称
//iStartIndex：开始删除的行
//iDelCount：删除的数量
function DelTableTrsByPos(tableName, iStartIndex, iDelCount) {
    var tableObj = document.getElementById(tableName);
    if (tableObj) {
        if (iStartIndex < -1) {
            iStartIndex = 0;
        }

        var iCanDelRowCount = parseInt(tableObj.rows.length) - iStartIndex;
        if (parseInt(iDelCount) > iCanDelRowCount) {
            iDelCount = iCanDelRowCount;
        }

        for (var i = 0; i < iDelCount; i++) {
            tableObj.deleteRow(iStartIndex);
        }
    }
}

//-------------------------------------拽动信息面板
var m_curDrayBoxObj = null;
var m_curMousePoX = 0;
var m_curMousePoY = 0;
function startDrayBox(divName) {
    m_curDrayBoxObj = document.getElementById(divName);
    var oEvent = window.event ? window.event : event;
    m_curMousePoX = parseInt(oEvent.clientX);
    m_curMousePoY = parseInt(oEvent.clientY);
    // console.log(m_curMousePoY)
    m_curDrayBoxObj.style.cursor = "move";
}

function toDrayBox() {
    var oEvent = window.event ? window.event : event;
    var curMousePoX = parseInt(oEvent.clientX);
    var curMousePoY = parseInt(oEvent.clientY);
    if (m_curDrayBoxObj != null) {
        var moveX = parseInt(curMousePoX) - parseInt(m_curMousePoX);
        var moveY = parseInt(curMousePoY) - parseInt(m_curMousePoY);
        m_curDrayBoxObj.style.left = parseInt(m_curDrayBoxObj.style.left) + parseInt(moveX) + "px";
        m_curDrayBoxObj.style.top = parseInt(m_curDrayBoxObj.style.top) + parseInt(moveY) + "px";

    }
    m_curMousePoX = curMousePoX;
    m_curMousePoY = curMousePoY;

}

function endDrayBox() {
    if (m_curDrayBoxObj) {
        m_curDrayBoxObj.style.cursor = "auto";
    }
    m_curDrayBoxObj = null;
    m_curMousePoX = 0;
    m_curMousePoY = 0;
}
//--------------------------------------------------------------------------

function CloseDivBox(divBoxId) {
    var obj = document.getElementById(divBoxId);
    if (obj) {
        obj.style.display = "none";
    }
}

function ShowDivBox(divBoxId, iLeft, iTop) {
    var obj = document.getElementById(divBoxId);
    if (obj) {
        if (obj.style.display != "block") {
            obj.style.display = "block";
            obj.style.left = parseInt(iLeft) + "px";
            obj.style.top = parseInt(iTop) + "px";
        }
    }
}

//--------------------------------------------------------------------------

//显示简单的点对象信息（鼠标移动到对象显示）：气象、点物标
function ShowObjSimpleInfo(layerId, objId,scrnPo) {
    var iLayerPos = API_GetLayerPosById(layerId);
    if (iLayerPos > -1) {
        var iMsgBoxHeight = 20;
        var iMsgBoxWidth = 200;
        var ObjPos = API_GetObjectPosById(objId, iLayerPos);
        var iObjPos = -1;
        if (ObjPos)
        {
            iObjPos = ObjPos.iObjPos;
        }
        var curObjInfoObj = API_GetObjectInfoByPos(iLayerPos, iObjPos);
        if (curObjInfoObj) {
            var strInnerHTML = "";
            var strName = curObjInfoObj.name;
            var arrExpAttrValue = curObjInfoObj.arrExpAttrValue;
            if (layerId == g_iWeatherLayerId) { //显示气象信息
                var strTitle = "天气预报:" + strName;
                strInnerHTML = "<center><nobr> " + strTitle.big().bold().fontcolor("#f2fa03") + "</nobr></center>";
                if (arrExpAttrValue) {
                    var iExpAttrCount = arrExpAttrValue.length;
                    for (var iExpAttrPos = 0; iExpAttrPos < iExpAttrCount; iExpAttrPos++) {
                        strInnerHTML += arrExpAttrValue[iExpAttrPos] + "<br>";
                        iMsgBoxHeight += g_iSimpleBoxOneLineSize;
                    }
                }
            }
            else if (layerId == g_iPortLayerId)//港口
            {
                var strTitle = "港口:" + strName;
                strInnerHTML = "<center><nobr> " + strTitle.big().bold().fontcolor("#f2fa03") + "</nobr></center>";
                var arrGeoPo = API_GetObjectGeoInfoByPos(iLayerPos, iObjPos); //获取坐标
                var strLonLat = "--";
                if (arrGeoPo.length > 0) {
                    strLonLat = API_LonLatToString(arrGeoPo[0].x /  10000000, true);
                    var strLat = API_LonLatToString(arrGeoPo[0].y / 10000000, false);
                    strLonLat += "," + strLat;
                }

                strInnerHTML += "坐标:" + strLonLat + "<br>";
                iMsgBoxHeight += g_iSimpleBoxOneLineSize;
                if (arrExpAttrValue) {
                    var iExpAttrCount = arrExpAttrValue.length;
                    for (var iExpAttrPos = 0; iExpAttrPos < iExpAttrCount; iExpAttrPos++) {
                        strInnerHTML += arrExpAttrValue[iExpAttrPos] + "<br>";
                        iMsgBoxHeight += g_iSimpleBoxOneLineSize;
                    }
                }
            }
            else {
                strInnerHTML = curObjInfoObj.name;
            }

            g_showSimpleInfoDiv.innerHTML = strInnerHTML;
            g_showSimpleInfoDiv.style.height = iMsgBoxHeight + "px";
            g_showSimpleInfoDiv.style.width = iMsgBoxWidth + "px";

            ShowInfoDivBox(g_showSimpleInfoDiv, scrnPo);
        }
        
    }
}

//显示简单的船舶信息（鼠标移动到船舶显示）
function ShowShipSimpleInfo(shipId, bSelPlayTrackShip, iTrackPos, scrnPo) {
    
    //选中的是轨迹回放的船舶
    if (bSelPlayTrackShip == true) {
        var iShipPos = API_GetPlayShipPosById(shipId);
        if (iShipPos > -1) {

            var iMsgBoxHeight = 20;
            var iMsgBoxWidth = 200;
            iMsgBoxHeight += g_iSimpleBoxOneLineSize;
            var shipName, shipMmsi, shipGeoPoX, shipGeoPoY, shipSpeed, shipCourse, shipTime;
            var strTitle;
            var shipInfoObj = API_GetPlayShipInfoByPos(iShipPos);
            if (shipInfoObj) {
                shipName = shipInfoObj.shipName;
                shipMmsi = shipInfoObj.shipMMSI;
                shipGeoPoX = shipInfoObj.shipGeoPoX;
                shipGeoPoY = shipInfoObj.shipGeoPoY;
                shipSpeed = shipInfoObj.shipSpeed;
                shipCourse = shipInfoObj.shipCourse;
                shipTime = shipInfoObj.shipTime;
                strTitle = "船舶信息:" + shipName;
            }

            if (iTrackPos != null) {//选中的是轨迹点
                var shipInfoObj = API_GetPlayHistroyTrackInfoByPos(iShipPos, iTrackPos);
                if (shipInfoObj) {
                    strTitle = "历史轨迹点信息";
                    shipGeoPoX = shipInfoObj.trackGeoPoX;
                    shipGeoPoY = shipInfoObj.trackGeoPoY;
                    shipSpeed = shipInfoObj.trackSpeed;
                    shipCourse = shipInfoObj.trackCourse;
                    shipTime = shipInfoObj.trackTime;
                }
            }
            if (shipSpeed) {
                shipSpeed = shipSpeed.toFixed(2);
            }

            var strInnerHTML = "<center><nobr> " + strTitle.big().bold().fontcolor("#f2fa03") + "</nobr></center>";
            strInnerHTML += "船名:" + shipName + "<br>";
            iMsgBoxHeight += g_iSimpleBoxOneLineSize; //修改信息面板的高度
            strInnerHTML += "MMSI:" + shipMmsi + "<br>";
            iMsgBoxHeight += g_iSimpleBoxOneLineSize;
            var strLon = API_LonLatToString(shipGeoPoX / 1000000, false);
            strInnerHTML += "经度:" + strLon + "<br>";
            iMsgBoxHeight += g_iSimpleBoxOneLineSize;
            var strLat = API_LonLatToString(shipGeoPoY / 1000000, false);
            strInnerHTML += "纬度:" + strLat + "<br>";
            iMsgBoxHeight += g_iSimpleBoxOneLineSize;
            strInnerHTML += "航速:" + shipSpeed + "(节)<br>";
            iMsgBoxHeight += g_iSimpleBoxOneLineSize;
            strInnerHTML += "航向:" + shipCourse + "(度)<br>";
            iMsgBoxHeight += g_iSimpleBoxOneLineSize;
            strInnerHTML += "时间:" + shipTime + "<br>";
            iMsgBoxHeight += g_iSimpleBoxOneLineSize;

            g_showSimpleInfoDiv.innerHTML = strInnerHTML;
            g_showSimpleInfoDiv.style.height = iMsgBoxHeight + "px";
            g_showSimpleInfoDiv.style.width = iMsgBoxWidth + "px";
            ShowInfoDivBox(g_showSimpleInfoDiv, scrnPo);
        }        
        
    }
    else {//选中的是当前船舶
        var iShipPos = API_GetShipPosById(shipId);
        if (iShipPos > -1) {
            var shipInfoObj = API_GetShipInfoByPos(iShipPos);
            if (shipInfoObj) {
                var shipName = shipInfoObj.shipName;
                var shipMmsi = shipInfoObj.shipMMSI;
                var shipTime = shipInfoObj.shipTime;

                var strInnerHTML = "<nobr>船名: " + shipName + "</nobr><br/><nobr>MMSI: " + shipMmsi + "</nobr>";
                g_showSimpleInfoDiv.style.height = "35px"; //只显示两行
                g_showSimpleInfoDiv.style.width = "120px";
                g_showSimpleInfoDiv.innerHTML = strInnerHTML;
                ShowInfoDivBox(g_showSimpleInfoDiv, scrnPo);
            }
        }
    }
    
}

//显示简单的台风轨迹点信息（鼠标移动到台风轨迹点(真实和预测轨迹点)显示）
function ShowTyphoonTrackSimpleInfo(typhoonId,iTruePos,iPredictPos, scrnPo) {
    var iTyphoonPos = API_GetTyphoonPosById(typhoonId);
    if (iTyphoonPos > -1) {
        var curTrackInfo = API_GetTyphoonTrackInfoByPos(iTyphoonPos, iTruePos, iPredictPos);//获取轨迹点信息

        if (curTrackInfo) {
            var iMsgBoxHeight = 20;
            var iMsgBoxWidth = 200;
            
            var time = curTrackInfo.time; //时间
            var po = curTrackInfo.po; //坐标
            var windPower = curTrackInfo.windPower; //风力
            var windSpeed = curTrackInfo.windSpeed; //风速
            var airPressure = curTrackInfo.airPressure; //气压

            var strReportStation = curTrackInfo.strReportStation;//预报台（只有预测轨迹点才有）

            var moveDirection = curTrackInfo.moveDirection; ; //移向(真实轨迹点才有)
            var moveSpeed = curTrackInfo.moveSpeed; ; //移速(真实轨迹点才有)
            var sevenRadius = curTrackInfo.sevenRadius; //7级半径(真实轨迹点才有)
            var tenRadius = curTrackInfo.tenRadius; //10级半径(真实轨迹点才有)
            var strTyphoonName = "";

            var curTyphoonInfo = API_GetTyphoonInfoByPos(iTyphoonPos);
            strTyphoonName = curTyphoonInfo.name; //台风名称
            
            var strTitle = "台风:" + strTyphoonName;
            var strInnerHTML = "<center><nobr> " + strTitle.big().bold().fontcolor("#f2fa03") + "</nobr></center>";

            if (strReportStation) {
                strInnerHTML += "<nobr>预报：" + strReportStation.fontcolor("#f2fa03") + "</nobr><br>";
                iMsgBoxHeight += g_iSimpleBoxOneLineSize;
            }
            
            strInnerHTML += "<nobr>时间：" + time.fontcolor("#f2fa03") + "</nobr><br>";
            iMsgBoxHeight += g_iSimpleBoxOneLineSize;

            strLon = API_LonLatToString(po.x / 10000000, true);
            strInnerHTML += "<nobr>经度：" + strLon.fontcolor("#f2fa03") + "</nobr><br>";
            iMsgBoxHeight += g_iSimpleBoxOneLineSize;

            var strLat = API_LonLatToString(po.y / 10000000, false);
            strInnerHTML += "<nobr>纬度：" + strLat.fontcolor("#f2fa03") + "</nobr><br>";
            iMsgBoxHeight += g_iSimpleBoxOneLineSize;

            var strWindPower = windPower + "（级）";
            strInnerHTML += "<nobr>风力：" + strWindPower.fontcolor("#f2fa03") + "</nobr><br>";
            iMsgBoxHeight += g_iSimpleBoxOneLineSize;

            var strWindSpeed = windSpeed + "（米/秒）";
            strInnerHTML += "<nobr>风速：" + strWindSpeed.fontcolor("#f2fa03") + "</nobr><br>";
            iMsgBoxHeight += g_iSimpleBoxOneLineSize;

            var strAirPressure = airPressure + "（百帕）";
            strInnerHTML += "<nobr>气压：" + strAirPressure.fontcolor("#f2fa03") + "</nobr><br>";
            iMsgBoxHeight += g_iSimpleBoxOneLineSize;

            //不是预测轨迹点的时候
            if (iPredictPos == null) {
                if (!moveDirection)
                {
                    moveDirection = "--";
                }
                strInnerHTML += "<nobr>移向：" + moveDirection.fontcolor("#f2fa03") + "</nobr><br>";
                iMsgBoxHeight += g_iSimpleBoxOneLineSize;

                if (!moveSpeed) {
                    moveSpeed = "--";
                }
                var strMoveSpeed = moveSpeed + "（公里/小时）";
                strInnerHTML += "<nobr>移速：" + strMoveSpeed.fontcolor("#f2fa03") + "</nobr><br>";
                iMsgBoxHeight += g_iSimpleBoxOneLineSize;

                
                if (!sevenRadius) {
                    sevenRadius = "--";
                }

                var strSevenRadius = sevenRadius + "（公里）";
                strInnerHTML += "<nobr>七级半径：" + strSevenRadius.fontcolor("#f2fa03") + "</nobr><br>";
                iMsgBoxHeight += g_iSimpleBoxOneLineSize;

                if (!tenRadius) {
                    tenRadius = "--";
                }
                var strTenRadius = tenRadius + "（公里）";
                strInnerHTML += "<nobr>十级半径：" + strTenRadius.fontcolor("#f2fa03") + "</nobr><br>";
                iMsgBoxHeight += g_iSimpleBoxOneLineSize;
            }

            g_showSimpleInfoDiv.style.height = iMsgBoxHeight + "px"; 
            g_showSimpleInfoDiv.style.width = iMsgBoxWidth + "px";
            g_showSimpleInfoDiv.innerHTML = strInnerHTML;
            ShowInfoDivBox(g_showSimpleInfoDiv, scrnPo);
        }
    }
}

//显示船舶详细信息面板（鼠标点击船舶信息）
function ShowShipDetailInfo(shipId, bSelPlayTrackShip, scrnPo) {
    var iShipPos = -1; 
    var shipInfoObj = null;
    if (bSelPlayTrackShip == true)
    {
        iShipPos = API_GetPlayShipPosById(shipId); //轨迹回放船舶
        if (iShipPos > -1) {
            shipInfoObj = API_GetPlayShipInfoByPos(iShipPos);
            API_SetSelectPlayShipByPos(iShipPos); //设置选中船舶，即显示船舶边框
        }
    }
    else
    {
        iShipPos = API_GetShipPosById(shipId);//当前船舶
        if (iShipPos > -1) {
            shipInfoObj = API_GetShipInfoByPos(iShipPos);
            API_SetSelectShipByPos(iShipPos); //设置选中船舶，即显示船舶边框
        }
    }

    if (shipInfoObj) {
        var shipName = shipInfoObj.shipName;        //船名名称
        var shipMmsi = shipInfoObj.shipMMSI;        //mmsi
        var shipGeoPoX = shipInfoObj.shipGeoPoX;    //位置
        var shipGeoPoY = shipInfoObj.shipGeoPoY;
        var shipSpeed = shipInfoObj.shipSpeed;      //速度
        var shipCourse = shipInfoObj.shipCourse;    //航向
        var shipWidth = shipInfoObj.shipWidth;      //宽度
        var shipLength = shipInfoObj.shipLength;    //长度            
        var iShipState = shipInfoObj.iShipState;    //状态
        var bOnlineOrNot = shipInfoObj.bOnlineOrNot; //是否在线
        var shipTime = shipInfoObj.shipTime;        //时间
        var bShowTrack = shipInfoObj.bShowTrack;    //是否显示轨迹
        var bFollow = shipInfoObj.bFollow; //是否跟踪船舶
        var strShipLon = API_LonLatToString(shipGeoPoX / 10000000, true);
        var strShipLat = API_LonLatToString(shipGeoPoY / 10000000, false);

        DelTableTrsByPos("TableShipInfo", 0, 1000);
        ShowDivBox("ShowDetailShipInfoDiv", 20, 20);

        var newRow = TableShipInfo.insertRow(-1);
        var newTd = newRow.insertCell(); //船名
        newTd.style.width = "10%";
        newTd.innerHTML = "<nobr><b>船名</b><nobr/>:";
        newTd = newRow.insertCell();
        newTd.style.width = "30%";
        newTd.innerHTML = shipName;
        newTd = newRow.insertCell(); //MMSi
        newTd.style.width = "10%";
        newTd.innerHTML = "<b>MMSI</b>:";
        newTd = newRow.insertCell();
        newTd.style.width = "30%";
        newTd.innerHTML = shipMmsi;

        newRow = TableShipInfo.insertRow(-1);
        newTd = newRow.insertCell(); //经度            
        newTd.innerHTML = "<b>经度</b>:";
        newTd = newRow.insertCell();
        newTd.innerHTML = strShipLon;
        newTd = newRow.insertCell(); //纬度
        newTd.innerHTML = "<b>纬度</b>:";
        newTd = newRow.insertCell();
        newTd.innerHTML = strShipLat;

        newRow = TableShipInfo.insertRow(-1);
        newTd = newRow.insertCell(); //航速            
        newTd.innerHTML = "<b>航速</b>:";
        newTd = newRow.insertCell();
        newTd.innerHTML = shipSpeed + ("节");
        newTd = newRow.insertCell(); //航向
        newTd.innerHTML = "<b>航向</b>:";
        newTd = newRow.insertCell();
        newTd.innerHTML = shipCourse + "(度)";

        newRow = TableShipInfo.insertRow(-1);
        newTd = newRow.insertCell(); //船长            
        newTd.innerHTML = "<b>长度</b>:";
        newTd = newRow.insertCell();
        newTd.innerHTML = shipLength + "(米)";
        newTd = newRow.insertCell(); //船宽
        newTd.innerHTML = "<b>船宽</b>:";
        newTd = newRow.insertCell();
        newTd.innerHTML = shipWidth + "(米)";

        newRow = TableShipInfo.insertRow(-1);
        newTd = newRow.insertCell(); //类型
        newTd.innerHTML = "<b>状态</b>:";
        newTd = newRow.insertCell();
        newTd.innerHTML = bOnlineOrNot == true ? "在线" : "离线";
        newTd = newRow.insertCell(); //状态
        newTd.innerHTML = "<b>类型</b>:";
        newTd = newRow.insertCell();
        newTd.innerHTML = iShipState == 0 ? "渔船" : "货船";

        newRow = TableShipInfo.insertRow(-1);
        newTd = newRow.insertCell(); //时间
        newTd.innerHTML = "<b>时间</b>:";
        newTd = newRow.insertCell();
        newTd.setAttribute("colspan", 3);
        newTd.innerHTML = "<nobr>" + shipTime + "</nobr>";

        document.getElementById("bSelPlayTrackShip").value = bSelPlayTrackShip == true ? "1" : "0";
        document.getElementById("ShowShipId").value = shipId;
        document.getElementById("ShowShipTrackOrNot").value = bShowTrack == true ? "隐藏轨迹" : "显示轨迹";
        document.getElementById("FollowShip").value = bFollow == true ? "取消跟踪" : "跟踪船舶";
    }
   
}

//是否显示船舶轨迹
function SetCurShowShipInfo(type) {
    var iShipId = document.getElementById("ShowShipId").value;
    var bSelPlayTrackShip = document.getElementById("bSelPlayTrackShip").value == "1" ? true : false;
    if (iShipId == null) {
        return;
    }

    if (type == 1) {//显示/隐藏当前轨迹
        var buttonObj = document.getElementById("ShowShipTrackOrNot");
        var strButtonText = buttonObj.value;
        var bShowOrNot;
        if (strButtonText == "显示轨迹") {
            buttonObj.value = "隐藏轨迹";
            bShowOrNot = true;
        }
        else {
            buttonObj.value = "显示轨迹";
            bShowOrNot = false;
        }

        if (bSelPlayTrackShip == true) {
            var iShipPos = API_GetPlayShipPosById(iShipId);
            API_SetShowPlayShipTrackOrNotByPos(iShipPos, bShowOrNot);
        }
        else {
            var iShipPos = API_GetShipPosById(iShipId);
            API_SetShowShipTrackOrNotByPos(iShipPos, bShowOrNot);
        }
        
    }
    else if (type == 2) {//居中船舶
        if (bSelPlayTrackShip == true) {
            var iShipPos = API_GetPlayShipPosById(iShipId);
            API_SetPlayShipToMapViewCenterByPos(iShipPos, bShowOrNot);
        }
        else {
            var iShipPos = API_GetShipPosById(iShipId);
            API_SetShipToMapViewCenterByPos(iShipPos, bShowOrNot);
        }
    }
    else if (type == 3) {//跟踪/取消跟踪船舶
        var buttonObj = document.getElementById("FollowShip");
        var strButtonText = buttonObj.value;

        var iFollowShipId = -1;
        if (strButtonText == "跟踪船舶") {
            buttonObj.value = "取消跟踪";
            iFollowShipId = iShipId;            
        }
        else {
            buttonObj.value = "跟踪船舶";
        }
        if (bSelPlayTrackShip == true) {
            var iShipPos = -1;
            if (iFollowShipId > -1) {
                iShipPos = API_GetPlayShipPosById(iFollowShipId);
            }
             
            API_FollowPlayShipByPos(iFollowShipId); ; 
        }
        else {
            var iShipPos = -1;
            if (iFollowShipId > -1) {
                iShipPos = API_GetShipPosById(iShipId);
            }
             
            API_FollowShipByPos(iShipPos); ; 
        }
    }

    //重绘是为了立刻看到效果，否则会等下一次重绘才看到效果
    if (bSelPlayTrackShip == true) {
        API_ReDrawPlayShip(); //重绘回放船舶
    }
    else {
        API_ReDrawShips(); //重绘船舶
    }
    
}

//取消选中船舶
function SetNoSelectShip() {
    var iShipId = document.getElementById("ShowShipId").value;
    var bSelPlayTrackShip = document.getElementById("bSelPlayTrackShip").value == "1" ? true : false;
    if (bSelPlayTrackShip)//是回放船舶
    {
        var iShipPos = API_GetPlayShipPosById(iShipId);
        API_SetSelectPlayShipByPos(iShipPos);
    }
    else {
        var iShipPos = API_GetShipPosById(iShipId);
        API_SetSelectShipByPos(iShipPos);
    }
}

function ShowObjDetailInfo(layerId, objId, scrnPo) {
    var iLayerPos = API_GetLayerPosById(layerId);//得到图层的pos
    if (iLayerPos > -1) {
        var iMsgBoxHeight = 20;
        var iMsgBoxWidth = 200;
        var ObjPos = API_GetObjectPosById(objId, iLayerPos);
        var iObjPos = -1;
        if (ObjPos) {
            iObjPos = ObjPos.iObjPos;
        }
        var curObjInfoObj = API_GetObjectInfoByPos(iLayerPos, iObjPos);
        if (curObjInfoObj) {
            var strInnerHTML = "";
            var strName = curObjInfoObj.name;
            var arrExpAttrValue = curObjInfoObj.arrExpAttrValue;
            if (layerId == g_iWeatherLayerId) { //显示气象信息
                //气象信息，这里可以得气象信息，可以根据气象信息去数据库或者其他地方获取信息来显示
            }
            else if (layerId == g_iPortLayerId)//港口
            {
                //物标信息对象curObjInfoObj有添加时候的id、扩展字段等信息，可以根据这些信息去数据库或者其他地方获取信息来显示
                var portId = curObjInfoObj.id;
                ShowPortInfo(portId, strName);
                
            }
            else {
                //只是自定义物标信息
            }

            if (strInnerHTML) {
                g_showSimpleInfoDiv.innerHTML = strInnerHTML;
                g_showSimpleInfoDiv.style.height = iMsgBoxHeight + "px";
                g_showSimpleInfoDiv.style.width = iMsgBoxWidth + "px";

                ShowInfoDivBox(g_showSimpleInfoDiv, scrnPo);
            }
        }

    }
}

function ShowPortInfo(id, strName) {
    ShowDivBox("ShowPortInfoDiv", 20, 20); //弹出信息面板
    
    document.getElementById("PortName").innerHTML = strName.big().bold().fontcolor("#FF000000");
    var nowTime = new Date();
    var strTime = nowTime.getFullYear() + "/" + nowTime.getMonth() + "/" + nowTime.getDay();
    document.getElementById("PortInfoTime").innerHTML = strTime.big().bold().fontcolor("#FF000000");
    //这里不演示去数据库获取数据了，直接写固定的信息来显示

    DelTableTrsByPos("PortTable", 0, 100); //清除之前显示的数据

    for (var i = 0; i < 6; i++) {
        var iTime = 2 * (i + 1);
        var strTime = iTime;
        if (iTime < 10) {
            strTime = "0" + strTime;
        }
        var iValue = parseInt(Math.random() * 200);
        var newRow = PortTable.insertRow(-1);
        var newTd = newRow.insertCell();
        newTd.style.width = "25%";
        newTd.innerHTML = "<b>潮时"+(i+1)+"：</b>" + strTime + ":00";
        newTd = newRow.insertCell();
        newTd.style.width = "10%";
        newTd.innerHTML = "<b>潮高：</b>";
        newTd = newRow.insertCell();
        newTd.style.width = "15%";
        newTd.innerHTML = iValue + "cm";
        newTd = newRow.insertCell();

        iValue = parseInt(Math.random() * 100);
        newTd.style.width = "25%";
        newTd.innerHTML = "<b>潮时" + (i + 1) + "：</b>" + strTime + ":30";
        newTd = newRow.insertCell();
        newTd.style.width = "10%";
        newTd.innerHTML = "<b>潮高：</b>";
        newTd = newRow.insertCell();
        newTd.style.width = "15%";
        newTd.innerHTML = iValue + "cm";
    }
}

//显示测距信息
function GetCurMeasureDist(CurDis, allMeasureDist, CurDegrees) {
    var allMile = parseInt(allMeasureDist * 1000); //转换成米
    var curMile = parseInt(CurDis * 1000);
    var curHaiLi = curMile / 1852;
    var curAllHaiLi = allMile / 1852;

    var strAllMile = "";
    var strCurMile = "";
    if (allMile > 1000) {
        strAllMile = (allMile / 1000).toFixed(2) + "千米（" + curAllHaiLi.toFixed(2) + "海里）";
    }
    else {
        strAllMile = allMile + "米（" + curHaiLi.toFixed(2) + "海里）";
    }

    if (curMile > 1000) {
        strCurMile = (curMile / 1000).toFixed(2) + "千米（" + curHaiLi.toFixed(2) + "海里）";
    }
    else {
        strCurMile = curMile + "米（" + curHaiLi.toFixed(2) + "海里）";
    }

    document.getElementById("allMeasureDist").innerHTML = strAllMile;

    document.getElementById("curDis").innerHTML = strCurMile;
    var curFangWei = Math.round(CurDegrees * 1000) / 1000;
    document.getElementById("curDegrees").innerHTML = curFangWei.toFixed(2) + "度";
}

//得到动态绘制物标(点、线、一般面)时，最后一个点坐标
function GetCurDrawObjCurPo(geoPoX, geoPoY) {
    //添加到table表中
    g_iDrawObjPoNum++;
    var newRow = DrawObjInfoTable.insertRow(-1);
    var newTd0 = newRow.insertCell(); //序号
    var newTd1 = newRow.insertCell(); //经度
    var newTd2 = newRow.insertCell(); //纬度

    newTd0.innerHTML = g_iDrawObjPoNum;
    newTd1.innerHTML = parseInt(geoPoX);
    newTd2.innerHTML = parseInt(geoPoY);
}

//得到动态绘制矩形的信息
//geoPoX:矩形左上顶点坐标
//geoPoY:矩形左上顶点坐标
//widthDis:矩形的宽度,单位(km)
//heightDis:矩形的高度,单位(km)
function GetCurDrawRectInfo(geoPoX, geoPoY, widthDis, heightDis) {
    var haiLiWidthDis = widthDis * 0.5399568;
    var haiLiHeightDis = heightDis * 0.5399568;
    document.getElementById("curDrawRectGeoPo").innerHTML = parseInt(geoPoX) + "," + parseInt(geoPoY);
    document.getElementById("curDrawRectWidthDis").innerHTML = haiLiWidthDis.toFixed(3);
    document.getElementById("curDrawRectHeightDis").innerHTML = haiLiHeightDis.toFixed(3);
}

//得到动态绘制圆的信息
//geoPoX:圆心
//geoPoY:圆心
//rDis:半径,单位(km)
function GetCurDrawCircleInfo(geoPoX, geoPoY, rDis) {
    var hailiRDis = rDis * 0.5399568; //半径，转换海里
    var curDrawCircleGeoPoObj = document.getElementById("curDrawCircleGeoPo");
    
    //if (curDrawCircleGeoPoObj.innerHTML == "") {
        curDrawCircleGeoPoObj.innerHTML = parseInt(geoPoX) + "," + parseInt(geoPoY);
    //}

    document.getElementById("curDrawCircleR").innerHTML = hailiRDis.toFixed(3);
}


