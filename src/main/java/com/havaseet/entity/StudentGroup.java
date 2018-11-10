package com.havaseet.entity;


import java.util.HashSet;
import java.util.Set;

public class StudentGroup {
public String gid; /*schoology gradedgroup id*/
public Boolean synced; /* validate if group exists in schoology*/
public String title;
public String description;
public String icon;
public String color;
public String criteria;
public Set<StudentGroupMember> members
  = new HashSet<StudentGroupMember>();
}
