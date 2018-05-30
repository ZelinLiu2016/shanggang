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
import java.util.HashMap;
import java.util.Iterator;
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
import com.sg.domain.Abnormal_info;
import com.sg.domain.Dredging_area;
import com.sg.domain.DumpingArea;
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
	//实时异常监测  0正常  1作业行为异常  2未驶入抛泥区 3作业位置错误 4抛泥区错误 5瞬时超速 6连续超速
    private static HashMap<Integer,List<Shipinfo>> ship_trajectory = new HashMap<Integer,List<Shipinfo>>();
    private static HashMap<Integer,List<Integer>> ship_state = new HashMap<Integer,List<Integer>>();
    private static HashMap<Integer,Abnormal_info> exceed_flag = new HashMap<Integer,Abnormal_info>();
//    private static HashMap<Integer,List<Integer>> ship_state = new HashMap<Integer,List<Integer>>();
    private static HashMap<Integer,Workrecord> timerecord = new HashMap<Integer,Workrecord>(); 
    private static int max_interval = 10;//超过10min超速为连续超速
    
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
			online();
		} catch (IOException e) {
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
			if(route_id.equals("1")||route_id.equals("2")||route_id.equals("3"))
				others(mmsi,date);
			else
				huangpu(mmsi,date);
				
		}
	}
	
	public static void online() throws IOException{
		SqlSession session = getSession();
		SimpleDateFormat dft = new SimpleDateFormat("yyyy-MM-dd");
		SimpleDateFormat dft1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String end = dft1.format(new Date());
		List<String> mmsi_str = session.selectList("getworkingmmsilist");
		List<Integer> mmsilist = new ArrayList<Integer>();
		for(String str:mmsi_str){
			String[] mm = str.split(";");
			for(int i=0;i<mm.length;i++){
				if(!mmsilist.contains(Integer.valueOf(mm[i])))
					mmsilist.add(Integer.valueOf(mm[i]));
			}
		}
		
		for(int mmsi:mmsilist){
			String begin = session.selectOne("getshiplastexitdump",String.valueOf(mmsi));
			Project info = new Project();
			info.setBeginDate(begin);
			info.setEndDate(end);
			info.setMmsilist(String.valueOf(mmsi));
			if(session.selectList("getinfoduring",info)==null)
				return;
			List<Shipinfo> location_list = session.selectList("getinfoduring",info);
//			System.out.println("开始时间："+begin);
//			System.out.println("结束时间："+end);
			for(Shipinfo it:location_list){
				//实时异常检测
				Abnormal_info abnormal = new Abnormal_info();
				abnormal.setLat(it.lat);
				abnormal.setLon(it.lon);
				abnormal.setMmsi(String.valueOf(mmsi));
				abnormal.setSpeed(it.sp);
				abnormal.setTime(it.ti);
				if(!ship_trajectory.containsKey(mmsi)){
					ship_trajectory.put(mmsi, new ArrayList<Shipinfo>());
					ship_state.put(mmsi, new ArrayList<Integer>());
					timerecord.put(mmsi, new Workrecord());
					exceed_flag.put(mmsi, new Abnormal_info());
					timerecord.get(mmsi).setMmsi(String.valueOf(mmsi));
				}
				boolean ishuangpu = false;
				String route_id = session.selectOne("getShipRoute_id",mmsi);
				String dumping_id = session.selectOne("getDumpingAreabyid",route_id);
				String dredging_id = session.selectOne("getdredgingareabyid",route_id);
				String dumping_str = session.selectOne("getDumpingLocation",dumping_id);
				String dredging_str = session.selectOne("getDredgingLocation",dredging_id);
				List<DumpingArea> otherdumping_info = session.selectList("getotherdumpingarea",dumping_id);
				List<Dredging_area> otherdredging_info = session.selectList("getotherdredingarea",Integer.valueOf(dredging_id));
				int speed_limit = session.selectOne("getSpeedlimit",route_id);
				Quadrilateral dumping = new Quadrilateral(dumping_str);
				Quadrilateral dredging = new Quadrilateral(dredging_str);
				List<Quadrilateral> otherdumping = new ArrayList<Quadrilateral>();
				List<Quadrilateral> otherdredging = new ArrayList<Quadrilateral>();
				if(dredging_id.equals("5")||dredging_id.equals("6")||dredging_id.equals("7")||dredging_id.equals("8"))
					ishuangpu = true;
				for(Iterator<DumpingArea> iter= otherdumping_info.iterator();iter.hasNext();){
					otherdumping.add(new Quadrilateral(iter.next().getLocation()));
				}
				for(Iterator<Dredging_area> iter=otherdredging_info.iterator();iter.hasNext();){
					otherdredging.add(new Quadrilateral(iter.next().getLocation()));
				}
				ship_trajectory.get(mmsi).add(it);
				LatLng point = new LatLng(Double.valueOf(it.lat),Double.valueOf(it.lon));
				//判断是否超速
//				System.out.println("speed_limit:"+speed_limit);
//				System.out.println("actual speed:"+shipinfo.sp);
				if(Double.valueOf(it.sp)>Double.valueOf(speed_limit)){
					try {
						if(exceed_flag.get(mmsi).abnormal_type.equals("Instant exceed speed")&&(dft1.parse(it.ti.substring(0, 19)).getTime()-dft1.parse(exceed_flag.get(mmsi).time.substring(0, 19)).getTime())/1000/60>max_interval){
							System.out.println("this exceed:"+it.ti);
							System.out.println("last_exceed:"+exceed_flag.get(mmsi).time);		
							abnormal.setAbnormal_type("Continuous exceed speed");
							abnormal.setExceed_interval((int) (dft1.parse(it.ti.substring(0, 19)).getTime()-dft1.parse(exceed_flag.get(mmsi).time.substring(0, 19)).getTime())/1000/60);
//							session.insert("addAbnormal",abnormal);
							session.commit();
						}
						else if(!exceed_flag.get(mmsi).abnormal_type.equals("Instant exceed speed")){
							abnormal.setAbnormal_type("Instant exceed speed");
							abnormal.setTime(it.ti);
							exceed_flag.get(mmsi).setAbnormal_type("Instant exceed speed");
							exceed_flag.get(mmsi).setTime(it.ti);
//							session.insert("addAbnormal",abnormal);
							session.commit();
							}
					} catch (ParseException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
//					System.out.println(abnormal.abnormal_type);
				}
				
				//ship_atate: 1在正确的工作区域 2错误的工作区域 3正确的抛泥区 4错误的抛泥区 5其他区域
				if(!ishuangpu&&(dredging.isContainsPoint(point))&&timerecord.get(mmsi).indred.equals("")){
					ship_state.get(mmsi).add(1);
					//in dredging area
					timerecord.get(mmsi).setIndred(it.ti);
					timerecord.get(mmsi).setDate(timerecord.get(mmsi).indred.substring(0, 10));							
				}
				else if(!ishuangpu&&dredging.isContainsPoint(point)&&!(timerecord.get(mmsi).indred.equals(""))){
					try {
						if(((dft1.parse(it.ti.substring(0, 19)).getTime()-dft1.parse(timerecord.get(mmsi).indred.substring(0, 19)).getTime())/1000/60>360)&&((dft1.parse(it.ti).getTime()-dft1.parse(timerecord.get(mmsi).indred).getTime())/1000/60<480)){
							//作业行为异常
							System.out.println("进抛泥区时间"+timerecord.get(mmsi).indred);
							System.out.println("此时时间："+it.ti);
							System.out.println("作业时间："+(dft1.parse(it.ti.substring(0, 19)).getTime()-dft1.parse(timerecord.get(mmsi).indred.substring(0, 19)).getTime())/1000/60);
							abnormal.setAbnormal_type("Working behaviour abnormal");
							timerecord.get(mmsi).setState(1);
							ship_state.get(mmsi).add(1);
							timerecord.get(mmsi).setExitdred(it.ti);
//							session.insert("addAbnormal",abnormal);
							session.commit();
						}
						else if((dft1.parse(it.ti.substring(0, 19)).getTime()-dft1.parse(timerecord.get(mmsi).indred.substring(0, 19)).getTime())/1000/60>480){
							abnormal.setAbnormal_type("Havn't dump into dumping area");
							timerecord.get(mmsi).setDate(timerecord.get(mmsi).indred.substring(0, 10));
							int k=ship_state.get(mmsi).size()-1;
							for(;k>0;k--){
								if(ship_state.get(mmsi).get(k)==1)
									timerecord.get(mmsi).setExitdred(ship_trajectory.get(mmsi).get(k).ti);
							}
							timerecord.get(mmsi).setIndump(it.ti);
							timerecord.get(mmsi).setExitdump(it.ti);
							timerecord.get(mmsi).setState(2);
//							session.insert("addAbnormal",abnormal);
							session.insert("addworkrecord",timerecord.get(mmsi));
							session.commit();
							System.out.println(abnormal.abnormal_type);
							ship_trajectory.get(mmsi).clear();
							ship_state.get(mmsi).clear();
							timerecord.get(mmsi).reset();;
						}
					} catch (ParseException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				else if(!ishuangpu&&WorkloadTimerTask.areascontains(otherdredging,point)&&timerecord.get(mmsi).indred.equals("")){
					ship_state.get(mmsi).add(2);
					//in wrong dredging area
					abnormal.setAbnormal_type("Wrong dredging area");
					timerecord.get(mmsi).setState(3);
					timerecord.get(mmsi).setIndred(it.ti);
//					session.insert("addAbnormal",abnormal);
					session.commit();
					System.out.println(abnormal.abnormal_type);
				}
				else if(dumping.isContainsPoint(point)&&!timerecord.get(mmsi).indred.equals("")&&(timerecord.get(mmsi).indump.equals(""))){
					timerecord.get(mmsi).setIndump(it.ti);
					ship_state.get(mmsi).add(3);
					if(timerecord.get(mmsi).getExitdred().equals("")){
						int k=ship_state.get(mmsi).size()-1;
						if(timerecord.get(mmsi).state==3){ 
							for(;k>0;k--){
								if(ship_state.get(mmsi).get(k)==5&&ship_state.get(mmsi).get(k-1)==2){
									timerecord.get(mmsi).setExitdred(ship_trajectory.get(mmsi).get(k).ti);
									System.out.println("BINGO!!!!!!!!!");
									break;
								}
							}
						}
						else{
							for(;k>0;k--){
								if(ship_state.get(mmsi).get(k)==5&&ship_state.get(mmsi).get(k-1)==1){
									timerecord.get(mmsi).setExitdred(ship_trajectory.get(mmsi).get(k).ti);
									break;
								}
							}
						}
					}
				}
				else if(!timerecord.get(mmsi).indred.equals("")&&WorkloadTimerTask.areascontains(otherdumping, point)){
					//in wrong dredging area
					abnormal.setAbnormal_type("Wrong dumping area");
					timerecord.get(mmsi).setIndump(it.ti);
					timerecord.get(mmsi).setState(4);
					ship_state.get(mmsi).add(4);
					int k=ship_state.get(mmsi).size()-1;
					if(timerecord.get(mmsi).state==3){
						for(;k>0;k--){
							if(ship_state.get(mmsi).get(k)==5&&ship_state.get(mmsi).get(k-1)==2){
								timerecord.get(mmsi).setExitdred(ship_trajectory.get(mmsi).get(k).ti);
								break;
							}
						}
					}
					else{
						for(;k>0;k--){
							if(ship_state.get(mmsi).get(k)==5&&ship_state.get(mmsi).get(k-1)==1){
								timerecord.get(mmsi).setExitdred(ship_trajectory.get(mmsi).get(k).ti);
								break;
							}
						}
					}
//					session.insert("addAbnormal",abnormal);
					session.commit();
					System.out.println(abnormal.abnormal_type);
				}
				else if(!dumping.isContainsPoint(point)&&(timerecord.get(mmsi).getState()==0||timerecord.get(mmsi).getState()==3||timerecord.get(mmsi).getState()==1)&&!timerecord.get(mmsi).indump.equals("")){
					timerecord.get(mmsi).setExitdump(it.ti);
					System.out.println("出抛泥区时间："+timerecord.get(mmsi));
					session.insert("addworkrecord",timerecord.get(mmsi));
					session.commit();
					ship_trajectory.get(mmsi).clear();
					ship_state.get(mmsi).clear();
					timerecord.get(mmsi).reset();
				}
				else if(timerecord.get(mmsi).getState()==4&&!WorkloadTimerTask.areascontains(otherdumping, point)&&!timerecord.get(mmsi).indump.equals("")){
					timerecord.get(mmsi).setExitdump(it.ti);
					session.insert("addworkrecord",timerecord.get(mmsi));
					session.commit();
					ship_trajectory.get(mmsi).clear();
					ship_state.get(mmsi).clear();
					timerecord.get(mmsi).reset();
				}
				else
					ship_state.get(mmsi).add(5);

			}		
		}
//		session.commit();
		session.close();
		
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
		String dumping_id = session.selectOne("getDumpingAreabyid",route_id);
		String dumping_str = session.selectOne("getDumpingLocation",dumping_id);
		List<DumpingArea> otherdumping_info = session.selectList("getotherdumpingarea",dumping_id);
		int speed_limit = session.selectOne("getSpeedlimit",route_id);
//		Quadrilateral harbor = new Quadrilateral(harbor_str);
		Quadrilateral dumping = new Quadrilateral(dumping_str);
		List<Quadrilateral> otherdumping = new ArrayList<Quadrilateral>();
		for(Iterator<DumpingArea> it= otherdumping_info.iterator();it.hasNext();){
			otherdumping.add(new Quadrilateral(it.next().getLocation()));
		}
		
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
			else if(rectangdis(dumping_str, point)<1000)
				state[i]=4;
			else if(areascontains(otherdumping,point))
				state[i]=5;//in other dumping area
			else
				state[i]=3;// neither in  dumping area nor near
//			if(state[i]!=3)
//				System.out.print(state[i]+",");
			i=i+1;
		}
		System.out.println("the length of state:"+state.length);
		
		boolean wait2 = true;
		
		Workrecord workrec = new Workrecord();
		workrec.setMmsi(mmsi);
		
		workrec.setIndred("");
		workrec.setExitdred("");
		workrec.setIndump("");
		workrec.setExitdump("");
		workrec.setState(0);
		workrec.setExceed_speed(0);
		workrec.setHandlerecord("");
		for(int j=0;j<state.length;j++){
			if(Double.valueOf(location_list.get(j).sp)>Double.valueOf(speed_limit))
				workrec.setExceed_speed(1);
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
			else if(state[j]==5&&wait2){//进入错误的抛泥区
				workrec.setState(4);
				Workrecord lastrec = session.selectOne("getlastrecord01",mmsi);
//				System.out.println("上一个?记录："+lastrec);
				if(lastrec==null||(sdf.parse(location_list.get(j).ti).getTime()-sdf.parse(lastrec.exitdump).getTime())/1000/60>480){		
					//more than 8h between two records		
					String date = location_list.get(j).ti.substring(0, 10);
					workrec.setDate(date);
					workrec.setIndump(location_list.get(j).ti);
					workrec.setExitdred(location_list.get(j).ti);
					Calendar ca = Calendar.getInstance();
					ca.setTime(sdf.parse(location_list.get(j).ti));
					ca.add(Calendar.HOUR, -2);				
					workrec.setIndred(sdf.format(ca.getTime()));
					ca.add(Calendar.HOUR, 4);	
					workrec.setExitdump(sdf.format(ca.getTime()));
					System.out.println(workrec);
					session.insert("addworkrecord",workrec);
					workrec.setIndred("");
					workrec.setExitdred("");
					workrec.setIndump("");
					workrec.setExitdump("");
					workrec.setState(0);
					workrec.setExceed_speed(0);
					session.commit();						
				}
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
					System.out.println(workrec);
					session.insert("addworkrecord",workrec);					
				}				
				workrec.setIndred("");
				workrec.setExitdred("");
				workrec.setIndump("");
				workrec.setExitdump("");
				workrec.setState(0);
				workrec.setExceed_speed(0);
				session.commit();
				}	
			else if(state[j]==4){
				boolean abnormal = true;
				int k=1;
				while(j+k<state.length&&((sdf.parse(location_list.get(j+k).ti).getTime()-sdf.parse(location_list.get(j).ti).getTime())/1000/60<480)){
					if(state[j+k]==2){
						abnormal = false;
						break;
					}				
					k++;
				}
				k=1;
				while(j-k>=0&&((sdf.parse(location_list.get(j).ti).getTime()-sdf.parse(location_list.get(j-k).ti).getTime())/1000/60<480)){
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
					}
					workrec.setIndred("");
					workrec.setExitdred("");
					workrec.setIndump("");
					workrec.setExitdump("");
					workrec.setState(0);
					workrec.setExceed_speed(0);
					wait2=true;
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
//		System.out.print("route_id:"+route_id);
		String harbor_id = session.selectOne("getdredgingareabyid",route_id);
//		System.out.print("harbor_id:"+harbor_id);
		String harbor_str = session.selectOne("getDredgingLocation",harbor_id);
		System.out.println("mmsi:"+mmsi+"route_id:"+route_id+"harbor_id:"+harbor_id);
		List<Dredging_area> dredinfo = session.selectList("getotherdredingarea",Integer.valueOf(harbor_id));
		String dumping_id = session.selectOne("getDumpingAreabyid",route_id);
//		System.out.print("dumping_id:"+dumping_id);
		String dumping_str = session.selectOne("getDumpingLocation",dumping_id);
		List<DumpingArea> dumpinfo = session.selectList("getotherdumpingarea",dumping_id);
		int speed_limit = session.selectOne("getSpeedlimit",route_id);
//		System.out.println("harbor_str:"+harbor_str);
//		System.out.println("dumping_str:"+dumping_str);
		Quadrilateral harbor = new Quadrilateral(harbor_str);
		Quadrilateral dumping = new Quadrilateral(dumping_str);
		List<Quadrilateral> otherdredging = new ArrayList<Quadrilateral>();
		List<Quadrilateral> otherdumping = new ArrayList<Quadrilateral>();
		for(Dredging_area area:dredinfo){
			otherdredging.add(new Quadrilateral(area.getLocation()));
		}
		for(DumpingArea area:dumpinfo){
			otherdumping.add(new Quadrilateral(area.getLocation()));
		}
		
		if(session.selectList("getinfoduring",info)==null)
			return;
		
		List<Shipinfo> location_list = session.selectList("getinfoofdate",info);
//		System.out.println(location_list);
//		System.out.println(location_list.get(0).ti);
		int len = location_list.size();
//		System.out.println("the length of the sequence:"+len);
		int[] state = new int[len];
		int i=0;
		for(Shipinfo it:location_list){
			LatLng point = new LatLng(Double.valueOf(it.lat),Double.valueOf(it.lon));
			if(harbor.isContainsPoint(point))
				state[i]=1;  //in harbor
			else if(dumping.isContainsPoint(point))
				state[i]=2; //in dumping area
			else if(areascontains(otherdredging, point))
				state[i]=4;
			else if(areascontains(otherdumping, point))
				state[i]=5;
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
		workrec.setState(0);
		workrec.setExceed_speed(0);
		workrec.setHandlerecord("");
		Workrecord lastrec = session.selectOne("getlastrecord",mmsi);		
//		System.out.println("上一条记录："+lastrec.exitdump);
		if(lastrec!=null&&(lastrec.exitdump.equals(lastrec.indump))){
			//the situation that a record is done among two days
//			System.out.println("又跨天任务！！！"+lastrec.toString());
			session.delete("deletework",lastrec);
			session.commit();
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
			if(Double.valueOf(location_list.get(j).sp)>Double.valueOf(speed_limit))
				workrec.setExceed_speed(1);
			if(state[j]==1&&wait1){
				workrec.setIndred(location_list.get(j).ti);
				wait1 = false;
				wait2 = true;
//				System.out.println("进入工作区域！！"+location_list.get(j).ti);
			}
			else if(state[j]==4&&wait1){
				workrec.setIndred(location_list.get(j).ti);
				workrec.setExitdred(location_list.get(j).ti);
				workrec.setState(3);//作业位置错误
				wait1 = false;
				wait2 = true;
			}
			else if((wait2&&((sdf.parse(location_list.get(j).ti).getTime() - sdf.parse(workrec.getIndred()).getTime())/1000/60>480))||(wait2&&state[j]==1&&((sdf.parse(location_list.get(j).ti).getTime() - sdf.parse(workrec.getIndred()).getTime())/1000/60>360))){
				boolean flag1 = false;
				int k=1;
				while(j+k<state.length&&((sdf.parse(location_list.get(j+k).ti).getTime()-sdf.parse(location_list.get(j).ti).getTime())/1000/60<180)){
					if(state[j+k]==1){
						flag1 = true;
						break;
					}				
					k++;
				}
				if(flag1){
					Calendar ca = Calendar.getInstance();
					ca.setTime(sdf.parse(location_list.get(j).ti));
					ca.add(Calendar.HOUR, 3);
					workrec.setExitdred(location_list.get(j).ti);
					workrec.setIndump(sdf.format(ca.getTime()));
					workrec.setExitdump(sdf.format(ca.getTime()));
					workrec.setState(1);
				}
				else{
					workrec.setExitdred(location_list.get(j).ti);
					workrec.setIndump(location_list.get(j).ti);
					workrec.setExitdump(location_list.get(j).ti);
					workrec.setState(2);
				}
				wait1 = true;
				wait2 = false;
				session.insert("addworkrecord",workrec);
				session.commit();
				System.out.println(workrec);
				workrec.setIndred("");
				workrec.setExitdred("");
				workrec.setIndump("");
				workrec.setExitdump("");
				workrec.setState(0);
				workrec.setExceed_speed(0);
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
			else if(state[j]==5&&wait2){
				workrec.setIndump(location_list.get(j).ti);
				workrec.setState(4);
				wait1 = false;
				wait2 = false;
				for(int k=j-1;k>0;k--){//back to find time of exit dred
					if(state[k]==3&&state[k-1]==1){
						workrec.setExitdred(location_list.get(k).ti);//time of exit dred
//						System.out.println("出工作区域！！"+location_list.get(k).ti);
						break;
					}
				}
				if(workrec.exitdred.equals(""))
					workrec.setExitdred(workrec.indred);
			}
			else if(state[j]==3&&!wait1&&!wait2){
//				System.out.println("出抛泥区域！！！"+location_list.get(j).ti);
				workrec.setExitdump(location_list.get(j).ti); 
				wait1 = true;
				wait2 = false;
				System.out.println(workrec);
				double timelen_dred = (sdf.parse(workrec.getExitdred()).getTime() - sdf.parse(workrec.getIndred()).getTime())/1000/60;
				double timelen_dump = (sdf.parse(workrec.getExitdump()).getTime() - sdf.parse(workrec.getIndump()).getTime())/1000/60;
//				System.out.println("挖泥时间："+timelen);
				if(timelen_dred>360)//unit is min
					workrec.setState(1);//挖泥时间过长
				session.insert("addworkrecord",workrec);
				session.commit();
				System.out.println(workrec);
				workrec.setIndred("");
				workrec.setExitdred("");
				workrec.setIndump("");
				workrec.setExitdump("");
				workrec.setState(0);
				workrec.setExceed_speed(0);
			}
		}
		if(workrec.indred!=""){
			System.out.println(workrec.toString());
			//a record is unfinishied in this day
			if(workrec.indump!="")
				workrec.exitdump=workrec.indump;
			else{
				if(workrec.exitdred!=""){
					workrec.indump=workrec.exitdred;
					workrec.exitdump=workrec.exitdred;
				}
				else{
					workrec.exitdred=workrec.indred;
					workrec.indump=workrec.indred;
					workrec.exitdump=workrec.indred;
				}
			}
			System.out.println(workrec.toString());
//			session.insert("addworkrecord",workrec);
			session.commit();
			workrec.setIndred("");
			workrec.setExitdred("");
			workrec.setIndump("");
			workrec.setExitdump("");
			workrec.setState(0);
			workrec.setExceed_speed(0);
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
	public static boolean areascontains(List<Quadrilateral> areas,LatLng point){
		for(Quadrilateral area:areas){
			if(area.isContainsPoint(point)){
				return true;
			}
		}
		return false;
	}
	public static void main(String[] args) throws IOException, ParseException {
		online();
	}
}
