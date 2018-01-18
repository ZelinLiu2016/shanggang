
/**
 * @author yuchangxu
 *
 * 2017-06-27
 */
package com.sg.http;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
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
	 */
	public static void main(String[] args) throws DocumentException, IOException {
//		Map<String, String> mapParam = new HashMap<String, String>();
////		mapParam.put("MMSI", "412370603");
		String xmlInfo = "<?xml version='1.0' encoding='gb2312'?><sendparament><MMSI>413465060</MMSI><starttime>2017-11-29 00:00:05</starttime><endtime>2017-11-29 23:59:56</endtime></sendparament>";
		String pathUrl = "http://112.126.75.47/xmlr/getzjshiptrajectory.do";
//		String xmlInfo = "<?xml version='1.0' encoding='gb2312' ?>"+"<sendparament>"+"<MMSI>413044840</MMSI>"+"<starttime>2017-06-25 00:00:00</starttime>"+"<endtime>2017-06-26 00:00:00</endtime>"+"</sendparament>";
//		String pathUrl = "http://112.126.75.47/xmlr/getzjshiptrajectory.do";
		String result = doPost(pathUrl, xmlInfo);
		System.out.println("字符串是："+result);
		Document document = DocumentHelper.parseText(result);
		Element node = document.getRootElement();
		List<Element> trajectory = node.elements("shiptrajectory");
		Shipinfo shipinfo = new Shipinfo();		
		for(Element tra:trajectory){			
//			System.out.println(tra.element("MMSI").getText());
			shipinfo.setMmsi(tra.element("MMSI").getText());
			shipinfo.setLat(tra.element("la").getText());
			shipinfo.setLon(tra.element("lo").getText());
			shipinfo.setCo(tra.element("co").getText());
			shipinfo.setSp(tra.element("sp").getText());
			shipinfo.setTi(tra.element("ti").getText());
			System.out.println("shipinfo:"+shipinfo);
			SqlSession session = RequestTimerTask.getSession();
			session.insert("addShipInfo",shipinfo);
			session.commit();
			session.close();
		}
//		Element weatherreports = node.element("weatherreports");
//		List weather = weatherreports.elements("weatherreport");
//		int windspeed = 0;
//		for (Iterator it = weather.iterator();it.hasNext();){
//			Element elm = (Element) it.next();
//			Element ti = elm.element("ti");
//			String time = ti.getText();
//			if(time.equals("2017-08-26 01:00")){
//				Element ws = elm.element("windspeed");
//				System.out.println("windspeed:"+ws.getText());
//				windspeed = Integer.valueOf(ws.getText());
//				break;
//			}
//		}
		
	}

}
