var manageNum = 0;
var allManage = [{"fleet_id":"1","name":"第一船队","address":"Shanghai","contact":"MrX","cellphone":"66666666"},{"fleet_id":"2","name":"第二船队","address":"Beijing","contact":"MrY","cellphone":"7777"}];
function setImportTable() {
    while (importNum != 0) {
        var parent=document.getElementById("import-modal");
        var child=document.getElementById("importmodal" + importNum);
        console.log(child);
        parent.removeChild(child)
        importNum--;
    }
    var newImportNum = 0;
    $("#setimportmodule").show();
    newImportNum = allBoats.length;
    var table = $('#import-modal');
    var entry = "";
    for (var i = 1; i < newImportNum+1; i++)
    {
        entry += '<tr id = "importmodal' + i + '">';
        entry += '<td><input class = "inputSB" type="text" id = "mmsl' + i + '" placeholder = ""/></td>';
        entry += '<td><input class = "inputSB" type="text" id = "boatname' + i + '" placeholder = ""/></td>';
        entry += '<td><input class = "inputSB" type="text" id = "imo' + i + '" placeholder = ""/></td>';
        entry += '<td><input class = "inputSB" type="text" id = "boatlength' + i + '" placeholder = ""/></td>';
        entry += '<td><input class = "inputSB" type="text" id = "boatwidth' + i + '" placeholder = ""/></td>';
        entry += '<td><input class = "inputSB" type="text" id = "boattype' + i + '" placeholder = ""/></td>';
        entry += '<td><button class = "SB" onclick = "concernEditImport(' + i + ')">确认修改</buttom></td>';
        entry += '</tr>';
        importNum++;
    }
    table.append(entry);
    for (var i = 1;i<newImportNum +1;++i){ 
        console.log(allBoats[i-1]);
        $('#mmsl' + i).val(allBoats[i-1].MMSl);
        $('#boatname' + i).val(allBoats[i-1].name);
        $('#imo' + i).val(allBoats[i-1].IMO);
        $('#boatlength' + i).val(allBoats[i-1].length);
        $('#boatwidth' + i).val(allBoats[i-1].width);
        $('#boattype' + i).val(allBoats[i-1].type);
    }
        
}

function addNewImport() {
    importNum++;
    var table = $('#import-modal');
    var entry = "";
    entry += '<tr id = "importmodal' + importNum + '">';
    entry += '<td><input class = "inputSB" type="text" id = "mmsl' + importNum + '" placeholder = ""/></td>';
    entry += '<td><input class = "inputSB" type="text" id = "boatname' + importNum + '" placeholder = ""/></td>';
    entry += '<td><input class = "inputSB" type="text" id = "imo' + importNum + '" placeholder = ""/></td>';
    entry += '<td><input class = "inputSB" type="text" id = "boatlength' + importNum + '" placeholder = ""/></td>';
    entry += '<td><input class = "inputSB" type="text" id = "boatwidth' + importNum + '" placeholder = ""/></td>';
    entry += '<td><input class = "inputSB" type="text" id = "boattype' + importNum + '" placeholder = ""/></td>';
    entry += '<td><button class = "SB" onclick = "concernEditImport(' + importNum + ')">确认修改</buttom></td>';
    entry += '</tr>';
    table.append(entry);
}

function cancelImport()
{
    $("#setimportmodule").hide();
}

function removeImport()
{
    var parent=document.getElementById("import-modal");
    var child=document.getElementById("importmodal" + importNum);
    parent.removeChild(child);
    importNum--;
}

 function concernImportParam(n)
 {

 }