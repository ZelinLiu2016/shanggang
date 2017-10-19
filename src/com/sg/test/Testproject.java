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
import java.util.List;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import com.sg.domain.Project;

public class Testproject {

	public static void main(String[] args) throws IOException {
		String resource = "mybatis-config.xml";
		InputStream inputStream = Resources.getResourceAsStream(resource);
		SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession session=sqlSessionFactory.openSession();
        
        
       
        listAll(session);

        Project p = new Project();
        p.setProjectId("56");
        session.delete("deleteProject",p);
        System.out.println("删除工程id="+p.getProjectId());
        
//      Project c = new Project("56","平安","浦西",74367,"2017-03-11","2017-12-15","19");
//      session.insert("addProject",c);
//      System.out.println("插入工程"+c.toString());
      
//      Project c = new Project("56","中国平安","浦西",884367,"2017-03-11","2017-12-15","19");
//      session.update("updateProject",c);
//      System.out.println("更新工程id="+c.getProjectId());
      listAll(session);
//      Project p = session.selectOne("getProject","10");
//      System.out.println(p.toString());
        
        session.commit();
		session.close();

		
	}
	private static void listAll(SqlSession session) {
		List<Project> cs = session.selectList("listProject");
		System.out.println("展示所有工程：");
		for (Project c : cs) {
			System.out.println(c.toString());
		}
	}
}
