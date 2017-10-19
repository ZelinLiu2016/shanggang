/**
 * 
 */
package com.sg.domain;

import bean.Cell;

/**
 * @author yuchang xu
 *
 * 2017-09-14
 */
public class Trajectory {
	public int trajectory_id;
	public int mmsi;
	public String start;
	public String end;
	public String celllist;
	boolean forward;
	
	
	public int getTrajectory_id() {
		return trajectory_id;
	}
	public void setTrajectory_id(int trajectory_id) {
		this.trajectory_id = trajectory_id;
	}
	public int getMmsi() {
		return mmsi;
	}
	public void setMmsi(int mmsi) {
		this.mmsi = mmsi;
	}
	public String getStart() {
		return start;
	}
	public void setStart(String start) {
		this.start = start;
	}
	public String getEnd() {
		return end;
	}
	public void setEnd(String end) {
		this.end = end;
	}
	public String getCelllist() {
		return celllist;
	}
	public void setCelllist(String celllist) {
		this.celllist = celllist;
	}
	public boolean isForward() {
		return forward;
	}
	public void setForward(boolean forward) {
		this.forward = forward;
	}
	@Override
	public String toString() {
		return "Trajectory [trajectory_id=" + trajectory_id + ", mmsi=" + mmsi + ", start=" + start + ", end=" + end
				+ ", celllist=" + celllist + ", forward=" + forward + "]";
	}
	
}
