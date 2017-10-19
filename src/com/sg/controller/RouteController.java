/**
 * 
 */
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

import com.sg.domain.Company;
import com.sg.domain.Route;

import net.sf.json.JSONObject;

/**
 * @author yuchang xu
 *
 * 2017-09-11
 */

@Controller
@RequestMapping("/route")
public class RouteController {
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
		System.out.println("插入数据");
		System.out.println(pro);
		JSONObject json = JSONObject.fromObject(pro);
		Route route = new Route();
		route.setRoute_id(json.getInt("route_id"));
		route.setHarbor(json.getString("harbor"));
		route.setDumping_area(json.getString("dumping_area"));
		route.setSpeedlimit(json.getDouble("speedlimit"));
		route.setLocation(json.getString("location"));
		SqlSession session = this.getSession();
		session.insert("addRoute",route);
		session.commit();
		session.close();
		String str ="success!!!!";
	    return new ResponseEntity<String>(str, HttpStatus.OK);
	}
	@RequestMapping(value="/update",method=RequestMethod.POST)
	 @ResponseBody
	public ResponseEntity<String> update(@RequestBody String pro) throws IOException{
		System.out.println("更新数据");
		System.out.println(pro);
		JSONObject json = JSONObject.fromObject(pro);
		Route route = new Route();
		route.setRoute_id(json.getInt("route_id"));
		route.setHarbor(json.getString("harbor"));
		route.setDumping_area(json.getString("dumping_area"));
		route.setSpeedlimit(json.getDouble("speedlimit"));
		route.setLocation(json.getString("location"));
		SqlSession session = this.getSession();
		session.insert("updateRoute",route);
		session.commit();
		session.close();
		String str ="success!!!!";
	    return new ResponseEntity<String>(str, HttpStatus.OK);
	}
	@RequestMapping(value="/delete",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<String> delete(@RequestBody String pro) throws IOException{
		System.out.println("删除数据");
		JSONObject json = JSONObject.fromObject(pro);
		String id = json.getString("route_id");
		SqlSession session = this.getSession();
		session.delete("deleteRoute",id);
		session.commit();
		session.close();
		String str ="success!!!!";
	    return new ResponseEntity<String>(str, HttpStatus.OK);
	}
	@RequestMapping(value="/listall",method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<Company>> listall() throws IOException{
		System.out.println("航道列表");
		SqlSession session = this.getSession();
		List<Company> companylist = session.selectList("getRoute");
		session.close();
	    return new ResponseEntity<List<Company>>(companylist, HttpStatus.OK);
	}
}
