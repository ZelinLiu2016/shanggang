/**
 * 
 */
package com.sg.domain;

/**
 * @author yuchang xu
 *
 * 2017-08-25
 */
public class Abnormal_info {
	public String mmsi;
	public String abnormal_type;
	public String lon;
	public String lat;
	public String time;
	public String speed;
	public String handle;
	public int windspeed;
	public int exceed_interval;
	
	
	
	public int getExceed_interval() {
		return exceed_interval;
	}
	public void setExceed_interval(int exceed_interval) {
		this.exceed_interval = exceed_interval;
	}
	public int getWindspeed() {
		return windspeed;
	}
	public void setWindspeed(int windspeed) {
		this.windspeed = windspeed;
	}
	public String getHandle() {
		return handle;
	}
	public void setHandle(String handle) {
		this.handle = handle;
	}
	public String getMmsi() {
		return mmsi;
	}
	public void setMmsi(String mmsi) {
		this.mmsi = mmsi;
	}
	public String getAbnormal_type() {
		return abnormal_type;
	}
	public void setAbnormal_type(String abnormal_type) {
		this.abnormal_type = abnormal_type;
	}
	public String getLon() {
		return lon;
	}
	public void setLon(String lon) {
		this.lon = lon;
	}
	public String getLat() {
		return lat;
	}
	public void setLat(String lat) {
		this.lat = lat;
	}
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
	public String getSpeed() {
		return speed;
	}
	public void setSpeed(String speed) {
		this.speed = speed;
	}
	@Override
	public String toString() {
		return "Abnormal_info [mmsi=" + mmsi + ", abnormal_type=" + abnormal_type + ", lon=" + lon + ", lat=" + lat
				+ ", time=" + time + ", speed=" + speed + ", handle=" + handle + ", windspeed=" + windspeed
				+ ", exceed_interval=" + exceed_interval + "]";
	}
	
}
