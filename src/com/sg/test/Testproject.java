/**
 * 
 */
package com.sg.test;

/**
 * @author yuchangxu
 *
 * 2017-06-26
 */
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import com.sg.domain.Project;

public class Testproject {

	public static void main(String[] args) throws IOException {
		SimpleDateFormat sj = new SimpleDateFormat("yyyy-MM-dd");
		Date now = new Date();
		DateFormat d1 = DateFormat.getDateInstance();		
		Calendar cal = Calendar.getInstance();
		cal.setTime(now);
		cal.add(Calendar.DATE, -1);
		String today = sj.format(cal.getTime()).toString();
		System.out.println("昨天日期："+today);
		cal.setTime(now);
		String month = sj.format(cal.getTime()).toString().substring(0, 8).concat("01");
		int w = cal.get(Calendar.DAY_OF_WEEK) - 2;
		cal.add(Calendar.DATE, -w);
		String week = sj.format(cal.getTime()).toString();
		System.out.println("本月初日期"+month);
		System.out.println("本周初日期："+week);
		
	}
	private static void listAll(SqlSession session) {
		List<Project> cs = session.selectList("listProject");
		System.out.println("展示所有工程：");
		for (Project c : cs) {
			System.out.println(c.toString());
		}
	}
}
