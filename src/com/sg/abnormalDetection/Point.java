/**
 * 
 */
package com.sg.abnormalDetection;
import java.util.ArrayList;

import com.baidu.mapapi.SDKInitializer;
import com.baidu.mapapi.model.LatLng;
import com.baidu.mapapi.utils.DistanceUtil;
import com.baidu.mapapi.utils.SpatialRelationUtil;

/**
 * @author yuchang xu
 *
 * 2017-08-21
 */
public class Point {
	private static final  double EARTH_RADIUS = 6378137;//赤道半径

	 public double lat;
	 public double lon;
	
	public Point(String str) {
		//String str = "31:10:15.27,122:09:44.16";
		int comma_position = str.indexOf(",");
//		int first_colon = str.indexOf(":");
//		System.out.println("comma_posision="+comma_position);
//		System.out.println("first_colon="+first_colon);
		String lat_str = str.substring(0, comma_position);
		String lon_str = str.substring(comma_position+1);
		lat = convertToDecimal(lat_str);
		lon = convertToDecimal(lon_str);
		
	}
	
	public static double convertToDecimal(String str){
		//把度分秒转化为度
		String[] a= str.split(":");
		double du = Double.valueOf(a[0]);
		double fen = Double.valueOf(a[1]);
		double miao = Double.valueOf(a[2]);
		if(du<0)  
			return -(Math.abs(du)+(Math.abs(fen)+(Math.abs(miao)/60))/60);  
		else
			return Math.abs(du)+(Math.abs(fen)+(Math.abs(miao)/60))/60;
	}
	
	private static double rad(double d){
		return d * Math.PI / 180.0; 
	} 
	
	public static double GetDistance(String p1,String p2) {
		String[] lo1 = p1.split(",");
		String[] lo2 = p2.split(",");
		double lon1=convertToDecimal(lo1[1]);
		double lat1=convertToDecimal(lo1[0]);
		double lon2=convertToDecimal(lo2[1]);
		double lat2=convertToDecimal(lo2[0]);
		double radLat1 = rad(lat1); 
		double radLat2 = rad(lat2); 
		double a = radLat1 - radLat2;
		double b = rad(lon1) - rad(lon2); 
		double s = 2 *Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2)+Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
		s = s * EARTH_RADIUS; return s;//单位米 }
	}
	public static double GetDistance(LatLng p1,String p2) {
		
		String[] lo2 = p2.split(",");
		double lon1=p1.longitude;
		double lat1=p1.latitude;
		double lon2=convertToDecimal(lo2[1]);
		double lat2=convertToDecimal(lo2[0]);
		double radLat1 = rad(lat1); 
		double radLat2 = rad(lat2); 
		double a = radLat1 - radLat2;
		double b = rad(lon1) - rad(lon2); 
		double s = 2 *Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2)+Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
		s = s * EARTH_RADIUS; return s;//单位米 }
	}
	public static double GetLineDistance(LatLng point,String a, String b){
		/**
		 * @param point是要计算到直线距离的点 a,b分别是直线的端点 
		 * @return 返回距离单位米
		 */
		double ab = GetDistance(a, b);
		double pa = GetDistance(point, a);
		double pb = GetDistance(point,b);
		double l = (ab+pa+pb)/2;
		double s = Math.sqrt(l*(l-ab)*(l-pa)*(l-pb));
		double d = 2*s/ab;
		return d;
	}
	
	public static void main(String[] args) {
		
//		LatLng p1 = new LatLng(convertToDecimal("30:40:72"),convertToDecimal("122:10:85"));
//		LatLng p2 = new LatLng(convertToDecimal("30:40:51"),convertToDecimal("122:12:66"));
		String p1 = "30:40:72,122:10:85";
		String p2 = "30:40:51,122:12:66";
//		String p3 = "30:40:73,122:12:17";
		LatLng p3 = new LatLng(convertToDecimal("30:40:73"),convertToDecimal("122:12:17"));
		double distance = GetDistance(p3, p2);
		System.out.println(distance);
	}

	

}
