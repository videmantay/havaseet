package com.havaseet;

public class ReqParams {
	public final String user;
	public final String section;

	public ReqParams(String user, String section) {
		this.user = user;
		this.section = section;
	}

	public String getParams() {
		return "uid=" + this.user + "&sec=" + this.section;
	}
}
