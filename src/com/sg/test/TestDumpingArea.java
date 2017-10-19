/**
 * 
 */
package com.sg.test;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import com.sg.domain.DumpingArea;
import com.sg.domain.Project;

/**
 * @author yuchangxu
 *
 * 2017-07-06
 */
public class TestDumpingArea {
	public static void main(String[] args) throws IOException {
		String resource = "mybatis-config.xml";
		InputStream inputStream = Resources.getResourceAsStream(resource);
		SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession session=sqlSessionFactory.openSession();
        
        DumpingArea da =new DumpingArea();
      da.setArea_id("102");
      da.setLocation("31'16'32N,121'45'39E;31'16'44N,12'45'40E");
      listAll(session);
      session.update("updateDumpingArea",da);
      session.commit();
      listAll(session);
		session.close();
      System.out.println("更新抛泥区域"+da.toString());
       
	}
        
	private static void listAll(SqlSession session) {
      List<DumpingArea> da=session.selectList("listDumpingArea");
      System.out.println("列出所有抛泥区域信息：");
      for (DumpingArea d:da) {
			System.out.println(d.toString());
		}
	}
	
}
