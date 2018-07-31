package com.havaseet;


import com.google.gson.Gson;
import com.havaseet.entity.ChartInfo;
import com.havaseet.entity.SchoologyInfo;
import com.havaseet.entity.SeatingChart;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import java.io.IOException;
import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "Teacher", urlPatterns = {"/teacher"})
public class TeacherServlet extends HttpServlet {
	private final Logger log = Logger.getLogger("logger");
	private final Gson gson = new Gson();

	public void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		String[] queryString = req.getQueryString().split("&");
		SchoologySSO sso = new SchoologySSO();
		sso.uid = queryString[0].split("=")[1];
		sso.section = queryString[1].split("=")[1];
		SchoologyInfo info = null;
		if (SchoologyUtils.checksOut(req, sso.uid)) {
			Cookie[] students;
			int enrllList = (students = req.getCookies()).length;

			for (int arg15 = 0; arg15 < enrllList; ++arg15) {
				Cookie arg16 = students[arg15];
				if (arg16.getName().equalsIgnoreCase("sessionid")) {
					info = (SchoologyInfo) DB.db().load().type(SchoologyInfo.class).id(Long.parseLong(arg16.getValue()))
							.now();
				}
			}

			String user = SchoologyApi.getUser(info, sso.uid);
			String section = SchoologyApi.getSection(info, sso.section);
			String enrList = SchoologyApi.getEnrollmentList(info.accessToken, sso.section);
			
			//save for default seatingchart
			SeatingChart sc;
			ChartInfo  chartInfo = DB.db().load().type(ChartInfo.class).id(sso.section).now();
			if(chartInfo == null) {
				chartInfo = new ChartInfo();
				chartInfo.sectionId = sso.section;
				DB.db().save().entity(chartInfo);
				 sc = new SeatingChart();
				sc.sectionId = sso.section;
				sc.uid = sso.uid;
				chartInfo.defaultId = DB.db().save().entity(sc).now().getId();
			}else {

			sc = DB.db().load().type(SeatingChart.class).id(chartInfo.defaultId).now();
			}

			TemplateGen arg211 = (TemplateGen) this.getServletContext().getAttribute("template");
			res.setContentType("text/html");
			res.setStatus(200);
			this.log.log(Level.INFO, "redenring teacher");
			HashMap<String,String> root = new HashMap<>();
			root.put("teacher", user);
			root.put("section", section);
			root.put("students", enrList);
			root.put("chartList", this.gson.toJson(chartInfo));
			root.put("seatingChart", gson.toJson(sc));
			Template teacherPage = arg211.getTeacherPage();

			try {
				teacherPage.process(root, res.getWriter());
			} catch (TemplateException arg171) {
				arg171.printStackTrace();
			}
		}

	}
}
