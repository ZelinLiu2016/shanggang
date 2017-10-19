/**
 * 
 */
package com.sg.http;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.TimerTask;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import com.sg.domain.InvertIndex;
import com.sg.domain.Trajectory;

/**
 * @author yuchang xu
 *
 * 2017-09-15
 */
public class CreateInvertIndexTimerTask extends TimerTask {

	public static SqlSession getSession() throws IOException{
		String resource = "mybatis-config.xml";
		InputStream inputStream = Resources.getResourceAsStream(resource);
		SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession session=sqlSessionFactory.openSession();
        return session;
	}
	
	@Override
	public  void run() {
		// TODO Auto-generated method stub
		createinvertindex();
	}
	
	private static void createinvertindex(){
		//每天执行一次 每次都从当天航程中得到新的cell记录并插入数据库
		SqlSession session = null;
		try {
			session = getSession();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		List<Trajectory> trajectorys = session.selectList("listTodayTrajectory");
		for(Trajectory tra:trajectorys){
			String[] cells = tra.celllist.split(";");
			for(String cell:cells){
				String trajectorylist = session.selectOne("listcell",cell);
				InvertIndex invertindex = new InvertIndex();
				invertindex.setCell(cell);
				if(trajectorylist==null||trajectorylist.length()==0){
					invertindex.setTrajectorylist(tra.trajectory_id+";");
					session.insert("addInvertIndex",invertindex);
				}
				else{
					invertindex.setTrajectorylist(trajectorylist+tra.trajectory_id+";");
					session.update("updatecell",invertindex);
				}
				session.commit();
			}			
		}
	}
	
	public static void main(String[] args) {
		createinvertindex();
	}
}
