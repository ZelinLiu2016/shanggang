/**
 * 
 */
package com.sg.domain;

/**
 * @author yuchang xu
 *
 * 2017-09-11
 */
public class Company {
	private String company_id;
	private String company_name;
	private String address;
	private String contact;
	private String cellphone;
	private String company_type;
	public String getCompany_id() {
		return company_id;
	}
	public void setCompany_id(String company_id) {
		this.company_id = company_id;
	}
	public String getCompany_name() {
		return company_name;
	}
	public void setCompany_name(String company_name) {
		this.company_name = company_name;
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
	public String getCompany_type() {
		return company_type;
	}
	public void setCompany_type(String company_type) {
		this.company_type = company_type;
	}
	@Override
	public String toString() {
		return "Company [company_id=" + company_id + ", company_name=" + company_name + ", address=" + address
				+ ", contact=" + contact + ", cellphone=" + cellphone + ", company_type=" + company_type + "]";
	}
	

}
