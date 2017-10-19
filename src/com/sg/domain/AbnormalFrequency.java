/**
 * 
 */
package com.sg.domain;

/**
 * @author yuchang xu
 *
 * 2017-09-04
 */
public class AbnormalFrequency {
	
	public int mmsi;
	public int frequency;
	public int getMmsi() {
		return mmsi;
	}
	public void setMmsi(int mmsi) {
		this.mmsi = mmsi;
	}
	public int getFrequency() {
		return frequency;
	}
	public void setFrequency(int frequency) {
		this.frequency = frequency;
	}
	@Override
	public String toString() {
		return "AbnormalFrequency [mmsi=" + mmsi + ", frequency=" + frequency + "]";
	}
	

}
