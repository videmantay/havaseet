package com.havaseet;

import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import java.io.Serializable;

public class DB<T> implements Serializable {
	private Class<T> clazz;

	private DB() {
	}

	public static Objectify db() {
		return ObjectifyService.ofy();
	}

	public DB(Class<T> clazz) {
		this.clazz = clazz;
	}
}
