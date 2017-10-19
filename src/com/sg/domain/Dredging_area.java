/**
 * 
 */
package com.sg.domain;

/**
 * @author yuchang xu
 *
 * 2017-09-14
 */
public class Dredging_area {
	public int dredging_id;
	public String location;
	public String dredging_name;
	
	public int getDredging_id() {
		return dredging_id;
	}
	public void setDredging_id(int dredging_id) {
		this.dredging_id = dredging_id;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public String getDredging_name() {
		return dredging_name;
	}
	public void setDredging_name(String dredging_name) {
		this.dredging_name = dredging_name;
	}
	@Override
	public String toString() {
		return "Dredging_area [dredging_id=" + dredging_id + ", location=" + location + ", dredging_name="
				+ dredging_name + "]";
	}
	
}
