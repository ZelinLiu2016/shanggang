/**
 * 
 */
package com.sg.http;

import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimerTask;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.baidu.mapapi.model.LatLng;
import com.sg.abnormalDetection.Point;
import com.sg.abnormalDetection.Quadrilateral;
import com.sg.domain.Project;
import com.sg.domain.Shipinfo;
import com.sg.domain.Workload_day;
import com.sg.domain.Workrecord;

import net.sf.json.JSONObject;

/**
 * @author yuchang xu
 *  workrecord.state: 0:正常 1：作业区时间异常 2：未进入指定区域抛泥 3：抛泥区内时间异常 4.船舶位置异常（不在作业区或抛泥区超过24小时）
 * 2017-11-03
 */
public class WorkloadTimerTask extends TimerTask {
	
	public static SqlSession getSession() throws IOException{
		String resource = "mybatis-config.xml";
		InputStream inputStream = Resources.getResourceAsStream(resource);
		SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession session=sqlSessionFactory.openSession();
        return session;
	}
	
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
		Date now = new Date();
		DateFormat d1 = DateFormat.getDateInstance();
		String date = d1.format(now);
		System.out.println("生成工作流程记录"+date);
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
		
		for(String mmsi:all_mmsi){							
			String route_id = session.selectOne("getShipRoute_id",Integer.valueOf(mmsi));
			if(route_id.equals("2")||route_id.equals("3"))
				others(mmsi,date);
			else
				huangpu(mmsi,date);
				
		}
	}
	
	public static void  huangpu(String mmsi, String today) throws IOException, NumberFormatException, ParseException{
		SqlSession session = getSession();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//		String date = d1.format(now);
		String begin = today+" 00:00:00";
		String end = today+" 23:59:59";
//		System.out.println(begin);
//		String mmsi="413358270";
		Project info = new Project();
		info.setMmsilist(mmsi);
		info.setBeginDate(begin);
		info.setEndDate(end);
//		String harbor_str = "30:38:11.08236,122:02:24.80746-30:37:54.27581,122:02:08.48830-30:37:03.41386,122:03:03.97582-30:35:56.67173,122:04:35.83018-30:35:50.00181,122:05:04.62764-30:36:09.94897,122:05:21.43164-30:37:01.33744,122:04:01.26801";
//		String dumping_str = "31:16:32,121:45:39-31:16:44,121:45:51-31:16:24,121:46:20-31:16:11,121:46:08";
		
		String route_id = session.selectOne("getShipRoute_id",Integer.valueOf(mmsi));
		String harbor_id = session.selectOne("getdredgingareabyid",route_id);
		String harbor_str = session.selectOne("getDredgingLocation",harbor_id);
		String dumping_id = session.selectOne("getDumpingAreabyid",route_id);
		String dumping_str = session.selectOne("getDumpingLocation",dumping_id);
//		Quadrilateral harbor = new Quadrilateral(harbor_str);
		Quadrilateral dumping = new Quadrilateral(dumping_str);
		
		
		if(session.selectList("getinfoduring",info)==null)
			return;
		
		List<Shipinfo> location_list = session.selectList("getinfoduring",info);
//		System.out.println(location_list);
//		System.out.println(location_list.get(0).ti);
		int len = location_list.size();
//		System.out.println("the length of the sequence:"+len);
		int[] state = new int[len];
		int i=0;
		for(Shipinfo it:location_list){
			LatLng point = new LatLng(Double.valueOf(it.lat),Double.valueOf(it.lon));
			if(dumping.isContainsPoint(point))
				state[i]=2; //in dumping area
			else if(rectangdis(dumping_str, point)<200)
				state[i]=4;
			else
				state[i]=3;// neither in  dumping area nor near
//			if(state[i]!=3)
//				System.out.print(state[i]+",");
			i=i+1;
		}
//		System.out.println("the length of state:"+state.length);
		
		boolean wait2 = true;
		
		Workrecord workrec = new Workrecord();
		workrec.setMmsi(mmsi);
		
		workrec.setIndred("");
		workrec.setExitdred("");
		workrec.setIndump("");
		workrec.setExitdump("");
		workrec.setState(0);
		for(int j=0;j<state.length;j++){
			if(state[j]==2&&wait2){
				workrec.setIndump(location_list.get(j).ti);
				workrec.setExitdred(location_list.get(j).ti);
				Calendar ca = Calendar.getInstance();
				ca.setTime(sdf.parse(location_list.get(j).ti));
				ca.add(Calendar.HOUR, -2);				
				workrec.setIndred(sdf.format(ca.getTime()));
				ca.add(Calendar.HOUR, 4);	
				workrec.setExitdump(sdf.format(ca.getTime()));
				wait2 = false;
//				System.out.println("进入抛泥区域！！"+location_list.get(j).ti);
			}
			else if(state[j]==3&&!wait2){
//				System.out.println("出抛泥区域！！"+location_list.get(j).ti);
				workrec.setExitdump(location_list.get(j).ti);
				wait2 = true;
				String date = location_list.get(j).ti.substring(0, 10);
				workrec.setDate(date);
				workrec.setState(0);
				Workrecord lastrec = session.selectOne("getlastrecord01",mmsi);
				if(lastrec==null||(sdf.parse(workrec.exitdump).getTime()-sdf.parse(lastrec.exitdump).getTime())/1000/60>180){
//					System.out.println(workrec); 
					session.insert("addworkrecord",workrec);					
					List<String> recorddate = session.selectList("listMmsiRecorddate",Integer.valueOf(mmsi));
					Workload_day workload = new Workload_day();
					workload.setMmsi(Integer.valueOf(mmsi));
					workload.setRecorddate(date);
					if(!recorddate.contains(date)){
						workload.setWorkload(1);
						if(workrec.state!=0&&((sdf.parse(workrec.exitdump).getTime() - sdf.parse(workrec.indump).getTime())/1000/60>60))
							workrec.setState(3);
						session.insert("addWorkload",workload);
					}
					else{
						if(workrec.state!=0&&((sdf.parse(workrec.exitdump).getTime() - sdf.parse(workrec.indump).getTime())/1000/60>60))
							workrec.setState(3);
						session.update("workloadincrease",workload);
					}
				}				
				workrec.setIndred("");
				workrec.setExitdred("");
				workrec.setIndump("");
				workrec.setExitdump("");
				workrec.setState(0);
				session.commit();
				}	
			else if(state[j]==4){
				boolean abnormal = true;
				int k=1;
				while(j+k<state.length&&k<=2500){
					if(state[j+k]==2){
						abnormal = false;
						break;
					}				
					k++;
				}
				while(j-k>=0&&k<=2500){
					if(state[j-k]==2){
						abnormal = false;
						break;
					}
					k++;
				}
				if(abnormal==true){
//					System.out.println("未进入抛泥区域抛泥！！！");
					String date = location_list.get(j).ti.substring(0, 10);
					workrec.setDate(date);
					workrec.setExitdred(location_list.get(j).ti);
					workrec.setIndump(location_list.get(j).ti);
					Calendar ca = Calendar.getInstance();
					ca.setTime(sdf.parse(location_list.get(j).ti));
					ca.add(Calendar.HOUR, -2);				
					workrec.setIndred(sdf.format(ca.getTime()));
					ca.add(Calendar.HOUR, 6);	
					workrec.setExitdump(sdf.format(ca.getTime()));
					workrec.setState(2);//dumping area abnormal-- don,t dump in indicating area
					Workrecord lastrec = session.selectOne("getlastrecord01",mmsi);
//					System.out.println("上一个?记录："+lastrec);
//					System.out.println("这条记录："+workrec);
					if(lastrec==null||(sdf.parse(workrec.exitdump).getTime()-sdf.parse(lastrec.exitdump).getTime())/1000/60>480){		
						//more than 8h between two records
						System.out.println(workrec);
						session.insert("addworkrecord",workrec);						
						List<String> recorddate = session.selectList("listMmsiRecorddate",Integer.valueOf(mmsi));
						Workload_day workload = new Workload_day();
						workload.setMmsi(Integer.valueOf(mmsi));
						workload.setRecorddate(date);
						if(!recorddate.contains(date)){
							workload.setWorkload(1);
							if(workrec.state!=0&&((sdf.parse(workrec.exitdump).getTime() - sdf.parse(workrec.indump).getTime())/1000/60>60))
								workrec.setState(3);
							session.insert("addWorkload",workload);
						}
						else{
							if(workrec.state!=0&&((sdf.parse(workrec.exitdump).getTime() - sdf.parse(workrec.indump).getTime())/1000/60>60))
								workrec.setState(3);
							session.update("workloadincrease",workload);
						}
					}
					workrec.setIndred("");
					workrec.setExitdred("");
					workrec.setIndump("");
					workrec.setExitdump("");
					workrec.setState(0);					
				}
			}
			session.commit();
			}
	
	session.commit();
	session.close();
	}
	
	public static void others(String mmsi, String date) throws IOException, ParseException{
		SqlSession session = getSession();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//		String date = d1.format(now);
//		String date = "2017-11-13";
//		String mmsi="413465060";
		Project info = new Project();
		info.setMmsilist(mmsi);
		info.setBeginDate(date);
	
		String route_id = session.selectOne("getShipRoute_id",Integer.valueOf(mmsi));
		String harbor_id = session.selectOne("getdredgingareabyid",route_id);
		String harbor_str = session.selectOne("getDredgingLocation",harbor_id);
		String dumping_id = session.selectOne("getDumpingAreabyid",route_id);
		String dumping_str = session.selectOne("getDumpingLocation",dumping_id);
//		System.out.println("harbor_str:"+harbor_str);
//		System.out.println("dumping_str:"+dumping_str);
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
//			if(state[i]!=3)
//				System.out.print(state[i]+",");
			i=i+1;
			
		}
//		System.out.println("the length of state:"+state.length);
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
//		System.out.println("上一条记录："+lastrec.exitdump);
		if(lastrec!=null&&(lastrec.exitdump.equals(""))){
			//the situation that a record is done among two days
//			System.out.println("又跨天任务！！！");
			session.delete("deletework",lastrec);
			lastrec.setDate(date);
			workrec = lastrec;
			if(workrec.exitdred.equals("")||workrec.indump.equals("")){
				wait1 = false;
				wait2 =true;
			}
			else if(workrec.exitdump.equals("")){
				wait1 = false;
				wait2 = false;
			}
		}
		for(int j=0;j<state.length;j++){
			if(state[j]==1&&wait1){
				workrec.setIndred(location_list.get(j).ti);
				wait1 = false;
				wait2 = true;
//				System.out.println("进入工作区域！！"+location_list.get(j).ti);
			}
			else if(state[j]==2&&wait2){
//				System.out.println("进入抛泥区域！！"+location_list.get(j).ti);
				workrec.setIndump(location_list.get(j).ti);
				wait1 = false;
				wait2 = false;
				for(int k=j-1;k>0;k--){//back to find time of exit dred
					if(state[k]==3&&state[k-1]==1){
						workrec.setExitdred(location_list.get(k).ti);//time of exit dred
//						System.out.println("出工作区域！！"+location_list.get(k).ti);
						break;
					}
				}
			}
			else if(state[j]==3&&!wait1&&!wait2){
//				System.out.println("出抛泥区域！！！"+location_list.get(j).ti);
				workrec.setExitdump(location_list.get(j).ti); 
				wait1 = true;
				wait2 = false;
				double timelen = (sdf.parse(workrec.getExitdred()).getTime() - sdf.parse(workrec.getIndred()).getTime())/1000/60;
//				System.out.println("挖泥时间："+timelen);
				if(timelen>600)//unit is min
					workrec.setState(1);//挖泥时间过长
				session.insert("addworkrecord",workrec);
//				System.out.println(workrec);
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
//			System.out.println("有未完成的任务！Q！！");
//			if(workrec.exitdred=="")
//				workrec.exitdred = "1976-11-30 00:00:00";
//			if(workrec.indump=="")
//				workrec.indump = "1976-11-30 00:00:00";
//			if(workrec.exitdump=="")
//				workrec.exitdump = "1976-11-30 00:00:00";
			session.insert("addworkrecord",workrec);
		}
	
	session.commit();
	session.close();
	}
	
	public static double rectangdis(String area, LatLng point){
		String[] recpoint = area.split("-");
		double mindis = Integer.MAX_VALUE;
		if(Point.GetLineDistance(point, recpoint[0], recpoint[1])<mindis)
			mindis = Point.GetLineDistance(point, recpoint[0], recpoint[1]);
		if(Point.GetLineDistance(point, recpoint[1], recpoint[2])<mindis)
			mindis = Point.GetLineDistance(point, recpoint[1], recpoint[2]);
		if(Point.GetLineDistance(point, recpoint[2], recpoint[3])<mindis)
			mindis = Point.GetLineDistance(point, recpoint[2], recpoint[3]);
		if(Point.GetLineDistance(point, recpoint[0], recpoint[3])<mindis)
			mindis = Point.GetLineDistance(point, recpoint[0], recpoint[3]);
		return mindis;
	}
	
	public static void main(String[] args) throws IOException, ParseException {
		others("413465060","2017-11-29");
	}
		
}
