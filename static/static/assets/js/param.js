var paramNum = 0;
var allParam = [];
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
        method: "GET",
        url: "/shanggang/project/list",
        success: function (data) {
        	console.log(data);
        	fillParamData(data);
        	console.log(allParam);
        	$("#setparammodule").show();
            newParamNum = allParam.length;
            var table = $('#param-modal');
            var entry = "";
            for (var i = 1; i < newParamNum+1; i++)
            {
                entry += '<tr id = "parammodal' + i + '"><td><input class = "inputSB" type="text" id = "projectid' + i + '" placeholder = ""/></td>';
                entry += '<td><input class = "inputSB" type="text" id = "projectname' + i + '" placeholder = ""/></td>';
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
            $('#area' + i).val(allParam[i-1].area);
            $('#projectid' + i).val(allParam[i-1].projectid);
            $('#projectname' + i).val(allParam[i-1].projectname);
            $('#capacity' + i).val(allParam[i-1].capacity);
            $('#shipnum' + i).val(allParam[i-1].shipnum);
            $('#startdate' + i).val(allParam[i-1].startdate);
            $('#enddate' + i).val(allParam[i-1].enddate);
            }
        }
    });
}

function fillParamData(data)
{
	allParam = [];
	for(var i = 0;i<data.length;++i)
		{
		allParam.push({"projectid":data[i].projectId,"projectname":data[i].projectName,
			"area":data[i].dumpingArea,"capacity":data[i].squareVolume,"startdate":data[i].beginDate,
			"enddate":data[i].endDate,"shipnum":data[i].boatNum});
		}
	
}
function addNewParam() {
    paramNum++;
    var table = $('#param-modal');
    var entry = "";
    entry += '<tr id = "parammodal' + paramNum + '"><td><input class = "inputSB" type="text" id = "projectid' + paramNum + '" placeholder = ""/></td>';
    entry += '<td><input class = "inputSB" type="text" id = "projectname' + paramNum + '" placeholder = ""/></td>';
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

 function concernEditParam(n)
 {
	 var i  = n ;
	 var postData = {"project_id":$("#projectid" + i).val(),"projectname":$("#projectname" + i).val(),
				"dumpingarea":$("#area" + i).val(),"squarevolume":$("#capacity"+i).val(),
				"begindate":$("#startdate"+i).val(),"enddate":$("#enddate"+i).val(),"boatnum":$("#shipnum"+i).val()};
	 console.log(postData);
	 $.ajax({
         type: "POST",
         url: "/shanggang/project/update",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("success");  
         	     
               },       
         error: function () {       
                alert("fail");       
           }       
     });
 }