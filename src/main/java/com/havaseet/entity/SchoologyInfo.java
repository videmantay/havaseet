package com.havaseet.entity;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.havaseet.entity.acct.AcctInfo;

import java.io.Serializable;
import java.util.ArrayList;

@Entity
public class SchoologyInfo implements Serializable {
	private static final long serialVersionUID = 2441439449361560144L;
	@Id
	public Long id;
	@Index
	public String uid;
	public String domain;
	public SchoologyToken requestToken = new SchoologyToken();
	public SchoologyToken accessToken = new SchoologyToken();
	/*These fields should be transit */
	public String createDate;
	public String lastLogin;
	public ArrayList<AcctInfo> acctInfo = new ArrayList<>();
	public boolean volumeEnabled;
	public boolean freeAcct;
	
}
