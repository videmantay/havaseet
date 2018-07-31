package com.havaseet.entity.acct;

import java.util.ArrayList;
import java.util.Date;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
public class SeatingChartAcct {

	
	@Id
	public Long id;
	/*every seating chart associated with a section */
	/*sections may have more than one seating chart */
	@Index
	public String sectionId;
	

	
	
	
}
