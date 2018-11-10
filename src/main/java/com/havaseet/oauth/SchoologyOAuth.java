package com.havaseet.oauth;

//import com.github.scribejava.core.builder.api.DefaultApi10a;

public class SchoologyOAuth //extends DefaultApi10a 
{
	private String domain ;
	public  SchoologyOAuth(String domain) {
		this.domain = domain;
	}
	/*@Override
	public String getAccessTokenEndpoint() {
		return "https://api.schoology.com/v1/oauth/access_token";
	}

	@Override
	protected String getAuthorizationBaseUrl() {
		
		return "https://"+domain+"/oauth/authorize";
	}

	@Override
	public String getRequestTokenEndpoint() {
		return "https://api.schoology.com/v1/oauth/request_token";
	} */

}
