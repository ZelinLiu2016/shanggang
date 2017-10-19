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

import com.sg.domain.AbnormalFrequency;
import com.sg.domain.Abnormal_info;
import com.sg.domain.Shipinfo;

import net.sf.json.JSONObject;

/**
 * @author yuchang xu
 *
 * 2017-08-25
 */
@Controller
@RequestMapping("/abnormalinfo")
public class Abnormal_infoController {
	public SqlSession getSession() throws IOException{
		String resource = "mybatis-config.xml";
		InputStream inputStream = Resources.getResourceAsStream(resource);
		SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession session=sqlSessionFactory.openSession();
        return session;
	}
	
	@RequestMapping(value="/listallabnormal",method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<Abnormal_info>> listabnoraml() throws IOException{
		SqlSession session = this.getSession();
		List<Abnormal_info> abnormal = session.selectList("listallabnormal");
		return new ResponseEntity<List<Abnormal_info>>(abnormal,HttpStatus.OK);
	}
	@RequestMapping(value="/addhandle",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<String> addhandle(@RequestBody String pro) throws IOException{
		SqlSession session = this.getSession();
		JSONObject json = JSONObject.fromObject(pro);
		Abnormal_info ab = new Abnormal_info();
		ab.setMmsi(json.getString("mmsi"));
		ab.setTime(json.getString("time"));
		ab.setAbnormal_type(json.getString("abnormal_type"));
		ab.setHandle(json.getString("handle"));
		session.update("addHandle",ab);
		session.commit();
		session.close();
		return new ResponseEntity<String>("Success!!!",HttpStatus.OK);
	}
	@RequestMapping(value="/locationplayback",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<List<Shipinfo>> playback(@RequestBody String pro) throws IOException{
		//异常点前后各一小时轨迹
		SqlSession session = this.getSession();
		JSONObject json = JSONObject.fromObject(pro);
		Abnormal_info abnormal = new Abnormal_info();
		abnormal.setMmsi(json.getString("mmsi"));
		abnormal.setTime(json.getString("time"));
		List<Shipinfo> shipinfo = session.selectList("getnearbylocation",abnormal);
		for(Shipinfo si:shipinfo){
			System.out.println(si);
		}
		return new ResponseEntity<List<Shipinfo>>(shipinfo,HttpStatus.OK);
	}
	
	@RequestMapping(value="/exceedspeedfre",method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<AbnormalFrequency>> exceedspeedfre() throws IOException{
		//超速异常频率统计
		SqlSession session = this.getSession();
		List<AbnormalFrequency> epabnormal = session.selectList("getspeedfrequency");
		return new ResponseEntity<List<AbnormalFrequency>>(epabnormal,HttpStatus.OK);
	}
	@RequestMapping(value="/areafre",method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<AbnormalFrequency>>areafre() throws IOException{
		//抛泥异常频率统计
		SqlSession session = this.getSession();
		List<AbnormalFrequency> epabnormal = session.selectList("getareafrequency");
		return new ResponseEntity<List<AbnormalFrequency>>(epabnormal,HttpStatus.OK);
	}
	@RequestMapping(value="/routefre",method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<AbnormalFrequency>>routefre() throws IOException{
		//航道异常频率统计
		SqlSession session = this.getSession();
		List<AbnormalFrequency> epabnormal = session.selectList("getroutefrequency");
		return new ResponseEntity<List<AbnormalFrequency>>(epabnormal,HttpStatus.OK);
	}
}
