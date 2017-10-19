/**
 * 
 */
package com.sg.controller;

import java.io.IOException;
import java.io.InputStream;
import java.net.URLDecoder;
import java.util.ArrayList;
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

import com.sg.domain.Dredging_area;
import com.sg.domain.DumpingArea;

import net.sf.json.JSONObject;

/**
 * @author yuchang xu
 *
 * 2017-09-14
 */
@Controller
@RequestMapping("/dredging_area")
public class Dredging_areaController {
	public SqlSession getSession() throws IOException{
		String resource = "mybatis-config.xml";
		InputStream inputStream = Resources.getResourceAsStream(resource);
		SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession session=sqlSessionFactory.openSession();
        return session;
	}
	
	@RequestMapping(value="/add",method=RequestMethod.POST)
	 @ResponseBody
	public void add(@RequestBody String pro) throws IOException{
		System.out.println("插入数据");
		JSONObject json = JSONObject.fromObject(pro);
		Dredging_area dredging = new Dredging_area();
		dredging.setDredging_id(json.getInt("area_id"));
		dredging.setLocation(json.getString("location"));
		dredging.setDredging_name(json.getString("name"));
		SqlSession session = this.getSession();
        session.insert("addDredgingArea",dredging);
        session.commit();
		session.close();
	}
	@RequestMapping(value="/listbyname",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<List<Dredging_area>> listbyid(@RequestBody String id) throws IOException{
		JSONObject json = JSONObject.fromObject(id);
		String area_name = json.getString("area_name");
		SqlSession session = this.getSession();
		 List<Dredging_area> da=session.selectList("getDredgingArea",area_name);
		 return new ResponseEntity<List<Dredging_area>>(da, HttpStatus.OK);
	}
	@RequestMapping(value="/listall",method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<Dredging_area>> listall() throws IOException{
		SqlSession session = this.getSession();
		 List<Dredging_area> da=session.selectList("getallDredgingArea");
		 return new ResponseEntity<List<Dredging_area>>(da, HttpStatus.OK);
	}
	@RequestMapping(value="/update")
	 @ResponseBody
	public ResponseEntity<String> update(@RequestBody String pro) throws IOException{
		System.out.println("更新数据");
		JSONObject json = JSONObject.fromObject(pro);
		Dredging_area dredging = new Dredging_area();
		dredging.setDredging_id(json.getInt("area_id"));
		dredging.setLocation(json.getString("location"));
		dredging.setDredging_name(json.getString("name"));
		SqlSession session = this.getSession();
		 session.update("updateDredgingArea",dredging);
		 session.commit();
		session.close();
		String str ="success!!!!";
		 return new ResponseEntity<String>(str, HttpStatus.OK);
	}
	
	@RequestMapping(value="/delete")
	 @ResponseBody
	public void delete(@RequestBody String pro) throws IOException{
		System.out.println("删除数据");
		JSONObject json = JSONObject.fromObject(pro);
		String area_id = json.getString("area_id");
		SqlSession session = this.getSession();
		session.delete("deleteDredgingArea",area_id);
		session.commit();
		session.close();
	}
}
