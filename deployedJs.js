
//main.js
/**
 * main.js
 * main entry for Havaseet app
 * @author Lee ViDemantay
 */

/** UI Constants */
/** @global */
const $floorPlan = $("div.floorPlan");
const $stationPlan = $("section.stationPlan");
const $navbar = $("nav#navbar");
/**global */
const $homeToolbar = $("div#homeToolbar");
/** @global */
const $homeToolSide = $("div.homeTool-side");
/** @global */
const $editTools = $("div.editToolbar");
/** @global */
const $editToolSide = $("div.editTool-side");
/** @global */
const $editToolCollapsible = $("div.editTool-side > div.accordian");
/** @global */
const $sideTools = $("div.sideTools");
/** @global */
const $studentList = $("ul.scStudentList");
/** @global */
const $groupList = $("ul.groupList");
/** @global */
const $procList = $("ul.procList");
/** @global */
const $curRoutineBtn = $("#curRoutineBtn");
/** @global */
const $curRoutineDropdown = $("div#routineDropdownList");

/** @global */
/***
 * @Routine
 * This will be the current routine that is being edited
 * and sent to the form.
 */
let routineCopy;

/** @global */
let isEditing = false;

/*Globals*/
/** @global */
let state = "home"; //home, edit
/** @global */
let editState = "furniture"; //posible editState: furniture,student,group,proc,info,station
/** @global */
let viewState = "student"; //possible view: student, group, proc,station,info

/** @global */
let activeEditGroup = null;
/** @global */
let activeGroup = null;


/** @global */
let sortByLastName = false; //TODO: move this to student list variable
//page init like resize

/* ------Here is the onload method so start all coding here except for inits ---*/
//populate the students into studentList
$(
  () => {
    //populate the heading section img and title
    $("img#sectionProfImg").attr("src", course.icon);
    $("#sectionTitleSpan").text(course.title + ": " + course.section);

    //pop routine list
    /*TODO: change to setRoutine later */
    populateRoutineList();

    /*set up click for view-btn :student group proc*/
    $("a.view-btn").click(function () {
      $this = $(this);
      $icon = $this.find("i.view-icon");
      if ($icon.hasClass("amber-text")) {
        //means it is already active
        return;
      }
      //here we can assume view is not active
      var className = "amber-text text-accent-1";
      $("i.view-icon").removeClass(className);
      $icon.addClass(className);
      $(".side-tool").css("display", "none");

      swtichView($this.attr("id"));
    }); //end click view-btn

    /*set up click for editLink btn*/
    $("a#editRoutineLink", "ul#settingsList").click(function () {
      toastr.info("clicked", "Student edit clicked");
      edit();
    });


    /** initalize group setting modal */
    

        let strategyNum = 16;
    
    let groupRationale = {
        strategy:'flexible',
        strategyDetail:'',//separated by colon
        groupBy:'',//here we could also use NAME_DESC/ NAME_ASC along with RTI2, HETERO etc
        customScale:{},
        description:'',
        studentMin:2,
        studentMax:6,
        subjects:[],
        latestAssginmentNum:3,
        assignments:[]
    };
    
    let strategies = [
        {id: 16, text: 'Flexible', descript:'Customize groups to fit your tasks'},
		{id: 11, text: 'Subjects', descript:'Group students by performance on subjects'},
		{id: 12, text: 'Assignments', descript:'Group students by performance on any graded assignments.'},
		{id: 13, text: 'Name', descript:'Group students by first or last name'},
		{id: 14, text: 'Proximity', descript:'Group students who are close to eacher other'},
		{id: 15, text: 'Random', descript:'Group students at random'}
		
		
	];
	let $strategySelect2 =  $('#strategySelect').select2({data: strategies, minimumResultsForSearch: Infinity});
	$strategySelect2.on('select2:select', function (e) {
	    var data = e.params.data;
	    //update description
        $('#strategy-descript').text(data.descript)
	});
	
    $('#strategySelect').change(function(e){
       
    	let $val = $(this).val();
        console.log('strategy changed: ' + 
        $val);
        //change value of data obj
        if($val == strategyNum){
            return;
        }
        hideStrategyDetails();
        switch($val){
            case '11':
                groupRationale.strategy = 'subjects';
                showSubjectSection();
                strategyNum = 11;
                break;
            case '12':
                groupRationale.strategy = 'assignments';
                showAssignmentSection();
                strategyNum = 12; 
                break;
            case '13':
                groupRationale.strategy = 'name';
                showNameSection();
                strategyNum = 13;
                break;
            case '14':
                groupRationale.strategy = 'proximity';
                showProximitySection();
                strategyNum = 14;
                break;
            case '15':
                groupRationale.strategy = 'random';
                showRandomSection();
                strategyNum
                break;
            default:
                groupRationale.strategy = 'flexible';
                showFlexibleSection();
                strategyNum = 16;
                break;
        }
        //erase detail
       
        groupRationale.strategyDetail = '';
        //check to see if it's diplayed
       
    });

    $('#subject-select').select2();
    $('#roles-carousel').carousel({
        interval: false,
        ride:false,
        wrap:false,
        touch:false,
        keyboard:false
    });

    $('#create-role-btn').click(function(e){
        $('#roles-carousel').carousel('next');
    });
    $('#back-to-role-btn').click(function(e){
        $('#roles-carousel').carousel('prev');
    });
   

    /*make color-selectable clickable passing available color*/
    var $colorSelect = $("button.btn.color-selection");
    $colorSelect.click(function () {
      var color;
      var $this = $(this);
      if (!$this.hasClass("selected")) {
        color = $this.attr("data-color");
        var $groupColorInput = $("#group-color-input");
        $groupColorInput.removeClass();
        $groupColorInput.addClass("dropdown-trigger btn " + color);
        $groupColorInput.attr("data-color", color);
      }
    });

    
    drawGrid();
    updateGroupPanels();
    updateProceduresPanels();
    home();
  } //end function //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
); //end jquery init;//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* ui function list */
function setCurRoutine(routineId) {
  /*need to make an ajax call here */

  $.getJSON("./dummyData/routineList.json", function (d) {
    var match = false;
    for (data in d) {
      if (data.id == routineId) {
        if (curRoutine == null) {
          break;
        }
        curRoutine = data;
        match = true;
        break;
      }
    } //end for
    if (!match) {
      curRoutine = course.routineList[0];
    }
    $curRoutineBtn.text(curRoutine.title);
    populateRoutineList();
  }).fail(function (jqxhr, textStatus, error) {
    var err = textStatus + ", " + error;
    showErrorAlert(err);
  });
}

function showErrorAlert(msg) {
  toastr.error(msg, "No Such Routine Error");
}
function populateRoutineList() {
  for (var i = 0; i < course.routineList.length; i++) {
    var s = course.routineList[i];
    if (s.id == curRoutine.id) {
      continue;
    }
    var $rosterItem = $('<a class="dropdown-item routine-item" href="#"></a>');
    $rosterItem.attr("id", s.id);
    $rosterItem.text(s.title);
    $rosterItem.css({
      textAlign: "center",
      margin: "0 auto",
      padding: "2px",
      verticalAlign: "middle",
      fontWeight: 10,
    });

    $curRoutineDropdown.append($rosterItem);
    if (i == course.routineList.length - 1) {
      break;
    }
    $curRoutineDropdown.append(
      "<div class='dropdown-divider' tab-index='-1'></div>"
    );

    //add the click fucntion to routine-items
    $(".routine-item").click(function () {
      setCurRoutine($(this).attr("id"));
    }); //end click
  } //end for
}

function home() {
  if (state == null) state = home;
  if (viewState == null) viewState = "student";
  if ($studentList.children().length < 1) {
    $studentList.append("<div><h5>No student to show</h5></div>");
  }

  $homeToolbar.css("display", "block");
  $homeToolSide.css("display", "block");
  //TODO: set up student action panel $('.rosterStudent').click();
  swtichView(viewState);
}

function doneHome() {
  $homeToolbar.css({ cssText: "display:none !important" });
  $homeToolSide.css({ cssText: "display:none !important" });
  switch (viewState) {
    case "group":
      doneGroupView();
      break;
    case "proc":
      doneProcView();
      break;
    case "station":
      doneStationView();
      break;
    case "info":
      doneInfoView();
      break;
    default:
      doneStudentView();
  }
}

function getRoutine(){
  if(isEditing){
    return routineCopy;
  }else{
    return curRoutine;
  }
}

function drawGrid() {
  //	console.log('called draw grid');
  //need to check for edit state
 let routine = getRoutine();
    
  $floorPlan.empty();
  $studentList.empty();
  //new strategy: put all student in studentList and
  //li will have their id number as an attr
  for (var i = 0; i < course.students.length; i++) {
    var sp = RosterStudentPanel.createPanel(course.students[i]);
    sp.appendTo($studentList).wrap(
      '<li class="list-group-item" data-id="' +
        course.students[i].id +
        '"></li>'
    );
  } ///end for ////////
  //put desks in place
  if (routine.furniture.length > 0) {
    //iterate
    for (var i = 0; i < routine.furniture.length; i++) {
      //place furniture on floor
      //check types
      //for desks see if student needs to be added
      if ((routine.furniture[i].type = "desk")) {
        var $desk = FurnitureUtils.drawDesk(routine.furniture[i]);
        var desk = $desk.data("desk");
        //if student are assigned then seats are present
        if (desk.seats.length > 0) {
          for (var j = 0; j < desk.seats.length; j++) {
            var $seat = $desk.find(".pos" + (j + 1));
            //console.log("this is the student seat:");
            //console.log($seat);
            if (desk.seats[j].student == null || desk.seats[j].student == "") {
              continue;
            } else {
              //iterate through student to find same id
              //and then "hide" from array
              var $liEls = $studentList.children().not(":hidden");
              for (var k = 0; k < $liEls.length; k++) {
                $el = $($liEls.get(k));
                //console.log('here is the student list:');
                //console.log($el);
                if ($el.attr("data-id") == desk.seats[j].student) {
                  $el.find("div.rosterStudent").appendTo($seat);
                  $el.hide();
                  continue;
                } //end if
              } //end for
            } //end else stuent empty
            $seat
              .find(".counterRotate")
              .css("transform", "rotate(" + -desk.rotate + "rad)");
          } //end for desk seat
        } //end if desk seat length
        //apend desk now
        $floorPlan.append($desk);
      } //end if furniture is a desk
    } //end for furniture
  } //end if furniture length

  //put groups in place
  if (routine.groups != null && routine.groups.length > 0) {
    var students = course.students.slice();
    for (let g of routine.groups) {
      for (let m of g.members) {
        for (let s = 0; s < students.length; s++) {
          if (m.memberId == students[s].id) {
            $(
              `div#${students[s].id}.rosterStudent`).attr('group', g.id);
            students.splice(s, 1);
            //console.log(students);
            break;
          } //end if
        } //end for students
      }
    }
  } //end if groups
} //end drawGrid///////

function edit() {
  doneHome();
  isEditing = true;
  editState = "furniture";
  $editTools.show();
  $editToolSide.show();
  if ($studentList.find("li").length > 0) {
    var $sListClone = $studentList.clone();
    $sListClone.addClass("edit");
    $sListClone.appendTo($("div#studentCollapseBody").empty());
    $sListClone.attr("id", "studentEditList");
  } else {
    $("div#studentCollapseBody")
      .empty()
      .append("<div> No students to view</div>");
  }
  routineCopy = $.extend(true, {}, curRoutine);
  /* set up edit toolside collapsible */
  $(window).on("shown.bs.collapse", () => {
    var $activeItem = $editToolCollapsible.find("div.collapse.show");
    //console.log('active item: ');
    //	console.log($activeItem.attr('id'));
    switchEditState(editStateFromId($activeItem.attr("id")));
  });
  editFurniture();
}

function doneEdit() {
  isEditing = false;
  switchEditState("furniture");
  $editTools.css("display", "none !important");
  $editToolSide.css("display", "none !important");
  home();
}

function submitEdit() {
  //Ajax call to submit data
  curRoutine = $.extend(true, {}, routineCopy);
  //send to server
  //console.log(curRoutine);
  doneEdit();
}

/*** apply immediate changes to curRoutine with routineCopy while in 
  edit mode 
*/
function applyEdit(){
  curRoutine = $.extend(true, {}, routineCopy);
 // drawGrid();
 // doneEdit();
}

function cancelEdit() {
  //revert back to old data
  //fix editState
  routineCopy = null;
  doneEdit();
}

function switchEditState(newState) {
  switch (editState) {
    case "student":
      doneEditStudent();
      break;
    case "group":
      doneEditGroup();
      break;
    case "station":
      doneEditStations();
      break;
    case "proc":
      doneEditProc();
      break;
    case "info":
      doneEditInfo();
      break;
    default:
      doneEditFurniture();
  }
  editState = newState;
  switch (editState) {
    case "student":
      editStudent();
      break;
    case "group":
      editGroup();
      break;
    case "station":
      editStations();
      break;
    case "proc":
      editProc();
      break;
    case "info":
      editInfo();
      break;
    default:
      editFurniture();
  }
}

function editStateFromId(id) {
  switch (id) {
    case "furnitureCollapse":
      return "furniture";
    case "studentCollapse":
      return "student";
    case "groupCollapse":
      return "group";
    case "stationCollapse":
      return "station";
    case "procCollapse":
      return "proc";
    case "infoCollapse":
      return "info";
  }
}

function editFurniture() {
  editState = "furniture";
  $("img.furnitureIcon").draggable({
    zIndex: 500,
    appendTo: "body",
    cursorAt: [0, 0],
    revert: "invalid",
    containment: ".seatingChart",
    helper: "clone",
  });
  $floorPlan.droppable({
    accept: ".furnitureIcon",
    greedy: true,
    drop: (e, ui) => {
      e.stopPropagation();
      e.preventDefault();
      var iconId = ui.draggable.attr("id");
      var top, left;

      left = e.clientX + window.scrollX - $floorPlan.offset().left + "px";
      top = e.clientY + window.scrollY - $floorPlan.offset().top + "px";

      var dropInfo = { desk: iconId, top: top, left: left };
      //console.log(dropInfo);
      var $newDesk = FurnitureUtils.newDeskOnDrop(dropInfo);
      $newDesk.position({ within: $floorPlan });
      $newDesk.appendTo($floorPlan);

      $newDesk.uniqueId().data("desk").id = $newDesk.attr("id");
      makeDragRotateDelete($newDesk);
    }, //end drop func
  });
  $(".desk-wrapper", ".floorPlan").each(function () {
    makeDragRotateDelete($(this));
  });
  $(".rosterStudent").css("opacity", "0.4");
} //end edit Furniture

function doneEditFurniture() {
  var $desks = $(".desk-wrapper", ".floorPlan").draggable("destroy");
  $("furnitureIcon", "div.editTool-side").draggable("destroy");

  $floorPlan.droppable("destroy");
  $(".deskDeleter", ".floorPlan").off("click").css("display", "none");
  $(".desk", ".floorPlan").rotatable("destroy");
  var deskList = [];
  $desks.each(function () {
    deskList.push($(this).data("desk"));
  });
  $(".rosterStudent").css("opacity", "1.0");
  getRoutine().furniture = deskList;
}

function makeDragRotateDelete($desk) {
  //console.log($desk); console.log("left:" + Math.floor($desk.find('.desk').width()/2) + " and top:"  + Math.floor($desk.find('.desk).height()/2));
  let caLeft = Math.floor($desk.find(".desk").width() / 2);
  let caTop = Math.floor($desk.find(".desk").height() / 2);
  $desk.draggable({
    cursorAt: { left: caLeft, top: caTop },
    tolerance: "pointer",
    stop: function (e, ui) {
      var $this = $(this);
      var top, left;
      left = e.clientX + window.scrollX - caLeft - $floorPlan.offset().left;

      if (left < -10) {
        if ($desk.children().hasClass("singledesk")) {
          left = -1;
        } else {
          left = -8;
        }
      }
      if (left > 915) {
        if ($desk.children().hasClass("doubledesk")) {
          left = 876;
        } else {
          left = 915;
        }
      }
      top = e.clientY + window.scrollY - caTop - $floorPlan.offset().top;

      if (top < 3) {
        top = 4;
      }
      if (top > 680) {
        top = 675;
      }
      //console.log('drag stop of MakeDragRotate: top is ' + top + ' and left is ' + left);
      $this.css("top", top + "px");
      $this.css("left", left + "px");
      //$this.css('display', 'block');
      $this.data("desk").top = $this.css("top");
      $this.data("desk").left = $this.css("left");
    },
    start: function (e, ui) {
      var top, left;
      left = e.clientX + window.scrollX - $floorPlan.offset().left + "px";
      top = e.clientY + window.scrollY - $floorPlan.offset().top + "px";

      $(ui.helper).css("top", top).css("left", left);
    }, //end start funciton
  });
  $desk.find(".desk").rotatable({
    angle: $desk.data("desk").rotate,
    stop: function (e, ui) {
      $this = $(this);
      $this.closest(".desk-wrapper").data("desk").rotate = ui.angle.current;
    },
    rotate: function (e, ui) {
      var $ui = $(ui.element);
      var $counter = $ui.find("div.counterRotate");
      if ($counter != null && $counter.length > 0) {
        $counter.css("transform", "rotate(" + -ui.angle.current + "rad)");
      }
    },
  });
  $desk
    .find(".deskDeleter")
    .click(function () {
      deleteFurniture($(this).closest(".desk-wrapper"));
    })
    .css("display", "block");
} //done make rotate drag delete

function deleteFurniture($desk) {
  let routine = getRoutine();
  var $rosStu = $desk.find(".rosterStudent");
  if ($rosStu.length > 0) {
    $rosStu.each(function () {
      var $this = $(this);
      $this
        .appendTo('li[data-id="' + $this.attr("id") + '"]')
        .parent()
        .show();
      $this.find(".counterRotate").css("transform", "rotate(0.0rad)");
      $this.delay(300);
    });
  } //end if
  for (var i = 0; i < routine.furniture.length; i++) {
    if (routine.furniture[i].id == $desk.data("desk").id) {
      routine.furniture.splice(i, 1);
      break;
    }
  }
  $desk.removeData("desk");
  $desk.remove();
} //done delete furniture

function editStudent() {
  $(".rosterStudent").draggable({
    helper: "clone",
    appendTo: "body",
    start: function () {
      $(this).css("opacity", "0.3");
    },
    stop: function (e, ui) {
      $(e.target).css("opacity", "1");
    },
    drag: function (e, ui) {
      $(ui.helper).find(".counterRotate").css("transform", "rotate(0.0rad)");
    },
  });
  $("td >div.seat", ".floorPlan").droppable({
    accept: ".rosterStudent",
    greedy: true,
    hoverClass: "seat-over",
    drop: function (e, ui) {
      //console.log('on drop called');
      var $dropSeat = $(e.target);
      var $draggable = $(ui.draggable);
      var $dragParent = $draggable.parent();
      //remove student from desk
      if($dragParent.hasClass('seat')){
        var stuDesk = $dragParent.closest("div.desk-wrapper").data("desk");
        if ($dragParent.hasClass("pos1")) {
          stuDesk.seats[0].student = "";
        } else {
          stuDesk.seats[1].student = "";
        }
      }//end if
      var $rosStudent = $dropSeat.find(".rosterStudent");

      //if seat occuupied by $rosStudent  move it first
      if ($rosStudent != null && $rosStudent.length > 0) {
        //first check to see if drag parent is comming from side
        if ($dragParent.is("li")) {
          $rosStudent.animate(
            { left: "+=7em", opacity: 0 },
            500,
            "swing",
            function () {
              var $appendToMe = $(
                'li[data-id = "' + $rosStudent.attr("id") + '"]'
              );
              //console.log('appendToMe is: ');
              //console.log($appendToMe)
              $appendToMe.css("display", "block");
              $rosStudent.appendTo($appendToMe);
              $rosStudent
                .css({ opacity: "1", position: "relative", left: "0px" })
                .find(".counterRotate")
                .css({ transform: "rotate(0.0rad)" });
            }
          );
        } //end if
        //next check to see if drag student is coming from a seat then swap
        if ($dragParent.hasClass("seat")) {
          var $pWrapper = $dropSeat.closest("div.desk-wrapper");
          var $cloneWrapper = $('<div id="clone"></div>');
          $cloneWrapper
            .css({
              overFlow: "visible",
              width: "4em",
              height: "8em",
              position: "absolute",
              left: $pWrapper.css("left"),
              top: $pWrapper.css("top"),
            })
            .appendTo(".floorPlan");
          $rosStudent.appendTo($cloneWrapper);
          $rosStudent.find(".counterRotate").css("transform", "rotate(0.0rad)");
          $cloneWrapper.animate(
            {
              left:
                "+=" + ($dragParent.offset().left - $pWrapper.offset().left),
              top: "+=" + ($dragParent.offset().top - $pWrapper.offset().top),
            },
            350,
            "swing",
            function () {
              $rosStudent.appendTo($dragParent);
              $cloneWrapper.remove();
              var stuDesk = $dragParent
                .closest("div.desk-wrapper")
                .data("desk");
              //console.log('student desk of the swapped is: ');
              //console.log(stuDesk);
              if ($dragParent.hasClass("pos1")) {
                stuDesk.seats[0].student = $rosStudent.attr("id");
              } //end if
              else {
                stuDesk.seats[1].student = $rosStudent.attr("id");
              } //end else
              $rosStudent
                .find(".counterRotate")
                .css("transform", "rotate(" + -stuDesk.rotate + "rad)");
            }
          ); //end animate
        } //end if swapping
      } //end check to see if seat is occupied
      //now place the drop student in the target seat
      $draggable.appendTo($dropSeat);
      if ($dragParent.children().length < 1 && $dragParent.is("li")) {
        $dragParent.hide();
      }
      var stuDesk = $dropSeat.closest("div.desk-wrapper").data("desk");
      if ($dropSeat.hasClass("pos1")) {
        stuDesk.seats[0].student = $draggable.attr("id");
      } else {
        stuDesk.seats[1].student = $draggable.attr("id");
      }
      $draggable
        .find(".counterRotate")
        .css("transform", "rotate(" + -stuDesk.rotate + "rad)");
        console.log('student placed in desk');
        console.log(routineCopy.furniture);
    } //end drop
  }); //end droppable

  //make seated student deletable
  $(".rosterStudent", ".floorPlan").each(function () {
    const $rosterStudent = $(this);
      const $delBtn = $('<a>remove</a>' );
      $delBtn.addClass("studentDeleter");
      $delBtn.click(function () {
        //remove student from desk
        var $seat = $rosterStudent.closest("div.seat");
        var stuDesk = $seat.closest("div.desk-wrapper").data("desk");
        if ($seat.hasClass("pos1")) {
          stuDesk.seats[0].student = "";
        } else {
          stuDesk.seats[1].student = "";
        }
        //hide studentDeleter
        $delBtn.css("display", "none");
        $rosterStudent
        .appendTo('li[data-id="' + $rosterStudent.attr("id") + '"]')
        .parent()
        .show();
      $rosterStudent.find(".counterRotate").css("transform", "rotate(0.0rad)");
      });
      $delBtn.prependTo($rosterStudent.find(".studentHead > .counterRotate"))
      .css({width:'100%', backgroundColor:'red', color:'white',
           height:'1.5rem', textAlign:'center', display:'none'});
      $rosterStudent.hover( function(){$delBtn.css('display', 'block')}, 
                            function(){$delBtn.css('display', 'none')});
    });
} // end edit student

function doneEditStudent() {
  $(".rosterStudent",".floorPlan").draggable("destroy").find(".studentDeleter").remove();
  $("td >div.seat", ".floorPlan").droppable("destroy");
}
function sortStudentList(a, b) {
  //console.log('sort stuent list called')
  /*a and b are list items find student */
  if (sortByLastName) {
    if ($(a).find(".last").text() < $(b).find(".last").text()) return -1;
    if ($(a).find(".last").text() > $(b).find(".last").text()) return 1;
    return 0;
  } else {
    if ($(a).find(".first").text() < $(b).find(".first").text()) return -1;
    if ($(a).find(".first").text() > $(b).find(".first").text()) return 1;
    return 0;
  }
}
/// Begin group functions
function editGroup() {
  //call groupview to show current color
  groupView();


  $('body').on('edit-group-start', function(e, group){
    
    activeEditGroup = group;
    showEligibleGroupMemebers(group);
  });

  $('body').on('remove-member', function(e, member){
    removeMemberFromGroup(activeEditGroup.id, member);
  });



  //first check to see if there are any groups;
  var $emptyGroupPanel = $("div#empty-group-panel");
  var $activeGroupPanel = $("div#active-group-panel");
  var $editGroupList = $("#edit-group-list");
 
  //incase of population empty children from edit-group-list
  $editGroupList.children().remove();
  //if not show empty else activate  panel
  if (routineCopy.groups.length < 1) {
    $emptyGroupPanel.show();
    $activeGroupPanel.hide();
  } else {
    // hide empty group panel
    $emptyGroupPanel.hide();
    $activeGroupPanel.show();
    // first group is active group
    let groups = routineCopy.groups;
    for (var i = 0; i < groups.length; i++) {
      //create an li to add to the
      var group = groups[i];
     addGroupToEditList(group);
  }
 $('#group-add-btn').click(newGroup);

}
}

function addGroupToEditList(group){
  var $editGroupList = $("#edit-group-list");
  var $item = EditGroupItem.create(group);
  $item.data("data", group);
  $editGroupList.append($item);
  $("a.edit-group-item-btn").click(function () {
    $(this).closest("form").css("display", "block");
  });
}

function showGroupColorPicker(groupId) {
  let group = routineCopy.groups.find((g) => g.id == groupId);
  let formerColor = group.color;
  let $popoverBody = $('.popover-body');
  
  $popoverBody.empty();
  $popoverBody.html(colorpicker());
  $('.color-btn', $popoverBody).click(function(){
    let color = $(this).attr('title');
    group.color = color;
    let $group = $(`div#${group.id}.group-detail`);
    $group.find('.card-header').removeClass(formerColor).addClass(color);
    $group.parent().find('a.group-btn').removeClass(formerColor).addClass(color);
    for(member of group.members){
      $(`div#${member.memberId}.rosterStudent`).find('.studentBody > .counterRotate').removeClass(formerColor).addClass(color);
    }
    $('.popover').popover('hide');
  });
}

function cancelGroupColorPicker(el) {

}

function showConfirmGroupDelete(groupId) {
 
  $('.popover-header').text(`Delete group?`);
  $('.popover-body').html(`<div class="btn-group"><button class="btn btn-danger" onclick="deleteGroup(${groupId})")>Yes</button><button class="btn btn-secondary" onclick="cancelGroupDelete()">No</button></div>`);

}

function cancelGroupDelete() {
  $('.popover').popover('hide');
}



function delayEditGroup() { 
  setTimeout(function () {
    editGroup();
  }, 1000);
}

function hideOtherEditGroupTools() {
  $('.group-btn').css('display', 'none');
			$('div#group-edit-toolbar').css('height', '0px');
}

function showEligibleGroupMemebers(group) {
 $('.rosterStudent').filter(`[group="${group.id}"]`).addClass('selected-group-member');
  var $studentList = $(".rosterStudent").not(`[group="${group.id}"]`);
   $studentList.each((i ,s)=>{
    let $s = $(s);
     $s.addClass('eligible-group-member');
     $s.find('.studentBody > .counterRotate').append(`<a class="add-member-btn d-flex flew-row justify-content-center align-items-center" 
                                                      style="position: absolute; z-index: 100; left: -1rem; top: -1rem; color:green;
                                                      background-color: #fff; border-radius: 90%; border: 1px solid #000;" 
                                                      ><i class="material-icons">add_circle</i></a>`);
});
$floorPlan.selectable({ filter: '.eligible-group-member',
selected: function(event, ui){ 
  addMemberToGroup(ui.selected);
} });
}

function showOtherEditGroupTools() {
  $('.group-btn').css('display', 'block');
      $('div#group-edit-toolbar').css('height', 'auto');
}

function newGroup(){
  if(!allGroupsValid()){
    toastr.error('Please make sure all groups have members before adding a new group');
    return;
  }
  let group = {};
  group.title = 'New Group';
  group.description = 'Adding a group to the routine';
  group.color = determinGroupColor();
  group.icon = 'fa-users';
  group.members = [];
  group.id =  - Math.floor(new Date().valueOf() );

  routineCopy.groups.push(group);
 addGroupToEditList(group);
}

function allGroupsValid(){
  if(routineCopy.groups.length == 0){console.log('length less than one'); return true;}

  for(let i = 0; i < routineCopy.groups.length; i++){
    let group = routineCopy.groups[i];
    if(group.members.length < 1 ){
      return false;
    }
  }
  return true;
}

function addGroup(groupInfo){

}

function deleteGroup(groupId){

  doneGroupView();
  doneEditGroup();
 
  for(var g of routineCopy.groups){
    if(g.id == groupId){

      if(g.members.length > 0){
        for(m of g.members){
          removeMemberFromGroup(groupId, m);
        }
      }
      routineCopy.groups.splice(routineCopy.groups.indexOf(g), 1);
      break;
    }
  }//end for
  //remove group from edit list
  showOtherEditGroupTools();
  let $group = $(`div#${groupId}`);
  endGroupChanges($group);
  $group.parent().remove();
  $('.popover').popover('hide');
  $('.rosterStudent').removeClass('eligible-group-member');
 editGroup();
 console.log(routineCopy.groups);
}

function changeGroupColor(group, color){}

function changeGroupIcon(group, icon){}

function addMemberToGroup(el){
  let $student = $(el);
  //may not be a member of a group
  let formerGroupId = $student.attr('group');
  let student = $student.data('student');
  if(formerGroupId){
    let member = { memberId: `${student.id}`};
    removeMemberFromGroup(formerGroupId, member);
  }
  
  addMemberToUiGroup({memberId: `${student.id}`});
  //remove from eligible group members
  $student.find('.add-member-btn').remove();
  $student.removeClass('eligible-group-member ui-selected ui-selectee');
  //add to group members
  $student.addClass('selected-group-member');
  $student.find('.studentBody > .counterRotate').addClass(`${activeEditGroup.color}`);
  $student.attr('group', activeEditGroup.id);
}
   
function addMemberToUiGroup(member){
  activeEditGroup.members.push(member);
  let $member = MemberItem.create(member);
  $(`div#${activeEditGroup.id}.group-detail`).find("ul.list-group").append($member);
}

function removeMemberFromGroup(groupId, member){
  console.log('remove member from group called');
  let group = routineCopy.groups.filter(g=>g.id == groupId)[0];
  if(group){
    let index = group.members.findIndex(m => m.memberId == member.memberId);
      if(index > -1){
      console.log('index is greater than -1 and member has id: ' + member.memberId);
      group.members.splice(index, 1);
      $student = $(`div#${member.memberId}.rosterStudent`);
      let $studentBody = $student.find('.studentBody > .counterRotate')
      $studentBody.removeClass(`${routineCopy.groups.filter(g=>g.id == groupId)[0].color}`);
      $studentBody.append(`<a class="add-member-btn d-flex flew-row justify-content-center align-items-center" 
      style="position: absolute; z-index: 100; left: -1rem; top: -1rem; color:green;
      background-color: #fff; border-radius: 90%; border: 1px solid #000;" 
      ><i class="material-icons">add_circle</i></a>`);
      $student.removeClass('selected-group-member');
      $student.addClass('eligible-group-member ui-selected ui-selectee');
      drawMembersGroup(group);
                           }

  }
}


function drawMembersGroup(group){
 let $group = $(`div#${group.id}.group-detail`);
  $group.find("ul.list-group").empty();
  for(let member of group.members){
    let $member = MemberItem.create(member);
    $group.find("ul.list-group").append($member);
  }
}

function saveGroupChanges(group){
  /*the group should be updated the curRoutine*/
  for(var g of routineCopy.groups){
    if(g.id == group.id){
      g = group;

      $(`a#${g.id}-btn > span`).text(g.title);
      break;
    }
  }
  
}

function cancelGroupChanges(){
  console.log('cancel group changes called');
  console.log(activeEditGroup);
  drawMembersGroup(activeEditGroup);
} 


function endGroupChanges($group){
  //update title of button
  $group.find(".card").first().css("display", "none");
  //called from main.js
  activeEditGroup = null;
    let $studentList = $(".rosterStudent");
    $studentList.find('.add-member-btn').remove();
    $studentList.removeClass('selected-group-member');

    $floorPlan.selectable('destroy');
  showOtherEditGroupTools();
}

function determinGroupColor(){
  let colors = ['red', 'blue', 'green', 'yellow darken-2', 'orange', 'purple', 'pink', 'brown'];
  let groupColors = getRoutine().groups.map(g=>g.color);
  let availableColors = colors.filter(c=>!groupColors.includes(c));
  if( availableColors[0] === undefined){
    return 'gray';
}else{
  return availableColors[0];
}
}

function doneEditGroup() {}
/// End group functions


/** End group functions */
function editStations() {}

function doneEditStations() {}

function editProc() {
  editState = "proc";
}

function doneEditProc() {}

function editInfo() {
  editState = "info";
}

function doneEditInfo() {}
//end editing functions ------//////

//View functions ---------//////////

function swtichView(view) {
  /** end current view state */
  if (view.includes("btn")) {
    //change btn id to enum vales
    view = viewStateById(view);
  }
  switch (viewState) {
    case "student":
      doneStudentView();
      break;
    case "groups":
      doneGroupView();
      break;
    case "stations":
      doneStationView();
      break;
    case "proc":
      doneProcView();
      break;
    case "info":
      doneInfoView();
      break;
  }
  /** set new view as curr view and update */
  // hide the tools set then show the active one.
  $(".side-tool").hide();
  viewState = view;
  switch (viewState) {
    case "groups":
      groupView();
      $("#groupListWrapper", "div.sideTools").show();
      break;
    case "stations":
      stationView();
      $("#stationListWrapper", "div.sideTools").show();
      break;
    case "proc":
      procView();
      $("#procListWrapper", "div.sideTools").show();
      break;
    case "info":
      infoView();
      $("#infoListWrapper", "div.sideTools").show();
      break;
    default:
      studentView();
      $("#studentListWrapper", "div.sideTools").show();
    /** TODO: figure out how to handle check status
		 * case 'assignment':break;
		case 'attendance':break;
		case 'awards':break;*/
  }
}

function viewStateById(idValue) {
  var view = "";
  switch (idValue) {
    case "groups-view-btn":
      view = "groups";
      break;
    case "stations-view-btn":
      view = "stations";
      break;
    case "proc-view-btn":
      view = "proc";
      break;
    case "info-view-btn":
      view = "info";
      break;
    default:
      view = "student";
  }
  return view;
}

function studentView() {
  //student borders should reflect the groups they belong to
  for(var g of getRoutine().groups){
   $(`div.rosterStudent[group="${g.id}"]`, $floorPlan).find('.studentBody > .counterRotate').css({ border: `1px solid ${g.color}` });
 
  }
  /*TODO:add click functions to students
	for showing studentActionPanel
*/
}
function doneStudentView() {
  //console.log('done student called')
  //give border back to white color and 3px
  $(".studentBody > .counterRotate").css({ border: "3px solid White" });
}

/*Group Function -- Start Here ------ */
function updateGroupPanels() {
  let routine = getRoutine();
  //console.log('update group Panels called');
  if (routine.groups != null && routine.groups.length > 0) {
    for (var i = 0; i < routine.groups.length; i++) {
      var $group = StudentGroupPanel.create(routine.groups[i]);
      //append to groupList
      $group.appendTo($groupList).wrap('<li class="list-group-item"></li>');
    }
  } else {
  }
}

function groupView() {
  //add color to students by group membership
  //clone student list
  var students = course.students.slice();
  //check each group and pop matches
  for (let g of getRoutine().groups) {
    for (let m of g.members) {
      for (let s = 0; s < students.length; s++) {
        if (m.memberId == students[s].id) {
         $s =  $(`div#${students[s].id}.rosterStudent`);
          $s.find( `.studentBody > .counterRotate`).addClass(g.color);
          students.splice(s, 1);
          //console.log(students);
          break;
        } //end if
      } //end for students
    }
  }
}

function doneGroupView() {
  //get rid of color style
  var students = course.students.slice();
  //check each group and pop matches
  for (let g of getRoutine().groups) {
    for (let m of g.members) {
      for (let s = 0; s < students.length; s++) {
        if (m.memberId == students[s].id) {
          $(
            `div#${students[s].id}.rosterStudent > .studentBody > .counterRotate`
          ).removeClass(g.color);
          students.splice(s, 1);
          //	console.log(students);
          break;
        } //end if
      } //end for students
    }

    //get rid of icons and roles

    //remove hover from group panels
  }
}

/* -- Group Functions End Here -----*/

/*--Procedure Functions Start ---*/

function updateProceduresPanels() {
  let routine = getRoutine();
  //console.log('update procedures panel called');
  if (routine.procedures != null && routine.procedures.length > 0) {
    for (var i = 0; i < routine.procedures.length; i++) {
      var $proc = ProcedurePanel.create(routine.procedures[i]);
      $proc.appendTo($procList).wrap('<li class="collection-item"></li>');
    } //end for
  } //end if
}
function procView() {}
function doneProcView() {}

/* --- Procedure Functions End ---- */

function stationView() {
  //hide all students
  $(".rosterStudent").hide();
  //make station layer visible
  $stationPlan.show();
  //draw stations
  drawStations();
}
function doneStationView() {}
function drawStations() {
  let routine = getRoutine();
  //get the stations from curRoutine
  let svg = SVG().addTo(".stationPlan");
  svg.size("100%", "100%");
  for (var s of routine.stations) {
    var shape;
    switch (s.shape) {
      case "rect":
        shape = svg.rect(s.w, s.h);
        break;
      case "circle":
        shape = svg.circle(s.h);
        break;
      case "polyLine":
        break;
    }
    shape.move(s.x, s.y).fill("rgba(255,255,255,0.3)").stroke(s.color);
  }
}

/**
 * This updates the rounds panel
 * in the side tools.
 */
function updateStationPanel() {}
function startRounds() {}
function pauseRounds() {}
function endRounds() {}
function infoView() {}
function doneInfoView() {}

//End View function ----------- /////

//Check functions hw & attendance //////
function hwCheck() {}
function doneHwCheck() {}
function submitHwCheck() {}
function cancelHwCheck() {}
function attendanceCheck() {}
function doneAttendanceCheck() {}
function submitAttendance() {}
function cancelAttendance() {}
//end Check functions /////////////////

//ajax functions - routine
function saveRoutine(routine) {}
function cancelSaveRoutine() {}
function deleteRoutine(routineId) {}
function cancelDeleteRoutine() {}
function printRoutine() {}
function newRoutine() {}
function copyRoutine() {}  

///function with Courses
$('div.card.course').on('click',
  function(){ var id = $(this).attr('id'); 
  google.run.script.withSuccessHandler(start).startCourse(id);
alert('click on ' + id) }
);

function start(data){
  console.log(data);
}

////End main.js//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//seatingchart.js             ///////////////////////////////////////////////////////////////////////////////
/**
 * roster student panel
 */
function RosterStudentPanel() {}
/*html only return inner html so must set a wrapper*/
RosterStudentPanel.template = `<div class="rosterStudent"
id="">
<div class="studentHead">
<div class="counterRotate">
<img class="studentImg z-depth-2 circle responsive-img"
src=""
style="width: 100%; height: 100%;">
</div>
</div>
<div class="studentBody">
<div class="counterRotate">
<section class="studentInfoTable">
<div class="studentName">
<span class="first"></span><br>
<span class="last"></span>
</div>
</section>
</div>
</div>
</div>`;
RosterStudentPanel.createPanel = function (stu) {
  this.$rosStudentPanel = $(RosterStudentPanel.template);
  this.$rosStudentPanel.data("student", stu);
  this.$rosStudentPanel.find(".first").text(stu.firstName);
  this.$rosStudentPanel.find(".last").text(stu.lastName);
  this.$rosStudentPanel.find("img.studentImg").attr("src", stu.pic);
  this.$rosStudentPanel.attr("id", stu.id);
  return this.$rosStudentPanel;
};

/*end roster student panel */

/*Group Panel */
function StudentGroupPanel() {}
StudentGroupPanel.template = `
 <div class="card group">
	 <div class="card-title">
	 <div class="row">
			 
 					<img class="groupIcon" style="position:relative; left:5px"/>
					 <i class="badge white-text" 
					 style="position:absolute; right:-5px; top:-5px; font-size:0.5em;border-radius:100%; padding:0.15rem 0.45rem"></i>
			 </div><!--end row -->
			 <div class="groupTitle truncate white-text" style="margin-bottom:5px"></div>
	 </div><!-- end card title -->
	 <div class="card-content white" style="margin:2px">
			 <label class="groupDescript" />
			 <br/><label class="groupCriteria"/>
			 <tabel class="groupMemeber">
				 <tbody class="groupMemeberContent"></tbody>
				 </tbody>
			 </tabel>
	 </div>
 </div>
 `;

StudentGroupPanel.create = function (group) {
  this.$group = $(StudentGroupPanel.template);
  //set the card id to gid
  this.$group.attr("id", group.gid);
  //set card color
  this.$group.addClass(group.color);
  //find the img tag and set the src if exist
  if (group.icon != null && group.icon != "") {
    this.$group.find("img").attr("src", group.icon);
  } else {
    this.$group.find("img").hide();
  }

  this.$group.find(".groupTitle").text(group.title);
  this.$group.find(".badge").addClass(group.color + " darken-3");
  this.$group.find(".badge").text(group.members.length);
  if (group.criteria != null && group.criteria != "") {
    this.$group.find("label.groupCriteria").text(group.criteria);
  } else {
    this.$group.find("label.groupCriteria").hide();
  }

  if (group.description != null && group.description != "") {
    this.$group.find("label.groupDescript").text(group.description);
  } else {
    this.$group.find("label.groupDescript").hide();
  }

  if (group.members.length > 0) {
    for (var i = 0; i < group.members.length; i++) {
      var $member = $(MemberItem.create(group.members[i]));
      $member.appendTo(this.$group.find("tbody.groupMemberContent"));
    }
  }

  return this.$group;
};
/*--- End Group Panel --- */
/* Edit Group Item */

function EditGroupItem() {}

EditGroupItem.create = function (group) { 
  const template = `<div class="group-wrapper"  style="position:relative; width:100%;">
  <a class='btn btn-block group-btn ' id='' >
    <span class="group-title">Test Group</span>
  </a>
  <div class="card group-detail" id="group-id" style="width:99%; position:absolute; z-index:1; display:none" >
  <div class="card-header" style="position:relative" class="blue">
     <div style="position:absolute; right:5px; top:5px"><a class="group-edit-more-btn"  data-toggle="popover" data-html="true"
                                                   data-content="<a class='group-color-btn btn btn-sm btn-block btn-outline-primary d-flex flex-row align-content-center justify-content-between'
                                                   onclick='showGroupColorPicker(${group.id})' ><span class='mr-1 px-16' >Color</span> <i class='material-icons' >palette</i></a>
                                                                 <a class='delete-group-btn btn btn-sm btn-outline-danger d-flex flex-row align-content-center justify-content-center my-1'
                                                                 onclick='showConfirmGroupDelete(${group.id})'><span class='mr-1 px-16' >Remove</span><i class='material-icons'>delete</i></a>" >
                                                                 <i class="material-icons text-white">more_vert</i></a></div>
      <div class="group-icon mb-1" style="width:50px; height:50px; 
                       margin: 0 auto;background-color:white; border:1px solid dimgray;
                       border-radius:10%  "></div>
      <input class="group-title" placehoder="Group Title" style="width:100%"/>
   
  </div>
    <div class="card-body white" >
    <div class="group-descript-panel">
      <textarea class="group-descript"  style="width:100%" placeholder="Group Description"></textarea>
    </div>
    <div class="group-members">
      <label>Members:</label>
      <div class="member-list">
        <ul class="list-group list-group-flush"></ul>
      </div>
      <div class="empty-member-list">No members yet</div>
    </div>
    </div>
    <div class="card-footer d-flex justify-content-center">
    <a class="btn-canel-group-changes py-1 text-danger"><i class="material-icons">close</i></a>
     
        <a class="btn-confirm-group-change py-1 text-success mx-3"><i class="material-icons">done</i></a>
    </div>
 </div>
 </div>`;
  var $group = $(template);
  $group.find("div.card-header").addClass(group.color + " white-text");
  $group.find(".group-descript").text(group.description);
  $group.find(".group-title").text(group.title);
  $group.find("input").val(group.title);
  $group.find(".card").first().attr("id", group.id);
  $group.find(".group-edit-more-btn").first().popover({sanitize: false});
  $group
    .find(".group-btn")
    .first()
    .attr("id", group.id + "-btn")
    .addClass(group.color + " white-text mb-2")
    .click(function () {
      $group.find(".card").first().css("display", "block");
      //called from main.js
      hideOtherEditGroupTools();
      var groupInfo = Object.assign({}, group);
    $(this).trigger("edit-group-start", groupInfo);
    });
  $group
    .find(".btn-confirm-group-change")
    .first()
    .click(function () {
      //called from main.js
      group.title = $group.find("input").val();
      group.description = $group.find(".group-descript").val();
     saveGroupChanges(group);
     endGroupChanges($group);
    });
  $group.find(".btn-canel-group-changes").first().click(function () {
    cancelGroupChanges();
    endGroupChanges($group);
  });
    
	if(group.members){
		$group.find('.empty-member-list').css('display', 'none');
		$group.find('div.member-list').css('display', 'block');

	for(var m of group.members){
		var $member = $(MemberItem.create(m));
		
		$group.find("ul.list-group").append($member);
	}
}

  return $group;
};

/* End Edit Group Item */
/* Member Tabel Item */
function MemberItem() {}
MemberItem.template = `<li class="member list-group-item"  style="position:relative; overflow:hidden; height:54px">
				<div class="d-flex flex-row mb-1">
				<img class="left group-mem-pic" style="height:35px; position:relative; left:-10px"/>
				 <div style="padding-right:1rem; font-size: 0.75rem">
				 	<span class="first trancate"></span>
				 	<span class="last truncate"></span>
				 </div>
				 <div class="d-flex flex-column" style="position:absolute; z-index:2; right:0px; top:0px">
				 	<div class="material-icons remove-member-btn text-danger" style="font-size:1.2rem">cancel</div>
				 </div>
				</div>
				 </li>`;
MemberItem.create = function (member) {
  //checkt to see if membership is valid
  //ie that student is still enrolled
  var match = false;
  var student;
  for (var i = 0; i < course.students.length; i++) {
    if (course.students[i].id == member.memberId) {
      match = true;
      student = course.students[i];
      break;
    } //end if
  } //end for
  if (match) {
     let $member = $(MemberItem.template);
     $member.attr("memberId", member.memberId);
     $member.find("img").attr("src", student.pic);
     $member.find(".first").text(student.firstName);
     $member.find(".last").text(student.lastName);
      $member.find(".remove-member-btn").click(function () {
        $(this).trigger("remove-member", member);
      });

    return  $member;
  } //end if match
  else {
   $($floorPlan).trigger("remove-member", member.memberId);
    return;
  }
};


   
/* Station Panel*/
function StationPanel() {}
/**
 * Template for Round Panel side tool
 * must set button data-target , aria-controls and id in sibiling div , aria-labelledby
 * span.round-title,
 */
StationPanel.template = `
<div class="card">
      <div class="card-header" >
          <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="" aria-expanded="true" aria-controls="">
           <span class="round-title"></span>
          </button>
      </div>
  
      <div id="" class="collapse show" aria-labelledby="" data-parent="#roundList">
        <div class="card-body">
         <section class="station-group-list"></section>
        </div>
      </div>
    </div>
`;
StationPanel.create = function () {};

function StationGroupPanel() {}
StationGroupPanel.template = `
	<li class="list-group-item">
		<button class="btn">
			
		</button>
	</li>
`;
StationGroupPanel.create = function () {};

function RoundPanel() {}
RoundPanel.template = `
	<div><button></button><div><ul class="list-group"></ul></div>
`;
RoundPanel.create = function () {};

function RoundGroupItemPanel() {}
RoundGroupItemPanel.template = `
	<li class="list-group-item">
		<button class="btn round-group-item-btn">
			<span class="group-name"></span>
		</button>
	</li>
`;
RoundGroupItemPanel.create = function () {};

/*Procedure Panel -----*/
function ProcedurePanel() {}
ProcedurePanel.template = `<div class="card">
<div class="card-action">
	<label class="left check"> 
		<input type="checkbox" css="display:none"/>
	</label>
	<label class="order" style="position:absolute;right:5px"/>
</div>
<div class="card-content"></div>
</div>`;

ProcedurePanel.create = function (procedure) {
  //console.log("ProcedurePanel recieve as Param: ");
  //console.log(procedure);
   $procPanel = $(ProcedurePanel.template);
   $procPanel.find("label.order").text(procedure.order);
   $procPanel.find("div.card-content").html(procedure.direction);
  //console.log("returning object: ");
  //console.log( $procPanel);
  return  $procPanel;
};

/*ProcedurePanel End-----*/
/*FurniturePanel - used to create desk and other furniture */
function FurnitureUtils() {}
FurnitureUtils.singleDeskTemplate = `<div class="desk-wrapper">
											<div class='desk singledesk'>
											<span class='deskDeleter material-icons'>cancel</span>
											<table style='width:100%;height:100%'><tr>
												<td><div class='seat pos1'></div></td>
											</tr></table></div></div>`;
FurnitureUtils.doubleDeskTemplate = `<div class="desk-wrapper">
											<div class='desk doubledesk'>
											<span class='deskDeleter material-icons'>cancel</span>
											<table style='width:100%;height:100%'><tr>
												<td>
												<div class='seat pos1'></div></td>
												<td><div class='seat pos2'></div></td>
											</tr></table></div></div>`;
FurnitureUtils.drawDesk = function (desk) {
  var $furniture;
  switch (desk.kind) {
    case "single":
      $furniture = $(FurnitureUtils.singleDeskTemplate);
      break;
    default:
      $furniture = $(FurnitureUtils.doubleDeskTemplate);
  } //end switch

  $furniture.css({ top: desk.top, left: desk.left });
  $furniture.find(".desk").css({ transform: "rotate(" + desk.rotate + "rad)" });
  $furniture.data("desk", desk);
  return $furniture;
}; //end draw  desk;

FurnitureUtils.newDeskOnDrop = function (dropInfo) {
  var $furniture;
  var desk = new Desk();
  switch (dropInfo.desk) {
    case "singleDeskIcon":
      desk.kind = "single";
      $furniture = $(FurnitureUtils.singleDeskTemplate);
      desk.seats.push(new Seat());
      break;
    default:
      $furniture = $(FurnitureUtils.doubleDeskTemplate);
      desk.seats.push(new Seat());
      desk.seats.push(new Seat(2));
  }
  desk.top = dropInfo.top;
  desk.left = dropInfo.left;
  $furniture.data("desk", desk);
  $furniture.css({ top: dropInfo.top, left: dropInfo.left });
  return $furniture;
};
/*end furniture utils */
/*Desk instance*/
function Desk() {
  //this id  is solely used on the client*/
  this.id;
  this.top = "0px";
  this.left = "0px";
  this.rotate = 0.0;
  this.transform = "";
  this.kind = "double";
  this.type = "desk";
  this.bgColor = "";
  this.borderColor = "";
  this.seats = [];
} //end desk

/*seat instance*/
function Seat(posNum) {
  if (posNum == null) {
    posNum = 1;
  }
  this.pos = posNum;
  this.student = "";
}

function Course(){};
Course.template = `
  <div class="card course col-4 ma-1" id="">
  <div class="card-header">
    <div class="card-title"></div>
  </div>
  <div class="card-body">   
  </div>
  <footer class="blockquote-footer"><cite>Created on: <span class="created-on"></span></cite></footer>
</div>
  `;
Course.create = function(course){
  $course = $(Course.template);
  $course.find('.course').attr('id', course.id);
  $course.find('.course-title').text(course.name);
  $courseBody = $course.find('card-body');
  if(course.section){$courseBody.append('<div>Section: ' + course.section + '</div>')}
  if(course.description){$courseBody.append('<div>Description: ' + course.description + '</div>')}
  if(course.room){$courseBody.append('<div>Room: ' + course.room + '</div>')}
  $course.find('.created-on').append(course.creationTime);

}

//////////////////////////End seatingchart.js ////////////////////////////////////////////////////////////////////////////////////////////////

//  client.js ////////////////
   //init course list modal
	$courseModal = $('#courseList-modal');
    $courseModal.modal(
		{
			show:false
		}
	);
	$courseModal.on('shown.bs.modal', ()=>{
		$('div.card.course').on('click',
  	function(){ var id = $(this).attr('id'); 
  	google.script.run.withSuccessHandler(start).startCourse(id);
	}
	);
	});

	$courseModal.on('hidden.bs.modal',()=>{
		$('div.card.course').off('click');
	});

  function start(data){
    console.log(data)
  }
		google.script.run
    .withSuccessHandler( initPage)
    .withFailureHandler(initError)
    .getUserProfile();
		 

		function initPage(data){
			Object.assign(userInfo, data.userInfo);
			courseList.length = 0;
			for(course of data.courseList.courses){
				courseList.push(course);
			}

			console.log(courseList)
			showCourses();
    }
		function initError(data){

		}
		
		function showCourses(){
			let $coursePanel = $('#courseList-panel');
				$coursePanel.empty();
			for( course of courseList){
        let row = $('<div class="row">');
				courseCard = Course(course);
        row.append(courseCard);
				$coursePanel.append(row);
			}
			$('#courseList-modal').modal('show');

		}



