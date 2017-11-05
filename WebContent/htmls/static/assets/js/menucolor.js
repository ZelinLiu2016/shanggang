var Menu1 = ["L1", "L1L1", "L1L2", "L1L3", "L1L4", "L1L5", "L1L6"];
var Menu2 = ["L2", "L2L1", "L2L1L1", "L2L1L2", 
				   "L2L2", "L2L2L1", "L2L2L2", "L2L2L3",
				   "L2L3", "L2L3L1", "L2L3L2", "L2L2L3", "L2L2L4", "L2L2L5",
				   "L2L4"];
var Menu3 = ["L3", "L3L1"];

function CleanAll()
{
	CleanMenu1();
	CleanMenu2();
	CleanMenu3();
}

function CleanMenu1()
{
	for(var i = 0;i<Menu1.length;++i)
	{
		$("#"+Menu1[i]).attr("class", "LeftText");
	}
}

function CleanMenu2()
{
	for(var i = 0;i<Menu2.length;++i)
	{
		$("#"+Menu2[i]).attr("class", "LeftText");
	}
}

function CleanMenu3()
{
	for(var i = 0;i<Menu3.length;++i)
	{
		$("#"+Menu3[i]).attr("class", "LeftText");
	}
}

function l1()
{
	$("#L1").attr("class", "LeftTextSelect");
	CleanMenu2();
	CleanMenu3();
}

function l2()
{
	$("#L2").attr("class", "LeftTextSelect");
	CleanMenu1();
	CleanMenu3();
}

function l3()
{
	$("#L3").attr("class", "LeftTextSelect");
	CleanMenu1();
	CleanMenu2();
}

function l2l1()
{
	CleanAll();
	$("#L2").attr("class", "LeftTextSelect");
	$("#L2L1").attr("class", "LeftTextSelect");
}

function l2l2()
{
	CleanAll();
	$("#L2").attr("class", "LeftTextSelect");
	$("#L2L2").attr("class", "LeftTextSelect");
}

function l2l3()
{
	CleanAll();
	$("#L2").attr("class", "LeftTextSelect");
	$("#L2L3").attr("class", "LeftTextSelect");
}