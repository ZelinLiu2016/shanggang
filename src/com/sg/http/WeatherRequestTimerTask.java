/**
 * 
 */
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
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.TimerTask;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.sg.abnormalDetection.FindAbnormal;
import com.sg.domain.Abnormal_info;
import com.sg.domain.Shipinfo;

/**
 * @author yuchang xu
 * Request the windspeed of the position of the ship
 * 
 * 2017-08-26
 */
public class WeatherRequestTimerTask extends TimerTask {

	/* (non-Javadoc)
	 * @see java.util.TimerTask#run()
	 */
	
	
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
	
	public static int windsp(String time, String lon,String lat) throws DocumentException{
		String xmlInfo = "<?xml version='1.0' encoding='utf-8'?>"+"<sendparament>"+"<searchtime>"+time+"</searchtime>"+"<longitude>"+lon+"</longitude>"+"<latitude>"+lat+"</latitude>"+"</sendparament>";
		String pathUrl = "http://112.126.75.47/xmlr/getcrtmarineweather.do";
//		System.out.println(xmlInfo);
		String result = doPost(pathUrl, xmlInfo);
		Document document = DocumentHelper.parseText(result);
		Element node = document.getRootElement();
		if(node.element("errormessage")!=null){
			System.out.println("ERROR REQUEST!!");
			return 0;
		}
		Element weatherreports = node.element("weatherreports");
		List weather = weatherreports.elements("weatherreport");
		int windspeed = 0;
		for (Iterator it = weather.iterator();it.hasNext();){
			Element elm = (Element) it.next();
			Element ti = elm.element("ti");
			String timeattribute = ti.getText();
			if(timeattribute.equals(time)){
				Element ws = elm.element("windspeed");
//				System.out.println("windspeed:"+ws.getText());
				windspeed = Integer.valueOf(ws.getText());
				break;
			}
		}
		return windspeed;
	}
	
	@Override
	public void run() {
		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat dft01 = new SimpleDateFormat("yyyy-MM-dd HH");
		SimpleDateFormat dft02 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String now = dft01.format(calendar.getTime())+":00";
		String now_comp = dft02.format(calendar.getTime());
		SqlSession session = null;
		try {
			session = getSession();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		List<Integer> mmsi = new ArrayList<Integer>();
		mmsi = session.selectList("listShipMmsi"); 
		for(int num:mmsi){
			Abnormal_info abnormal = new Abnormal_info();
			boolean flag = false;
			Shipinfo shipinfo = session.selectOne("listnewShipinfo",num);
			String lat = shipinfo.getLat();
			String lon = shipinfo.getLon();
//			System.out.println(lat);
			int windspeed = 0;
			try {
				windspeed = windsp(now,lon,lat);
			} catch (DocumentException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			flag = FindAbnormal.weatherAbnormal(windspeed);
			if(flag==true){
				abnormal.setAbnormal_type("Weather abnormal");
				abnormal.setLat(lat);
				abnormal.setLon(lon);
				abnormal.setMmsi(String.valueOf(num));
				abnormal.setSpeed(shipinfo.getSp());
				abnormal.setTime(now_comp);
				abnormal.setWindspeed(windspeed);
				System.out.println("天气异常："+abnormal);
				session.insert("addAbnormal",abnormal);
			}
		}
		session.commit();
		session.close();
	}
	
//	public static void main(String[] args) throws DocumentException {
//		Calendar calendar = Calendar.getInstance();
//		SimpleDateFormat dft01 = new SimpleDateFormat("yyyy-MM-dd HH");
//		SimpleDateFormat dft02 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//		String now = dft01.format(calendar.getTime())+":00";
//		String now_comp = dft02.format(calendar.getTime());
////		System.out.println(now);
//		SqlSession session = null;
//		try {
//			session = getSession();
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//		List<Integer> mmsi = new ArrayList<Integer>();
//		mmsi = session.selectList("listShipMmsi"); 
//		for(int num:mmsi){
//			Abnormal_info abnormal = new Abnormal_info();
//			boolean flag = false;
//			Shipinfo shipinfo = session.selectOne("listnewShipinfo",num);
//			String lat = shipinfo.getLat();
//			String lon = shipinfo.getLon();
////			System.out.println(lat);
//			flag = FindAbnormal.weatherAbnormal(windsp(now,lon,lat));
//			if(flag==true){
//				abnormal.setAbnormal_type("Weather abnormal");
//				abnormal.setLat(lat);
//				abnormal.setLon(lon);
//				abnormal.setMmsi(String.valueOf(num));
//				abnormal.setSpeed(shipinfo.getSp());
//				abnormal.setTime(now_comp);
//				System.out.println(abnormal);
//				session.insert("addAbnormal",abnormal);
//			}
//		}
//		session.commit();
//		session.close();
//	}
}
