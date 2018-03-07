
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
	

	/**
	 * ����������
	 * @param args
	 * @throws DocumentException 
	 * @throws IOException 
	 * @throws ParseException 
	 */
	public static void main(String[] args) throws DocumentException, IOException, ParseException {
//		String xmlInfo = "<?xml version='1.0' encoding='gb2312'?><sendparament><MMSI>413380190</MMSI><starttime>2018-01-28 00:00:05</starttime><endtime>2018-02-03 23:59:56</endtime></sendparament>";
//		String pathUrl = "http://112.126.75.47/xmlr/getzjshiptrajectory.do";
//		String result = doPost(pathUrl, xmlInfo);
//		System.out.println("查询完毕");
//		System.out.println("字符串是："+result);
		
		SqlSession session = getSession();
		List<String> mmsi = session.selectList("getworkingmmsilist");
		List<String> mmsiset = new ArrayList<String>();
		for(int i=0;i<3;i++){
			String[] temp = mmsi.get(i).split(";");
			for(int j=0;j<temp.length;j++){
				if(!mmsiset.contains(temp[j]))
					mmsiset.add(temp[j]);
			}
		}
		System.out.print(mmsiset);
//		SimpleDateFormat sdf = new SimpleDateFormat( "yyyy-MM-dd HH:mm:ss" );
//		Date start = sdf.parse("2018-01-28 00:00:05");
//		Date end = sdf.parse("2018-01-28 23:59:59");
//		Calendar cdstart = Calendar.getInstance();   
//		Calendar cdend = Calendar.getInstance();   
//		cdstart.setTime(start);
//		cdend.setTime(end);;
//		for(int i=0;i<36;i++){
//			String start_str = sdf.format(cdstart.getTime());
//			String end_str = sdf.format(cdend.getTime());
//			System.out.println(start_str);
//			System.out.println(end_str);
//			cdstart.add(Calendar.DATE, 1);
//			cdend.add(Calendar.DATE, 1);
//		}
//		for(Iterator<String> it=mmsiset.iterator();it.hasNext();){
//			String mi = it.next();
//			System.out.println(mi);
//			String[] xmlInfo = new String[4];
//			xmlInfo[0] = "<?xml version='1.0' encoding='gb2312'?><sendparament><MMSI>"+mi+"</MMSI><starttime>2018-01-28 00:00:05</starttime><endtime>2018-02-03 23:59:56</endtime></sendparament>";
//			xmlInfo[1] = "<?xml version='1.0' encoding='gb2312'?><sendparament><MMSI>"+mi+"</MMSI><starttime>2018-02-04 00:00:05</starttime><endtime>2018-02-10 23:59:56</endtime></sendparament>";
//			xmlInfo[2] = "<?xml version='1.0' encoding='gb2312'?><sendparament><MMSI>"+mi+"</MMSI><starttime>2018-02-11 00:00:05</starttime><endtime>2018-02-17 23:59:56</endtime></sendparament>";
//			xmlInfo[3] = "<?xml version='1.0' encoding='gb2312'?><sendparament><MMSI>"+mi+"</MMSI><starttime>2018-02-18 00:00:05</starttime><endtime>2018-02-24 23:59:56</endtime></sendparament>";
//			xmlInfo[3] = "<?xml version='1.0' encoding='gb2312'?><sendparament><MMSI>"+mi+"</MMSI><starttime>2018-02-25 00:00:05</starttime><endtime>2018-03-03 23:59:56</endtime></sendparament>";
//			String pathUrl = "http://112.126.75.47/xmlr/getzjshiptrajectory.do";
//			for(int i=0;i<xmlInfo.length;i++){
//				String result = doPost(pathUrl, xmlInfo[i]);
//				System.out.println("字符串是："+result);
//				Document document = DocumentHelper.parseText(result);
//				Element node = document.getRootElement();
//				List<Element> trajectory = node.elements("shiptrajectory");
//				Shipinfo shipinfo = new Shipinfo();		
//				for(Element tra:trajectory){			
//					shipinfo.setMmsi(tra.element("MMSI").getText());
//					shipinfo.setLat(tra.element("la").getText());
//					shipinfo.setLon(tra.element("lo").getText());
//					shipinfo.setCo(tra.element("co").getText());
//					shipinfo.setSp(tra.element("sp").getText());
//					shipinfo.setTi(tra.element("ti").getText());
//					System.out.println(shipinfo.mmsi+","+shipinfo.ti);
//					session.insert("addShipInfo",shipinfo);
//					session.commit();
//					}
//			}
//		}
//		session.close();
	}
}
