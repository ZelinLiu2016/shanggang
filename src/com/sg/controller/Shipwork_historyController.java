/**
 * 
 */
package com.sg.domain;

/**
 * @author yuchang xu
 *
 * 2018-03-20
 */
public class Shipwork_history {
	private int mmsi;
	private int company_id;
	private String startdate;
	private String enddate;
	private int route_id;
	private int project_id;
	public int getMmsi() {
		return mmsi;
	}
	public void setMmsi(int mmsi) {
		this.mmsi = mmsi;
	}
	public int getCompany_id() {
		return company_id;
	}
	public void setCompany_id(int company_id) {
		this.company_id = company_id;
	}
	public String getStartdate() {
		return startdate;
	}
	public void setStartdate(String startdate) {
		this.startdate = startdate;
	}
	public String getEnddate() {
		return enddate;
	}
	public void setEnddate(String enddate) {
		this.enddate = enddate;
	}
	public int getRoute_id() {
		return route_id;
	}
	public void setRoute_id(int route_id) {
		this.route_id = route_id;
	}
	public int getProject_id() {
		return project_id;
	}
	public void setProject_id(int project_id) {
		this.project_id = project_id;
	}
	@Override
	public String toString() {
		return "Shipwork_history [mmsi=" + mmsi + ", company_id=" + company_id + ", startdate=" + startdate
				+ ", enddate=" + enddate + ", route_id=" + route_id + ", project_id=" + project_id + "]";
	}
	
}
