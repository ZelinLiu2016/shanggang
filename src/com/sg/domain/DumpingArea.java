/**
 * 
 */
package com.sg.domain;

/**
 * @author yuchangxu
 *
 * 2017-07-06
 */
public class DumpingArea {
	private String area_id;
	private String location;
	private String areaname;
	
	
	
	/**
	 * @return the area_id
	 */
	public String getArea_id() {
		return area_id;
	}
	/**
	 * @param area_id the area_id to set
	 */
	public void setArea_id(String area_id) {
		this.area_id = area_id;
	}
	/**
	 * @return the location
	 */
	public String getLocation() {
		return location;
	}
	/**
	 * @param location the location to set
	 */
	public void setLocation(String location) {
		this.location = location;
	}
	
	
	public String getAreaname() {
		return areaname;
	}
	public void setAreaname(String areaname) {
		this.areaname = areaname;
	}
	/**
	 * 
	 */
	public DumpingArea() {
		
		// TODO Auto-generated constructor stub
	}
	@Override
	public String toString() {
		return "DumpingArea [area_id=" + area_id + ", location=" + location + ", areaname=" + areaname + "]";
	}
	
	
	
}
