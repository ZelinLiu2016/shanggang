/**
 * 
 */
package com.sg.controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.apache.tomcat.jni.Local;
import org.omg.PortableInterceptor.LOCATION_FORWARD;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import net.sf.json.JSONObject;

import com.baidu.mapapi.model.LatLng;
import com.sg.abnormalDetection.Point;
import com.sg.abnormalDetection.Quadrilateral;
import com.sg.domain.Abnormal_info;
import com.sg.domain.Project;
import com.sg.domain.Shipinfo;
import com.sg.http.DeleteTimerTask;
/**
 * @author yuchang xu
 *
 * 2017-08-15
 */

@Controller
@RequestMapping("/shipinfo")
public class ShipinfoController {
	public SqlSession getSession() throws IOException{
		String resource = "mybatis-config.xml";
		InputStream inputStream = Resources.getResourceAsStream(resource);
		SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession session=sqlSessionFactory.openSession();
        return session;
	}
	
	@RequestMapping(value="/listallinfo",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<List<Shipinfo>> listallinfo(@RequestBody String pro) throws IOException{
		JSONObject json = JSONObject.fromObject(pro);
		String mmsi = json.getString("mmsi");
		SqlSession session  = this.getSession();
		List<Shipinfo> shipinfo = session.selectList("listallShipinfo",mmsi);
		System.out.println("mmsi编号"+mmsi+"的船只的所有轨迹记录");
		return new ResponseEntity<List<Shipinfo>>(shipinfo,HttpStatus.OK);
	}
	
	@RequestMapping(value="/listnewinfo",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<List<Shipinfo>> listnewinfo(@RequestBody String pro) throws IOException{
		JSONObject json = JSONObject.fromObject(pro);
		String mmsi = json.getString("mmsi");
		SqlSession session  = this.getSession();
		List<Shipinfo> shipinfo = session.selectList("listnewShipinfo",mmsi);
		System.out.println("mmsi编号"+mmsi+"的船只的最新位置记录");
		return new ResponseEntity<List<Shipinfo>>(shipinfo,HttpStatus.OK);
	}
	@RequestMapping(value="/listinfoafter",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<List<Shipinfo>> listinfafter(@RequestBody String pro) throws IOException{
		JSONObject json = JSONObject.fromObject(pro);
		Abnormal_info ab = new Abnormal_info();
		ab.setMmsi(json.getString("mmsi"));;
		ab.setTime(json.getString("starttime"));
		SqlSession session  = this.getSession();
		List<Shipinfo> shipinfo = session.selectList("getseverallocation",ab);
		System.out.println("查询mmsi编号"+json.getString("mmsi")+"的船只"+json.getString("starttime")+"之后1h的轨迹记录");
		return new ResponseEntity<List<Shipinfo>>(shipinfo,HttpStatus.OK);
	}
	@RequestMapping(value="/listinfoduring",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<List<Shipinfo>> listinduring(@RequestBody String pro) throws IOException{
		JSONObject json = JSONObject.fromObject(pro);
		Project info = new Project();
		info.setBeginDate(json.getString("starttime"));
		info.setEndDate(json.getString("endtime"));
		info.setMmsilist(json.getString("mmsi"));
		SqlSession session  = this.getSession();
		List<Shipinfo> shipinfo = session.selectList("getinfoduring",info);
		System.out.println("查询编号为"+json.getString("mmsi")+"的船只"+json.getString("starttime")+"到"+json.getString("endtime")+"的轨迹记录");
		return new ResponseEntity<List<Shipinfo>>(shipinfo,HttpStatus.OK);
	}
	
	@RequestMapping(value="/flowofday",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<List<String>> flow(@RequestBody String pro) throws IOException{
		List<String> res = new ArrayList<String>();
		JSONObject json = JSONObject.fromObject(pro);
		String mmsi = json.getString("mmsi");
		String starttime = json.getString("starttime");
		String endtime = json.getString("endtime");
		Project info = new Project();
		info.setMmsilist(mmsi);
		info.setBeginDate(starttime);
		info.setEndDate(endtime);
//		String harbor_str = "30:33:53.48025,122:10:22.15761-30:33:33.11945,122:10:18.39148-30:32:55.71872,122:17:18.08089-30:32:35.36090,122:17:14.29433";
//		String dumping_str = "30:34:53,122:18:31-30:35:55,122:19:22-30:36:17,122:18:45-30:35:17,122:17:55";
		SqlSession session = this.getSession();
		String route_id = session.selectOne("getShipRoute_id",Integer.valueOf(mmsi));
		String harbor_id = session.selectOne("getdredgingareabyid",route_id);
		String harbor_str = session.selectOne("getDredgingLocation",harbor_id);
		String dumping_id = session.selectOne("getDumpingAreabyid",route_id);
		String dumping_str = session.selectOne("getDumpingLocation",dumping_id);
		Quadrilateral harbor = new Quadrilateral(harbor_str);
		Quadrilateral dumping = new Quadrilateral(dumping_str);
		
		if(session.selectList("getinfoduring",info)==null)
			return new ResponseEntity<List<String>>(res,HttpStatus.OK);
		
		List<Shipinfo> location_list = session.selectList("getinfoduring",info);
//		System.out.println(location_list);
//		System.out.println(location_list.get(0).ti);
		int len = location_list.size();
		System.out.println("the length of the sequence:"+len);
		int[] state = new int[len];
		int i=0;
		for(Shipinfo it:location_list){
			LatLng point = new LatLng(Double.valueOf(it.lat),Double.valueOf(it.lon));
			if(harbor.isContainsPoint(point))
				state[i]=1;  //in harbor
			else if(dumping.isContainsPoint(point))
				state[i]=2; //in dumping area
			else
				state[i]=3;// neither in harbor nor in dumping area
			i=i+1;
//			System.out.print(state[i]+",");
		}
		System.out.println("the length of state:"+state.length);
		boolean wait1 = true;
		boolean wait2 = false;
		String[] period = new String[2];
		period[0] = "";
		period[1] = "";
		for(int j=0;j<state.length;j++){
			
			if(state[j]==1&&wait1){
				period[0] = location_list.get(j).ti;
				wait1 = false;
				wait2 = true;
				System.out.println("在港区内！！");
			}
			if(state[j]==2&&wait2){
				wait2 = false;
			}
			if(state[j]==3&&!wait1&&!wait2){
				period[1] = location_list.get(j).ti;
				wait1 = true;
				wait2 = false;
				String temp = period[0] + ";" + period[1];
				res.add(temp);
				period[0]="";
				period[1]="";
			}
		}
		return new ResponseEntity<List<String>>(res,HttpStatus.OK);
	} 
	
	@RequestMapping(value="/settimeperiod",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<String> settimeperiod(@RequestBody String pro) throws IOException{
		JSONObject json =JSONObject.fromObject(pro);
		SqlSession session = this.getSession();
		session.update("updatetimeperiod",json.getInt("days"));
		session.commit();
		session.close();
		String result ="set parameter successfully!!!!";
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	
	
}
