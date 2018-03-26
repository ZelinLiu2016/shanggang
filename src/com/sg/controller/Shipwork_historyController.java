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

import com.sg.domain.Ship;
import com.sg.domain.Shipwork_history;

import net.sf.json.JSONObject;

/**
 * @author yuchang xu
 *
 * 2018-03-20
 */
@Controller
@RequestMapping("/shipworkhistory")
public class Shipwork_historyController {
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
		Shipwork_history shiphis = new Shipwork_history();
		shiphis.setMmsi(json.getInt("mmsi"));
		shiphis.setCompany_id(json.getInt("company_id"));
		shiphis.setRoute_id(json.getInt("route_id"));
		shiphis.setStartdate(json.getString("startdate"));
		shiphis.setEnddate(json.getString("enddate"));
		shiphis.setProject_id(json.getInt("project_id"));
		SqlSession session = this.getSession();
		session.insert("addShipworkhistory",shiphis);
		session.commit();
		session.close();
		String str ="success!!!!";
	    return new ResponseEntity<String>(str, HttpStatus.OK);
	}
	@RequestMapping(value="/delete",method=RequestMethod.POST)
	 @ResponseBody
	public ResponseEntity<String> delete(@RequestBody String pro) throws IOException{
		System.out.println("删除数据");
		System.out.println(pro);
		JSONObject json = JSONObject.fromObject(pro);
		Ship ship = new Ship();
		ship.setMmsi(json.getInt("mmsi"));
		ship.setFleet_id(json.getInt("company_id"));
		ship.setRoute_id(json.getInt("route_id"));
		ship.setStartdate(json.getString(json.getString("startdate")));
		ship.setEnddate(json.getString("enddate"));
		ship.setProject_id(json.getInt("project_id"));
		SqlSession session = this.getSession();
		session.delete("deleteShipworkhis",ship);
		session.commit();
		session.close();
		String str ="success!!!!";
	    return new ResponseEntity<String>(str, HttpStatus.OK);
	}
	@RequestMapping(value="/listbymmsi",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<List<Shipwork_history>> listbymmsi(@RequestBody String pro) throws IOException{
		JSONObject json = JSONObject.fromObject(pro);
		int mmsi=json.getInt("mmsi");
		int project_id = json.getInt("project_id");
		Shipwork_history shiphis = new Shipwork_history();
		shiphis.setMmsi(mmsi);
		shiphis.setProject_id(project_id);
		SqlSession session = this.getSession();
		List<Shipwork_history> res = session.selectList("getShipworkhisbyid",shiphis);
		return new ResponseEntity<List<Shipwork_history>>(res,HttpStatus.OK);
	}
}
