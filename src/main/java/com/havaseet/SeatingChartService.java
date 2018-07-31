package com.havaseet;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.googlecode.objectify.Key;
import com.havaseet.DB;
import com.havaseet.entity.SeatingChart;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "SeatingChartService", urlPatterns = {"/seatingchart/*"})
public class SeatingChartService extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private final Logger log = Logger.getAnonymousLogger();
	private Gson gson = (new GsonBuilder()).setLenient().create();

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		this.log.info("Seating chart service called");
		BufferedReader reader = request.getReader();
		StringBuilder sb = new StringBuilder();

		String line;
		do {
			line = reader.readLine();
			if (line != null && !line.equalsIgnoreCase("null")) {
				sb.append(line);
			}
		} while (line != null);

		reader.close();
		String json = sb.toString();
		this.log.info("json is:  " + json);
		if (json != null && !json.isEmpty()) {
			SeatingChart chart = (SeatingChart) this.gson.fromJson(json, SeatingChart.class);
			long id = ((Key) DB.db().save().entity(chart).now()).getId();
			this.log.info("id from save is " + id);
		}

	}

	protected void doDelete(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
	}
}