/**
 * 
 */
package com.sg.controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
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

import com.sg.domain.Route;
import com.sg.domain.Workrecord;

import net.sf.json.JSONObject;

/**
 * @author yuchang xu
 *
 * 2017-11-04
 */

@Controller
@RequestMapping("/workrecord")
public class WorkrecordController {
	public SqlSession getSession() throws IOException{
		String resource = "mybatis-config.xml";
		InputStream inputStream = Resources.getResourceAsStream(resource);
		SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession session=sqlSessionFactory.openSession();
        return session;
	}
	
	@RequestMapping(value="/daterecord",method=RequestMethod.POST)
	 @ResponseBody
	public ResponseEntity<List<Workrecord>> add(@RequestBody String pro) throws IOException{
		JSONObject json = JSONObject.fromObject(pro);
		System.out.println("获得mmsi为"+json.getString("mmsi")+"的船只日期"+json.getString("date")+"的工作记录");
		SqlSession session = this.getSession();
		Workrecord request = new Workrecord();
		request.setMmsi(json.getString("mmsi"));
		request.setDate(json.getString("date"));
		List<Workrecord> record = session.selectList("listonedayrecord",request);
		session.close();
	    return new ResponseEntity<List<Workrecord>>(record, HttpStatus.OK);
	}
	
	@RequestMapping(value="/abnormal",method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<String>> abnormal() throws IOException{
		System.out.println("获得船只异常工作记录");
		SqlSession session = this.getSession();
		List<String> res_str = new ArrayList<String>();
		List<Workrecord> res = session.selectList("getabnormal");
		for(Iterator<Workrecord> iter = res.iterator();iter.hasNext();){
			Workrecord rec = (Workrecord)iter.next();
			String temp = rec.toString();
			String route_id = session.selectOne("getShipRoute_id",Integer.valueOf(rec.mmsi));
			Route route = session.selectOne("getRouteinfoByid",route_id);
			temp = temp + "dumping_area:" + route.getDumping_area() +","+"work_area:"+route.getHarbor()+","+"route_location:"+route.getLocation();
			res_str.add(temp);
		}
		return new ResponseEntity<List<String>>(res_str,HttpStatus.OK);
	}
}
