/**
 * 
 */
package com.sg.domain;

/**
 * @author yuchang xu
 *
 * 2017-09-16
 */
public class InvertIndex {
	public String cell;
	public String trajectorylist;
	public String getCell() {
		return cell;
	}
	public void setCell(String cell) {
		this.cell = cell;
	}
	public String getTrajectorylist() {
		return trajectorylist;
	}
	public void setTrajectorylist(String trajectorylist) {
		this.trajectorylist = trajectorylist;
	}
	@Override
	public String toString() {
		return "InvertIndex [cell=" + cell + ", trajectorylist=" + trajectorylist + "]";
	}
	
	
}
