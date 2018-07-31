package com.havaseet;


import com.google.api.client.auth.oauth.OAuthParameters;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpRequest;
import com.google.api.client.http.HttpRequestFactory;
import com.google.api.client.http.HttpResponse;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.gson.Gson;
import com.havaseet.entity.*;
import java.io.IOException;
import java.util.logging.Logger;

public class SchoologyApi {
	private static Logger log = Logger.getAnonymousLogger();
	private static Gson gson = new Gson();
	/*use between havaseet-chart(prod) and schooliki-lms(test)*/
	public static final String CALLBACK = "https://havaseet-chart.appspot.com/schoologycallback";
	public static final String REQUEST_URL = "https://api.schoology.com/v1/oauth/request_token";
	public static final String ACCESS_URL = "https://api.schoology.com/v1/oauth/access_token";
	
	public static SchoologyToken requestToken() {
		OAuthParameters oauthParameters = getParams(null);
		GenericUrl genUrl = new GenericUrl("https://api.schoology.com/v1/oauth/request_token");
		HttpRequest request = null;
		HttpRequestFactory requestFac = (new NetHttpTransport()).createRequestFactory();

		try {
			request = requestFac.buildGetRequest(genUrl);
			request.getHeaders().setAuthorization(oauthParameters.getAuthorizationHeader());
			log.info("request for user header is : " + request.getHeaders().getAuthorization().toString());
			log.info("request url is " + request.getUrl().build());
		} catch (IOException arg8) {
			log.warning("url not created proper for user");
			
		}

		try {
			request.setRetryOnExecuteIOException(true);
			HttpResponse arg7 = request.execute();
			String e = arg7.parseAsString();
			log.info("response body is " + e);
			String[] tokenParts = e.split("&");
			//first is oauth_token = token
			SchoologyToken token = new SchoologyToken();
			token.token = tokenParts[0].split("=")[1];
			token.tokenSecret = tokenParts[1].split("=")[1];
			return token;
		} catch (IOException arg71) {
			log.warning("request for token ended error when producing response");
			return null;
		}
	}
	
	public static String authrorize(String domain, String rToken, String addTo) {
		String redirect = "https://" + domain + "/oauth/authorize?oauth_token=" + rToken + "&oauth_callback="
				+ CALLBACK + "?" + addTo;
		return redirect;
	}
	
	public static SchoologyToken accessToken(SchoologyToken token) {
		OAuthParameters params = getParams(token);
		GenericUrl genUrl = new GenericUrl("https://api.schoology.com/v1/oauth/access_token");
		HttpRequest request = null;
		HttpRequestFactory requestFac = (new NetHttpTransport()).createRequestFactory();

		try {
			request = requestFac.buildGetRequest(genUrl);
			request.getHeaders().setAuthorization(params.getAuthorizationHeader());
			log.info("request for access token header is : " + request.getHeaders().getAuthorization().toString());
			log.info("request url is " + request.getUrl().build());
		} catch (IOException arg8) {
			log.warning("url not created proper for access token");
		}

		try {
			request.setRetryOnExecuteIOException(true);
			HttpResponse arg7 = request.execute();
			String e = arg7.parseAsString();
			log.info("response body is " + e);
			String[] tokenParts = e.split("&");
			//first is oauth_token = token
			SchoologyToken accessToken = new SchoologyToken();
			accessToken.token = tokenParts[0].split("=")[1];
			accessToken.tokenSecret = tokenParts[1].split("=")[1];
			return accessToken;
		} catch (IOException arg71) {
			log.warning("request for user ended error when producing response");
			arg71.printStackTrace();
			return null;
		}
	}

	public static String user(SchoologyInfo info) {
		String url = url();
		String userUrl = url + "users/" + info.uid;
		return execute(info.accessToken, userUrl);
		
	}

	public static String getUser(SchoologyInfo info, String uId) {
		String url = url();
		String userUrl = url + "users/" + uId;
		return execute(info.accessToken, userUrl);
	}

	public static String getSectionList(SchoologyInfo info) {
		String url = url();
		String secUrl = url + "users/" + info.uid + "/sections?start=0&limit=10";
		return execute(info.accessToken, secUrl);
	}

	public static String getSection(SchoologyInfo info, String secId) {
		String url = url();
		String secUrl = url + "/sections/" + secId;
		return execute(info.accessToken, secUrl);
	}

	public static String getEnrollmentList(SchoologyToken info, String secId) {
		String url = url();
		String enUrl = url + "sections/" + secId + "/enrollments?start=0&limit=50";
		return execute(info, enUrl);
	}

	private static String execute(SchoologyToken token, String resource) {
		OAuthParameters oauthParameters = getParams(token);
		GenericUrl genUrl = new GenericUrl(resource);
		HttpRequest request = null;
		HttpRequestFactory requestFac = (new NetHttpTransport()).createRequestFactory();

		try {
			request = requestFac.buildGetRequest(genUrl);
			request.getHeaders().setAccept("application/json");
			request.getHeaders().setAuthorization(oauthParameters.getAuthorizationHeader());
			log.info("request for user header is : " + request.getHeaders().getAuthorization().toString());
			log.info("request url is " + request.getUrl().build());
		} catch (IOException arg8) {
			log.warning("url not created proper for user");
		}

		try {
			HttpResponse arg7 = request.execute();
			String e = arg7.parseAsString();
			log.info("response body is " + e);
			return e;
		} catch (IOException arg71) {
			log.warning("request for user ended error when producing response");
			arg71.printStackTrace();
			return null;
		}
	}

	private static OAuthParameters getParams(SchoologyToken key) {
		String token = "";
		String secretToken = "";
		if(key != null && key.token != null) {
			token = key.token;
			secretToken = key.tokenSecret;
		}
		OAuthParameters oauthParameters = new OAuthParameters();
		oauthParameters.consumerKey = OAuthCred.consumerKey;
		oauthParameters.realm = "Schoology API";
		oauthParameters.version = "1.0";
		oauthParameters.token = token;
		oauthParameters.computeNonce();
		oauthParameters.computeTimestamp();
		oauthParameters.signatureMethod = "PLAINTEXT";
		oauthParameters.signature = OAuthCred.sharedSecret + "%26" + secretToken;
		return oauthParameters;
	}

	private static String url() {
			return "https://api.schoology.com/v1/";
	}
}
