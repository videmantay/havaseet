package com.havaseet;

import com.havaseet.DB;
import com.havaseet.entity.SchoologyInfo;
import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

public class TeacherFilter implements Filter {
	public void init(FilterConfig filterConfig) throws ServletException {
	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		Cookie[] cookies = ((HttpServletRequest) request).getCookies();
		Cookie[] arg7 = cookies;
		int arg6 = cookies.length;

		for (int arg5 = 0; arg5 < arg6; ++arg5) {
			Cookie c = arg7[arg5];
			if (c.getName().equalsIgnoreCase("sessionid")) {
				Long sessionId = Long.getLong(c.getValue());
				SchoologyInfo info = (SchoologyInfo) DB.db().load().type(SchoologyInfo.class).id(sessionId.longValue())
						.now();
				chain.doFilter(request, response);
				return;
			}
		}

	}

	public void destroy() {
	}
}
