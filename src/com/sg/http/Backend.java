package com.sg.http;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.apache.catalina.Session;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;

import com.sg.domain.Ship;
import com.sg.domain.Shipinfo;
import com.sun.org.apache.commons.collections.Transformer;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;

public class Backend{
	@SuppressWarnings("deprecation")
	public static void main(String[] args) {
		TimerTask task01 = new RequestTimerTask();  //get ship position information through interface
		TimerTask task02 = new DeleteTimerTask();  //clean overdue data
		TimerTask task03 = new Backup();
		TimerTask task04 = new WeatherRequestTimerTask();  //catch weather abnormal
		long period01 = 1000*60;//do request every minute
		long period02 = 24*60*1000*60;//one day
		long period03 = 24*60*1000*60;
		long period04 = 30*1000*60;  //half an hour
		Calendar calendar = Calendar.getInstance();
		Date firsttime = calendar.getTime();
		Date firstdate = calendar.getTime();
		firstdate.setHours(24);
		firstdate.setMinutes(0);
		firstdate.setSeconds(0);
//		System.out.println(firstdate);
		Timer timer = new Timer();
		timer.schedule(task01, firsttime,period01);
		timer.schedule(task04, firsttime,period04);
		timer.schedule(task02, firsttime,period02);
		timer.schedule(task03, firsttime,period03);
	}
}
