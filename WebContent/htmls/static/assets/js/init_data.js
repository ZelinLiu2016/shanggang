$.ajax({
	method: "GET",
	url: "/shanggang/project/list",
	async:false,
	success: function (data) {
		fillParamData(data);
		fillMmsiProjectData(data);
		set_port_menu();
		startup_show();
		},
	error: function () {       
		alert("获取数据失败！");
	}  
});
$.ajax({
	method: "GET",
	url: "/shanggang/company/listall",
	async:false,
	success: function (data) {
		fillCompanyData(data);
		},
	error: function () {       
		alert("获取数据失败！");
	}  
});
$.ajax({
	method: "GET",
	url: "/shanggang/ship/list",
	async:false,
	success: function (data) {
		fillMmsiData(data);
		},
	error: function () {       
		alert("获取数据失败！");
	}  
});
$.ajax({
	method: "GET",
	async:false,
	url: "/shanggang/dredging_area/listall",
	async:false,
	success: function (data) {
		fillAllShujun(data);
	},
	error: function () {       
		alert("获取数据失败！");
	}  
});

$.ajax({
	method: "GET",
	url: "/shanggang/dumping_area/list",
	async:false,
	success: function (data) {
		fillAllPaoni(data);
	},
	error: function () {       
		alert("获取数据失败！");
	}  
});

$.ajax({
	method: "GET",
	url: "/shanggang/route/listall",
	async:false,
	success: function (data) {    
			fillAllRoute(data);
		  },       
	error: function () {       
		   alert("获取数据失败！");       
	  }       
});

/*$.ajax({
	method: "GET",
	url: "/shanggang/abnormalinfo/exceedspeedfre",
	success: function (data) {
		data=[];
		fillSpeedfre(data);
		},
	error: function () {       
		alert("fail");
	}  
});*/
$.ajax({
	method: "GET",
	url: "/shanggang/workrecord/abnormal",
	success: function (data) {
		fillAreafre(data);
		},
	error: function () {       
		alert("获取数据失败");
	}  
});
/*$.ajax({
	method: "GET",
	url: "/shanggang/abnormalinfo/routefre",
	success: function (data) {
		data=[];
		fillRoutefre(data);
		},
	error: function () {       
		alert("fail");
	}  
});*/