
/**
 * @author yuchangxu
 *
 * 2017-06-27
 */
package com.sg.http;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.xml.stream.events.StartDocument;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.sg.domain.Shipinfo;

/**
 * @author Post Method
 */
public class HttpPostXml {
	
    /**
     * ������post����
     * @param urlStr
     * @param xmlInfo
     */
	
	public static SqlSession getSession() throws IOException{
		String resource = "mybatis-config.xml";
		InputStream inputStream = Resources.getResourceAsStream(resource);
		SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession session=sqlSessionFactory.openSession();
        return session;
	}
	
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
	
	public static void getdata(String begintime, String endtime, String[] mmsiset) throws IOException, ParseException, DocumentException{
		SqlSession session = getSession();
		String pathUrl = "http://112.126.75.47/xmlr/getzjshiptrajectory.do";
		SimpleDateFormat sdf = new SimpleDateFormat( "yyyy-MM-dd HH:mm:ss" );

		for(int i=0;i<mmsiset.length;i++){
			String mi = mmsiset[i];
			System.out.println(mi);
			Date start = sdf.parse(begintime);
			Date end = sdf.parse(endtime);
			Calendar cdstart = Calendar.getInstance();   
			Calendar cdend = Calendar.getInstance();   
			cdstart.setTime(start);
			cdend.setTime(end);
			String start_str = sdf.format(cdstart.getTime());
			String end_str = sdf.format(cdend.getTime());
			String xmlInfo = "<?xml version='1.0' encoding='gb2312'?><sendparament><MMSI>"+mi+"</MMSI><starttime>"+start_str+"</starttime><endtime>"+end_str+"</endtime></sendparament>";
			cdstart.add(Calendar.DATE, 1);
			cdend.add(Calendar.DATE, 1);
			String result = doPost(pathUrl, xmlInfo);
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
				System.out.println(shipinfo.mmsi+","+shipinfo.ti);
				session.insert("addShipInfo",shipinfo);
				session.commit();
				}
		}
		session.close();
	}

	/**
	 * ����������
	 * @param args
	 * @throws DocumentException 
	 * @throws IOException 
	 * @throws ParseException 
	 */
	public static void main(String[] args) throws DocumentException, IOException, ParseException {
		String[] mmsiset={"413442240"};
		getdata("2018-05-30 00:00:00","2018-05-21 16:52:00",mmsiset);
		
	}
}
