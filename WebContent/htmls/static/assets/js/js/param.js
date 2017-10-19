var paramNum = 0;
var selectedParam = "changjiang"
var allParam = {"changjiang":[{area:"1_1",capacity:1000.1,shipnum:3,startdate:"2017-01-01",enddate:"2017-05-01"},{area:"1_1",capacity:1000.1,shipnum:3,startdate:"2017-01-01",enddate:"2017-05-01"}]};
function setParamTable() {
    while (paramNum != 0) {
        var parent=document.getElementById("param-modal");
        var child=document.getElementById("parammodal" + paramNum);
        console.log(child);
        parent.removeChild(child)
        paramNum--;
    }
    var newParamNum = 0;
    $.ajax({
            method: "POST",
            url: "http://202.120.38.3:8091/adduser",
            data: {}
        }).fail(function() {
            alert( "未连接到服务器!" );
            $("#setparammodule").show();
            newParamNum = allParam[selectedParam].length;
            var table = $('#param-modal');
            var entry = "";
            for (var i = 1; i < newParamNum+1; i++)
            {
                entry += '<tr id = "parammodal' + i + '"><td>' + '<button class = "SB">' + '区域'+ i + '</buttom>' + '</td>';
                entry += '<td><input class = "inputSB" type="text" id = "area' + i + '" placeholder = ""/></td>';
                entry += '<td><input class = "inputSB" type="text" id = "capacity' + i + '" placeholder = ""/></td>';
                entry += '<td><input class = "inputSB" type="text" id = "shipnum' + i + '" placeholder = ""/></td>';
                entry += '<td><input class = "inputSB" type="text" id = "startdate' + i + '" placeholder = ""/></td>';
                entry += '<td><input class = "inputSB" type="text" id = "enddate' + i + '" placeholder = ""/></td>';
                entry += '<td><button class = "SB" onclick = "concernEditParam(' + i + ')">确认修改</buttom></td>';
                entry += '</tr>';
                paramNum++;
            }
            table.append(entry);
            for (var i = 1;i<newParamNum +1;++i){ 
            $('#area' + i).val(allParam[selectedParam][i-1].area);
            $('#capacity' + i).val(allParam[selectedParam][i-1].capacity);
            $('#shipnum' + i).val(allParam[selectedParam][i-1].shipnum);
            $('#startdate' + i).val(allParam[selectedParam][i-1].startdate);
            $('#enddate' + i).val(allParam[selectedParam][i-1].enddate);
        }
        }).done(function( data ) {
            var ret = JSON.parse(data);
            $("#setparammodule").show();
        }); 
}

function addNewParam() {
    paramNum++;
    var table = $('#param-modal');
    var entry = "";
    entry += '<tr id = "parammodal' + paramNum + '"><td>' + '<button class = "SB">' + '区域'+ paramNum + '</buttom>' + '</td>';
    entry += '<td><input class = "inputSB" type="text" id = "area' + paramNum + '" placeholder = ""/></td>';
    entry += '<td><input class = "inputSB" type="text" id = "capacity' + paramNum + '" placeholder = ""/></td>';
    entry += '<td><input class = "inputSB" type="text" id = "shipnum' + paramNum + '" placeholder = ""/></td>';
    entry += '<td><input class = "inputSB" type="text" id = "startdate' + paramNum + '" placeholder = ""/></td>';
    entry += '<td><input class = "inputSB" type="text" id = "enddate' + paramNum + '" placeholder = ""/></td>';
    entry += '<td><button class = "SB" onclick = "concernEditParam(' + paramNum + ')">确认修改</buttom></td>';
    entry += '</tr>';
    table.append(entry);
}

function removeParam()
{
    var parent=document.getElementById("param-modal");
    var child=document.getElementById("parammodal" + paramNum);
    parent.removeChild(child);
    paramNum--;
}

function cancelParam()
{
    $("#setparammodule").hide();
}

function concernEditParam(n)
{

}