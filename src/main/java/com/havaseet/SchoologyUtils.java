package com.havaseet;


import com.google.common.primitives.Longs;
import com.havaseet.DB;
import com.havaseet.entity.SchoologyInfo;
import java.util.logging.Logger;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

public class SchoologyUtils {
	private static Logger log = Logger.getAnonymousLogger();
	public static final String CALLBACK = "https://havaseet-chart.appspot.com/schoologycallback";
	public static final String REQUEST_URL = "https://api.schoology.com/v1/oauth/request_token";
	public static final String ACCESS_URL = "https://api.schoology.com/v1/oauth/access_token";
	public static boolean checksOut(HttpServletRequest req, String uid) {
		Cookie[] cookies = req.getCookies();
		Cookie[] arg5 = cookies;
		int arg4 = cookies.length;

		for (int arg3 = 0; arg3 < arg4; ++arg3) {
			Cookie c = arg5[arg3];
			if (c.getName().equalsIgnoreCase("SESSIONID")) {
				log.info("cookie sessionid is : " + c.getValue());
				Long infoId = Longs.tryParse(c.getValue());
				SchoologyInfo info = (SchoologyInfo) DB.db().load().type(SchoologyInfo.class).id(infoId.longValue())
						.now();
				if (info.uid.equals(uid)) {
					return true;
				}
				break;
			}
		}

		return false;
	}

	public static String authrorize(String domain, String rToken, String addTo) {
		String redirect = "https://" + domain + "/oauth/authorize?oauth_token=" + rToken + "&oauth_callback="
				+ CALLBACK + "?" + addTo;
		return redirect;
	}

}
