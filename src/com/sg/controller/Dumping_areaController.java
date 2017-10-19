package com.sg.controller;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FileUtils;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.sg.domain.DumpingArea;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;


@Controller
@RequestMapping("/dumping_area")
public class Dumping_areaController {

	private static final int String = 0;

	public SqlSession getSession() throws IOException{
		String resource = "mybatis-config.xml";
		InputStream inputStream = Resources.getResourceAsStream(resource);
		SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession session=sqlSessionFactory.openSession();
        return session;
	}
	

	@RequestMapping(value="/list",method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<DumpingArea>> list() throws IOException{
		SqlSession session = this.getSession();
		 
		 List<DumpingArea> da=session.selectList("listDumpingArea");
		 ObjectMapper objectMapper = new ObjectMapper();
	
	      
//	      String[] newarea_json= area_json.toArray(new String[1]);
//	      System.out.println(newarea_json);
		 return new ResponseEntity<List<DumpingArea>>(da, HttpStatus.OK);
		}
	
	@RequestMapping(value="/listbyid",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<List<DumpingArea>> listbyid(@RequestBody String id) throws IOException{
		
		String str = URLDecoder.decode(id,"utf-8");
		if (str.charAt(str.length()-1) == '=')
		{
			str = str.substring(0,str.length() -1);
		}
		JSONObject json = JSONObject.fromObject(str);
		String area_id = json.getString("area_id");
		SqlSession session = this.getSession();
		 List<String> area_json = new ArrayList<String>();
		 List<DumpingArea> da=session.selectList("listDumpingAreaByid",area_id);
//		 ObjectMapper objectMapper = new ObjectMapper();
//		
//	      for (DumpingArea d:da) {
//	    	  
//	    	  System.out.println(d.toString());
//			  area_json.add(objectMapper.writeValueAsString(d)) ;
//			}
//	      System.out.println(area_json);
//		 System.out.println("haovd");
		//return new ResponseEntity<String>("{"+'"'+"jjj"+'"'+":"+'"'+"kkk"+'"'+"}", HttpStatus.OK);
		 return new ResponseEntity<List<DumpingArea>>(da, HttpStatus.OK);
		}
	

	
	@RequestMapping(value="/add",method=RequestMethod.POST)
	 @ResponseBody
	public void add(@RequestBody String dumpin) throws IOException{
		System.out.println("插入数据");
		System.out.println(dumpin);
		JSONObject json = JSONObject.fromObject(dumpin);
		DumpingArea dumpingarea = new DumpingArea();
		dumpingarea.setArea_id(json.getString("area_id"));
		dumpingarea.setLocation(json.getString("location"));
		
		System.out.println(dumpingarea);
		SqlSession session = this.getSession();
        session.insert("addDumpingArea",dumpingarea);
        session.commit();
		session.close();
	}
	
	@RequestMapping(value="/update")
	 @ResponseBody
	public ResponseEntity<String> update(@RequestBody String dumpin) throws IOException{
		System.out.println("更新数据");
		System.out.println(dumpin);
		JSONObject json = JSONObject.fromObject(dumpin);
		DumpingArea dumpingarea = new DumpingArea();
		dumpingarea.setArea_id(json.getString("area_id"));
		dumpingarea.setLocation(json.getString("location"));
		dumpingarea.setAreaname(json.getString("areaname"));
		System.out.println(dumpingarea);
		SqlSession session = this.getSession();
		 session.update("updateDumpingArea",dumpingarea);
		 session.commit();
		session.close();
		String str ="success!!!!";
		 return new ResponseEntity<String>(str, HttpStatus.OK);
	}
	
	@RequestMapping(value="/delete")
	 @ResponseBody
	public void delete(@RequestBody String dumpin) throws IOException{
		System.out.println("删除数据");
		JSONObject json = JSONObject.fromObject(dumpin);
		String area_id = json.getString("area_id");
		SqlSession session = this.getSession();
		session.delete("deleteDumpingArea",area_id);
		session.commit();
		session.close();
	}

	//用js文件做显示界面
//	@RequestMapping(value={"/areas","/"},method=RequestMethod.GET)
//	public String list(Model model) {
//		//model.addAttribute("pagers", userService.find());
//		return "dumping_area/list";
//	}
//	
//	//链接到add页面时是GET请求，会访问这段代码
//	@RequestMapping(value="/add",method=RequestMethod.GET)
//	public String add(Model model) {
//		//开启modelDriven
//		model.addAttribute("dumpingarea",new DumpingArea());
//		return "dumping_area/add";
//	}
//	
//	//在具体添加用户时，是post请求，就访问以下代码
//	@RequestMapping(value="/add",method=RequestMethod.POST)
//	public String add(DumpingArea dumpingarea) throws IOException{		
//		SqlSession session = this.getSession();
//		System.out.println(dumpingarea);
//        session.insert("addDumpingArea",dumpingarea);
//        session.commit();
//		session.close();
//        
//        return "redirect:/dumping_area/";
//	} 
//	
	
//	@RequestMapping(value="/add",method=RequestMethod.POST)
//	 @ResponseBody
//	public void add(@RequestParam(value = "area_id",required=false) Integer area_id, 
//			@RequestParam(value = "location",required=false) String location, 
//			@RequestParam(value = "name",required=false) String name) throws IOException{
//		System.out.println("插入数据");
//		DumpingArea dumpingarea = new DumpingArea();
//		dumpingarea.setArea_id(area_id);
//		dumpingarea.setLocation(location);
//		dumpingarea.setName(name);
//		System.out.println(dumpingarea);
//		SqlSession session = this.getSession();
//       session.insert("addDumpingArea",dumpingarea);
//       session.commit();
//		session.close();
//	}
	
//	@RequestMapping(value="/update")
//	 @ResponseBody
//	public void update(@RequestParam(value = "area_id") int area_id, 
//			@RequestParam(value = "location") String location, 
//			@RequestParam(value = "name") String name) throws IOException{
//		DumpingArea dumpingarea = new DumpingArea();
//		dumpingarea.setArea_id(area_id);
//		dumpingarea.setLocation(location);
//		dumpingarea.setName(name);
//		System.out.println(dumpingarea);
//		SqlSession session = this.getSession();
//		 session.update("updateDumpingArea",dumpingarea);
//     session.commit();
//		session.close();
//	}
//	
//	@RequestMapping(value="/delete")
//	 @ResponseBody
//	public void update(@RequestParam(value = "area_id") int area_id) throws IOException{
//	
//		SqlSession session = this.getSession();
//		session.delete("deleteDumpingArea",area_id);
//    session.commit();
//		session.close();
//	}	 
	
}
