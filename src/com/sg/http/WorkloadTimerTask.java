/**
 * 
 */
package com.sg.http;

import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.TimerTask;

import org.apache.ibatis.session.SqlSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.baidu.mapapi.model.LatLng;
import com.sg.abnormalDetection.Quadrilateral;
import com.sg.domain.Project;
import com.sg.domain.Shipinfo;
import com.sg.domain.Workload_day;
import com.sg.domain.Workrecord;

import net.sf.json.JSONObject;

/**
 * @author yuchang xu
 *
 * 2017-11-03
 */
public class WorkloadTimerTask extends TimerTask {

	/* (non-Javadoc)
	 * @see java.util.TimerTask#run()
	 */
	@Override
	public  void run() {
		try {
			workrecord();
		} catch (IOException | ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public static void workrecord() throws IOException, ParseException{		
		String mmsi = "413403090";
		Date now = new Date();
		DateFormat d1 = DateFormat.getDateInstance();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//		String date = d1.format(now);
		String date = "2016-07-14";
		Project info = new Project();
		info.setMmsilist(mmsi);
		info.setBeginDate(date);
		String harbor_str = "30:33:53.48025,122:10:22.15761-30:33:33.11945,122:10:18.39148-30:32:55.71872,122:17:18.08089-30:32:35.36090,122:17:14.29433";
		String dumping_str = "30:34:53,122:18:31-30:35:55,122:19:22-30:36:17,122:18:45-30:35:17,122:17:55";
		SqlSession session = RequestTimerTask.getSession();
//		String route_id = session.selectOne("getShipRoute_id",Integer.valueOf(mmsi));
//		String harbor_id = session.selectOne("getdredgingareabyid",route_id);
//		String harbor_str = session.selectOne("getDredgingLocation",harbor_id);
//		String dumping_id = session.selectOne("getDumpingAreabyid",route_id);
//		String dumping_str = session.selectOne("getDumpingLocation",dumping_id);
		Quadrilateral harbor = new Quadrilateral(harbor_str);
		Quadrilateral dumping = new Quadrilateral(dumping_str);
		
		if(session.selectList("getinfoduring",info)==null)
			return;
		
		List<Shipinfo> location_list = session.selectList("getinfoofdate",info);
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
			System.out.print(state[i]+",");
			i=i+1;
			
		}
		System.out.println("the length of state:"+state.length);
		boolean wait1 = true;
		boolean wait2 = false;
		
		Workrecord workrec = new Workrecord();
		workrec.setMmsi(mmsi);
		workrec.setDate(date);
		workrec.setIndred("");
		workrec.setExitdred("");
		workrec.setIndump("");
		workrec.setExitdump("");
		Workrecord lastrec = session.selectOne("getlastrecord",mmsi);		
		if(lastrec!=null&&(lastrec.exitdump==null)){
			//the situation that a record is done among two days
			session.delete("deletework",lastrec);
			lastrec.setDate(date);
			workrec = lastrec;
			if(workrec.getExitdred()==null||workrec.getIndump()==null){
				wait1 = false;
				wait2 =true;
			}
			else if(workrec.getExitdump()==null){
				wait1 = false;
				wait2 = false;
			}
		}
		for(int j=0;j<state.length;j++){
			if(state[j]==1&&wait1){
				workrec.setIndred(location_list.get(j).ti);
				wait1 = false;
				wait2 = true;
				System.out.println("进入工作区域！！");
			}
			else if(state[j]==2&&wait2){
				System.out.println("进入抛泥区域！！");
				workrec.setIndump(location_list.get(j).ti);
				wait1 = false;
				wait2 = false;
				for(int k=j-1;j>0;j--){//back to find time of exit dred
					if(state[j]==3&&state[j-1]==1){
						workrec.setExitdred(location_list.get(k).ti);//time of exit dred
						break;
					}
				}
			}
			else if(state[j]==3&&!wait1&&!wait2){
				System.out.println("出抛泥区域！！！");
				workrec.setExitdump(location_list.get(j).ti); 
				wait1 = true;
				wait2 = false;
				double timelen = (sdf.parse(workrec.getExitdred()).getTime() - sdf.parse(workrec.getIndred()).getTime())/1000/60;
				System.out.println("挖泥时间："+timelen);
				if(timelen>240)//unit is min
					workrec.setState(1);
				session.insert("addworkrecord",workrec);
				System.out.println(workrec);
				List<String> recorddate = session.selectList("listMmsiRecorddate",Integer.valueOf(mmsi));
				Workload_day workload = new Workload_day();
				workload.setMmsi(Integer.valueOf(mmsi));
				workload.setRecorddate(date);
				if(!recorddate.contains(date)){
					workload.setWorkload(1);
					session.insert("addWorkload",workload);
				}
				else
					session.update("workloadincrease",workload);
				workrec.setIndred("");
				workrec.setExitdred("");
				workrec.setIndump("");
				workrec.setExitdump("");
				workrec.setState(0);
			}
		}
		if(workrec.indred!=""){
			//a record is unfinishied in this day
			System.out.println("有未完成的任务！Q！！");
			if(workrec.exitdred=="")
				workrec.exitdred = null;
			if(workrec.indump=="")
				workrec.indump = null;
			if(workrec.exitdump=="")
				workrec.exitdump = null;
			session.insert("addworkrecord",workrec);
		}
		session.commit();
		session.close();
	}
	
	public static void main(String[] args) throws IOException, ParseException {
//		SqlSession session  = RequestTimerTask.getSession();
//		String mmsi = "413403090";
//		String date = "2016-07-12";
//		
//		Project info = new Project();
//		info.setMmsilist(mmsi);
//		info.setBeginDate(date);
//	
////		String harbor_str = "30:33:53.48025,122:10:22.15761-30:33:33.11945,122:10:18.39148-30:32:55.71872,122:17:18.08089-30:32:35.36090,122:17:14.29433";
////		String dumping_str = "30:34:53,122:18:31-30:35:55,122:19:22-30:36:17,122:18:45-30:35:17,122:17:55";
//		
//		List<Shipinfo> location_list = session.selectList("getinfoofdate",info);
//		System.out.println(location_list.size());
		workrecord();
	}
}
