function jump_to_second()
{
	if(len(sessionStorage) == 0)
	{
		window.open("202.120.38.3:8092/index.html");
	}
	else{
		userid = sessionStorage.id;
		pwd = sessionStorage.pwd;
		window.open("202.120.38.3:8092/index.html?userid=" + userid+"pwd=" + pwd);
	}
}