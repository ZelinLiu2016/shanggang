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
	private String owner;
	private String owner_phone;
	private String startdate;
	private String enddate;
	private int project_id;
	
	
	
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
	public int getProject_id() {
		return project_id;
	}
	public void setProject_id(int project_id) {
		this.project_id = project_id;
	}
	public String getOwner_phone() {
		return owner_phone;
	}
	public void setOwner_phone(String owner_phone) {
		this.owner_phone = owner_phone;
	}
	public String getOwner() {
		return owner;
	}
	public void setOwner(String owner) {
		this.owner = owner;
	}
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
				+ contact + ", cellphone=" + cellphone + ", route_id=" + route_id + ", owner=" + owner
				+ ", owner_phone=" + owner_phone + ", startdate=" + startdate + ", enddate=" + enddate + ", project_id="
				+ project_id + "]";
	}
	
	
}
