package com.havaseet.entity;


import java.io.Serializable;

public class StudentSeat implements Serializable {
	private static final transient long serialVersionUID = 4912335951117569448L;
	public Integer seatNum;
	public String rosterStudent;
	public String color;
	public String url;
	public boolean isEmpty;

	public boolean isEmpty() {
		if (this.rosterStudent != null && !this.rosterStudent.isEmpty()) {
			this.isEmpty = false;
		} else {
			this.isEmpty = true;
		}

		return this.isEmpty;
	}

	public Integer getSeatNum() {
		return this.seatNum;
	}

	public void setSeatNum(Integer seatNum) {
		this.seatNum = seatNum;
	}

	public String getRosterStudent() {
		return this.rosterStudent;
	}

	public void setRosterStudent(String rosterStudent) {
		this.rosterStudent = rosterStudent;
	}
}
