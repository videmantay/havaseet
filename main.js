
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
    createUserInfo(mainFolder.getId())
  }
  
}

//then git classroom info
function getUserProfile(){
  let userJson
  let userinfoId = PropertiesService.getUserProperties().getProperty(userInfoProp);
  if(userinfoId){
    userJson = DriveApp.getFileById(userinfoId).getBlob().getDataAsString();
    Logger.log(userJson);
   return getCourses(JSON.parse(userJson));
  }else{
    //see if mainFolder exist?
    let mainFolderId = PropertiesService.getUserProperties().getProperty(mainFolderProp);
    if(mainFolderId){
      //just create userInfo file 
      createUserInfo(mainFolderId);
      getUserProfile();
    }else{
      //no main no user start over
      init();
      getUserProfile();
    }
    
  }

}

function createUserInfo(mainId){
  let user = {email: Session.getActiveUser().getEmail()};
    let info =  DriveApp.getFolderById(mainId).createFile(userInfoFile, JSON.stringify(user));
    PropertiesService.getUserProperties().setProperty(userInfoProp, info.getId())
}

function getCourses(u){
  let courses = Classroom.Courses.list();
  return {courseList: courses, userInfo: u};
}

function startCourse(c){
  //this is where you get routineList and default routine if any
  let studentList =  Classroom.Courses.Students.list(c.id);
  studentList.students[0].profile.photoUrl
  let teacherList = Classroom.Courses.Teachers.list(c.id);
  let course = {
			"id": c.id,
			"courseId": "c.id",
			"title": c.name ,
			"section": c.section,
      "room": c.room,
			"icon": "img/star2.svg",
			"routineList": [
				{ "title": 'Your seat', "id": 5732568548769792, 'defaultRoutine': true },
				{ "title": 'Math Lab', "id": 9002568548769792 },
				{ "title": 'Reading Place', "id": 2222568548769792 },
				{ "title": 'Investigation', "id": 708968548769792 }
			],
			//"teacher": {},
			"students": [
			//	
			]
		};
    for(stu of studentList.students){
      course.students.push({ "id": stu.userId, "firstName": stu.profile.name.givenName, "lastName": stu.profile.name.familyName, 
                  "pic": stu.profile.photoUrl})
    }
  
}





