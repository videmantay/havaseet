package com.havaseet;

import java.io.Serializable;
import java.util.List;

public class EnrollmentList implements Serializable {
	public List<Enrollment> enrollment;
	public String total;
	public Links links;
}