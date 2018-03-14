package com.sg.controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
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
import org.springframework.web.bind.annotation.ResponseBody;

import com.sg.domain.Route;
import com.sg.domain.Ship;
import com.sg.domain.Shipinfo;

import net.sf.json.JSONObject;

@Controller
@RequestMapping("/ship")
public class ShipController {
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
		Ship ship = new Ship();
		ship.setMmsi(json.getInt("mmsi"));
		ship.setShipname(json.getString("shipname"));
		ship.setImo(json.getString("imo").equals("")?0:json.getInt("imo"));
		ship.setLength(json.getString("length").equals("")?0.0:json.getDouble("length"));
		ship.setWidth(json.getString("width").equals("")?0.0:json.getDouble("width"));
		ship.setShiptype(json.getString("shiptype"));
		ship.setCapacity(json.getString("capacity").equals("")?0.0:json.getDouble("capacity"));
		ship.setFleet_id(json.getInt("fleet_id"));
		ship.setContact(json.getString("contact"));
		ship.setCellphone(json.getString("cellphone"));
		ship.setRoute_id(json.getInt("route_id"));
		ship.setOwner(json.getString("owner"));
		ship.setOwner_phone(json.getString("owner_phone"));
		SqlSession session = this.getSession();
		session.insert("addShip",ship);
		session.update("createNewtable",json.getString("mmsi"));
		session.commit();
		session.close();
		String str ="success!!!!";
	    return new ResponseEntity<String>(str, HttpStatus.OK);
	}
	@RequestMapping(value="/setroute_id",method=RequestMethod.POST)
	 @ResponseBody
	public ResponseEntity<String> addroute_id(@RequestBody String pro) throws IOException{
		JSONObject json = JSONObject.fromObject(pro);
		Ship ship = new Ship();
		ship.setMmsi(json.getInt("mmsi"));
		ship.setRoute_id(json.getInt("route_id"));
		SqlSession session = this.getSession();
		session.update("setShipRoute_id",ship);
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
		Ship ship = new Ship();
		ship.setMmsi(json.getInt("mmsi"));
		ship.setShipname(json.getString("shipname"));
		ship.setImo(json.getInt("imo"));
		ship.setLength(json.getDouble("length"));
		ship.setWidth(json.getDouble("width"));
		ship.setShiptype(json.getString("shiptype"));
		ship.setCapacity(json.getDouble("capacity"));
		ship.setFleet_id(json.getInt("fleet_id"));
		ship.setContact(json.getString("contact"));
		ship.setCellphone(json.getString("cellphone"));
		ship.setRoute_id(json.getInt("route_id"));
		ship.setOwner(json.getString("owner"));
		ship.setOwner_phone(json.getString("owner_phone"));
		SqlSession session = this.getSession();
		session.update("updateShip",ship);
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
		
		int mmsi = json.getInt("mmsi");
		
		SqlSession session = this.getSession();
		session.delete("deleteShip",mmsi);
		session.commit();
		session.close();
		String str ="success!!!!";
		 return new ResponseEntity<String>(str, HttpStatus.OK);
	}
	
	@RequestMapping(value="/list",method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<Ship>> list() throws IOException{
		 SqlSession session = this.getSession();
		 List<Ship> da = session.selectList("listShip");
		 System.out.println("所有船只信息：");
		 return new ResponseEntity<List<Ship>>(da, HttpStatus.OK);
		}
	
	@RequestMapping(value="/listbyfleetid",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<List<Shipinfo>> listbyfleetid(@RequestBody String pro) throws IOException{
		JSONObject json = JSONObject.fromObject(pro);
		
		int fleet_id = json.getInt("fleet_id"); 
		SqlSession session = this.getSession();
		List<Shipinfo> info = new ArrayList<Shipinfo>();
		 List<Integer> da = session.selectList("listShipbyfleetid",fleet_id); 
		 for(int mmsi:da){
			 info.add(session.selectOne("listnewShipinfo",mmsi));
		 }
		 System.out.println("船队"+fleet_id+"的船只信息：");
		 return new ResponseEntity<List<Shipinfo>>(info, HttpStatus.OK);
		}
	@RequestMapping(value="/listbyprojectid",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<List<Ship>> listbyproid(@RequestBody String pro) throws IOException{
		JSONObject json = JSONObject.fromObject(pro);		
		int pro_id = json.getInt("project_id"); 
		SqlSession session = this.getSession();
		String mmsilist = session.selectOne("getMmsilist",pro_id);	
		System.out.println(mmsilist);
		List<String> wareIdList = Arrays.asList(mmsilist.split(";"));
		List<Ship> ship = session.selectList("getshiplist",wareIdList);		 
//		 System.out.println("船队"+fleet_id+"的船只信息：");
		 return new ResponseEntity<List<Ship>>(ship, HttpStatus.OK);
		}
	
	@RequestMapping(value="/listallmmsi",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<List<Integer>> listmmsi(@RequestBody String pro) throws IOException{
		SqlSession session = this.getSession();
		JSONObject json = JSONObject.fromObject(pro);
		String[] company = json.getString("companylist").split(",");
		List<Integer> mmsi = new ArrayList<Integer>();
		for(String str:company){
			mmsi.addAll(session.selectList("getMMSIofCompany",str));
		}
		return new ResponseEntity<List<Integer>>(mmsi, HttpStatus.OK);
	}
	
	@RequestMapping(value="/mohu",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<List<Integer>> mohu(@RequestBody String pro) throws IOException{
		SqlSession session = this.getSession();
		JSONObject json = JSONObject.fromObject(pro);
		String str = json.getString("str");
		List<Integer> mmsi = session.selectList("mohuship",str);
		return new ResponseEntity<List<Integer>>(mmsi,HttpStatus.OK);
	}
	@RequestMapping(value="/getareainfo",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<String> area(@RequestBody String pro) throws IOException{
		SqlSession session = this.getSession();
		JSONObject json = JSONObject.fromObject(pro);
		String route_id = session.selectOne("getShipRoute_id",json.getInt("mmsi"));
		Route route = session.selectOne("getRouteinfoByid",route_id);
		String dumping_area = session.selectOne("getDumpingLocation",route.getDumping_area());
		String dredging_area = session.selectOne("getDredgingLocation",route.getHarbor());
		String res = "dumping_area:"+dumping_area+",dredging_area:"+dredging_area;
		return new ResponseEntity<String>(res,HttpStatus.OK);
	}
}
