package com.sg.controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sg.domain.User_system2;

import net.sf.json.JSONObject;

@Controller
@RequestMapping("/user_sys2")
public class User_system2Controller {
	public SqlSession getSession() throws IOException{
		String resource = "mybatis-config.xml";
		InputStream inputStream = Resources.getResourceAsStream(resource);
		SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession session=sqlSessionFactory.openSession();
        return session;
	}
	
	@RequestMapping(value="/add",method=RequestMethod.POST)
	 @ResponseBody
	public ResponseEntity<String> add(@RequestBody String pro) throws IOException{
		JSONObject json = JSONObject.fromObject(pro);
		String name = json.getString("username");
		String password = json.getString("password");
		String privilege = json.getString("privilege");
		User_system2 u2 = new User_system2();
		u2.setUser_name(name);
		u2.setPassword(password);
		u2.setPrivilege(privilege);
		SqlSession session = this.getSession();
		session.insert("addUser",u2);
		session.commit();
		session.close();
		return new ResponseEntity<String>("Success!",HttpStatus.OK);
	}
	
	@RequestMapping(value="/alluser",method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<User_system2>> alluser(@RequestBody String pro) throws IOException{
		SqlSession session = this.getSession();
		List<User_system2> userlist = session.selectList("getUsers");
		return new ResponseEntity<List<User_system2>>(userlist,HttpStatus.OK);
	}
	
	@RequestMapping(value="/modifyuser",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<String> modifypassword(@RequestBody String pro) throws IOException{
		JSONObject json = JSONObject.fromObject(pro);
		String name = json.getString("username");
		String password = json.getString("password");
		String privilege = json.getString("privilege");
		User_system2 u2 = new User_system2();
		u2.setUser_name(name);
		u2.setPassword(password);
		u2.setPrivilege(privilege);
		SqlSession session = this.getSession();
		session.update("updateUser",u2);
		session.commit();
		session.close();
		return new ResponseEntity<String>("Success!",HttpStatus.OK);
	}
	
	@RequestMapping(value="/verification",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<String> verification(@RequestBody String pro) throws IOException{
		JSONObject json = JSONObject.fromObject(pro);
		String name = json.getString("username");
		String password = json.getString("password");
		SqlSession session = this.getSession();
		String true_password = session.selectOne("getUserPassword",name);
		System.out.println(true_password);
		if(true_password==null)
			return new ResponseEntity<String>("Not exist!",HttpStatus.OK);
		else if(true_password.equals(password))
			return new ResponseEntity<String>("RIGHT!",HttpStatus.OK);
		else
			return new ResponseEntity<String>("WRONG!",HttpStatus.OK);
	}
}
