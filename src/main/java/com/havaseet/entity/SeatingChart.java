package com.havaseet.entity;


import com.google.cloud.Date;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Serialize;
import java.io.Serializable;
import java.util.ArrayList;

@Entity
public class SeatingChart implements Serializable {
	private static final long serialVersionUID = 2656470746976405698L;
	@Id
	public Long id;
	@Index
	public String uid;
	@Index
	public String sectionId;
	@Serialize
	public ArrayList<Furniture> furniture = new ArrayList<>();
	@Serialize
	public RotationManager rotationManager;
	public boolean isDefault;
	public boolean readOnly = false;
	
	/*transit fields */
	/*algorith needed to account for expiration date
	 * where if a volume price superceeds this one
	 * user still gets full warrenty
	 */

	public boolean shared;
	public ArrayList<String> allowedUids = new ArrayList<String>();
	public String createDate;
	public boolean isActive;
	public boolean isArchived;
	public Date expDate;
	public boolean isVolume;
	public ArrayList<String> domainAssociations = new ArrayList<String>();
}
