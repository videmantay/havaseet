

//check for touch
function mobileCheck() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
/**
 * roster student panel
 */
function RosterStudentPanel(){};
	/*html only return inner html so must set a wrapper*/
RosterStudentPanel.template =`<div class="rosterStudent"
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
 RosterStudentPanel.createPanel = function(stu){
	 this.$rosStudentPanel = $(RosterStudentPanel.template);
	 this.$rosStudentPanel.data('student', stu);
	this.$rosStudentPanel.find('.first').text(stu.name_first);
	this.$rosStudentPanel.find('.last').text(stu.name_last);
	this.$rosStudentPanel.find('img.studentImg').attr('src', stu.picture_url);
	this.$rosStudentPanel.attr('id',stu.id);
	return this.$rosStudentPanel;
 };

 /*end roster student panel */

 /*Group Panel */
 function StudentGroupPanel(){};
 StudentGroupPanel.template =`
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

 StudentGroupPanel.create= function(group){
	this.$group = $(StudentGroupPanel.template);
	//set the card id to gid
	this.$group.attr('id', group.gid);
	//set card color
	this.$group.addClass(group.color);
	//find the img tag and set the src if exist
	if(group.icon != null && group.icon != ''){
		this.$group.find('img').attr('src', group.icon);
	}else{
		this.$group.find('img').hide();
	}

	this.$group.find('.groupTitle').text(group.title);
	this.$group.find('.badge').addClass(group.color + " darken-3");
	this.$group.find('.badge').text(group.members.length);
	if(group.criteria != null && group.criteria != ''){
		this.$group.find('label.groupCriteria').text(group.criteria);
	}else{
		this.$group.find('label.groupCriteria').hide();
	}

	if(group.description != null && group.description != ''){
		this.$group.find('label.groupDescript').text(group.description);
	}else{
		this.$group.find('label.groupDescript').hide();
	}

	if(group.members.length > 0){
		for(var i = 0; i < group.members.length; i++){
			var $member = MemberItem.create(group.members[i]);
			$member.appendTo(this.$group.find('tbody.groupMemberContent'));
		}
	}
	
	return this.$group;
 };
/*--- End Group Panel --- */
 /* Edit Group Item */
 
 function EditGroupItem(){};
 EditGroupItem.template = `
 <li class="group-edit-item" style="position:relative" >
	 <div class="collapsible-header group-title">
	 	<span class="title">
	 	</div><!-- End title Div -->
	 <div class="collapsible-body group-descript" style="padding:0px !important">
	 	<ul class="collection edit-group-member-list" style="height:100px; overflow-y:scroll;
	 																min-width:100% !important;">
	 	</ul>
	 	<div class="empty-group-members" style="display:none;margin:0.5rem">Drag students here to add members</div>
	 	<a class="edit-group-item-btn btn-flat btn-small" style="position:absolute;right:5px; bottom:3px"><i class="material-icons">edit</i></a>
	 <form  class="group-form white" style="position:absolute; z-index:2; height:100%; width:100%;top:0px;left:0px; display:none">
	 <div class="input-field" style="margin:0px !important;!important;">
	 	<input type="text" style="padding:0.15em" />
	 </div>
	 	<textarea class="materialize-textarea" style="height:75px;max-height:75px;overflow-y:scroll"></textarea>
	 	 <div>
	 	<a class="btn-flat red-text left wave-light"> <i class="material-icons cancel-group-edit">cancel</i></a>
	 	<a class="btn-flat green-text right wave-light"><i class="material-icons done-group-edit">done</i></a>
	 </div>
	 </form>
	 </div><!-- End body div -->
	 
</li> `;
 
 EditGroupItem.create = function(group){
	 this.$group = $(EditGroupItem.template);
	 this.$group.find('div.collapsible-header').addClass(group.color +' white-text');
	 this.$group.find('a.btn-floating').addClass(group.color);
	 this.$group.find('span.title').text(group.title);
	 this.$group.find('span.descript').text(group.description);
	 this.$group.find('input').addClass(group.color).attr('placeholder',group.title);
	 this.$group.find('textarea').attr('placeholder',group.description);
	 return this.$group;
 };
 
 /* End Edit Group Item */
/* Member Tabel Item */
 function MemberItem(){};
MemberItem.template = 
			 `<li class="collection-item group-mem" data-member='' style="position:relative; overflow:hidden; height:75px">
				 <img class="left group-mem-pic" style="height:55px; position:relative; left:-10px"/>
				 <div style="padding-right:1rem">
				 <label class="first trancate"></label>
				 <label class="last truncate"></label>
				 </div>
				 <div class="material-icons" style="position:absolute; z-index:2; right:0px; top:0px">cancel</div>
			   </li>`;
MemberItem.create = function(member){
	//checkt to see if membership is valid
	//ie that student is still enrolled
var match = false;
var student;
for(var i = 0 ; i < students.enrollment.length; i++){
if(students.enrollment[i].id == member.id){
	match = true;
	student = students.enrollment[i];
	break;
}//end if
}//end for
if(match){
this.$member = $(MemberItem.template);
this.$member.find('div.group-mem').attr('data-member', member.gid);

for(var i = 0; i < member.role.length; i++){
  var $roleItem = RoleItem.create(member.role[i]);
  $roleItem.appendTo(this.$member.find('div.group-role'));
}//end for role

this.$member.find('img').attr('src', student.picture_url);
this.$member.find('label.first').text(student.name_first);
this.$member.find('label.last').text(student.name_last);

return this.$member;

}//end if match
else{
	//TODO:add notification mechanism listing unenrolled students
	return;
}

}


/*end memeber table tiem*/
/* Role item*/
function RoleItem(){};
RoleItem.template = `<div class="row">
<div class="col xs2"><img class="role-icon"/></div>
<div class="col xs10"><label class="role-name"/></div>
</div>`;

RoleItem.create= function(role){
	console.log("RoleItem.create:  here is the object");
	console.log(role);
	this.$roleItem = $(RoleItem.template);
	//set pic if there is one
	if(role.icon != null && role.icon !=''){
		this.$roleItem.find('img').attr("src",role.icon);
	}else{
		this.$roleItem.find('img').hide();
	}///end else
	this.$roleItem.find('label.role-name').css('color',role.color).text(role.title);
	//TODO: do something with role description
	console.log("RoleItem.create: return this object");
	console.log(this.$roleItem);
	return this.$roleItem;
};
/*end role item*/
/*Procedure Panel -----*/
function ProcedurePanel(){};
ProcedurePanel.template = `<div class="card">
<div class="card-action">
	<label class="left check"> 
		<input type="checkbox" css="display:none"/>
	</label>
	<label class="order" style="position:absolute;right:5px"/>
</div>
<div class="card-content"></div>
</div>`;

ProcedurePanel.create = function(procedure){
	console.log("ProcedurePanel recieve as Param: ");
	console.log(procedure);
	this.$procPanel = $(ProcedurePanel.template);
	this.$procPanel.find('label.order').text(procedure.order);
	this.$procPanel.find('div.card-content').html(procedure.direction);
	console.log("returning object: ");
	console.log(this.$procPanel);
	return this.$procPanel;

};

/*ProcedurePanel End-----*/
/*FurniturePanel - used to create desk and other furniture */
function FurnitureUtils(){};
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
	FurnitureUtils.drawDesk = function(desk){
	var $furniture;
	switch(desk.kind){
		case 'single': $furniture = $(FurnitureUtils.singleDeskTemplate);break;
		default:$furniture =  $(FurnitureUtils.doubleDeskTemplate);
	}//end switch

	$furniture.css({top:desk.top, left:desk.left});
	$furniture.find('.desk').css({transform:'rotate('+ desk.rotate +'rad)'});
	$furniture.data('desk',desk);
	return $furniture;
};//end draw  desk;

  FurnitureUtils.newDeskOnDrop = function(dropInfo){
	  var $furniture;
	var desk = new Desk();
	switch(dropInfo.desk){
		case'singleDeskIcon':desk.kind = 'single'; 
			$furniture = $(FurnitureUtils.singleDeskTemplate);
			desk.seats.push(new Seat());
			break;
		default:$furniture =  $(FurnitureUtils.doubleDeskTemplate);
		desk.seats.push(new Seat());
		desk.seats.push(new Seat(2));
	}
	desk.top = dropInfo.top;
	desk.left = dropInfo.left;
	$furniture.data('desk',desk);
	$furniture.css({top:dropInfo.top, left:dropInfo.left});
	return $furniture;
  }
/*end furniture utils */
/*Desk instance*/
function Desk(){
	//this id  is solely used on the client*/
	this.id;
	this.top = "0px";
	this.left="0px";
	this.rotate = 0.0;
	this.transform = '';
	this.kind = 'double';
	this.type = "desk";
	this.bgColor = '';
	this.borderColor = '';
	this.seats = [];
}//end desk
/*seat instance*/
function Seat(posNum){
	if(posNum == null){ posNum =1}
	this.pos = posNum;
	this.student = '';
}


