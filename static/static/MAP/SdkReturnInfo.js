/*
*文件:SdkReturnInfo.js,功能：此文件的方法为海图操作的时候，YimaEnc SDK返回来的信息，
*比如绘制标注返回坐标、测距返回距离、鼠标选中船舶返回船舶信息等
*/

//鼠标移动时，选中对象的信息（手机版本这个方法不会被调用）
function ReturnSelectObjByMouseMove(objInfo) {
    if (objInfo) {
        var scrnPo = objInfo.po;
        switch (objInfo.objType) {//{objType,id,po}
            case 1: //选中了船舶，得到船舶的id,pos
                var iShipId = objInfo.id;
                var bSelPlayTrackShip = objInfo.bSelPlayTrackShip;//是否选中了轨迹回放的船舶
                var iTrackPos = objInfo.iTrackPos; //假如是轨迹回放，则是选中轨迹点pos
                ShowShipSimpleInfo(iShipId,bSelPlayTrackShip,iTrackPos, scrnPo);
                break;
            case 2: //选中了点物标，得到物标所属的图层layerId以及物标objId
                var layerId = objInfo.layerId;//图层的id
                var objId = objInfo.objId;//物标的id
                ShowObjSimpleInfo(layerId, objId, scrnPo);
                break;
            case 3: //选中了台风轨迹信息
                var typhoonId = objInfo.typhoonId; //台风id
                var iTruePos = objInfo.iTruePos; //台风真实轨迹点pos
                var iPredictPos = objInfo.iPredictPos; //真实轨迹点的预测轨迹点pos
                ShowTyphoonTrackSimpleInfo(typhoonId, iTruePos, iPredictPos, scrnPo);
                break;
        }
    }
    else {
        if (g_showSimpleInfoDiv) {
            g_showSimpleInfoDiv.style.display = "none";
        }
    }
}

//鼠标左击时查询到的对象信息
function ReturnSelectObjByMouseLeftDown(objInfo) {
    if (objInfo == null) {
        return;
    }
    
    if (objInfo) {
        switch (objInfo.objType) {
            case 1: //选中了船舶，得到船舶的id,pos
                var iShipId = objInfo.id;
                var scrnPo = objInfo.po;
                var bSelPlayTrackShip = objInfo.bSelPlayTrackShip;
                ShowShipDetailInfo(iShipId, bSelPlayTrackShip, scrnPo); //显示船舶的详细信息
                break;
            case 2: //选中了物标，得到物标所属的图层id以及物标id
                var layerId = objInfo.layerId; //图层的id
                var objId = objInfo.objId; //物标的id
                ShowObjDetailInfo(layerId,objId, scrnPo);//显示物标的详细信息
                break;
            case 3:
                break;
        }
    }
    else {
        if (g_showSimpleInfoDiv) {
            g_showSimpleInfoDiv.style.display = "none";
        }
    }
}

//鼠标右键事件
//scrnPo:鼠标在海图上的位置
function ReturnOnMouseRightDown(scrnPo) {
    var selObjInfo = API_SelectCurScrnShowObjectInfoByScrnPo(scrnPo, false);
    if (selObjInfo) {
        var iSelObjCount = selObjInfo.length;
        if (iSelObjCount > 0) {
            API_SetCurHighLightObjectById(selObjInfo[0].layerId, selObjInfo[0].objId); //高亮当前右键选中的物标
        }
    }
    else {
        API_SetCurHighLightObjectById(-1, -1);//取消高亮
    }

    var scale = API_GetCurMapScale();
    var po = API_GetCurMapCenterLonLatPo();
}

//绘制类型结构体
var DynamicSymbolType =
{
    none: 0, //无状态
    drawPoint: 1, //绘制点
    drawLine: 2, //绘制线
    drawFace: 3, //绘制面
    drawRect: 4, //绘制矩形
    drawCircle: 5,//绘制圆
    measureDist: 6, //测距
    measureArea: 7, //测面积
    directionLine: 8//方位线
};

//动态绘制物标时，选中点之后返回的坐标
function ReturnDrawDynamicObjNewInfo(objDynamicInfo) {
    if (objDynamicInfo) {
        switch (objDynamicInfo.type) {
            case DynamicSymbolType.drawPoint:
                GetCurDrawObjCurPo(objDynamicInfo.po.x, objDynamicInfo.po.y);
                break;
            case DynamicSymbolType.drawLine: //绘制线
                GetCurDrawObjCurPo(objDynamicInfo.po.x, objDynamicInfo.po.y);
                break;
            case DynamicSymbolType.drawFace: //绘制面
                GetCurDrawObjCurPo(objDynamicInfo.po.x, objDynamicInfo.po.y);
                break;
            case DynamicSymbolType.drawRect: //绘制矩形
                GetCurDrawRectInfo(objDynamicInfo.po.x, objDynamicInfo.po.y, objDynamicInfo.w, objDynamicInfo.h);
                break;
            case DynamicSymbolType.drawCircle: //绘制圆
                GetCurDrawCircleInfo(objDynamicInfo.po.x, objDynamicInfo.po.y, objDynamicInfo.r);
                break;
            case DynamicSymbolType.drawPoint: //测距
                API_SetCurDrawDynamicUseType(DynamicSymbolType.drawPoint);
                break;
            case DynamicSymbolType.drawPoint: //测面积
                API_SetCurDrawDynamicUseType(DynamicSymbolType.drawPoint);
                break;
            case DynamicSymbolType.drawPoint: //电子方位线
                API_SetCurDrawDynamicUseType(DynamicSymbolType.drawPoint);
                break;
        }
    }
}

//返回测距时的距离：鼠标移动激发该方法
//CurDis：当前段距离（km)
//allMeasureDist：累加距离（km）
//CurDegrees：当前方位（度）
function ReturnCurMeasureDist(CurDis, allMeasureDist, CurDegrees) {
    GetCurMeasureDist(CurDis, allMeasureDist, CurDegrees);
}

//测距时候，鼠标点击激发该方法
//curGeoPo:鼠标当前点击的经纬度坐标，格式{1210000000,310000000}
//curDis:当前点击点与上一个点的距离（km)
//allMeasureDist:累加的距离（km）
//CurDegrees:当前点与上一个点的角度（度）
function ReturnCurMeasurePoInfoByMouseDown(curGeoPo, curDis, allMeasureDist, CurDegrees) {
    if (curGeoPo) {
        //alert("测距点信息："+curGeoPo.x + "," + curGeoPo.y + "_" + curDis + "_" + allMeasureDist + "_" + CurDegrees);
    }
}