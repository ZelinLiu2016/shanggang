package com.sg.controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;


import com.sg.domain.Fleet;
import com.sg.domain.Ship;

import net.sf.json.JSONObject;

@Controller
@RequestMapping("/fleet")
public class FleetController {
	
	public SqlSession getSession() throws IOException{
		String resource = "mybatis-config.xml";
		InputStream inputStream = Resources.getResourceAsStream(resource);
		SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession session=sqlSessionFactory.openSession();
        return session;
	}
	
	@RequestMapping(value="/list",method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<Fleet>> list() throws IOException, JsonMappingException, IOException{
		SqlSession session = this.getSession();
		List<String> fleet_json = new ArrayList<String>();
		List<Fleet> fl = session.selectList("listFleet");
		
		System.out.println("船队列表：");
		return new ResponseEntity<List<Fleet>>(fl, HttpStatus.OK);
	}
	
	@RequestMapping(value="/listbyid",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<List<Fleet>> list(@RequestBody String id) throws IOException, JsonMappingException, IOException{
		JSONObject json = JSONObject.fromObject(id);
		int fleet_id = json.getInt("fleet_id");
		SqlSession session = this.getSession();
		List<Fleet> fl = session.selectList("getFleet",fleet_id);
		System.out.println("船队列表：");
	
		return new ResponseEntity<List<Fleet>>(fl, HttpStatus.OK);
	}
	

	@RequestMapping(value="/add",method=RequestMethod.POST)
	 @ResponseBody
	public ResponseEntity<String> add(@RequestBody String str) throws IOException{
		System.out.println("插入数据");
		System.out.println(str);
		JSONObject json = JSONObject.fromObject(str);
		Fleet fleet = new Fleet();
		fleet.setFleet_id(json.getInt("fleet_id"));
		fleet.setName(json.getString("name"));
		fleet.setAddress(json.getString("address"));
		fleet.setContact(json.getString("contact"));
		fleet.setCellphone(json.getString("cellphone"));
		
		System.out.println(fleet);
		SqlSession session = this.getSession();
        session.insert("addFleet",fleet);
        session.commit();
		session.close();
		String result ="success!!!!";
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	
	@RequestMapping(value="/update")
	 @ResponseBody
	public ResponseEntity<String> update(@RequestBody String str) throws IOException{
		System.out.println("更新数据");
		//System.out.println(str);
		JSONObject json = JSONObject.fromObject(str);
		Fleet fleet = new Fleet();
		fleet.setFleet_id(json.getInt("fleet_id"));
		fleet.setName(json.getString("name"));
		fleet.setAddress(json.getString("address"));
		fleet.setContact(json.getString("contact"));
		fleet.setCellphone(json.getString("cellphone"));
		
		System.out.println(fleet);
		SqlSession session = this.getSession();
		 session.update("updateFleet",fleet);
		 session.commit();
		session.close();
		String result ="success!!!!";
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	
	@RequestMapping(value="/delete")
	 @ResponseBody
	public ResponseEntity<String> delete(@RequestBody String id) throws IOException{
		System.out.println("删除数据");
		JSONObject json = JSONObject.fromObject(id);
		int fleet_id = json.getInt("fleet_id");
		SqlSession session = this.getSession();
		session.delete("deleteFleet",fleet_id);
		session.commit();
		session.close();
		String result ="success!!!!";
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
}
