package com.havaseet;


import freemarker.log.Logger;
import freemarker.template.Configuration;
import freemarker.template.DefaultObjectWrapperBuilder;
import freemarker.template.Template;
import freemarker.template.TemplateExceptionHandler;
import java.io.IOException;
import javax.servlet.ServletContext;

public class TemplateGen {
	private final Configuration cfg;
	private final Logger LOG;

	public TemplateGen(ServletContext ctx) {
		this.cfg = new Configuration(Configuration.VERSION_2_3_23);
		this.LOG = Logger.getLogger(TemplateGen.class.getName());
		this.cfg.setServletContextForTemplateLoading(ctx, "WEB-INF/html");
		DefaultObjectWrapperBuilder owb = new DefaultObjectWrapperBuilder(Configuration.VERSION_2_3_23);
		owb.setForceLegacyNonListCollections(false);
		owb.setDefaultDateType(3);
		this.cfg.setObjectWrapper(owb.build());
		this.cfg.setDefaultEncoding("UTF-8");
		this.cfg.setTemplateExceptionHandler(TemplateExceptionHandler.HTML_DEBUG_HANDLER);
	}

	public Template getTeacherPage() {
		try {
			Template arg1 = this.cfg.getTemplate("teacher.html");
			this.LOG.info(arg1.toString());
			return arg1;
		} catch (IOException arg11) {
			arg11.printStackTrace();
			return null;
		}
	}

	public Template getSchoologyPage() {
		try {
			Template arg1 = this.cfg.getTemplate("schoology-error.html");
			return arg1;
		} catch (IOException arg11) {
			arg11.printStackTrace();
			return null;
		}
	}
}
