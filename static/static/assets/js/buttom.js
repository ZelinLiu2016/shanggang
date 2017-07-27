var g_ButtomLayerId = 11111;
var g_ButtomStylePos = [];
var faceLayerPos2 = 200;
var coorNum = 4;
var buttomNum = 0;

var waiLatitu1 = [{x: "121:34:20.9868", y: "31:22:42.5395"}, {x: "121:34:31.1886", y: "31:22:38.2704"}, {x: "121:35:15.9875", y: "31:22:19.5182"}, {x: "121:35:36.8365", y: "31:22:08.3102"}, {x: "121:35:46.4557", y: "31:22:03.1435"}, {x: "121:36:08.0308", y: "31:22:32.6818"}, {x: "121:35:57.9734", y: "31:22:37.2534"}, {x: "121:34:49.7134", y: "31:23:08.2783"}, {x: "121:34:45.3848", y: "31:23:10.2463"}, {x: "121:34:39.0199", y: "31:22:59.9397"}];
var waiLatitu4 = [{x: "121:38:45.7525", y: "31:20:31.8628"}, {x: "121:38:54.5107", y: "31:20:27.7900"}, {x: "121:38:59.9331", y: "31:20:25.2694"}, {x: "121:39:02.4272", y: "31:20:24.1107"}, {x: "121:39:28.9743", y: "31:20:11.7604"}, {x: "121:39:34.6588", y: "31:20:09.1188"}, {x: "121:39:55.2036", y: "31:19:57.4021"}, {x: "121:40:09.7306", y: "31:19:49.1122"}, {x: "121:40:40.4341", y: "31:19:29.6422"}, {x: "121:40:55.2500", y: "31:19:46.8390"}, {x: "121:41:10.8932", y: "31:20:05.0340"}, {x: "121:40:35.0329", y: "31:20:22.5957"}, {x: "121:40:19.8552", y: "31:20:30.0258"}, {x: "121:39:49.7796", y: "31:20:44.7479"}, {x: "121:39:23.5376", y: "31:20:57.5895"}, {x: "121:39:21.0730", y: "31:20:58.7941"}, {x: "121:39:15.7168", y: "31:21:01.4163"}, {x: "121:39:07.0578", y: "31:21:05.6529"}, {x: "121:38:56.5640", y: "31:20:48.9853"}];
var yangLatitu1 = [{x: " 122:10:22.15761", y: " 30:33:53.48025"}, {x: " 122:10:18.39148", y: " 30:33:33.11945"}, {x: " 122:17:18.08089", y: " 30:32:55.71872"}, {x: " 122:17:14.29433", y: " 30:32:35.36090"}];
var yangLatitu2 = [{x: " 122:02:24.80746", y: " 30:38:11.08236"}, {x: " 122:02:08.48830", y: " 30:37:54.27581"}, {x: " 122:03:03.97582", y: " 30:37:03.41386"}, {x: " 122:04:35.83018", y: " 30:35:56.67173"}, {x: " 122:05:04.62764", y: " 30:35:50.00181"}, {x: " 122:05:21.43164", y: " 30:36:09.94897"}, {x: " 122:04:01.26801", y: " 30:37:01.33744"}];
var luoLatitu = [{x: "121:22:18.2988", y: "31:30:11.0216"}, {x: "121:23:24.1070", y: "31:29:35.4710"}, {x: "121:23:59.0306", y: "31:29:16.0423"}, {x: "121:24:13.8393", y: "31:29:12.0008"}, {x: "121:25:20.2946", y: "31:28:41.4080"}, {x: "121:26:46.9862", y: "31:27:47.2171"}, {x: "121:26:58.6120", y: "31:27:56.0161"}, {x: "121:25:28.3825", y: "31:28:52.4249"}, {x: "121:23:39.0149", y: "31:29:42.7646"}, {x: "121:22:26.3795", y: "31:30:22.0058"}];
var allLatitu = [];

var waiButtom1 = [];
var waiButtom4 = [];
var yangButtom1 = [];
var yangButtom2 = [];
var luoButtom = [];
var huangButtom = [];
var allButtom = [];

var slope = [30, 20, 20, 20, 20, 0, 15, 30, 15, 20, 20, 20, 20];
var superDW = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
// var exp = []

var waiButtomNew = [];
var buttomFaces = 1000;
var modalNum = 0;
var modalN = 0;

function AddButtomFaces(data) {

    var layerPos = API_GetLayerPosById(g_ButtomLayerId);
    // for (var i = 0; i < depData.length; i++) {
    //     depData[i][0] = depData[i][0]*10000000;
    //     depData[i][1] = depData[i][1]*10000000;
    // }
    // console.log(w);
    // console.log(depData[0]);
  
    
    // data = [];
    // for(var i = 0; i < data2.length; ++i){
    //     data.push(data2[i][0],data2[i][1]);
    // }
    var arr = [];
        for (var j = 0; j < data.length; j++) {
            var ob = {x: data[j][1],y: data[j][0]};
            arr.push(ob);
            // console.log(arr); 
        }
       
        buttomFaces = AddButtomFace(layerPos, 0, arr, g_ButtomStylePos[0]);
        API_ReDrawLayer();
}

function AddButtomLayer() {
    g_ButtomStylePos = [];
    // console.log(h%2);
    var faceLayerInfo = [];
    g_ButtomLayerId++;
    faceLayerInfo.id = g_ButtomLayerId;
    faceLayerInfo.type = 3; //类型：1=点图层，2=线图层，3=面图层
    faceLayerInfo.name = "底标高"; //图层名称
    faceLayerInfo.bShow = true; //显示
    faceLayerPos2 = API_AddNewLayer(faceLayerInfo, null);
    if (faceLayerPos2 > -1) {
            var faceStyle = [];
            faceStyle.borderWith = 2; //线的粗细
            faceStyle.borderColor = "#FF6347"; //线的颜色
            faceStyle.bFilled = true; //是否填充颜色
            faceStyle.fillColor = "#FF6347"; //填充的颜色
            faceStyle.iOpacity = 65; //透明度
            faceStyle.bShowText = false; //是否显示名称
            // console.log(API_AddFaceLayerStyleByPos(faceLayerPos2, faceStyle))
            g_ButtomStylePos.push(API_AddFaceLayerStyleByPos(faceLayerPos2, faceStyle));
    }
}

function AddButtomFace(layerPos, objName, arrObjPo, layerStylePos) {
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

function deleteButtomFace() {
    // var addNum = buttomFaces.length - 1;
    API_DelObjectByPos(faceLayerPos2, buttomFaces);
    API_ReDrawLayer();
}

function resetButtomFace() {
    coorNum = 4;
    deleteButtomFace();
    for (var i = 0; i < 10; i++) {
        $("#coor" + i + "x").val("");
        $("#coor" + i + "y").val("");
    }
}

function cancelButtom() {
    for (var i = 5; i < 10; i++) {
        $("#coor" + i).hide();
    }
    deleteButtomFace();
    var del = API_DelLayerByPos(faceLayerPos2);
    API_ReDrawLayer();
    $('#setbuttom').hide();
    coorNum = 4;
    buttomFaces = 1000;
}

function setButtomDialog(n) {
    AddButtomLayer();
    buttomFaces = 1000;
    // console.log(n);
    var changeButtom = allButtom[chooseHarbor - 1]
    var buttomLength = changeButtom.length
    if(n < buttomLength + 1) {
        var buttomPoint = changeButtom[n - 1].co
    var buttomDepth = changeButtom[n - 1].d
    // console.log(buttomPoint[0].x);
    coorNum = buttomPoint.length;
    $("#setbuttom").show();
    for (var i = 1; i < coorNum + 1; i++) {
        $('#coor' + i + 'x').val(latituConverTo(buttomPoint[i - 1].x))
        $('#coor' + i + 'y').val(latituConverTo(buttomPoint[i - 1].y))
        $('#coor' + i).show();
    }
    $("#buttom").val(buttomDepth);
    for (var i = coorNum + 1; i < 10; i++) {
        $("#coor" + i).hide();
    }
}else{
    $("#setbuttom").show();
    coorNum = 3;
    for (var i = 1; i < 4; i++) {
        $("#coor" + i).show();
    }
    for (var i = coorNum + 1; i < 10; i++) {
        $("#coor" + i).hide();
    }
}
    
}

function showButtom2(n) {
    deleteButtomFace()
    labelInfo = [];
    AddButtomLayer();
    buttomFaces = 1000;
    // console.log(n);
    var changeButtom = allButtom[chooseHarbor - 1];
    var buttomLength = changeButtom.length;
    if(n < buttomLength + 1) {
    var buttomPoint = changeButtom[n - 1].co;
    var buttomDepth = changeButtom[n - 1].d;
    // console.log(buttomPoint[0].x);
    var coorNum = buttomPoint.length;
    
    for (var i = 0; i < coorNum; i++) {
        var ob = [];
        ob.push(buttomPoint[i].y)
        ob.push(buttomPoint[i].x)
        labelInfo.push(ob);
    }
    AddButtomFaces(labelInfo);
}
}

function showButtom() {
    deleteButtomFace()
    labelInfo = [];
    for (var i = 1; i < coorNum + 1; i++) {
        var ob = []
        var a = $("#coor" + i + "x").val();
        var b = $("#coor" + i + "y").val();
        ob.push(convertToLatitu(b));
        ob.push(convertToLatitu(a));
        labelInfo.push(ob);
    }
    AddButtomFaces(labelInfo);
}

function addButtomPoint() {
    coorNum++;
    // var table = $('.buttom-table tbody');
    // var entry = "";
    // entry += '<tr><td>' + '<input type="text" id = "coor'+ coorNum + 'x" placeholder = ""/>' + '</td>';
    // entry += '<td>' + '<input type="text" id = "coor'+ coorNum + 'y" placeholder = ""/>' + '</td>';        
    // entry += '</tr>';
    // coorNum++;
    // table.append(entry);
    $("#coor" + coorNum).show();
}

function deleteButtomPoint() {
    $("#coor" + coorNum + 'x').val("");
    $("#coor" + coorNum + 'y').val("");
    $("#coor" + coorNum).hide()
    coorNum-- ;
}

function newButtom() {
    buttomFaces = 1000;
    var coorPoints = [];
    for (var i = 1; i < coorNum + 1; i++) {
        var coor = {x: $("#coor" + i + "x").val(), y: $("#coor" + i + "x").val()}
        coorPoints.push(coor);
    }
        var coorButtom = {co: coorPoints, d: $("#buttom").val()}
    for (var i = 5; i < 10; i++) {
        $("#coor" + i).hide();
    }
    for (var i = 0; i < 10; i++) {
        $("#coor" + i + "x").val("");
        $("#coor" + i + "y").val("");
    }

}

function concernButtom() {
    // waiButtom4 = [];
    // for (var j = 0; j < buttomNum; j++){
    //    waiButtom4.push(waiButtomNew[i]);
    // }
    // var coorPoints = [];
    allButtom[chooseHarbor - 1][modalN].co = []
    for (var i = 1; i < coorNum + 1; i++) {
        allButtom[chooseHarbor - 1][modalN].co.push({x: 0, y: 0});
        allButtom[chooseHarbor - 1][modalN].co[i - 1].x = convertToLatitu($("#coor" + i + "x").val())
        allButtom[chooseHarbor - 1][modalN].co[i - 1].y = convertToLatitu($("#coor" + i + "y").val())
    }
    // var coorButtom = {co: coorPoints, d: $("#buttom").val()}
    // console.log(waiButtom4[modalN])
    allButtom[chooseHarbor - 1][modalN].d = parseFloat($("#buttom").val());
    // console.log(waiButtom4[modalN])
    for (var i = 5; i < 10; i++) {
        $("#coor" + i).hide();
    }
    for (var i = 0; i < 10; i++) {
        $("#coor" + i + "x").val("");
        $("#coor" + i + "y").val("");
    }
    buttomFaces = 1000;
    cancelButtom();

}



function waigaoqiao4Defult() {
    waiButtom4 = [];
     waiButtom4.push({co:[{x: convertToLatitu(waiLatitu4[0].x), y: convertToLatitu(waiLatitu4[0].y)},
        {x: convertToLatitu(waiLatitu4[1].x), y: convertToLatitu(waiLatitu4[1].y)},
        {x: convertToLatitu(waiLatitu4[18].x), y: convertToLatitu(waiLatitu4[18].y)}], d: 10.0});
    waiButtom4.push({co:[{x: convertToLatitu(waiLatitu4[1].x), y: convertToLatitu(waiLatitu4[1].y)},
        {x: convertToLatitu(waiLatitu4[16].x), y: convertToLatitu(waiLatitu4[16].y)},
        {x: convertToLatitu(waiLatitu4[17].x), y: convertToLatitu(waiLatitu4[17].y)},
        {x: convertToLatitu(waiLatitu4[18].x), y: convertToLatitu(waiLatitu4[18].y)}], d: 10.0});
    waiButtom4.push({co:[{x: convertToLatitu(waiLatitu4[1].x), y: convertToLatitu(waiLatitu4[1].y)},
        {x: convertToLatitu(waiLatitu4[2].x), y: convertToLatitu(waiLatitu4[2].y)},
        {x: convertToLatitu(waiLatitu4[15].x), y: convertToLatitu(waiLatitu4[15].y)},
        {x: convertToLatitu(waiLatitu4[16].x), y: convertToLatitu(waiLatitu4[16].y)}], d: 10.5});
    waiButtom4.push({co:[{x: convertToLatitu(waiLatitu4[2].x), y: convertToLatitu(waiLatitu4[2].y)},
        {x: convertToLatitu(waiLatitu4[3].x), y: convertToLatitu(waiLatitu4[3].y)},
        {x: convertToLatitu(waiLatitu4[14].x), y: convertToLatitu(waiLatitu4[14].y)},
        {x: convertToLatitu(waiLatitu4[15].x), y: convertToLatitu(waiLatitu4[15].y)}], d: 11.0});
    waiButtom4.push({co:[{x: convertToLatitu(waiLatitu4[3].x), y: convertToLatitu(waiLatitu4[3].y)},
        {x: convertToLatitu(waiLatitu4[4].x), y: convertToLatitu(waiLatitu4[4].y)},
        {x: convertToLatitu(waiLatitu4[13].x), y: convertToLatitu(waiLatitu4[13].y)},
        {x: convertToLatitu(waiLatitu4[14].x), y: convertToLatitu(waiLatitu4[14].y)}], d: 11.5});
    waiButtom4.push({co:[{x: convertToLatitu(waiLatitu4[4].x), y: convertToLatitu(waiLatitu4[4].y)},
        {x: convertToLatitu(waiLatitu4[6].x), y: convertToLatitu(waiLatitu4[6].y)},
        {x: convertToLatitu(waiLatitu4[12].x), y: convertToLatitu(waiLatitu4[12].y)},
        {x: convertToLatitu(waiLatitu4[13].x), y: convertToLatitu(waiLatitu4[13].y)}], d: 11.5});
    waiButtom4.push({co:[{x: convertToLatitu(waiLatitu4[6].x), y: convertToLatitu(waiLatitu4[6].y)},
        {x: convertToLatitu(waiLatitu4[7].x), y: convertToLatitu(waiLatitu4[7].y)},
        {x: convertToLatitu(waiLatitu4[11].x), y: convertToLatitu(waiLatitu4[11].y)},
        {x: convertToLatitu(waiLatitu4[12].x), y: convertToLatitu(waiLatitu4[12].y)}], d: 11.0});
    waiButtom4.push({co:[{x: convertToLatitu(waiLatitu4[7].x), y: convertToLatitu(waiLatitu4[7].y)},
        {x: convertToLatitu(waiLatitu4[8].x), y: convertToLatitu(waiLatitu4[8].y)},
        {x: convertToLatitu(waiLatitu4[10].x), y: convertToLatitu(waiLatitu4[10].y)},
        {x: convertToLatitu(waiLatitu4[11].x), y: convertToLatitu(waiLatitu4[11].y)}], d: 10.5});

}  

function waigaoqiao1Defult() {
    waiButtom1 = [];
    waiButtom1.push({co:[{x: convertToLatitu(waiLatitu1[0].x), y: convertToLatitu(waiLatitu1[0].y)},
        {x: convertToLatitu(waiLatitu1[1].x), y: convertToLatitu(waiLatitu1[1].y)},
        {x: convertToLatitu(waiLatitu1[9].x), y: convertToLatitu(waiLatitu1[9].y)}], d: 11.9});
    waiButtom1.push({co:[{x: convertToLatitu(waiLatitu1[1].x), y: convertToLatitu(waiLatitu1[1].y)},
        {x: convertToLatitu(waiLatitu1[7].x), y: convertToLatitu(waiLatitu1[7].y)},
        {x: convertToLatitu(waiLatitu1[8].x), y: convertToLatitu(waiLatitu1[8].y)},
        {x: convertToLatitu(waiLatitu1[9].x), y: convertToLatitu(waiLatitu1[9].y)}], d: 11.9});
    waiButtom1.push({co:[{x: convertToLatitu(waiLatitu1[1].x), y: convertToLatitu(waiLatitu1[1].y)},
        {x: convertToLatitu(waiLatitu1[3].x), y: convertToLatitu(waiLatitu1[3].y)},
        {x: convertToLatitu(waiLatitu1[6].x), y: convertToLatitu(waiLatitu1[6].y)},
        {x: convertToLatitu(waiLatitu1[7].x), y: convertToLatitu(waiLatitu1[7].y)}], d: 12.4});
    waiButtom1.push({co:[{x: convertToLatitu(waiLatitu1[3].x), y: convertToLatitu(waiLatitu1[3].y)},
        {x: convertToLatitu(waiLatitu1[4].x), y: convertToLatitu(waiLatitu1[4].y)},
        {x: convertToLatitu(waiLatitu1[5].x), y: convertToLatitu(waiLatitu1[5].y)},
        {x: convertToLatitu(waiLatitu1[6].x), y: convertToLatitu(waiLatitu1[6].y)}], d: 11.9});

}

function yangshan1Defult() {
    yangButtom1 = [];
    yangButtom1.push({co:[{x: convertToLatitu(yangLatitu1[0].x), y: convertToLatitu(yangLatitu1[0].y)},
        {x: convertToLatitu(yangLatitu1[1].x), y: convertToLatitu(yangLatitu1[1].y)},
        {x: convertToLatitu(yangLatitu1[3].x), y: convertToLatitu(yangLatitu1[3].y)},
        {x: convertToLatitu(yangLatitu1[2].x), y: convertToLatitu(yangLatitu1[2].y)}], d: 16.0});
}

function yangshan2Defult() {
    yangButtom2 = [];
    yangButtom2.push({co:[{x: convertToLatitu(yangLatitu2[0].x), y: convertToLatitu(yangLatitu2[0].y)},
        {x: convertToLatitu(yangLatitu2[1].x), y: convertToLatitu(yangLatitu2[1].y)},
        {x: convertToLatitu(yangLatitu2[2].x), y: convertToLatitu(yangLatitu2[2].y)},
        {x: convertToLatitu(yangLatitu2[6].x), y: convertToLatitu(yangLatitu2[6].y)}], d: 15.5});
        yangButtom2.push({co:[{x: convertToLatitu(yangLatitu2[2].x), y: convertToLatitu(yangLatitu2[2].y)},
        {x: convertToLatitu(yangLatitu2[3].x), y: convertToLatitu(yangLatitu2[3].y)},
        {x: convertToLatitu(yangLatitu2[4].x), y: convertToLatitu(yangLatitu2[4].y)},
        {x: convertToLatitu(yangLatitu2[5].x), y: convertToLatitu(yangLatitu2[5].y)},
        {x: convertToLatitu(yangLatitu2[6].x), y: convertToLatitu(yangLatitu2[6].y)}], d: 15.5});

}

function LuojingDefult() {
    luoButtom = [];
    luoButtom.push({co:[{x: convertToLatitu(luoLatitu[0].x), y: convertToLatitu(luoLatitu[0].y)},
        {x: convertToLatitu(luoLatitu[1].x), y: convertToLatitu(luoLatitu[1].y)},
        {x: convertToLatitu(luoLatitu[8].x), y: convertToLatitu(luoLatitu[8].y)},
        {x: convertToLatitu(luoLatitu[9].x), y: convertToLatitu(luoLatitu[9].y)}], d: 11.5});
    luoButtom.push({co:[{x: convertToLatitu(luoLatitu[1].x), y: convertToLatitu(luoLatitu[1].y)},
        {x: convertToLatitu(luoLatitu[2].x), y: convertToLatitu(luoLatitu[2].y)},
        {x: convertToLatitu(luoLatitu[3].x), y: convertToLatitu(luoLatitu[3].y)},
        {x: convertToLatitu(luoLatitu[8].x), y: convertToLatitu(luoLatitu[8].y)}], d: 11.5});
    luoButtom.push({co:[{x: convertToLatitu(luoLatitu[3].x), y: convertToLatitu(luoLatitu[3].y)},
        {x: convertToLatitu(luoLatitu[4].x), y: convertToLatitu(luoLatitu[4].y)},
        {x: convertToLatitu(luoLatitu[7].x), y: convertToLatitu(luoLatitu[7].y)},
        {x: convertToLatitu(luoLatitu[8].x), y: convertToLatitu(luoLatitu[8].y)}], d: 11.5});
    luoButtom.push({co:[{x: convertToLatitu(luoLatitu[4].x), y: convertToLatitu(luoLatitu[4].y)},
        {x: convertToLatitu(luoLatitu[5].x), y: convertToLatitu(luoLatitu[5].y)},
        {x: convertToLatitu(luoLatitu[6].x), y: convertToLatitu(luoLatitu[6].y)},
        {x: convertToLatitu(luoLatitu[7].x), y: convertToLatitu(luoLatitu[7].y)}], d: 11.5});

}

function HuangpujiangDefult() {
    huangButtom = [];
    huangButtom.push({co:[{x: convertToLatitu(luoLatitu[0].x), y: convertToLatitu(luoLatitu[0].y)},
        {x: convertToLatitu(luoLatitu[1].x), y: convertToLatitu(luoLatitu[1].y)},
        {x: convertToLatitu(luoLatitu[8].x), y: convertToLatitu(luoLatitu[8].y)},
        {x: convertToLatitu(luoLatitu[9].x), y: convertToLatitu(luoLatitu[9].y)}], d: 9.5});
}

function setButtom() {
    allButtom = [];
    allButtom.push(waiButtom1);
    allButtom.push(waiButtom4);
    allButtom.push(yangButtom1);
    allButtom.push(yangButtom2);
    allButtom.push(luoButtom);
    allButtom.push(huangButtom);
    allLatitu.push(waiLatitu1);
    allLatitu.push(waiLatitu4);
    allLatitu.push(yangLatitu1);
    allLatitu.push(yangLatitu2);
    allLatitu.push(luoLatitu);
}

function buttomModal() {
    while (modalNum != 0) {
        var parent=document.getElementById("buttom-modal");
    // console.log("buttommodal" + modalNum);
        var child=document.getElementById("buttommodal" + modalNum);
    // console.log(child)
        parent.removeChild(child)
        modalNum--;
    }
        
    // waigaoqiao4Defult()
    $("#setbuttommodule").show();
    // console.log(waiButtom4)

    
    var buttomLength = allButtom[chooseHarbor - 1].length;
    for (var i = 0; i < buttomLength; i++)
        addNewModal();
    
}

function addNewModal() {
    modalNum++;
    var table = $('#buttom-modal');
    var entry = "";
    entry += '<tr id = "buttommodal' + modalNum + '"><td>' + '<button class = "SB" onclick = "showButtom2(' + modalNum + ')">' + '区域'+ modalNum + '</buttom>' + '</td>';
    entry += '<td>' + '<button class = "SB" onclick = "showModal(' + modalNum + ')">' + '修改' + '</buttom>' + '</td>';
    entry += '</tr>';
    
    table.append(entry);
}

function removeModel() {
    allButtom[chooseHarbor - 1].pop();
    var parent=document.getElementById("buttom-modal");
    // console.log("buttommodal" + modalNum);
    var child=document.getElementById("buttommodal" + modalNum);
    // console.log(child)
    parent.removeChild(child)
    modalNum--;
}

function showModal(i) {
    deleteButtomFace()
    $('#setbuttommodal').hide()
    modalN = i - 1;
    setButtomDialog(i)
}

function cancelModal() {
    $("#setbuttommodule").hide();
    while (modalNum != 0) {
    var parent=document.getElementById("buttom-modal");
    // console.log("buttommodal" + modalNum);
    var child=document.getElementById("buttommodal" + modalNum);
    // console.log(child)
    parent.removeChild(child)
    modalNum--;
    }
    deleteButtomFace()
}

function setEarthWorkTable() {
    $("#earthwork-form").show();
    for (var i = 0; i < 4; i++) {
        $("#earthcaculate" + i).show();
    }
    $("#earthcancel").hide();
    $("#earthconcern").show();
    $("#earthcaculate" + 4).hide();
    $("#tufangtitle").text("航道参数设计");
    $("#earthwork3").val(slope[2 * chooseHarbor - 1]);
    $("#earthwork4").val(slope[2 * chooseHarbor]);
    $("#earthwork1").val(superDW[2 * chooseHarbor - 1]);
    $("#earthwork2").val(superDW[2 * chooseHarbor]);
}

function concernWorkTable() {
    slope[2 * chooseHarbor - 1] = parseFloat($("#earthwork3").val());
    slope[2 * chooseHarbor] = parseFloat($("#earthwork4").val());
    superDW[2 * chooseHarbor - 1] = parseFloat($("#earthwork1").val());
    superDW[2 * chooseHarbor] = parseFloat($("#earthwork2").val());
    $("#earthwork-form").hide();
}

function earthWorkTable() {
    $("#tufangtitle").text("土方计算");
    $("#earthwork-form").show();
    $("#earthconcern").hide();
    $("#earthcancel").show();
    for (var i = 1; i < 6; i++) {
        $("#earthwork" + i).val('');
    }
    // for (var i = 0; i < 4; i++) {
    //     $("#earthcaculate" + i).hide();
    // }
    $("#earthcaculate" + 4).show();

    var buttomNow = allButtom[chooseHarbor - 1];
    
    var blength = buttomNow.length;
    var maxdepth = 40;
    for(var i = 0; i < blength; i++) {
        maxdepth = buttomNow[i].d < maxdepth ? buttomNow[i].d : maxdepth;
    }
    // console.log(maxdepth);
    caculateEarthWork = getEarthWork(depthData, slope[2 * chooseHarbor - 1], slope[2 * chooseHarbor],
     superDW[2 * chooseHarbor - 1], superDW[2 * chooseHarbor], 0, buttomNow);

    $("#earthwork3").val(slope[2 * chooseHarbor - 1]);
    $("#earthwork4").val(slope[2 * chooseHarbor]);
    $("#earthwork1").val(superDW[2 * chooseHarbor - 1]);
    $("#earthwork2").val(superDW[2 * chooseHarbor]);
    caculateEarthWork = caculateEarthWork.toFixed(0);
    $("#earthwork5").val(caculateEarthWork / 1000000);
}

function resetEarthwork() {
    for (var i = 1; i < 6; i++) {
        $("#earthwork" + i).val('');
    }
}

function cancelEarthwork() {
    $("#earthwork-form").hide();
}

function caculateNewEarthWork() {
    var superWidth = 0;
    var superDepth = 0;
    var xvertex = 0;
    var yvertex = 0;
    // console.log($("#earthwork4").val())
    superWidth = $("#earthwork1").val();
    superDepth = $("#earthwork2").val();
    xvertex = $("#earthwork3").val();
    yvertex = $("#earthwork4").val();
    var buttomNow = allButtom[chooseHarbor - 1];
  
    xvertex = parseFloat(xvertex);
    yvertex = parseFloat(yvertex);
    superWidth = parseFloat(superWidth);
    superDepth = parseFloat(superDepth);
    
    var EarthWork = getEarthWork(depthData, xvertex,yvertex,
     superWidth, superDepth, 0, buttomNow);
    EarthWork = EarthWork.toFixed(2);
    $("#earthwork5").val(EarthWork / 1000000);
}

function scientificNum(num) {
    var p = Math.floor(Math.log(num)/Math.LN10);
    var n = num * Math.pow(10, -p);
    n = n.toFixed(2);
    return n + '×10^' + p;
}

function getWarnSurface(triangle, vertex, levels, threshold, rangedThreshold) {
    var rangedArea = new Array(rangedThreshold.length);
    var level2 = [];
    for (var i = 0; i < rangedThreshold.length; i++) {
        rangedArea[i] = 0.0;
        for (var j = 1; j < rangedThreshold[i].co.length - 1; j++) {
            rangedArea[i] += getTriangleArea(rangedThreshold[i].co[j], rangedThreshold[i].co[j + 1], rangedThreshold[i].co[0]);
        }
        level2.push(rangedThreshold[i].d - warnlevel[0]);
        level2.push(rangedThreshold[i].d - warnlevel[1]);
        // console.log(rangedArea[i]);
    }
    for(var i = 0; i < levels.length; i++) level2.push(levels[i]);
    level2.sort();
    var level3 = [];
    level3.push[parseFloat(level2[0])];
    for(var i = 1; i < level2.length; i++) {
        if(level2[i] != level2[i - 1]) level3.push(parseFloat(level2[i]));
    }
    for(var i = 1; i < level3.length; i++) {
        level3[i] = parseFloat(level3[i])
    }
    level3.sort(sortNumber);
    extendVertices(triangle, vertex, level3);
    var dropTriangle = new Array(triangle.length / 3);
    dropIllegalTriangle(triangle, vertex, dropTriangle);
    var vertexToTriangle = getLinkedListOfVertexToTriangle(triangle, vertex);
    var surfaces = [];
    var visited = new Array(triangle.length / 3);
    for (var i = triangle.length; i >= 3; i-=3) {
        if (!visited[i / 3 - 1] && !dropTriangle[i / 3 - 1]) {
            var bfsEdges = generateNewWarnSurface(surfaces, vertex, 
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
            var t1 = determinePolyArea(u1, rangedThreshold, rangedArea, threshold, i / 3 - 1, 1);
            var t2 = determinePolyArea(u2, rangedThreshold, rangedArea, threshold, i / 3 - 1, 1);
            var t3 = determinePolyArea(u3, rangedThreshold, rangedArea, threshold, i / 3 - 1, 1);
            //depth
            var d = (t1 + t2 + t3) / 3;

            applyBFSWarn(bfsEdges, contains, visited, dropTriangle, vertexToTriangle, levels, surfaces, vertex, triangle, rangedThreshold,rangedArea);
        }
    }
    // console.log(surfaces);
    return surfaces;
}

function sortNumber(a,b)
{
return a - b
}

function generateNewWarnSurface(surfaces, vertex, v1, v2, v3, levels, rangedThreshold, rangedArea, threshold) {
    var u1 = {x: vertex[v1][1],y: vertex[v1][0]};
    var u2 = {x: vertex[v2][1],y: vertex[v2][0]};
    var u3 = {x: vertex[v3][1],y: vertex[v3][0]};
        //determine range
    var t1 = determinePolyArea(u1, rangedThreshold, rangedArea, threshold, i / 3 - 1, 1);
    var t2 = determinePolyArea(u2, rangedThreshold, rangedArea, threshold, i / 3 - 1, 1);
    var t3 = determinePolyArea(u3, rangedThreshold, rangedArea, threshold, i / 3 - 1, 1);
        //depth
    var surface = [v1, v2, v3];
    var d = (t1 + t2 + t3) / 3;
    var c = (vertex[v1][2] + vertex[v2][2] + vertex[v3][2]) / 3;
    surfaces.push({surface: surface, level: getLevelWarn(levels, c, d)});
    var re = [];
    re.push({x: v1, y: v2});
    re.push({x: v2, y: v3});
    re.push({x: v3, y: v1});
    return re;
}

function getLevelWarn(levels, depth, d) {
    // console.log(d)
    if(depth < d - warnlevel[0]) {
        return 0
    }else{
        if(depth < d - warnlevel[1]) {
            return 1
        }else{
        for (var i = 2; i < levels.length; i++) {
        if (depth < levels[i]) {
            return i;
        }
    }
    }
}
    return levels.length - 1;
}

function convertToLatitu(str) {
    var c = str.split(":");
    e = (parseFloat(c[0]) + parseFloat(c[1]) / 60.0 + parseFloat(c[2]) / 3600.0) * 10000000;
    return e;
}

function latituConverTo(n) {
    var a = Math.ceil(n / 10000000) - 1;
    var b = Math.ceil((n - a * 10000000) * 60 / 10000000) - 1;
    var c =(n - a * 10000000 - b * 10000000 / 60) * 3600 / 10000000
    var str = a + ':' + b + ':' + c;
    return str;
}   

function allPart() {

    if(ShowAll == true) {
        ShowAll =false;
        $("#all-show").text("全部");
        ThreeView(depthData, level[2]);
    }
    else{
        ShowAll = true;
        $("#all-show").text("部分");
        ThreeView(depthData, level[2]);
    }
}

function dividelevel() {
    var l = $('#setDepthForm #depthlevel').val();
    if(l > 2) {
    level = [];
    var x = $('#setDepthForm #depthdown').val() - $('#setDepthForm #depthup').val();
    x = x / (l - 1);
    for(var i = 0; i < l; i++) {
        leveltmp[i] = parseFloat($('#setDepthForm #depthup').val()) + i * x;
        leveltmp[i] = leveltmp[i].toFixed(1);
        level.push(0);
    }
    for(var i = 0; i < 10; i++) $('#setDepthForm #leveld' + (i + 1)).hide();
    for(var i = 0; i < l; i++) {
        $('#setDepthForm #leveld' + (i + 1)).show();
        $('#setDepthForm #level' + (i + 1)).val(leveltmp[i]);
    }
    }
}