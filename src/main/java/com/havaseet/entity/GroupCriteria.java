package com.havaseet.entity;

public class GroupCriteria {
	public enum TestSubject{READING, MATH,FLUENCY,SCIENCE, HISTORY,OTHER};
	public enum BasedOn{ELD,TESTS,LAST_NAME,FIRST_NAME,DOB,PROXIMITY};

	public BasedOn basedOn = BasedOn.LAST_NAME;
	public TestSubject testSubject = null;
	public int amtLimit = 4;
	public boolean moreThanLimitOk = true;
	
}
