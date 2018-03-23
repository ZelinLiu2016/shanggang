package com.sg.http;

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
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.baidu.mapapi.model.LatLng;
import com.baidu.mapapi.utils.SpatialRelationUtil;
import com.sg.abnormalDetection.Circle;
import com.sg.abnormalDetection.FindAbnormal;
import com.sg.abnormalDetection.Point;
import com.sg.abnormalDetection.Quadrilateral;
import com.sg.domain.Abnormal_info;
import com.sg.domain.Dredging_area;
import com.sg.domain.DumpingArea;
import com.sg.domain.Project;
import com.sg.domain.Shipinfo;
import com.sg.domain.Trajectory;
import com.sg.domain.Workload_day;
import com.sun.javafx.collections.MappingChange.Map;

import bean.Cell;
import bean.GPS;
import util.TileSystem;

public class RequestTimerTask extends TimerTask {
	
//	public static HashMap<Integer, Boolean> shipstate = new HashMap<Integer, Boolean>();
	private static double max_dis = 500;//距离规定预设航道偏离不大于500米
	public static double threshold = 0.04;
	//记录轨迹
	public static HashMap<Integer, Trajectory> trajectoryMap;
	//判断轨迹异常
	private static HashMap<String, List<List<Cell>>> supportTrajectoriesMap ;
    private static HashMap<String, List<Cell>> adaptiveWindowMap;
    private static HashMap<String, List<List<Cell>>> allTrajectoriesMap;
    //实时异常监测
    private static HashMap<Integer,List<Shipinfo>> ship_trajectory = new HashMap<Integer,List<Shipinfo>>();
    private static Abnormal_info exceed_flag = new Abnormal_info();
//    private static HashMap<Integer,List<Integer>> ship_state = new HashMap<Integer,List<Integer>>();
    private static HashMap<Integer,List<String>> timerecord = new HashMap<Integer,List<String>>(); 
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
	
	@Override
	public void run(){
		// TODO Auto-generated method stub
		SimpleDateFormat dft = new SimpleDateFormat("yyyy-MM-dd");
		SimpleDateFormat dft1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		System.out.println("向数据库插入数据!!!");
		Calendar calendar = Calendar.getInstance();
		System.out.println("这条记录的时间是："+calendar.getTime());
		String date = dft.format(calendar.getTime());
		SqlSession session = null;
		try {
			session = getSession();
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
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
			System.out.println("获取"+mmsi+"的最新坐标");

			List<String> ti = session.selectList("listShipRecordTime",mmsi);
			/*****************************GET DATA FROM INTERFACE************************************************************/
			String xmlInfo = "<?xml version='1.0' encoding='utf-8'?>"+"<sendparament>"+"<MMSI>"+mmsi+"</MMSI>"+"</sendparament>";
			String pathUrl = "http://112.126.75.47/xmlr/getcrtshipposition.do";	
			String doc = doPost(pathUrl, xmlInfo);
			Shipinfo shipinfo = new Shipinfo();
			try {
				shipinfo = getxmlInfo(doc);
			} catch (DocumentException e) {
				e.printStackTrace();
			}
			/********************add record into shipinfo*******************************************/
			boolean exist = false;
			if(ti.contains(shipinfo.getTi()+".0")){
//				System.out.println("this record is exist!");
				exist = true;
			}
			else if(shipinfo.mmsi!=null&&shipinfo.mmsi!=""){
				session.insert("addShipInfo",shipinfo);
				session.commit();
//				System.out.println("INSERT SUCCESSFULLY!");
			}
			//实时异常检测
			Abnormal_info abnormal = new Abnormal_info();
			abnormal.setLat(shipinfo.lat);
			abnormal.setLon(shipinfo.lon);
			abnormal.setMmsi(String.valueOf(mmsi));
			abnormal.setSpeed(shipinfo.sp);
			abnormal.setTime(shipinfo.ti);
			if(!ship_trajectory.containsKey(mmsi)){
				ship_trajectory.put(mmsi, new ArrayList<Shipinfo>());
//				ship_state.put(mmsi, new ArrayList<Integer>());
				timerecord.put(mmsi, new ArrayList<String>());
			}
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
					if(exceed_flag.abnormal_type.equals("Instant exceed speed")&&(dft1.parse(shipinfo.ti.substring(0, 19)).getTime()-dft1.parse(exceed_flag.time.substring(0, 19)).getTime())/1000/60>max_interval){
						System.out.println("this exceed:"+shipinfo.ti);
						System.out.println("last_exceed:"+exceed_flag.time);		
						abnormal.setAbnormal_type("Continuous exceed speed");
						abnormal.setExceed_interval((int) (dft1.parse(shipinfo.ti.substring(0, 19)).getTime()-dft1.parse(exceed_flag.time.substring(0, 19)).getTime())/1000/60);
						exceed_flag.setAbnormal_type("");
						exceed_flag.setTime("");
						session.insert("addAbnormal",abnormal);
						session.commit();
					}
					else if(!exceed_flag.abnormal_type.equals("Instant exceed speed")){
						abnormal.setAbnormal_type("Instant exceed speed");
						abnormal.setTime(shipinfo.ti);
						exceed_flag.setAbnormal_type("Instant exceed speed");
						exceed_flag.setTime(shipinfo.ti);
						session.insert("addAbnormal",abnormal);
						session.commit();
						}
				} catch (ParseException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
//				System.out.println(abnormal.abnormal_type);
			}
			else{
				exceed_flag.setAbnormal_type("");
			}
			
			if((dredging.isContainsPoint(point))&&timerecord.get(mmsi).isEmpty()){
//				ship_state.get(mmsi).add(1);
				//in dredging area
				if(timerecord.get(mmsi).isEmpty())
					timerecord.get(mmsi).add(shipinfo.ti);
			}
			else if(WorkloadTimerTask.areascontains(otherdredging,point)){
//				ship_state.get(mmsi).add(2);
				//in wrong dredging area
				abnormal.setAbnormal_type("Wrong dredging area");
				session.insert("addAbnormal",abnormal);
				session.commit();
				System.out.println(abnormal.abnormal_type);
				ship_trajectory.get(mmsi).clear();
				exceed_flag.setAbnormal_type("");;
				timerecord.get(mmsi).clear();
			}
			else if(WorkloadTimerTask.areascontains(otherdumping, point)){
//				ship_state.get(mmsi).add(3);
				//in wrong dredging area
				abnormal.setAbnormal_type("Wrong dumping area");
				session.insert("addAbnormal",abnormal);
				session.commit();
				System.out.println(abnormal.abnormal_type);
				ship_trajectory.get(mmsi).clear();
//				ship_state.get(mmsi).clear();
				exceed_flag.setAbnormal_type("");;
				timerecord.get(mmsi).clear();
			}
			else if(dredging.isContainsPoint(point)&&!(timerecord.get(mmsi).isEmpty())){
				try {
					if(((dft1.parse(shipinfo.ti.substring(0, 19)).getTime()-dft1.parse(timerecord.get(mmsi).get(0).substring(0, 19)).getTime())/1000/60>360)&&((dft1.parse(shipinfo.ti).getTime()-dft1.parse(timerecord.get(mmsi).get(0)).getTime())/1000/60<480)){
						//作业行为异常
						abnormal.setAbnormal_type("Working behaviour abnormal");
						session.insert("addAbnormal",abnormal);
						session.commit();
						System.out.println(abnormal.abnormal_type);
						ship_trajectory.get(mmsi).clear();
//						ship_state.get(mmsi).clear();
						exceed_flag.setAbnormal_type("");;
						timerecord.get(mmsi).clear();
					}
					else if((dft1.parse(shipinfo.ti.substring(0, 19)).getTime()-dft1.parse(timerecord.get(mmsi).get(0).substring(0, 19)).getTime())/1000/60>480){
						abnormal.setAbnormal_type("Havn't dump into dumping area");
						session.insert("addAbnormal",abnormal);
						session.commit();
						System.out.println(abnormal.abnormal_type);
						ship_trajectory.get(mmsi).clear();
//						ship_state.get(mmsi).clear();
						exceed_flag.setAbnormal_type("");
						timerecord.get(mmsi).clear();
					}
				} catch (ParseException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}		
//		session.commit();
		session.close();
	}
	
	
	public static boolean iBOATOline(String num) {
		Shipinfo shipinfo = new Shipinfo();
        String longtitude = shipinfo.getLon();
        String lattitude = shipinfo.getLat();

        //TODO 是否要检测？ continue

        //epilog
        List<Cell> adaptiveWindow = adaptiveWindowMap.get(num);
        List<List<Cell>> supportTrajectories = supportTrajectoriesMap.get(num);

        //
        Cell cell = TileSystem.GPSToTile(new GPS(Double.parseDouble(lattitude), Double.parseDouble(longtitude), null));

        adaptiveWindow.add(cell);

        int lastSupportSize = supportTrajectories.size();
        supportTrajectories.removeIf(cells -> !hasCommonPath(adaptiveWindow, cells));

        double support = supportTrajectories.size() * 1.0 / lastSupportSize;
        if (support < threshold) {
            //TODO 异常点异常插入数据库
//			anomalyCells.add(cell);
  
            supportTrajectories = new ArrayList<>(allTrajectoriesMap.get(num));
            adaptiveWindow.clear();
            adaptiveWindow.add(cell);
            return true;
        }

        //prolog
        adaptiveWindowMap.put(num, adaptiveWindow);
        supportTrajectoriesMap.put(num, supportTrajectories);
        return false;
    }

    /**
     * 检测算法中相关函数
     */
    private static boolean hasCommonPath(List<Cell> testPath, List<Cell> samplePath) {
        int index = -1;
        boolean search;
        for (Cell cell : testPath) {
            search = false;
            for (int i = index + 1; i < samplePath.size(); i++) {
                if (samplePath.get(i).equals(cell)) {
                    index = i;
                    search = true;
                    break;
                }
            }
            if (!search)
                return false;
        }
        return true;
    }
    
    /**
     * 初始化
     * @throws IOException 
     */
    private static void init(String mmsi, Cell startCell, String endArea) throws IOException {
        //假设 endArea 114.2222,30.22222;114.3333,30.3333
        String[] endAreas = endArea.split("-");

        //计算网格范围
        int minX = Integer.MAX_VALUE, minY = Integer.MAX_VALUE;
        int maxX = Integer.MIN_VALUE, maxY = Integer.MIN_VALUE;
        for (String onePoint : endAreas) {
            String[] sp = onePoint.split(",");
            //TODO 建议新加一个String转Cell方法
            Cell cell = TileSystem.GPSToTile(new GPS(Point.convertToDecimal(sp[0]), Point.convertToDecimal(sp[1]), null));//TODO 检查经纬度的顺序
            minX = Math.min(minX, cell.getTileX());
            minY = Math.min(minY, cell.getTileY());
            maxX = Math.max(maxX, cell.getTileX());
            maxY = Math.max(maxY, cell.getTileY());
        }

        List<Cell> cellArea = new ArrayList<>();
        for (int i = minX; i <= maxX; i++)
            for (int j = minY; j <= maxY; j++)
                cellArea.add(new Cell(i, j));

        //得到经过起点的轨迹

        //TODO get+cell+from+invert_index
        //String startTrajectoryList=getCellFromInvertIndex(startCell);
//        String startTrajectoryList = "1234;2222;3333";
        SqlSession session = RequestTimerTask.getSession();
        String startTrajectoryList = session.selectOne("listcell",startCell.toString());
        if(startTrajectoryList==null)//数据库中没有这个cell的记录
        	return;
        List<String> startSet = new ArrayList<>(Arrays.asList(startTrajectoryList.split(";")));

        //得到经过终点的轨迹
        Set<String> endSet = new HashSet<>();
        for (Cell endCell : cellArea) {
            //TODO get+cell+from+invert_index
            //String endTrajectoryList=getCellFromInvertIndex(endCell);
//            String endTrajectoryList = "1234;2222;3333";
        	String endTrajectoryList = session.selectOne("listcell",endCell.toString());
            endSet.addAll(Arrays.asList(endTrajectoryList.split(";")));
        }

        //交集
        startSet.retainAll(endSet);

        //通过id得到轨迹的网格流
        List<List<Cell>> allTrajectories = new ArrayList<>();
        for (String tId : startSet) {
            //TODO get+cell_list+from+trajectory
            //String cellList=getCellListFromTrajectory(tId);
//            String cellList = "[111,222];[112,222];[113,222]";
        	String cellList = session.selectOne("getcelllistbyid",tId);
            String[] csp = cellList.split(";");
            List<Cell> oneTrajectory = new ArrayList<>();
            for (String cs : csp) {
                oneTrajectory.add(new Cell(cs));
            }

            allTrajectories.add(oneTrajectory);
        }

        allTrajectoriesMap.put(mmsi, allTrajectories);
    }

    /**
     * 完成
     */
    private static void finish(String mmsi) {
        adaptiveWindowMap.remove(mmsi);
        supportTrajectoriesMap.remove(mmsi);
    }
    
	public static void main(String[] args) {
//		shipstate = new HashMap<Integer, Boolean>();
		trajectoryMap = new HashMap<Integer, Trajectory>();
		supportTrajectoriesMap = new HashMap<String, List<List<Cell>>>();
	    adaptiveWindowMap = new HashMap<String, List<Cell>>();
	    allTrajectoriesMap = new HashMap<String, List<List<Cell>>>();
		TimerTask task01 = new RequestTimerTask();  //get ship position information through interface
		TimerTask task02 = new DeleteTimerTask();  //clean overdue data
		TimerTask task03 = new Backup(); //backup database
		TimerTask task06 = new WorkloadTimerTask();//everuday workrecord
		TimerTask task04 = new WeatherRequestTimerTask();  //catch weather abnormal
		TimerTask task05 = new CreateInvertIndexTimerTask();// create invert index
		long period01 = 1000*60;//do request every minute
		long period02 = 24*60*1000*60;//one day
		long period03 = 24*60*1000*60;//one day
		long period04 = 30*1000*60;  //half an hour
		long period05 = 30*1000*60;//one day
		Calendar calendar = Calendar.getInstance();
		Date firsttime = calendar.getTime();
		Date firstdate = calendar.getTime();
		firstdate.setHours(23);
		firstdate.setMinutes(59);
		firstdate.setSeconds(55);
//		System.out.println(firstdate);
		Timer timer = new Timer();
		timer.schedule(task01, firsttime,period01);
//		timer.schedule(task04, firsttime,period04);
//		timer.schedule(task02, firstdate,period02);
		timer.schedule(task03, firstdate,period03);
		timer.schedule(task06, firstdate,period03);
//		timer.schedule(task05, firsttime,period05);
		
	}
	
}
