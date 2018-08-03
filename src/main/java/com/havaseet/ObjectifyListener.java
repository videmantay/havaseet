package com.havaseet;

import com.googlecode.objectify.ObjectifyService;
import com.havaseet.entity.SchoologyInfo;
import com.havaseet.entity.SeatingChart;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
public class ObjectifyListener implements ServletContextListener {
	public void contextDestroyed(ServletContextEvent sce) {
	}

	public void contextInitialized(ServletContextEvent sce) {
		ObjectifyService.init();
		ObjectifyService.register(SchoologyInfo.class);
		ObjectifyService.register(SeatingChart.class);
	}
}