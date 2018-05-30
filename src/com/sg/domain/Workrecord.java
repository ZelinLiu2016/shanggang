/**
 * 
 */
package com.sg.domain;

/**
 * @author yuchang xu
 *
 * 2017-11-03
 */
public class Workrecord {
	public String mmsi;
	public String date;
	public String indred="";
	public String exitdred="";
	public String indump="";
	public String exitdump="";
	public int state=0;
	public int ishandled;
	public String handlerecord="";
	public int exceed_speed;
	
	public int getExceed_speed() {
		return exceed_speed;
	}
	public void setExceed_speed(int exceed_speed) {
		this.exceed_speed = exceed_speed;
	}
	public int getIshandled() {
		return ishandled;
	}
	public void setIshandled(int ishandled) {
		this.ishandled = ishandled;
	}
	public String getHandlerecord() {
		return handlerecord;
	}
	public void setHandlerecord(String handlerecord) {
		this.handlerecord = handlerecord;
	}
	public String getMmsi() {
		return mmsi;
	}
	public void setMmsi(String mmsi) {
		this.mmsi = mmsi;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getIndred() {
		return indred;
	}
	public void setIndred(String indred) {
		this.indred = indred;
	}
	public String getExitdred() {
		return exitdred;
	}
	public void setExitdred(String exitdred) {
		this.exitdred = exitdred;
	}
	public String getIndump() {
		return indump;
	}
	public void setIndump(String indump) {
		this.indump = indump;
	}
	public String getExitdump() {
		return exitdump;
	}
	public void setExitdump(String exitdump) {
		this.exitdump = exitdump;
	}
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}
	public void reset(){
		this.indred="";
		this.exitdred="";
		this.indump="";
		this.exitdump="";
		this.state=0;
	}
	@Override
	public String toString() {
		return "\"mmsi\":\"" + mmsi + "\", \"date\":\"" + date + "\", \"indred\":\"" + indred + "\", \"exitdred\":\"" + exitdred
				+ "\", \"indump\":\"" + indump + "\", \"exitdump\":\"" + exitdump + "\", \"state\":" + state + ", \"ishandled\":" + ishandled
				+ ", \"handlerecord\":\"" + handlerecord + "\", \"exceed_speed\":" + exceed_speed;
	}
	
		
}
