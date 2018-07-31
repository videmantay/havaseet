package com.havaseet;

import java.util.UUID;
import java.util.logging.Logger;

public class SchoologyHeader {
	private Logger log = Logger.getAnonymousLogger();
	public String oauth_token = "";
	public String oauth_token_secret = "";
	private StringBuilder header = new StringBuilder();

	public SchoologyHeader() {
		this.setHeader();
	}

	public SchoologyHeader(String oauth_token) {
		this.oauth_token = oauth_token;
		this.setHeader();
	}

	public SchoologyHeader(String oauth_token, String oauth_token_secret) {
		this.oauth_token_secret = oauth_token_secret;
		this.log.info("here is token secret in header " + this.oauth_token_secret);
		this.oauth_token = oauth_token;
		this.oauth_token_secret = oauth_token_secret.split("=")[1];
		this.log.info("token secret after split " + this.oauth_token_secret);
		this.setHeader();
	}

	private void setHeader() {
		this.header.append("OAuth oauth_consumer_key=\"" + OAuthCred.consumerKey + "\",");
		this.header.append(this.oauth_token + "\",");
		this.header.append("oauth_nonce=\"" + UUID.randomUUID().toString() + "\",");
		this.header.append("oauth_timestamp=\"" + System.currentTimeMillis() / 1000L + "\",");
		this.header.append("oauth_signature_method=\"PLAINTEXT\",");
		this.header.append("oauth_version=\"1.0\",");
		this.header.append("oauth_signature=\"" + OAuthCred.sharedSecret + "%26" + this.oauth_token_secret + "\",");
		this.header.append("oauth_verifier=\"\"");
	}

	public String toString() {
		return this.header.toString();
	}
}
