/**
 * 
 */
package com.sg.http;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimerTask;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import com.sg.domain.Message;

/**
 * @author yuchang xu
 *
 * 2017-08-15
 */
public class DeleteTimerTask extends TimerTask {

	/* (non-Javadoc)
	 * @see java.util.TimerTask#run()
	 */
	static int days = 15;
	
	
	public int getDays() {
		return days;
	}

	public static SqlSession getSession() throws IOException{
		String resource = "mybatis-config.xml";
		InputStream inputStream = Resources.getResourceAsStream(resource);
		SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession session=sqlSessionFactory.openSession();
        return session;
	}
	
	@SuppressWarnings("static-access")
	@Override
	public void run() {
		// TODO Auto-generated method stub
		System.out.println("清洗数据!!!");
		Message message = new Message();
		SqlSession session = null;
		try {
			session = this.getSession();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		List<Integer> mmsi = new ArrayList<Integer>();
		mmsi = session.selectList("listShipMmsi");
//		message.setMmsi("412375620");
		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat dft = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date now = null;
		try {
			now = dft.parse(dft.format(calendar.getTime()));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		calendar.setTime(now);
		days = session.selectOne("showtimeperiod");
		calendar.add(Calendar.DATE, -days);
		message.setTimestamp(dft.format(calendar.getTime()));
		for(int m:mmsi){
			String mstr = Integer.toString(m);
			message.setMmsi(mstr);
			session.delete("deletedata",message);
			System.out.println("删除mmsi="+mmsi+"时间间隔为"+days+"之前的数据");
			session.commit();
		}
		session.close();
	}


}
