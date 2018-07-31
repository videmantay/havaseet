package com.havaseet;


import com.havaseet.entity.SchoologyInfo;
import com.havaseet.entity.SchoologyToken;
import java.io.IOException;
import java.io.StringReader;
import java.util.concurrent.ExecutionException;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.DatatypeConverter;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.xml.sax.Attributes;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;
import org.xml.sax.helpers.DefaultHandler;

@WebServlet(name = "Schoology", urlPatterns = {"/schoology"})
public class Schoology extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Logger log = Logger.getAnonymousLogger();

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		try {
			this.schoology(request, response);
		} catch (ParserConfigurationException | SAXException | InterruptedException | ExecutionException arg3) {
			arg3.printStackTrace();
		}

	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		try {
			this.schoology(request, response);
		} catch (ParserConfigurationException | SAXException | InterruptedException | ExecutionException arg3) {
			arg3.printStackTrace();
		}

	}

	private void schoology(HttpServletRequest req, HttpServletResponse res) throws IOException, ParserConfigurationException, SAXException, InterruptedException, ExecutionException {
      SchoologySSO sso = new SchoologySSO();
      this.log.info("Schoology initiated");
      String sectionId = "";
      String parseSection = req.getParameter("RelayState").split("\\?")[1];
      if(parseSection.contains("section")) {
         String[] saml1 = parseSection.split("&");
         sectionId = saml1[1].split("=")[1];
      }

      this.log.info("section id is " + sectionId);
      sso.section = sectionId;
      String saml11 = req.getParameter("SAMLResponse");
      String xml = new String(DatatypeConverter.parseBase64Binary(saml11));
      SAXParserFactory factory = SAXParserFactory.newInstance();
      factory.setNamespaceAware(true);
      SAXParser parser = factory.newSAXParser();
      XMLReader reader = parser.getXMLReader();
      reader.setContentHandler(new DefaultHandler() {
    		boolean uid = false;
    		boolean parseUid = false;
    		boolean domain = false;
    		boolean parseDomain = false;

    		

    		public void startElement(String uri, String localName, String qName, Attributes attributes) {
    			if (this.uid) {
    				this.parseUid = true;
    				log.info("is parsing uid");
    				this.uid = false;
    			}

    			if (this.domain) {
    				this.parseDomain = true;
    				log.info("parsing domain");
    				this.domain = false;
    			}

    			if (attributes != null && attributes.getLength() > 0) {
    				for (int i = 0; i < attributes.getLength(); ++i) {
    					if (attributes.getValue(i).equalsIgnoreCase("uid")) {
    						this.uid = true;
    					}

    					if (attributes.getValue(i).equalsIgnoreCase("domain")) {
    						this.domain = true;
    					}
    				}
    			}

    		}

    		public void characters(char[] ch, int start, int length) {
    			if (this.parseUid) {
    				sso.uid = new String(ch, start, length);
    				log.info("uid = " + sso.uid);
    				this.parseUid = false;
    			}

    			if (this.parseDomain) {
    				sso.domain = new String(ch, start, length);
    				log.info("domain is " +sso.domain);
    				this.parseDomain = false;
    			}

    		}

    		public void endDocument() {
    			log.info("sso has courseId: " + sso.section + " sso has uid: "
    					+ sso.uid + " and domain: " + sso.domain);
    		}
    	});
      reader.parse(new InputSource(new StringReader(xml)));
      SchoologyInfo info = (SchoologyInfo)DB.db().load().type(SchoologyInfo.class).filter("uid", sso.uid).first().now();
      if(info == null || info.accessToken.token == null || info.accessToken.token.isEmpty()) {
         this.log.info("No schoology info or access token in data base ask for schoology request token");
         info = new SchoologyInfo();
         info.uid = sso.uid;
         info.domain = sso.domain;
         this.getSchoologyToken(res, info, sso);
      }
      try {
    SchoologyApi.user(info);
      }catch(Exception e) {
    	  
      }
      String queryString = "uid=" + sso.uid + "&sec=" + sso.section;
      Cookie cookie = new Cookie("SESSIONID", "" + info.id);
      cookie.setHttpOnly(true);
      res.addCookie(cookie);
      res.sendRedirect("/teacher?" + queryString);
      res.flushBuffer();
   }

	private void getSchoologyToken(HttpServletResponse res, SchoologyInfo info, SchoologySSO sso) throws IOException, InterruptedException, ExecutionException {
		SchoologyToken token = null;
		int attempts = 0;
		do{ token = SchoologyApi.requestToken();attempts++;
		log.info("token is " + token.token + " and attempts:" +attempts);}while(token == null || attempts < 10);
		
		info.requestToken = token;
		DB.db().save().entity(info).now();
		String addTo = "uid="+sso.uid +"&sec="+sso.section;
		res.sendRedirect(SchoologyApi.authrorize(sso.domain, token.token, addTo));
		res.flushBuffer();
	}
}
