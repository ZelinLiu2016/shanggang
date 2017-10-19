package com.sg.domain;

public class Fleet {
	private int fleet_id;
	private String name;
	private String address;
	private String contact;
	private String cellphone;
	
	
	
	public Fleet() {
		super();
		// TODO Auto-generated constructor stub
	}


	public Fleet(int fleet_id, String name, String address, String contact, String cellphone) {
		super();
		this.fleet_id = fleet_id;
		this.name = name;
		this.address = address;
		this.contact = contact;
		this.cellphone = cellphone;
	}


	public int getFleet_id() {
		return fleet_id;
	}


	public void setFleet_id(int fleet_id) {
		this.fleet_id = fleet_id;
	}


	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}


	public String getAddress() {
		return address;
	}


	public void setAddress(String address) {
		this.address = address;
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


	@Override
	public String toString() {
		return "Fleet [fleet_id=" + fleet_id + ", name=" + name + ", address=" + address + ", contact=" + contact
				+ ", cellphone=" + cellphone + "]";
	}
	
	
}
