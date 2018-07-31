package com.havaseet;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;


@WebListener
public class TemplateListener implements ServletContextListener {

    /**
     * Default constructor. 
     */
    public TemplateListener() {
        // TODO Auto-generated constructor stub
    }

	/**
     * @see ServletContextListener#contextDestroyed(ServletContextEvent)
     */
    public void contextDestroyed(ServletContextEvent sce)  { 
    	sce.getServletContext().setAttribute("template", (Object) null);
    }

	/**
     * @see ServletContextListener#contextInitialized(ServletContextEvent)
     */
    public void contextInitialized(ServletContextEvent sce)  { 
    	TemplateGen template = new TemplateGen(sce.getServletContext());
		sce.getServletContext().setAttribute("template", template);
    }
    

}
