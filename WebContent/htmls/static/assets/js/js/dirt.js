var dirtNum = 0;
var paramNum = 0;
var dirtSelected = "";
var allDirt = {};
var coorNum = 0;
var dirtAreaSelected = 0;
function demo()
{    
    var changjiang = [];
    changjiang.push({co:[{x: convertToLatitu("121:45:39"), y: convertToLatitu("31:16:32")},
        {x: convertToLatitu("121:45:51"), y: convertToLatitu("31:16:44")},
        {x: convertToLatitu("121:46:20"), y: convertToLatitu("31:16:24")},
        {x: convertToLatitu("121:46:08"), y: convertToLatitu("31:16:11")}], s: 0.5});
    changjiang.push({co:[{x: convertToLatitu("122:09:56.98"), y: convertToLatitu("31:10:31.32")},
        {x: convertToLatitu("122:09:44.16"), y: convertToLatitu("31:10:15.27")},
        {x: convertToLatitu("122:11:48.66"), y: convertToLatitu("31:09:01.75")},
        {x: convertToLatitu("122:12:01.48"), y: convertToLatitu("31:09:17.80")}], s: 2.4});
    allDirt["changjiang"] = changjiang;
}

function setDirtTable() {
    while (dirtNum != 0) {
        var parent=document.getElementById("dirt-modal");
    // console.log("buttommodal" + modalNum);
        var child=document.getElementById("dirtmodal" + dirtNum);
        parent.removeChild(child)
        dirtNum--;
    }
    var newDirtNum = 0;
    var postData = {"area_id":"1_"};
    $.ajax({
            type: "POST",
            url: "http://10.181.176.61:8080/shanggang/dumping_area/listbyid",
            data: JSON.stringify(postData),
            contentType: "application/json",
            dataType: 'jsonp',
            success: function (data) {       
                      alert("success"); 
                  },       
            error: function () {       
                   alert("fail");       
              }       
        });
}

function fillAllDirt(data) {

}

function showDirt(n) {
    deleteButtomFace()
    labelInfo = [];
    AddButtomLayer();
    buttomFaces = 1000;
    var dirts = allDirt[dirtSelected];
    var size = dirts.length;
    if(n < size + 1) {
        var buttomPoint = dirts[n - 1].co;
        var buttomDepth = dirts[n - 1].s;
        var coorNum = buttomPoint.length;
        API_SetMapViewCenter(buttomPoint[0].x/10000000, buttomPoint[0].y/10000000);
        for (var i = 0; i < coorNum; i++) {
            var ob = [];
            ob.push(buttomPoint[i].y)
            ob.push(buttomPoint[i].x)
            labelInfo.push(ob);
        }
        AddButtomFaces(labelInfo);
    }
}

function concernEditDirt() {
    coordinate = []
    for (var i = 1; i < coorNum + 1; i++) {
        coordinate.push({x:convertToLatitu($("#coorx" + i).val()),y:convertToLatitu($("#coory" + i).val())});
    }
    allDirt[dirtSelected][dirtAreaSelected-1].co = coordinate;
    allDirt[dirtSelected][dirtAreaSelected-1].s = parseFloat($("#dirt-area").val());
    cancelEditDirt();
}

function addNewDirt() {
    dirtNum++;
    allDirt[dirtSelected].push({co:[],s:0});
    var table = $('#dirt-modal');
    var entry = "";
    entry += '<tr id = "dirtmodal' + dirtNum + '"><td>' + '<button class = "SB" onclick = "showDirt(' + dirtNum + ')">' + '区域'+ dirtNum + '</buttom>' + '</td>';
    entry += '<td>' + '<button class = "SB" onclick = "editDirt(' + dirtNum + ')">' + '修改' + '</buttom>' + '</td>';
    entry += '</tr>';
    table.append(entry);
}

function removeDirt() {
    allDirt[dirtSelected].pop();
    var parent=document.getElementById("dirt-modal");
    var child=document.getElementById("dirtmodal" + dirtNum);
    parent.removeChild(child)
    dirtNum--;
}

function editDirt(n) {
    dirtAreaSelected = n;
    deleteButtomFace();
    dirtEditDialog(n);
}

function dirtEditDialog(n) {
    while(coorNum!=0) {
        var parent=document.getElementById("dirt-edit");
        var child=document.getElementById("dirt-edit" + coorNum);
        parent.removeChild(child);
        coorNum--;
    }
    AddButtomLayer();
    buttomFaces = 1000;
    var changeDirt = allDirt[dirtSelected];
    console.log(changeDirt);
    var dirtLength = changeDirt.length
    if(n < dirtLength + 1) {
        var buttomPoint = changeDirt[n - 1].co
        var buttomDepth = changeDirt[n - 1].s
        coorNum = buttomPoint.length;
        $("#setdirt").show();
        var table = $('#dirt-edit');
        var entry = "";
        for (var i = 1; i < coorNum + 1; i++) {
            entry += '<tr id = "dirt-edit' + i + '"><td><input class = "inputSB" type="text" id = "coorx' + i + '" placeholder = ""/></td>';
            entry += '<td><input class = "inputSB" type="text" id = "coory' + i + '" placeholder = ""/></td>';
            entry += '</tr>';
        }
        table.append(entry);
        for (var i = 1;i<coorNum + 1;++i){ 
            $('#coorx' + i).val(latituConverTo(buttomPoint[i - 1].x))
            $('#coory' + i).val(latituConverTo(buttomPoint[i - 1].y))
        }
        $('#dirt-area').val(buttomDepth);
    }  
}

function addDirtPoint() {
    coorNum++;
    var table = $('#dirt-edit');
    var entry = "";
    entry += '<tr id = "dirt-edit' + coorNum + '"><td><input class = "inputSB" type="text" id = "coorx' + coorNum + '" placeholder = ""/></td>';
    entry += '<td><input class = "inputSB" type="text" id = "coory' + coorNum + '" placeholder = ""/></td></tr>';
    table.append(entry);
}

function removeDirtPoint(){
    var parent=document.getElementById("dirt-edit");
    var child=document.getElementById("dirt-edit" + coorNum);
    parent.removeChild(child);
    coorNum--;
}


function cancelDirtwork() {
    $("#setdirtmodule").hide();
}

function cancelParam() {
    $("#setparammodule").hide();
}

function cancelEditDirt() {
    while(coorNum!=0) {
        var parent=document.getElementById("dirt-edit");
        var child=document.getElementById("dirt-edit" + coorNum);
        parent.removeChild(child);
        coorNum--;
    }
    $('#setdirt').hide();
}

function choosechangjiang(){
    dirtSelected = "changjiang";
    dashLineOn = 0;   
    times = [];
    datas = [];
    $(".change").removeClass('Current');
    $("#waigaoqiao1").addClass('Current');
    level = levels[0];
    warnlevel = warnlevels[0];
    chooseHarbor=1;
    API_SetMapViewCenter(121.76666666666667, 31.266666666666666, 20000);
    deleteFaces();
    getWarningLevel();
    //getDepthLevel();
    //getRecentDate();
    
    $("#set-dirt-table").show();
    $("#set-sealine").show();
    $("#set-project-param").show();
    $("#boat-import").show();
    $("#boat-management").show();

    $("#xianshi").click()
    demo();
}