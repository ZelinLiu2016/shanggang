package com.sg.domain;

public class Ship {
	private int mmsi;
	private String shipname;
	private int imo;
	private double length;
	private double width;
	private String shiptype;
	private double capacity;
	private int fleet_id;
	private String contact;
	private String cellphone;
	private int route_id;
	
	
	public int getRoute_id() {
		return route_id;
	}
	public void setRoute_id(int route_id) {
		this.route_id = route_id;
	}
	public String getContact() {
		return contact;
	}
	public void setContact(String contact) {
		this.contact = contact;
	}
	public String getCellphone() {
		return cellphone;
	}
	public void setCellphone(String cellphone) {
		this.cellphone = cellphone;
	}
	public int getMmsi() {
		return mmsi;
	}
	public void setMmsi(int mmsi) {
		this.mmsi = mmsi;
	}
	public String getShipname() {
		return shipname;
	}
	public void setShipname(String shipname) {
		this.shipname = shipname;
	}
	public int getImo() {
		return imo;
	}
	public void setImo(int imo) {
		this.imo = imo;
	}
	public double getLength() {
		return length;
	}
	public void setLength(double length) {
		this.length = length;
	}
	public double getWidth() {
		return width;
	}
	public void setWidth(double width) {
		this.width = width;
	}
	public String getShiptype() {
		return shiptype;
	}
	public void setShiptype(String shiptype) {
		this.shiptype = shiptype;
	}
	public int getFleet_id() {
		return fleet_id;
	}
	public void setFleet_id(int fleet_id) {
		this.fleet_id = fleet_id;
	}


	public double getCapacity() {
		return capacity;
	}

	public void setCapacity(double capacity) {
		this.capacity = capacity;
	}
	@Override
	public String toString() {
		return "Ship [mmsi=" + mmsi + ", shipname=" + shipname + ", imo=" + imo + ", length=" + length + ", width="
				+ width + ", shiptype=" + shiptype + ", capacity=" + capacity + ", fleet_id=" + fleet_id + ", contact="
				+ contact + ", cellphone=" + cellphone + ", route_id=" + route_id + "]";
	}
	
	
}
