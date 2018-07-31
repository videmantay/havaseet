package com.havaseet;

import com.google.gson.Gson;
import com.havaseet.entity.SchoologyInfo;
import com.havaseet.entity.SchoologyToken;

import java.io.IOException;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "SchoologyCallback", urlPatterns = {"/schoologycallback"})
public class SchoologyCallback extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Logger log = Logger.getAnonymousLogger();
	private Gson gson = new Gson();

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		this.log.info("schoology call  back init");
		this.log.info("Here is query string " + request.getQueryString());
		String[] params = request.getQueryString().split("&");
		SchoologyInfo info = (SchoologyInfo) DB.db().load().type(SchoologyInfo.class)
				.filter("uid", params[0].split("=")[1]).first().now();
		  SchoologyToken accessToken =   SchoologyApi.accessToken(info.requestToken);
		  info.accessToken = accessToken;
		DB.db().save().entity(info).now();
	
		SchoologyUser sUser = gson.fromJson(SchoologyApi.user(info), SchoologyUser.class);
		if (info.uid == null) {
			info.uid = sUser.uid;
		} else if (!info.uid.equals(sUser.uid)) {
			response.sendRedirect("/error.html");
			return;
		}

		Cookie cookie = new Cookie("SESSIONID", "" + info.id);
		cookie.setHttpOnly(true);
		response.addCookie(cookie);
		response.sendRedirect("/teacher?" + request.getQueryString());
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		this.doGet(request, response);
	}
}
