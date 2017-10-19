/**
 * 
 */
package com.sg.domain;

/**
 * @author yuchang xu
 *
 * 2017-08-29
 */
public class Workload_day {
	public int mmsi;
	public int workload;
	public String recorddate;
	
	
	public String getRecorddate() {
		return recorddate;
	}
	public void setRecorddate(String recorddate) {
		this.recorddate = recorddate;
	}
	public int getMmsi() {
		return mmsi;
	}
	public void setMmsi(int mmsi) {
		this.mmsi = mmsi;
	}
	public int getWorkload() {
		return workload;
	}
	public void setWorkload(int workload) {
		this.workload = workload;
	}
	@Override
	public String toString() {
		return "Workload_day [mmsi=" + mmsi + ", workload=" + workload + ", recorddate=" + recorddate + "]";
	}
		
}
