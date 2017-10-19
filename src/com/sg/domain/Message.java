/**
 * 
 */
package com.sg.domain;

/**
 * @author yuchang xu
 *
 * 2017-08-15
 * this class is a message to send to backend to delete some data
 */
public class Message {
	public String mmsi;
	public String timestamp;
	
	public Message() {
		super();
		// TODO Auto-generated constructor stub
	}
	public String getMmsi() {
		return mmsi;
	}
	public void setMmsi(String mmsi) {
		this.mmsi = mmsi;
	}
	public String getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}
	
	

}
