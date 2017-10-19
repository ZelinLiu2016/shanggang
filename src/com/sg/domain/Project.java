
package com.sg.domain;

/**
 * @author yuchangxu
 *
 * 2017-06-26
 */

public class Project {
		private String projectId;
		private String projectName;
		private String dumpingArea;
		private String squareVolume;
		private String beginDate;
		private String endDate;
		private String boatNum;
		private String harborName;
		private String mud_ratio;
		private String route_id;
		private String mmsilist;
		private String construction_company;
		private String design_company;
		private String supervision_company;
		
		

		public String getConstruction_company() {
			return construction_company;
		}

		public void setConstruction_company(String construction_company) {
			this.construction_company = construction_company;
		}

		public String getDesign_company() {
			return design_company;
		}

		public void setDesign_company(String design_company) {
			this.design_company = design_company;
		}

		public String getSupervision_company() {
			return supervision_company;
		}

		public void setSupervision_company(String supervision_company) {
			this.supervision_company = supervision_company;
		}

		public String getHarborName() {
			return harborName;
		}

		public void setHarborName(String harborName) {
			this.harborName = harborName;
		}

		public String getProjectId(){
			return projectId;
		}
		
		
		/**
		 * @param projectId the projectId to set
		 */
		public void setProjectId(String projectId) {
			this.projectId = projectId;
		}

		/**
		 * @return the projectName
		 */
		public String getProjectName() {
			return projectName;
		}

		/**
		 * @param projectName the projectName to set
		 */
		public void setProjectName(String projectName) {
			this.projectName = projectName;
		}

		/**
		 * @return the dumpingArea
		 */
		public String getdumpingArea() {
			return dumpingArea;
		}

		/**
		 * @param dumpingArea the dumpingArea to set
		 */
		public void setdumpingArea(String dumpingArea) {
			this.dumpingArea = dumpingArea;
		}

		/**
		 * @return the squareVolume
		 */
		public String getSquareVolume() {
			return squareVolume;
		}

		/**
		 * @param squareVolume the squareVolume to set
		 */
		public void setSquareVolume(String squareVolume) {
			this.squareVolume = squareVolume;
		}

		/**
		 * @return the beginDate
		 */
		public String getBeginDate() {
			return beginDate;
		}

		/**
		 * @param beginDate the beginDate to set
		 */
		public void setBeginDate(String beginDate) {
			this.beginDate = beginDate;
		}

		/**
		 * @return the endDate
		 */
		public String getEndDate() {
			return endDate;
		}

		/**
		 * @param endDate the endDate to set
		 */
		public void setEndDate(String endDate) {
			this.endDate = endDate;
		}

		/**
		 * @return the boatNum
		 */
		public String getBoatNum() {
			return boatNum;
		}

		/**
		 * @param boatNum the boatNum to set
		 */
		public void setBoatNum(String boatNum) {
			this.boatNum = boatNum;
		}


		public String getMud_ratio() {
			return mud_ratio;
		}



		public void setMud_ratio(String mud_ratio) {
			this.mud_ratio = mud_ratio;
		}



		public String getRoute_id() {
			return route_id;
		}



		public void setRoute_id(String route_id) {
			this.route_id = route_id;
		}



		public String getMmsilist() {
			return mmsilist;
		}



		public void setMmsilist(String mmsilist) {
			this.mmsilist = mmsilist;
		}

		@Override
		public String toString() {
			return "Project [projectId=" + projectId + ", projectName=" + projectName + ", dumpingArea=" + dumpingArea
					+ ", squareVolume=" + squareVolume + ", beginDate=" + beginDate + ", endDate=" + endDate
					+ ", boatNum=" + boatNum + ", harborName=" + harborName + ", mud_ratio=" + mud_ratio + ", route_id="
					+ route_id + ", mmsilist=" + mmsilist + ", construction_company=" + construction_company
					+ ", design_company=" + design_company + ", supervision_company=" + supervision_company + "]";
		}
	

				
	}