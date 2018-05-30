package com.sg.domain;

public class User_system2 {
	private String user_name;
	private String password;
	private String privilege;
	public String getUser_name() {
		return user_name;
	}
	public void setUser_name(String user_name) {
		this.user_name = user_name;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getPrivilege() {
		return privilege;
	}
	public void setPrivilege(String privilege) {
		this.privilege = privilege;
	}
	@Override
	public String toString() {
		return "User_system2 [user_name=" + user_name + ", password=" + password + ", privilege=" + privilege + "]";
	}
	
}
