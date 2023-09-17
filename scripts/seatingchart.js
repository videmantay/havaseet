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

function Course(course){
  return `
  <div class="card course" id="${course.id}">
  <div class="card-header">
    <div class="card-title">${course.name}</div>
  </div>
  <div class="card-body">
      ${course.section ? `<div>Section: ${course.section}</div>`: ''}
      ${course.description ? `<div>Description: ${course.description}</div>`: ''}
      ${course.room ? `<div> Room: ${course.room}</div>`: ''}
      <footer class="blockquote-footer"><cite>Created on: ${course.creationTime}</cite></footer>
  </div>
</div>
  `;
}
