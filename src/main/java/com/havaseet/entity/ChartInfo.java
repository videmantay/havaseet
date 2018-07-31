package com.havaseet.entity;

import java.util.ArrayList;
import java.util.List;

import com.googlecode.objectify.annotation.*;


@Entity
public class ChartInfo {
@Id
public String  sectionId;

public Long defaultId;

@Serialize
public List<Info> list = new ArrayList<>();

public class Info{
	public String title;
	public Long id;
}
}
