function system2_login(thisform) {
	pwd = password.value;
	password.value = SHA1(password.value);
	$.ajax({
		url: "http://202.120.38.3:8091/login",
		type: "GET",
		data: {userId: userId.value, password: password.value}
	}).fail(function() {
		// $('#loadingModal').modal('hide');
		alert("未连接到服务器!");
	}).done(function(data) {
		// $('#loadingModal').modal('hide');
		//changeInfoDialog(data);

		if(data.isSuccess==1){
			data["pwd"] = pwd;
			system2_setSession(data);

			self.location='MapView_new.htm';
		}else{
			alert("用户名或密码错误！")
		}
	});	
}

function system2_auto_login(userid, password)
{
	pwd = password;
	password = SHA1(password);
	$.ajax({
		url: "http://202.120.38.3:8091/login",
		type: "GET",
		data: {userId: userid, password: password}
	}).fail(function() {
		// $('#loadingModal').modal('hide');
		alert("未连接到服务器!");
	}).done(function(data) {
		// $('#loadingModal').modal('hide');
		//changeInfoDialog(data);

		if(data.isSuccess==1){
			data["pwd"] = pwd;
			system2_setSession(data);

			self.location='MapView_new.htm';
		}else{
			alert("用户名或密码错误！")
		}
	});	
}

function system2_setSession(data) {
		sessionStorage.userId = data.userId;
        sessionStorage.name = data.name;
		sessionStorage.phone = data.phone;
		sessionStorage.privilege = data.privilege;
		sessionStorage.unit = data.unit;
		sessionStorage.warningStatus = data.warningStatus;
		sessionStorage.pwd = data.pwd;
}

function getParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return decodeURI(r[2]);   //对参数进行decodeURI解码
    return null;
}

$(document).ready(function() 
{
	var user_id = getParam("userid");
	var pwd = getParam("pwd");
	if(user_id != null && pwd != null){
		system2_auto_login(user_id, pwd);
	}
});