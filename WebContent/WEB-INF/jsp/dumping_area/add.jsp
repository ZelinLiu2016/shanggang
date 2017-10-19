<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="sf" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
<sf:form method="post" modelAttribute="dumpingarea">
	Area_ID:<sf:input path="area_id"/><br/>
	Location:<sf:input path="location"/><br/>
	Name:<sf:input path="name"/><br/>
	<input type="submit" value="添加抛泥区域"/>
</sf:form>
</body>
</html>