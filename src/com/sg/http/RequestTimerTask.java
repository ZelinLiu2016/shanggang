package com.sg.http;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
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

    

	public static String doPost(String urlStr, String strInfo) {
		String reStr="";
		try {
			URL url = new URL(urlStr);
			URLConnection con = url.openConnection();
			con.setDoOutput(true);
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
		List<Integer> mmsi = new ArrayList<Integer>();
		mmsi = session.selectList("listShipMmsi");
		HashMap<String,Project> map = new HashMap<String,Project>();
		List<Project> projectlist = session.selectList("listProject");
		for(Project pro:projectlist){
			String shiplist = pro.getMmsilist();
			String[] ship = shiplist.split(";");
			for(String str:ship){
				map.put(str, pro);
			}
		}
		for(int num:mmsi){
			Project project = map.get(String.valueOf(num));
			System.out.println(num);
			String route_id = session.selectOne("getShipRoute_id",num);
			String area = session.selectOne("getDumpingAreabyid",route_id);
			String dredging = session.selectOne("getdredgingareabyid",route_id);
			int speedlimit = session.selectOne("getSpeedlimit",route_id);
//			String dredgingstr = project.getHarborName();
//			List<String> dredging = new ArrayList<String>(Arrays.asList(dredgingstr.split(";")));
//			System.out.println("mmsi:"+num+",area_id:"+area);
			List<String> ti = session.selectList("listShipRecordTime",num);
			/*****************************GET DATA FROM INTERFACE************************************************************/
			String xmlInfo = "<?xml version='1.0' encoding='utf-8'?>"+"<sendparament>"+"<MMSI>"+num+"</MMSI>"+"</sendparament>";
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
				System.out.println("this record is exist!");
				exist = true;
			}
			else{
				session.insert("addShipInfo",shipinfo);
				session.commit();
				System.out.println("INSERT SUCCESSFULLY!");
			}
			/*************************************************************************************/
			//判断是否在抛泥区
			LatLng position = new LatLng(Double.valueOf(shipinfo.lat),Double.valueOf(shipinfo.lon));
			boolean in1_1 = area.equals("1_1")?(FindAbnormal.area1_1).isContainsPoint(position):false;
			boolean in1_2 = area.equals("1_2")?(FindAbnormal.area1_2).isContainsPoint(position):false;
			boolean in1_3 = area.equals("1_3")?(FindAbnormal.area1_3).isContainsPoint(position):false;
			boolean in2_1 = area.equals("2_1")?(FindAbnormal.area2_1).isContainsPoint(position):false;
			boolean in3_1 = area.equals("3_1")?(FindAbnormal.area3_1).isContainsPoint(position):false;
			boolean in3_2 = area.equals("3_2")?(FindAbnormal.area3_2).isContainsPoint(position):false;
			boolean in4_1 = area.equals("4_1")?(FindAbnormal.area4_1).isContainsPoint(position):false;
			boolean in5_1 = area.equals("5_1")?(FindAbnormal.area5_1).isContainsPoint(position):false;
			boolean in = in1_1||in1_2||in1_3||in2_1||in3_1||in3_2||in4_1||in5_1;
            /*******************************************************************************************/
			//判断是否在港区
			boolean dredging_in = false;
			List<LatLng> dredging_area = new ArrayList<LatLng>();
			Dredging_area dre = session.selectOne("getDredgingArea",dredging);
			String locationstr = dre.getLocation();
			String[] location = locationstr.split("-");
			for(String node:location){//港区的每个顶点
				String[] lon_lat = node.split(",");
				LatLng no = new LatLng(Point.convertToDecimal(lon_lat[0]), Point.convertToDecimal(lon_lat[1]));
				dredging_area.add(no);
			}
			dredging_in = SpatialRelationUtil.isPolygonContainsPoint(dredging_area,position);
			/*******************************************************************************/
			 // 记录轨迹 当完成一次从港区到抛泥去任务时记录工作量
			GPS gps = new GPS(Double.valueOf(shipinfo.lat),Double.valueOf(shipinfo.lon),null);
			Cell locationToCell = TileSystem.GPSToTile(gps);
			dredging_in = true;
			if((in||dredging_in)==true){//在港区或者抛泥区
				if(trajectoryMap.get(num)==null){// 还没有这条船的哈希 说明这个cell是起点
					Trajectory tempTrajectory = new Trajectory();
					tempTrajectory.setMmsi(num);
					tempTrajectory.setStart(locationToCell.toString());
					tempTrajectory.setCelllist(""+locationToCell.toString()+";");
					if(in==true)
						tempTrajectory.setForward(false);
					else if(dredging_in==true)
						tempTrajectory.setForward(true);
					trajectoryMap.put(num, tempTrajectory);		//哈希表中加入这条船  开始记录轨迹			
				}
				else{//哈希表中已存在这只船
					Trajectory tempTrajectory = trajectoryMap.get(num);
					String celllist = tempTrajectory.getCelllist();
					String[] cellarr = celllist.split(";");
					int len = cellarr.length;
					if(!locationToCell.toString().equals(cellarr[len-1])){//如果是新的网格点就加入轨迹list
						celllist += locationToCell.toString();
						celllist = celllist+";";
						tempTrajectory.setCelllist(celllist);
						trajectoryMap.put(num, tempTrajectory);
					}
					if((tempTrajectory.isForward()==true&&in==true)||(tempTrajectory.isForward()==false&&dredging_in==true)){
						//到抛泥区域即正向轨迹的终点 到港区即反向轨迹的终点
						tempTrajectory.setEnd(locationToCell.toString());
						session.insert("addTrajectory",tempTrajectory);//插入轨迹表
						session.commit();
						trajectoryMap.remove(num);//插入轨迹表之后就删除本地映射
						
						if(tempTrajectory.isForward()==true&&in==true){
							//完成一次从港区到抛泥区的轨迹 记录一次workload
							List<String> recorddate = session.selectList("listMmsiRecorddate",num);
							if(!recorddate.contains(date)){//还没有这只船这天的记录就插入新字段
								Workload_day workload = new Workload_day();
								workload.setMmsi(num);
								workload.setRecorddate(date);
								workload.setWorkload(0);
								session.insert("addWorkload",workload);
								session.update("workloadincrease",workload);
							}
							else{//已经有这只船这天的工作量记录就加一
								Workload_day workload = new Workload_day();
								workload.setMmsi(num);
								workload.setRecorddate(date);
								System.out.println("MMSI="+num+"的船只"+date+"完成一次任务");
								session.update("workloadincrease",workload);
							}
							session.commit();
						}
					}
				}
			}
			else{//哈希表中已有这条船未完成的轨迹记录 且此时正在行程中 
				if(trajectoryMap.get(num)!=null){
					Trajectory tempTrajectory = trajectoryMap.get(num);
					String celllist = tempTrajectory.getCelllist();
					String[] cellarr = celllist.split(";");
					if(!locationToCell.toString().equals(cellarr[-1])){//新的网格点
						celllist += locationToCell.toString();
						celllist = celllist+";";
						tempTrajectory.setCelllist(celllist);
						trajectoryMap.put(num, tempTrajectory);
					}
				}				
			}
			
				
//			System.out.println("trajectoryMap"+trajectoryMap);
			/******************count the workload*****************************************/
//			boolean last_in = shipstate.containsKey(num)?shipstate.get(num):false;
//			List<String> recorddate = session.selectList("listMmsiRecorddate",num);
//			shipstate.put(num, in);
//			if(!recorddate.contains(date)){
//				Workload_day workload = new Workload_day();
//				workload.setMmsi(num);
//				workload.setRecorddate(date);
//				workload.setWorkload(0);
//				
//				session.insert("addWorkload",workload);
//			}
//			if((last_in==false)&&(in==true)){
//				Workload_day workload = new Workload_day();
//				workload.setMmsi(num);
//				workload.setRecorddate(date);
//				System.out.println("MMSI="+num+"的船只"+date+"完成一次任务");
//				session.update("workloadincrease",workload);
//			}
//			session.commit();
			
				
			/***************************find abnormal*******************/
			Abnormal_info abnormal_info = new Abnormal_info();
			
			boolean da_flag = false; //dumping_area abnormal
			boolean speed_flag = false; //spped abnormal
		
			try {
				da_flag = FindAbnormal.daAbnormal(shipinfo, area);
				speed_flag = FindAbnormal.spAbnormal(shipinfo,speedlimit);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			abnormal_info.setLat(shipinfo.lat);
			abnormal_info.setLon(shipinfo.lon);
			abnormal_info.setMmsi(shipinfo.mmsi);
			abnormal_info.setSpeed(shipinfo.sp);
			abnormal_info.setTime(shipinfo.ti);
			/**********************find trajectory abnormal by route record*********************************************/
			//根据数据库中存有的航道判断航行异常
			String route = session.selectOne("getRouteByid",route_id);
			String[] route_point = route.split("-");
			int len = route_point.length;
			double mindistance = Double.MAX_VALUE;
			for(int i =0;i<len-1;i++){
				if(Point.GetLineDistance(position, route_point[i], route_point[i+1])<mindistance)
					mindistance = Point.GetLineDistance(position, route_point[i], route_point[i+1]);
			}
			if(mindistance>max_dis){
//				System.out.println("mindistance:"+mindistance);
				abnormal_info.setAbnormal_type("Route Abnormal");
				System.out.println("航行轨迹异常："+abnormal_info);
				session.insert("addAbnormal",abnormal_info);
			}
			/**************用iBOAT算法【判断轨迹异常************/
			String endArea ="";
			
			if(trajectoryMap.get(num)!=null&&allTrajectoriesMap.get(String.valueOf(num))==null){
				//开始一轮新的监测
				if(trajectoryMap.get(num).isForward()==true)
					endArea = session.selectOne("getDumpingLocation",area);
				else
					endArea = session.selectOne("getDredgingLocation",dredging);
				try {
					init(String.valueOf(num),locationToCell,endArea);//初始化轨迹检测
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			if(trajectoryMap.get(num)!=null&&allTrajectoriesMap.get(String.valueOf(num))!=null){//轨迹监测中
				Trajectory tempTrajectory = trajectoryMap.get(num);
				if((tempTrajectory.isForward()==true&&in==true)||(tempTrajectory.isForward()==false&&dredging_in==true))//到达终点 本次监测结束
					finish(String.valueOf(num));
				else{
					if(iBOATOline(String.valueOf(num))==true){
						abnormal_info.setAbnormal_type("Route Abnormal");
						System.out.println("航行轨迹异常："+abnormal_info);
						session.insert("addAbnormal",abnormal_info);
					}
				}
				
			}
			/**********************dumping area abnormal *********************************************/	
			if((da_flag==true)&&(exist==false)){
				abnormal_info.setAbnormal_type("Dumping_area Abnormal");
				System.out.println("抛泥区域异常："+abnormal_info);
				session.insert("addAbnormal",abnormal_info);
			}
			/**********************find speed abnormal by route record*********************************************/
			if(speed_flag==true&&(exist==false)){
				abnormal_info.setAbnormal_type("Exceed the speed limit Abnormal");
				System.out.println("超速异常："+abnormal_info);
				session.insert("addAbnormal",abnormal_info);
			}		
			session.commit();
		}		
		session.commit();
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
		firstdate.setMinutes(0);
		firstdate.setSeconds(0);
//		System.out.println(firstdate);
		Timer timer = new Timer();
		timer.schedule(task01, firsttime,period01);
		timer.schedule(task04, firsttime,period04);
		timer.schedule(task02, firstdate,period02);
		timer.schedule(task03, firstdate,period03);
		timer.schedule(task05, firsttime,period05);
		
	}
	
}
