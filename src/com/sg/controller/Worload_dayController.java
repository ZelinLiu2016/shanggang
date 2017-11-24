/**
 * 
 */
package com.sg.controller;

import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
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

import com.sg.domain.Project;
import com.sg.domain.Workload_day;

import net.sf.json.JSONObject;

/**
 * @author yuchang xu
 *
 * 2017-08-30
 */

@Controller
@RequestMapping("/workload")
public class Worload_dayController {
	public SqlSession getSession() throws IOException{
		String resource = "mybatis-config.xml";
		InputStream inputStream = Resources.getResourceAsStream(resource);
		SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession session=sqlSessionFactory.openSession();
        return session;
	}
	
//	@RequestMapping(value="/getallworkload",method=RequestMethod.GET)
//	@ResponseBody
//	public ResponseEntity<List<Integer>> getallworkload() throws IOException{
//		SqlSession session = getSession();
//		List<Integer> allworkload = session.selectList("getallsumworkload");
//		System.out.println(allworkload);
//		return new ResponseEntity<List<Integer>>(allworkload,HttpStatus.OK);
//	}
	
	@RequestMapping(value="/getallnewworkload",method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<String>> getallnewworkload() throws IOException{
		//查询所有船当天目前的工作量
		SqlSession session = getSession();
		List<String> mmsi_str = session.selectList("getallmmsilist");
		List<String> all_mmsi = new ArrayList<String>();
		for(String str:mmsi_str){
			String[] mm = str.split(";");
			for(int i=0;i<mm.length;i++){
				if(!all_mmsi.contains(mm[i]))
					all_mmsi.add(mm[i]);
			}
		}
		SimpleDateFormat sj = new SimpleDateFormat("yyyy-MM-dd");
		Date now = new Date();
		DateFormat d1 = DateFormat.getDateInstance();		
		Calendar cal = Calendar.getInstance();
		cal.setTime(now);
		cal.add(Calendar.DATE, -1);
		String today = sj.format(cal.getTime()).toString();
//		System.out.println("昨天日期："+today);
		cal.setTime(now);
		String month = sj.format(cal.getTime()).toString().substring(0, 8).concat("01");
		int w = cal.get(Calendar.DAY_OF_WEEK) - 2;
		cal.add(Calendar.DATE, -w);
		String week = sj.format(cal.getTime()).toString();
//		System.out.println("本月初日期"+month);
//		System.out.println("本周初日期："+week);
		List<String> res = new ArrayList<String>();
		for(String mmsi:all_mmsi){
			String temp = "mmsi:"+ mmsi +",";
			Workload_day wd = new Workload_day();
			wd.setMmsi(Integer.valueOf(mmsi));
			wd.setRecorddate(today);
			temp+=("day:"+session.selectOne("getcountafter",wd)+",");
//			System.out.println(temp);
			wd.setRecorddate(week);
			temp+=("week:"+session.selectOne("getcountafter",wd)+",");
			wd.setRecorddate(month);
			temp+=("month:"+session.selectOne("getcountafter",wd));
//			System.out.println(temp);
			res.add(temp);
		}
		return new ResponseEntity<List<String>>(res,HttpStatus.OK);
	}
	
	@RequestMapping(value="/getworkloadbymmsi",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Double> getworkloadbymmsi(@RequestBody String pro) throws IOException{
		//查询mmsi某日期之后的工作量（方为单位）
		SqlSession session = getSession();
		JSONObject json = JSONObject.fromObject(pro);
		Workload_day workload = new Workload_day();
		workload.setMmsi(json.getInt("mmsi"));
		workload.setRecorddate(json.getString("date"));
		System.out.println("查询mmsi编号为"+workload.getMmsi()+"日期"+workload.getRecorddate()+"之后的工作量");
		if(session.selectOne("getworkload",workload)!=null){
			double capacity = session.selectOne("getCapacity",workload.getMmsi());
			int num = session.selectOne("getworkload",workload);
			double result = capacity*num;
			return new ResponseEntity<Double>(result, HttpStatus.OK);
		}
		else
			return new ResponseEntity<Double>(0.0,HttpStatus.OK);
//		List<String> recorddate = session.selectList("listMmsiRecorddate",json.getInt("mmsi"));
//		if(recorddate.contains(workload.getRecorddate())){
//			double capacity = session.selectOne("getCapacity",workload.getMmsi());
//			int num = session.selectOne("getworkload",workload);
//			double result = capacity*num;
//			return new ResponseEntity<String>(String.valueOf(result), HttpStatus.OK);
//		}
//		else
//		{
//			return new ResponseEntity<String>("This record is not exist！！！",HttpStatus.OK);
//		}
	}
	
	
	@RequestMapping(value="/getprojectprocess",method= RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<HashMap<String,Double>> getprojectprocess(@RequestBody String pro) throws IOException{
		//返回某工程下所有船只开工以来的进度 工程总进度 工程进度百分比
		HashMap<String,Double> res = new HashMap<String,Double>(); 
		SqlSession session = getSession();
		JSONObject json = JSONObject.fromObject(pro);
		System.out.println("查询工程编号为"+json.getInt("project_id")+"的进度");
		String begindate = session.selectOne("getbegindate",json.getInt("project_id"));
		Double volume = session.selectOne("getvolume",json.getInt("project_id"));
		String mmsilist = session.selectOne("getMmsilist",json.getInt("project_id"));
		String[] mmsi = mmsilist.split(";");
		double total = 0;
		for(String num:mmsi){
			Workload_day workload = new Workload_day();
			workload.setMmsi(Integer.valueOf(num));
			workload.setRecorddate(begindate);
			if(session.selectOne("getsumworkload",workload)!=null){
				int temp = session.selectOne("getsumworkload",workload);
				double capacity = session.selectOne("getCapacity",workload.getMmsi());
				res.put(num,(double) capacity*temp);
				total = total+capacity*temp;
			}
			else
				res.put(num,0.0);
		}
		res.put("total", total);
		res.put("percent", total/volume);
		return new ResponseEntity<HashMap<String,Double>>(res,HttpStatus.OK);
	}
	@RequestMapping(value="/getcompanyprocess",method= RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<HashMap<String,Double>> getcompanyprocess(@RequestBody String pro) throws IOException{
		//返回某公司某日期之后的工作量
		HashMap<String,Double> res = new HashMap<String,Double>(); 
		SqlSession session = getSession();
		JSONObject json = JSONObject.fromObject(pro);
		System.out.println("查询公司编号为"+json.getString("company_id")+"的工作量");
		String begindate = json.getString("begindate");
		List<Integer> mmsilist = session.selectList("getMMSIofCompany",json.getString("company_id"));
		double total =0.0;
		for(int mmsi:mmsilist){
			Workload_day workload = new Workload_day();
			workload.setMmsi(mmsi);
			workload.setRecorddate(begindate);
			if(session.selectOne("getsumworkload",workload)!=null){
				int temp = session.selectOne("getsumworkload",workload);
				double capacity = session.selectOne("getCapacity",workload.getMmsi());
				res.put(String.valueOf(mmsi),(double) capacity*temp);
				total = total+capacity*temp;
			}
			else
				res.put(String.valueOf(mmsi),0.0);
		}
		res.put("total", total);
		return new ResponseEntity<HashMap<String,Double>>(res,HttpStatus.OK);
	}
}
