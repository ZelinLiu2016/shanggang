/**
 * 
 */
package com.sg.test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.baidu.mapapi.model.LatLng;
import com.sg.abnormalDetection.Quadrilateral;
import com.sg.domain.Abnormal_info;
import com.sg.domain.Dredging_area;
import com.sg.domain.DumpingArea;
import com.sg.domain.Shipinfo;
import com.sg.domain.Workrecord;
import com.sg.http.WorkloadTimerTask;

/**
 * @author yuchang xu
 *
 * 2018-03-22
 */
public class OnlineAbnormalDetection {
	   //实时异常监测
	private static HashMap<Integer,List<Shipinfo>> ship_trajectory = new HashMap<Integer,List<Shipinfo>>();
    private static HashMap<Integer,List<Integer>> ship_state = new HashMap<Integer,List<Integer>>();
    private static HashMap<Integer,Abnormal_info> exceed_flag = new HashMap<Integer,Abnormal_info>();
//    private static HashMap<Integer,List<Integer>> ship_state = new HashMap<Integer,List<Integer>>();
    private static HashMap<Integer,Workrecord> timerecord = new HashMap<Integer,Workrecord>(); 
    private static int max_interval = 10;//超过10min超速为连续超速
    
	public static String doPost(String urlStr, String strInfo) {
		String reStr="";
		try {
			URL url = new URL(urlStr);
			URLConnection con = url.openConnection();
			con.setDoOutput(true);
			con.setReadTimeout(3 * 10000);
            con.setConnectTimeout(2 * 10000);
			//con.setRequestProperty("Pragma:", "no-cache");
			con.setRequestProperty("Cache-Control", "no-cache");
			con.setRequestProperty("Content-Type", "text/xml");
			OutputStreamWriter out = new OutputStreamWriter(con.getOutputStream());
			out.write(new String(strInfo.getBytes("utf-8")));
			out.flush();
			out.close();
			BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), "utf-8"));		
			String line = "";
			for (line = br.readLine(); line != null; line = br.readLine()) {
				reStr += line;
			}
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return reStr;
	}
	
	public static SqlSession getSession() throws IOException{
		String resource = "mybatis-config.xml";
		InputStream inputStream = Resources.getResourceAsStream(resource);
		SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession session=sqlSessionFactory.openSession();
        return session;
	}
	
	public static Shipinfo getxmlInfo(String doc) throws DocumentException{
		Document document = DocumentHelper.parseText(doc);
		Element node = document.getRootElement();
		if(node.element("errormessage")!=null){
			System.out.println("ERROR REQUEST!!");
			return new Shipinfo();
		}
		Element mmsi = node.element("mmsi");
		Element lon = node.element("lon");
		Element lat = node.element("lat");
		Element ti = node.element("ti");
		Element status = node.element("status");
		Element sp = node.element("sp");
		Element co = node.element("co");
		Element rot = node.element("rot");
		Element draft = node.element("draft");
		Element dest = node.element("dest");
		Shipinfo shipinfo = new Shipinfo();
		shipinfo.setMmsi(mmsi.getText());
		shipinfo.setLon(lon.getText());
		shipinfo.setLat(lat.getText());
		shipinfo.setTi(ti.getText());
		shipinfo.setStatus(status.getText());
		shipinfo.setSp(sp.getText());
		shipinfo.setCo(co.getText());
		shipinfo.setRot(rot.getText());
		shipinfo.setDraft(draft.getText());
		shipinfo.setDest(dest.getText());
		return shipinfo;
	}
	
	public static void main(String[] args) throws DocumentException{
		// TODO Auto-generated method stub
		SimpleDateFormat dft1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		SqlSession session = null;
		try {
			session = getSession();
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		int mmsi=413380190;
		String start_str="2017-11-11 00:00:00";
		String end_str = "2017-11-11 23:59:59";
		String pathUrl = "http://112.126.75.47/xmlr/getzjshiptrajectory.do";
		String xmlInfo = "<?xml version='1.0' encoding='gb2312'?><sendparament><MMSI>"+mmsi+"</MMSI><starttime>"+start_str+"</starttime><endtime>"+end_str+"</endtime></sendparament>";
		String result = doPost(pathUrl, xmlInfo);
		System.out.println("字符串读取成功");
		Document document = DocumentHelper.parseText(result);
		Element node = document.getRootElement();
		List<Element> trajectory = node.elements("shiptrajectory");
		Shipinfo shipinfo = new Shipinfo();		
		for(Element tra:trajectory){			
			shipinfo.setMmsi(tra.element("MMSI").getText());
			shipinfo.setLat(tra.element("la").getText());
			shipinfo.setLon(tra.element("lo").getText());
			shipinfo.setCo(tra.element("co").getText());
			shipinfo.setSp(tra.element("sp").getText());
			shipinfo.setTi(tra.element("ti").getText());
		
			//实时异常检测
			Abnormal_info abnormal = new Abnormal_info();
			abnormal.setLat(shipinfo.lat);
			abnormal.setLon(shipinfo.lon);
			abnormal.setMmsi(String.valueOf(mmsi));
			abnormal.setSpeed(shipinfo.sp);
			abnormal.setTime(shipinfo.ti);
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
			for(Iterator<DumpingArea> it= otherdumping_info.iterator();it.hasNext();){
				otherdumping.add(new Quadrilateral(it.next().getLocation()));
			}
			for(Iterator<Dredging_area> it=otherdredging_info.iterator();it.hasNext();){
				otherdredging.add(new Quadrilateral(it.next().getLocation()));
			}
			ship_trajectory.get(mmsi).add(shipinfo);
			LatLng point = new LatLng(Double.valueOf(shipinfo.lat),Double.valueOf(shipinfo.lon));
			//判断是否超速
//			System.out.println("speed_limit:"+speed_limit);
//			System.out.println("actual speed:"+shipinfo.sp);
			if(Double.valueOf(shipinfo.sp)>Double.valueOf(speed_limit)){
				try {
					if(exceed_flag.get(mmsi).abnormal_type.equals("Instant exceed speed")&&(dft1.parse(shipinfo.ti.substring(0, 19)).getTime()-dft1.parse(exceed_flag.get(mmsi).time.substring(0, 19)).getTime())/1000/60>max_interval){
						System.out.println("this exceed:"+shipinfo.ti);
						System.out.println("last_exceed:"+exceed_flag.get(mmsi).time);		
						abnormal.setAbnormal_type("Continuous exceed speed");
						abnormal.setExceed_interval((int) (dft1.parse(shipinfo.ti.substring(0, 19)).getTime()-dft1.parse(exceed_flag.get(mmsi).time.substring(0, 19)).getTime())/1000/60);
						session.insert("addAbnormal",abnormal);
						session.commit();
					}
					else if(!exceed_flag.get(mmsi).abnormal_type.equals("Instant exceed speed")){
						abnormal.setAbnormal_type("Instant exceed speed");
						abnormal.setTime(shipinfo.ti);
						exceed_flag.get(mmsi).setAbnormal_type("Instant exceed speed");
						exceed_flag.get(mmsi).setTime(shipinfo.ti);
						session.insert("addAbnormal",abnormal);
						session.commit();
						}
				} catch (ParseException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
//				System.out.println(abnormal.abnormal_type);
			}
			
			//ship_atate: 1在正确的工作区域 2错误的工作区域 3正确的抛泥区 4错误的抛泥区 5其他区域
			if(!ishuangpu&&(dredging.isContainsPoint(point))&&timerecord.get(mmsi).indred.equals("")){
				ship_state.get(mmsi).add(1);
				//in dredging area
				timerecord.get(mmsi).setIndred(shipinfo.ti);
				timerecord.get(mmsi).setDate(timerecord.get(mmsi).indred.substring(0, 10));							
			}
			else if(!ishuangpu&&dredging.isContainsPoint(point)&&!(timerecord.get(mmsi).indred.equals(""))){
				try {
					if(((dft1.parse(shipinfo.ti.substring(0, 19)).getTime()-dft1.parse(timerecord.get(mmsi).indred.substring(0, 19)).getTime())/1000/60>360)&&((dft1.parse(shipinfo.ti).getTime()-dft1.parse(timerecord.get(mmsi).indred).getTime())/1000/60<480)){
						//作业行为异常
						abnormal.setAbnormal_type("Working behaviour abnormal");
						timerecord.get(mmsi).setState(1);
						ship_state.get(mmsi).add(1);
						session.insert("addAbnormal",abnormal);
						session.commit();
						System.out.println(abnormal.abnormal_type);
					}
					else if((dft1.parse(shipinfo.ti.substring(0, 19)).getTime()-dft1.parse(timerecord.get(mmsi).indred.substring(0, 19)).getTime())/1000/60>480){
						abnormal.setAbnormal_type("Havn't dump into dumping area");
						timerecord.get(mmsi).setDate(timerecord.get(mmsi).indred.substring(0, 10));
						int k=ship_state.get(mmsi).size()-1;
						for(;k>0;k--){
							if(ship_state.get(mmsi).get(k)==1)
								timerecord.get(mmsi).setExitdred(ship_trajectory.get(mmsi).get(k).ti);
						}
						timerecord.get(mmsi).setIndump(shipinfo.ti);
						timerecord.get(mmsi).setExitdump(shipinfo.ti);
						timerecord.get(mmsi).setState(2);
						session.insert("addAbnormal",abnormal);
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
				timerecord.get(mmsi).setIndred(shipinfo.ti);
				session.insert("addAbnormal",abnormal);
				session.commit();
				System.out.println(abnormal.abnormal_type);
			}
			else if(dumping.isContainsPoint(point)&&!timerecord.get(mmsi).indred.equals("")){
				timerecord.get(mmsi).setIndump(shipinfo.ti);
				ship_state.get(mmsi).add(3);
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
			else if(!timerecord.get(mmsi).indred.equals("")&&WorkloadTimerTask.areascontains(otherdumping, point)){
				//in wrong dredging area
				abnormal.setAbnormal_type("Wrong dumping area");
				timerecord.get(mmsi).setIndump(shipinfo.ti);
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
				session.insert("addAbnormal",abnormal);
				session.commit();
				System.out.println(abnormal.abnormal_type);
			}
			else if(!dumping.isContainsPoint(point)&&(timerecord.get(mmsi).getState()==0||timerecord.get(mmsi).getState()==3||timerecord.get(mmsi).getState()==1)&&!timerecord.get(mmsi).indump.equals("")){
				timerecord.get(mmsi).setExitdump(shipinfo.ti);
				session.insert("addworkrecord",timerecord.get(mmsi));
				session.commit();
				ship_trajectory.get(mmsi).clear();
				ship_state.get(mmsi).clear();
				timerecord.get(mmsi).reset();
			}
			else if(timerecord.get(mmsi).getState()==4&&!WorkloadTimerTask.areascontains(otherdumping, point)&&!timerecord.get(mmsi).indump.equals("")){
				timerecord.get(mmsi).setExitdump(shipinfo.ti);
				session.insert("addworkrecord",timerecord.get(mmsi));
				session.commit();
				ship_trajectory.get(mmsi).clear();
				ship_state.get(mmsi).clear();
				timerecord.get(mmsi).reset();
			}
			else
				ship_state.get(mmsi).add(5);

		}		
		session.close();
	}
}
