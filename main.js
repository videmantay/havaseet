import 'google-apps-script';

const mainFolderProp = 'havaseetconfig';
const userInfoProp = 'userinfo';
const userInfoFile = 'userInfo.json';

//first load the html maybe like a splash screen.
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
  
}

function init(){
  let folderId = PropertiesService.getUserProperties().getProperty(mainFolderProp);
  if(folderId == null){
    //set up new folder
    let mainFolder = DriveApp.getRootFolder().createFolder('HVST_Config');
    mainFolder.setDescription(`Created by Havaseet to store config info.`);
    PropertiesService.getUserProperties().setProperty(mainFolderProp, mainFolder.getId());
    let user = {email: Session.getActiveUser().getEmail()};
    let info =  mainFolder.createFile(userInfoFile, JSON.stringify(user));
    PropertiesService.getUserProperties().setProperty(userInfoProp, info.getId())
  }
  
}

//then git classroom info
function getUserProfile(){
  let userJson
  let userinfoId = PropertiesService.getUserProperties().getProperty(userInfoProp);
  if(userinfoId){
    userJson = DriveApp.getFileById(userinfoId).getBlob().getDataAsString();
   return getCourses(JSON.parse(userJson));
  }else{
    //see if mainFolder exist?
    let mainFolderId = PropertiesService.getUserProperties().getProperty(mainFolderProp);
    if(mainFolderId){
      //just create userInfo file 
      createUserInfo();
      getUserProfile();
    }else{
      //no main no user start over
      init();
      getUserProfile();
    }
    
  }

}

function getCourses(u){
  let courses = Classroom.Courses.list();
  return {courseList: courses, userInfo: u};
}




