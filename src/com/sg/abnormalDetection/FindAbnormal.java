/**
 * 
 */
package com.sg.abnormalDetection;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import com.baidu.mapapi.model.LatLng;
import com.sg.domain.Shipinfo;

/**
 * @author yuchang xu
 *
 * 2017-08-22
 */
public class FindAbnormal {
	//Dumping Area LOCATION!!
	public static Quadrilateral area1_1 = new Quadrilateral("31:16:32,121:45:39-31:16:44,121:45:51-31:16:24,121:46:20-31:16:11,121:46:08");
	public static Quadrilateral area1_2 = new Quadrilateral("31:10:31.32,122:09:56.98-31:10:15.27,122:09:44.16-31:09:01.75,122:11:48.66-31:09:17.80,122:12:01.48");
	public static Quadrilateral area1_3 = new Quadrilateral("31:04:04,122:19:16-31:03:15,122:19:16-31:03:15,122:23:02-31:04:04,122:23:02");
	public static Quadrilateral area2_1 = new Quadrilateral("30:34:53,122:18:31-30:35:55,122:19:22-30:36:17,122:18:45-30:35:17,122:17:55");
	public static Quadrilateral area3_1 = new Quadrilateral("29:40:51.7,122:25:59.82-29:40:52.3,122:27:14.6-29:40:19.8,122:27:14.8-29:40:19.2,122:25:59.82");
	public static Quadrilateral area3_2 = new Quadrilateral("29:45:13.26,122:28:00.64-29:45:13.26,122:29:14.4-29:44:24.6,122:28:00.64-29:44:24.6,122:29:14.4");
	public static Circle area4_1 = new Circle("24:52:33,119:04:48-0.5");
	public static Circle area5_1 = new Circle("24:46:42,117:52:13-0.5");
	//LIMIT OF SPEED
	public static double max_speed = 7.0;
	
	
	public static SqlSession getSession() throws IOException{
		String resource = "mybatis-config.xml";
		InputStream inputStream = Resources.getResourceAsStream(resource);
		SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession session=sqlSessionFactory.openSession();
        return session;
	}
	
	public static boolean daAbnormal(Shipinfo info, String area) throws IOException{
		
		LatLng position = new LatLng(Double.valueOf(info.lat),Double.valueOf(info.lon));

		boolean flag1_1 = (!area.equals("1_1"))&&(area1_1.isContainsPoint(position));
//		System.out.println("flag1_1:"+flag1_1);
		boolean flag1_2 = (!area.equals("1_2"))&&(area1_2.isContainsPoint(position));
//		System.out.println("flag1_2:"+flag1_2);
		boolean flag1_3 = (!area.equals("1_3"))&&(area1_3.isContainsPoint(position));
//		System.out.println("flag1_3:"+flag1_3);
		boolean flag2_1 = (!area.equals("2_1"))&&( area2_1.isContainsPoint(position));
//		System.out.println("flag2_1:"+flag2_1);
		boolean flag3_1 = (!area.equals("3_1"))&&( area3_1.isContainsPoint(position));
//		System.out.println(!area.equals("area3_1"));
//		System.out.println("flag3_1:"+flag3_1);
		boolean flag3_2 = (!area.equals("3_2"))&&(area3_2.isContainsPoint(position));
//		System.out.println("flag3_2:"+flag3_2);
		boolean flag4_1 = (!area.equals("4_1"))&&( area4_1.isContainsPoint(position));
//		System.out.println("flag4_1:"+flag4_1);
		boolean flag5_1 = (!area.equals("5_1"))&&( area5_1.isContainsPoint(position));
//		System.out.println("flag5_1:"+flag5_1);
		return flag1_1||flag1_2||flag1_3||flag2_1||flag3_1||flag3_2||flag4_1||flag5_1;
	}
	
	public static boolean spAbnormal(Shipinfo info, int speedlimit){
		boolean flag = false;
		if(Double.valueOf(info.sp) > speedlimit)
			flag = true;
		return flag;
	}
	
	public static boolean weatherAbnormal(int windspeed){
		boolean flag = false;
		if(windspeed>max_speed)
			flag = true;
		return flag;
	}
	
	public static void main(String[] args) throws IOException {
		Shipinfo si = new Shipinfo();
		
		String area = "3_1";
		Point po = new Point("30:36:17,122:18:45");
		LatLng position = new LatLng(Double.valueOf(po.lat),Double.valueOf(po.lon));
		si.setMmsi("412375620");
		Double latt = po.lat;
		Double longt = po.lon;
//		System.out.println(latt);
//		System.out.println(longt);
		si.setLat(Double.toString(po.lat));;
		si.setLon(Double.toString(po.lon));
		System.out.println(area3_1.isContainsPoint(position));
//		System.out.println(FindAbnormal.daAbnormal(si,area));
	}
}
