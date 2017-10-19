package com.sg.domain;

/**
 * @author yuchangxu
 *this is a class for position information of ship.
 * */

public class Shipinfo {
	public String mmsi;
	public String lon;
	public String lat;
	public String ti;
	public String status;
	public String sp;
	public String co;
	public String rot;
	public String draft;
	public String dest;
	
	public Shipinfo(String mmsi, String lon, String lat, String ti, String status, String sp, String co, String rot,
			String draft, String dest) {
		super();
		this.mmsi = mmsi;
		this.lon = lon;
		this.lat = lat;
		this.ti = ti;
		this.status = status;
		this.sp = sp;
		this.co = co;
		this.rot = rot;
		this.draft = draft;
		this.dest = dest;
	}
	
	public Shipinfo() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public String getMmsi() {
		return mmsi;
	}
	public void setMmsi(String mmsi) {
		this.mmsi = mmsi;
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
	public String getTi() {
		return ti;
	}
	public void setTi(String ti) {
		this.ti = ti;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getSp() {
		return sp;
	}
	public void setSp(String sp) {
		this.sp = sp;
	}
	public String getCo() {
		return co;
	}
	public void setCo(String co) {
		this.co = co;
	}
	public String getRot() {
		return rot;
	}
	public void setRot(String rot) {
		this.rot = rot;
	}
	public String getDraft() {
		return draft;
	}
	public void setDraft(String draft) {
		this.draft = draft;
	}
	public String getDest() {
		return dest;
	}
	public void setDest(String dest) {
		this.dest = dest;
	}
	@Override
	public String toString() {
		return "Shipinfo [mmsi=" + mmsi + ", lon=" + lon + ", lat=" + lat + ", ti=" + ti + ", status=" + status
				+ ", sp=" + sp + ", co=" + co + ", rot=" + rot + ", draft=" + draft + ", dest=" + dest + "]";
	}
	
	
}
