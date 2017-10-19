package com.sg.controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sg.domain.DumpingArea;
import com.sg.domain.Project;

import net.sf.json.JSONObject;

@Controller
@RequestMapping("/project")
public class ProjectController {
	
	public SqlSession getSession() throws IOException{
		String resource = "mybatis-config.xml";
		InputStream inputStream = Resources.getResourceAsStream(resource);
		SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession session=sqlSessionFactory.openSession();
        return session;
	}
	
	@RequestMapping(value="/add",method=RequestMethod.POST)
	 @ResponseBody
	public ResponseEntity<String> add(@RequestBody String pro) throws IOException{
		System.out.println("插入数据");
		System.out.println(pro);
		JSONObject json = JSONObject.fromObject(pro);
		Project project = new Project();
		project.setProjectId(json.getString("project_id"));
		project.setProjectName(json.getString("projectname"));
		project.setdumpingArea(json.getString("dumpingarea"));
		project.setSquareVolume(json.getString("squarevolume"));
		project.setBeginDate(json.getString("begindate"));
		project.setEndDate(json.getString("enddate"));
		project.setBoatNum(json.getString("boatnum"));
		project.setHarborName(json.getString("harborname"));
		project.setMud_ratio(json.getString("mud_ratio"));
		project.setRoute_id(json.getString("route_id"));
		project.setMmsilist(json.getString("mmsilist"));
		project.setConstruction_company(json.getString("construction_company"));
		project.setDesign_company(json.getString("design_company"));
		project.setSupervision_company(json.getString("supervision_company"));
		SqlSession session = this.getSession();
		session.insert("addProject",project);
		session.commit();
		session.close();
		String str ="success!!!!";
		return new ResponseEntity<String>(str, HttpStatus.OK);
	}
	
	@RequestMapping(value="/update")
	 @ResponseBody
	public ResponseEntity<String> update(@RequestBody String pro) throws IOException{
		System.out.println("更新数据");
		System.out.println(pro);
		JSONObject json = JSONObject.fromObject(pro);
		Project project = new Project();
		project.setProjectId(json.getString("project_id"));
		project.setProjectName(json.getString("projectname"));
		project.setdumpingArea(json.getString("dumpingarea"));
		project.setSquareVolume(json.getString("squarevolume"));
		project.setBeginDate(json.getString("begindate"));
		project.setEndDate(json.getString("enddate"));
		project.setBoatNum(json.getString("boatnum"));
		project.setHarborName(json.getString("harborname"));
		project.setMud_ratio(json.getString("mud_ratio"));
		project.setRoute_id(json.getString("route_id"));
		project.setMmsilist(json.getString("mmsilist"));
		project.setConstruction_company(json.getString("construction_company"));
		project.setDesign_company(json.getString("design_company"));
		project.setSupervision_company(json.getString("supervision_company"));
		SqlSession session = this.getSession();
		session.update("updateProject",project);
		session.commit();
		session.close();
		String str ="success!!!!";
		 return new ResponseEntity<String>(str, HttpStatus.OK);
	}
	
	@RequestMapping(value="/delete")
	 @ResponseBody
	public ResponseEntity<String> delete(@RequestBody String pro) throws IOException{
		System.out.println("删除数据");
		JSONObject json = JSONObject.fromObject(pro);
		Project project = new Project();
		project.setProjectId(json.getString("project_id"));
		
		SqlSession session = this.getSession();
		session.delete("deleteProject",project);
		session.commit();
		session.close();
		String str ="success!!!!";
		 return new ResponseEntity<String>(str, HttpStatus.OK);
	}
	@RequestMapping(value="/list",method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<Project>> list() throws IOException{
		SqlSession session = this.getSession();
//		 List<String> json = new ArrayList<String>();
		 List<Project> da=session.selectList("listProject");
		 for(Project d:da) {
			 System.out.println(d.toString());
		 }
		 return new ResponseEntity<List<Project>>(da, HttpStatus.OK);
		}
	@RequestMapping(value="/listbyid",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<List<Project>> listbyid(@RequestBody String pro) throws IOException{
		JSONObject json = JSONObject.fromObject(pro);
		String id = json.getString("projectid");
		SqlSession session = this.getSession();
//		 List<String> json = new ArrayList<String>();
		 List<Project> da=session.selectList("getProject",id);
		 for(Project d:da) {
			 System.out.println(d.toString());
		 }
		 return new ResponseEntity<List<Project>>(da, HttpStatus.OK);
		}
	@RequestMapping(value="/listbyharbor",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<List<Project>> listbyharbor(@RequestBody String pro) throws IOException{
		JSONObject json = JSONObject.fromObject(pro);
		String harbor = json.getString("harbor_name");
		SqlSession session = this.getSession();
		List<Project> project = session.selectList("listbyharbor",harbor);
		return new ResponseEntity<List<Project>>(project,HttpStatus.OK);
	}
}
