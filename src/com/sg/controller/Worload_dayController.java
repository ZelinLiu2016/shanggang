/**
 * 
 */
package com.sg.controller;

import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
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

import com.sg.domain.Project;
import com.sg.domain.Route;
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
		List<String> mmsi_str = session.selectList("getworkingmmsilist");
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
			double capacity = session.selectOne("getCapacity",Integer.valueOf(mmsi));
			String temp = "mmsi:"+ mmsi +",";
			int number = 0;
			Workload_day wd = new Workload_day();
			wd.setMmsi(Integer.valueOf(mmsi));
			wd.setRecorddate(today);
			number = session.selectOne("getcountafter",wd);
			temp+=("day:"+number+","+"day_volumn:"+number*capacity+",");
//			System.out.println(temp);
			wd.setRecorddate(week);
			number = session.selectOne("getcountafter",wd);
			temp+=("week:"+number+","+"week_volumn:"+number*capacity+",");
			wd.setRecorddate(month);
			number = session.selectOne("getcountafter",wd);
			temp+=("month:"+number+","+"month_volumn:"+number*capacity);
//			System.out.println(temp);
			res.add(temp);
		}
		return new ResponseEntity<List<String>>(res,HttpStatus.OK);
	}
	
	@RequestMapping(value="/projectworkload",method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<String>> projectworkload() throws IOException{
		//查询所有船当天目前的工作量
		List<String> res = new ArrayList<String>();
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
		SqlSession session = getSession();
		List<Project> working_pro = session.selectList("listworkingproject");
		for(Iterator iter = working_pro.iterator(); iter.hasNext();){
			Project proj = (Project)iter.next();
			String temp = proj.getProjectName();
			String mmsi_str = proj.getMmsilist();
			List<String> all_mmsi = new ArrayList<String>();
			String[] mm = mmsi_str.split(";");
			for(int i=0;i<mm.length;i++){
				if(!all_mmsi.contains(mm[i]))
					all_mmsi.add(mm[i]);
			}
			int day_workload = 0;
			int day_volumn = 0;
			int week_workload = 0;
			int week_volumn = 0;
			int month_workload = 0;
			int month_volumn = 0;
			for(String mmsi:all_mmsi){
				Workload_day wd = new Workload_day();
				wd.setMmsi(Integer.valueOf(mmsi));
				wd.setRecorddate(today);
				double capacity = session.selectOne("getCapacity",Integer.valueOf(mmsi));
				int per_day = session.selectOne("getcountafter",wd);
				wd.setRecorddate(week);
				int per_week = session.selectOne("getcountafter",wd);
				wd.setRecorddate(month);
				int per_month = session.selectOne("getcountafter",wd);
				day_workload += per_day;
				day_volumn += per_day*capacity;
				week_workload += per_week;
				week_volumn += per_week*capacity;
				month_workload += per_month;
				month_volumn += per_month*capacity;
			}
			temp = temp+ ",day:" + day_workload + ",day_volumn:" + day_volumn +",week:" +week_workload + ",week_volumn:" + week_volumn+",month:" + month_workload+ ",month_volumn:" + month_volumn;
			res.add(temp);
		}		
		return new ResponseEntity<List<String>>(res,HttpStatus.OK);
	}
	
	@RequestMapping(value="/getworkloadbymmsi",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<HashMap<String,Double>> getworkloadbymmsi(@RequestBody String pro) throws IOException{
		//查询mmsi某时间段内的工作量（方为单位）
		HashMap<String,Double> result = new HashMap<String,Double>();
		SqlSession session = getSession();
		JSONObject json = JSONObject.fromObject(pro);
		Project project = new Project();
		project.setBeginDate(json.getString("begindate"));
		project.setEndDate(json.getString("enddate"));
		project.setMmsilist(json.getString("mmsi"));
		System.out.println("查询mmsi编号为"+project.getMmsilist()+"日期"+project.getBeginDate()+","+project.getEndDate()+"之间的工作量");
		if(session.selectOne("getcountduring",project)!=null){
			double capacity = session.selectOne("getCapacity",Integer.valueOf(project.getMmsilist()));
			int num = session.selectOne("getcountduring",project);
			double vol = capacity*num;
			result.put("number", Double.valueOf(num));
			result.put("volumn", vol);
		}
		else{
			result.put("number", 0.0);
			result.put("volumn", 0.0);
		}
		return new ResponseEntity<HashMap<String,Double>>(result, HttpStatus.OK);
	}
	
	@RequestMapping(value="/getprojectproduring",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<List<String>> getprojectproduring(@RequestBody String pro) throws IOException, ParseException{
		//返回某工程下所有船只时间段内工作量
		List<String> res = new ArrayList<String>(); 
		SqlSession session = getSession();
		JSONObject json = JSONObject.fromObject(pro);
		System.out.println("查询工程编号为"+json.getInt("project_id")+"的进度");
		Project project = new Project();
		project.setBeginDate(session.selectOne("getbegindate",json.getInt("project_id")));
		System.out.println(project.getBeginDate());
		project.setEndDate(json.getString("enddate"));
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		int pro_len = (int) ((sdf.parse(session.selectOne("getenddate",json.getInt("project_id"))).getTime()-sdf.parse(session.selectOne("getbegindate",json.getInt("project_id"))).getTime())/(1000*60*60*24));
		int now = (int) ((sdf.parse(json.getString("enddate")).getTime()-sdf.parse(session.selectOne("getbegindate",json.getInt("project_id"))).getTime())/(1000*60*60*24));
		double plan_percent = (double)now/pro_len;
		String mmsilist = session.selectOne("getMmsilist",json.getInt("project_id"));
		String[] mmsi = mmsilist.split(";");
		double total = 0.0;
		int total_num =0;
		for(String num:mmsi){
			int company_id = session.selectOne("getshipcompany_id",Integer.valueOf(num));
			String company_name = session.selectOne("getCompanyName",String.valueOf(company_id));
			String str ="mmsi:"+num+","+"company:"+company_name+",";
			project.setMmsilist(num);
			if(session.selectOne("getcountduring",project)!=null){
				int temp = session.selectOne("getcountduring",project);
				double capacity = session.selectOne("getCapacity",Integer.valueOf(num));
				str = str+"number:"+temp+","+"volumn:"+capacity*temp/10000;
				res.add(str);
				total_num = total_num + temp;
				total = total+capacity*temp/10000;
			}
			else{
				str = str+"number:"+"0.0"+","+"volumn:"+"0.0";
				res.add(str);
			}
		}
		double project_volume = session.selectOne("getvolume",json.getInt("project_id"));
		double project_percent = total/project_volume;
		res.add("totalnumber:"+total_num);
		res.add("total_volumn:"+total);
		res.add("project_process_percent:"+project_percent);
		res.add("plan_percent:"+plan_percent);
		return new ResponseEntity<List<String>>(res,HttpStatus.OK);
	}
	
	@RequestMapping(value="/getharborproduring",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<List<String>> getharborproduring(@RequestBody String pro) throws IOException{
		//返回某挖泥区下所有船只时间段内工作量
		List<String> res = new ArrayList<String>(); 
		SqlSession session = getSession();
		JSONObject json = JSONObject.fromObject(pro);
		System.out.println("查询挖泥区"+json.getInt("harbor_id")+"的进度");
		Project project = new Project();
		project.setBeginDate(json.getString("begindate"));
		project.setEndDate(json.getString("enddate"));
		List<Integer> route = session.selectList("getroute_idbyharbor",json.getString("harbor_id"));
		List<String> mmsi = new ArrayList<>();
		for(int route_id:route){
			List<String> ship = session.selectList("getshipbyroute",route_id);
			for(String si:ship){
				if(!mmsi.contains(si))
					mmsi.add(si);
			}
		}
		double total = 0.0;
		int total_num =0;
		for(String num:mmsi){
			String str = "mmsi:"+num+",";
			project.setMmsilist(num);
			int temp = session.selectOne("getcountduring",project);
			double capacity = session.selectOne("getCapacity",Integer.valueOf(num));
			str = str+"number:"+temp+",volumn:"+capacity*temp/10000;
			res.add(str);
			total_num = total_num +temp;
			total = total+capacity*temp/10000;	
		}
		res.add("total_number:"+total_num+",total_volumn:"+total);
		return new ResponseEntity<List<String>>(res,HttpStatus.OK);
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
				int temp = session.selectOne("getcountafter",workload);
				double capacity = session.selectOne("getCapacity",workload.getMmsi());
				res.put(num,(double) capacity*temp/10000);
				total = total+capacity*temp/10000;
			}
			else
				res.put(num,0.0);
		}
		res.put("total", total);
		res.put("percent", total/volume);
		return new ResponseEntity<HashMap<String,Double>>(res,HttpStatus.OK);
	}
	@RequestMapping(value="/getcompanyproduring",method= RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<List<String>> getcompanyproduring(@RequestBody String pro) throws IOException{
		//返回某公司时间段的工作量
		List<String> res = new ArrayList<String>(); 
		SqlSession session = getSession();
		JSONObject json = JSONObject.fromObject(pro);
		List<String> company = session.selectList("getbuildcompany");
		Project project = new Project();
		project.setBeginDate(json.getString("begindate"));
		project.setEndDate(json.getString("enddate"));
		for(String com:company){
			String str = "company_id:"+com+",";
//			System.out.println("查询公司编号为"+com+"的工作量");
			List<Integer> mmsilist = session.selectList("getMMSIofCompany",com);
			double total =0.0;
			int total_num = 0;
			for(int mmsi:mmsilist){
				project.setMmsilist(String.valueOf(mmsi));
				int temp = session.selectOne("getcountduring",project);
				double capacity = session.selectOne("getCapacity",mmsi);
				str = str+"mmsi:"+String.valueOf(mmsi)+",number:"+temp+",volumn:"+(double) capacity*temp/10000+";";
				total_num+=temp;
				total = total+capacity*temp/10000;
			}
			str = str+"total_number:"+total_num+",total_volumn:"+total;
			res.add(str);
		}
		return new ResponseEntity<List<String>>(res,HttpStatus.OK);
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
	public static void main(String[] args) throws ParseException {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		long sub = (sdf.parse("2017-12-03").getTime() - sdf.parse("2017-11-23").getTime())/(1000*60*60*24);
		System.out.println(sub);
	}
}
