/**
 * 
 */
package com.sg.domain;

/**
 * @author yuchang xu
 *
 * 2017-09-11
 */
public class Route {
	private int route_id;
	private String harbor;
	private String dumping_area;
	private double speedlimit;
	private String location;
	public int getRoute_id() {
		return route_id;
	}
	public void setRoute_id(int route_id) {
		this.route_id = route_id;
	}
	public String getHarbor() {
		return harbor;
	}
	public void setHarbor(String harbor) {
		this.harbor = harbor;
	}
	public String getDumping_area() {
		return dumping_area;
	}
	public void setDumping_area(String dumping_area) {
		this.dumping_area = dumping_area;
	}
	public double getSpeedlimit() {
		return speedlimit;
	}
	public void setSpeedlimit(double speedlimit) {
		this.speedlimit = speedlimit;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	@Override
	public String toString() {
		return "Route [route_id=" + route_id + ", harbor=" + harbor + ", dumping_area=" + dumping_area + ", speedlimit="
				+ speedlimit + ", location=" + location + "]";
	}
	
}
