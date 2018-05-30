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

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import com.sg.domain.Project;

public class Testproject {

	public static void main(String[] args) throws IOException {
		String password = "12adafs3455356456";
		String sha_password = DigestUtils.shaHex(password);
		System.out.println(sha_password);
	}
	private static void listAll(SqlSession session) {
		List<Project> cs = session.selectList("listProject");
		System.out.println("展示所有工程：");
		for (Project c : cs) {
			System.out.println(c.toString());
		}
	}
}
