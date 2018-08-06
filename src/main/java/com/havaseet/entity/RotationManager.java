package com.havaseet.entity;

import java.util.HashSet;

public class RotationManager {
public Long id;
public int rotationTime;
public int transitTime;
public GroupCriteria criteria;
public HashSet<Station>stations;
public HashSet<StudentGroup>groups;
}
