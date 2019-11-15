/*list of all 'global variable */
var $floorPlan = $("div.floorPlan");
var $homeTools =$('div.homeToolbar');
var $homeToolSide=$('div.homeTool-side')
var $editTools = $('div.editToolbar');
var $editToolSide = $('div.editTool-side');
var $editToolCollapsible = $('div.editTool-side > ul.collapsible');
var $sideTools = $('div.sideTools');
var $studentList = $('ul.scStudentList');
var $groupList = $('ul.groupList');
var $procList = $('ul.procList');
var state = 'home';//home, edit
var isEditing = false;//replace state
var editState = 'furniture';//posible editState: furniture,student,group,proc,info,station
var viewState = 'student';//possible view: student, group, proc,station,info
var oldData;
var sortByLastName = false;
//page init like resize 
/* $(window).resize(function(){
	console.log('window was resize');
	if(window.clientWidth < 1160){
		showResizeWarning();
	}else{
		showChartApp();
	}
}); */
//populate the heading section img and title
$('img#sectionProfImg').attr('src',course.section.profile_url );
$('span#sectionTitleSpan').text(course.section.course_title +': ' + course.section.section_title);
//init tooltip
$('a.tooltiped').tooltip();
//init dropdown
$('a.dropdown-trigger').dropdown({constrainWidth:true});
$('.tabs').tabs();
$('.modal').modal();

/* ------Here is the onload method so start all coding here except for inits ---*/
//populate the students into studentList
$(()=> {
	//set current routine btn
	var $curRoutineBtn = $("a#curRoutineBtn > span");
	$curRoutineBtn.text(window.curChart.title);
	
	//pop routine list
	for(var i =0; i < seatingCharts.list.length; i++){
		var s = seatingCharts.list[i];
		var $rosterItem = $('<li class="collection-item routine-item grey-text"></li>');
		$rosterItem.attr('id',s.id);
		$rosterItem.text(s.title);
		$rosterItem.css({textAlign:'center',margin:'0 auto',padding:'2px',verticalAlign:'middle',fontWeight:10})
		$('ul#routineDropdownList').append($rosterItem).append("<li class='divider' tab-index='-1'></li>");
	}//end for
	
	//add the click fucntion to routine-items
	$('li.routine-item').click(function(){var $this = $(this);
	var $curRot =$('a#curRoutineBtn >span');
	if($this.text() ==$curRot.text() ){console.log('text were the same');return;}
	else{$curRot.text($this.text());
	console.log('text were different');
	//TODO: make ajax call to get routine and 

					}//end else //////////////////////
		});//end click
		
/*set up click for view-btn :student group proc*/
$('a.view-btn').click(function(){
	$this = $(this);
	$icon = $this.find('i.view-icon');
	if($icon.hasClass('amber-text')){
		//means it is already active
		return;
	}
	//here we can assume view is not active
	var className ='amber-text text-accent-1'
	$('i.view-icon').removeClass(className);
	$icon.addClass(className);
	$('.side-tool').css('display', 'none');
	switch($this.attr('id')){
		case 'student-view-btn':view = 'student';$('div#studentListWrapper').css('display', 'block');break;
		case 'groups-view-btn':view = 'group';$('div#groupListWrapper').css('display', 'block');break;
		case 'proc-view-btn':view = 'proc';$('div#procListWrapper').css('display', 'block');break;
	}
});//end click view-btn

/*set up click for editLink btn*/
$('a#editRoutineLink','ul#settingsList').click(function(){
//	console.log('edit btn click');
	edit();
});

/* set up edit toolside collapsible */
$editToolCollapsible.collapsible({onOpenEnd:() =>{
	var $activeItem = $editToolCollapsible.find('li.active');
	switch( editState){
		case 'furniture':doneEditFurniture();break;
		case 'student':doneEditStudent();break;
		case 'proc':doneEditProc();break;
		case 'info':doneEditInfo();break;
		case 'group':doneEditGroup();break;
	}
	switch($activeItem.attr('id')){
		case'furnitureCollapseItem':editFurniture();break;
		case 'studentCollapseItem':editStudent();break;
		case 'groupCollapseItem':editGroup();break;
		case 'procCollapseItem':editProc();break;
		case 'infoCollapseItem':editInfo();break;
	}
}});

/*make add group btn open modal for group edit */ 
//addGroup btn shows modal
$('button#group-add-btn').click(function(){
	$("div#groupEditLayer.modal").modal('open');
});
/*make color-selectable clickable passing available color*/
var $colorSelect = $('button.btn.color-selection');
$colorSelect.click(function(){
	var color;
	var $this = $(this);
	if(! $this.hasClass('selected')){
		color = $this.attr('data-color');
	var $groupColorInput = 	$('#group-color-input');
	$groupColorInput.removeClass();
	$groupColorInput.addClass('dropdown-trigger btn ' + color);
	$groupColorInput.attr('data-color', color);	
		
	}
});



	drawGrid();
	updateGroupPanels();
	updateProceduresPanels();
	home();
}//end function //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
);//end jquery init;//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/* ui function list */

function home(){
	isEditing = false;
	view = 'student';
	if($studentList.children().length < 1){
		$studentList.append("<div><h5>No student to show</h5></div>")
	}
	$('.rosterStudent').click();
	
};

function doneHome(){
	$homeTools.hide();
	$homeToolSide.hide();
	switch(view){
		case 'group':doneGroupView();break;
		case 'proc':doneProcView();break;
		case 'station':doneStationView();break;
		case 'info':doneInfoView();break;
		default:doneStudentView();
	}
};

function drawGrid(){
	console.log('called draw grid');
	$floorPlan.empty();
	$studentList.empty();
//new strategy: put all student in studentList and 
//li will have their id number as an attr
	for(var i = 0; i < students.enrollment.length; i++){
		if(students.enrollment[i].admin == 1)continue;
		var sp =  RosterStudentPanel.createPanel(students.enrollment[i]);
		sp.appendTo($studentList)
		.wrap('<li class="collection-item" data-id="'+ students.enrollment[i].id+ '"></li>');
	}///end for ////////
	//put desks in place
	if(curChart.furniture.length  > 0){
		//iterate
		for(var i = 0; i < curChart.furniture.length; i++ ){
			//place furniture on floor
				//check types 
				//for desks see if student needs to be added
			if(curChart.furniture[i].type='desk'){
				var $desk = FurnitureUtils.drawDesk(curChart.furniture[i]);
				var desk = $desk.data('desk');
				//if student are assigned then seats are present
				if(desk.seats.length > 0){
					for(var j = 0; j < desk.seats.length; j++){
						var $seat = $desk.find('.pos'+(j+1));
						console.log("this is the student seat:");
						console.log($seat);
						if(desk.seats[j].student == null || desk.seats[j].student == ''){
							continue;
						}else{
								//iterate through student to find same id
								//and then "hide" from array
								var $liEls = $studentList.children().not(':hidden');
								for(var k = 0; k < $liEls.length; k++){
									$el = $($liEls.get(k));
									console.log('here is the student list:');
									console.log($el);
									if($el.attr('data-id') == desk.seats[j].student){
										$el.find('div.rosterStudent').appendTo($seat);
										$el.hide();
										continue;
									}//end if
								}//end for
						}//end else stuent empty
						$seat.find('.counterRotate').css('transform', 'rotate('+(-desk.rotate) +'rad)')
					}//end for desk seat 
				}//end if desk seat length
				//apend desk now
				$floorPlan.append($desk);
			}//end if furniture is a desk
		}//end for furniture
	}//end if furniture length
	
}//end drawGrid///////
function edit(){
	doneHome();
	isEditing = true;
	editState = 'furniture';
	$editTools.show();
	$editToolSide.show();
	if($studentList.find('li').length > 0){
		var $sListClone = $studentList.clone();
		$sListClone.addClass('edit');
		$sListClone.appendTo($('div#studentCollapseBody').empty());
		$sListClone.attr('id', 'studentEditList');
	}else{
		$('div#studentCollapseBody').empty().append('<div> No students to view</div>');
	}
	oldData = $.extend(true,{},curChart);
	editFurniture();
};
function doneEdit(){
	switchEditState();
	$editTools.hide();
	$editToolSide.hide();
	home();
};
function submitEdit(){
	//Ajax call to submit data
	doneEdit();
}

function cancelEdit(){
	//revert back to old data
	//fix editState
	curChart = oldData;
	doneEdit();
}

function switchEditState(){
	switch(editState){
		case 'student':doneEditStudent();
		case 'group':doneEditGroup();
		case 'proc':doneEditProc();
		case 'info':doneEditInfo();
		default:doneEditFurniture();
	}
}

function editFurniture(){
	editState = 'furniture';
	$('img.furnitureIcon').draggable({zIndex:500,appendTo:'body',
					cursorAt:[0,0], revert:'invalid', containment:'seatingChart', helper:'clone'});
	$floorPlan.droppable({accept:'.furnitureIcon', greedy:true,
							drop:(e,ui)=>{
								//console.log('this is e object');
								//console.log(e);
								e.stopPropagation();
								e.preventDefault();
								var iconId = ui.draggable.attr('id');
								var top,left;
								
									left = (e.clientX + window.scrollX) - $floorPlan.offset().left +'px';
									top = (e.clientY + window.scrollY)- $floorPlan.offset().top +'px';
									
								
								var dropInfo ={desk:iconId, top:top, left:left};
								//console.log(dropInfo);
								var $newDesk = FurnitureUtils.newDeskOnDrop(dropInfo);
								$newDesk.appendTo($floorPlan);
								$newDesk.uniqueId().data('desk').id = $newDesk.attr('id');
								makeDragRotateDelete($newDesk);
							}//end drop func
							});
	$('.desk-wrapper', '.floorPlan').each(function(){makeDragRotateDelete($(this))});
};//end edit Furniture

function doneEditFurniture(){
	var $desks = $('.desk-wrapper','.floorPlan').draggable('destroy');
	$('furnitureIcon','div.editTool-side').draggable('destroy');
	
	$floorPlan.droppable('destroy');
	$('.deskDeleter','.floorPlan').off('click').css('display','none');
	 $('.desk', '.floorPlan').rotatable('destroy');
	var deskList = [];
	$desks.each(function(){
	deskList.push($(this).data('desk'));}		
	);
	curChart.furniture = deskList;
	
};

function makeDragRotateDelete($desk){
	console.log('makeDragRotateDelete starting object: ');
	console.log($desk);
	$desk.draggable({containment: $floorPlan ,cursorAt:[0,0],
					stop:function(e, ui){
						var $this = $(this);
						 var top, left;
						left = (e.clientX + window.scrollX) - $floorPlan.offset().left +'px';
									top = (e.clientY + window.scrollY)- $floorPlan.offset().top +'px'; 
						
						 $this.css('top', top);
						$this.css('left', left); 
						//$this.css('display', 'block');
						$this.data('desk').top = $this.css('top');
						$this.data('desk').left = $this.css('left');
					},
					start:function(e , ui){
						  var top, left;
						  
							left = (e.clientX + window.scrollX) - $floorPlan.offset().left +'px';
										top = (e.clientY + window.scrollY)- $floorPlan.offset().top +'px'; 
							
							 $(ui.helper).css('top', top).css('left', left);
							
							//$(this).css('display', 'none');
	
					}//end start funciton				
	});
	$desk.find('.desk').rotatable({angle:$desk.data('desk').rotate, 
			stop:function(e, ui){
				$this = $(this);
				$this.closest('.desk-wrapper').data('desk').rotate = ui.angle.current;
			},
			rotate:function(e,ui){
				var $ui = $(ui.element);
				var $counter = $ui.find('div.counterRotate');
				if($counter !=null && $counter.length > 0){
					$counter.css("transform", "rotate(" + -ui.angle.current +"rad)");
				}
			}
	});
	$desk.find('.deskDeleter').click(function(){
		deleteFurniture( $(this).closest('.desk-wrapper'));
	}).css('display','block');
	
};//done make rotate drag delete

function deleteFurniture($desk){
	var $rosStu = $desk.find(".rosterStudent");
	if($rosStu.length > 0){
		$rosStu.each(function(){
			var $this = $(this);
			$this.appendTo('li[data-id="'+$this.attr('id')+'"]').parent().show();
			$this.find('.counterRotate').css("transform", "rotate(0.0rad)");
			$this.delay(300);
		});
	}//end if
	for(var i = 0 ; i < curChart.furniture.length; i++){
		if(curChart.furniture[i].id == $desk.data('desk').id){
			curChart.furniture.splice(i,1);
			break;
		}
	}
	$desk.removeData('desk');
	$desk.remove();
}

function editStudent(){
	editState = 'student';
	$('.rosterStudent').draggable({containment:'.seatingChart',
				helper:'clone', appendTo:'body', 
				start:function(){
					$(this).css('opacity', '0.3');
				},
				stop:function(e, ui){
					$(e.target).css('opacity','1');
				},
				drag:function(e, ui){
					$(ui.helper).find('.counterRotate').css('transform','rotate(0.0rad)');
				}
				});
	$('td >div.seat', '.floorPlan').droppable({accept:'.rosterStudent',greedy:true,hoverClass:'seat-over',
			drop:function(e,ui){
				console.log('on drop called');
				var $dropSeat = $(e.target);
				var $draggable =  $(ui.draggable);
				var $dragParent = $draggable.parent();
				console.log('drag parent is: ');
				console.log($dragParent);
				var $rosStudent = $dropSeat.find('.rosterStudent');
				
				//if seat occuupied by $rosStudent  move it first
				if($rosStudent != null && $rosStudent.length > 0){
					//first check to see if drag parent is comming from side
					if($dragParent.is('li')){
						$rosStudent.animate({left:'+=7em', opacity:0},500,'swing',
								function(){
							var $appendToMe = $('li[data-id = "'+ $rosStudent.attr('id')  +'"]');
							//console.log('appendToMe is: ');
							//console.log($appendToMe)
							$appendToMe.css('display','block');
							$rosStudent.appendTo($appendToMe);
							$rosStudent.css({opacity:'1', position:'relative', left:'0px'})
								.find('.counterRotate').css({transform:'rotate(0.0rad)'});
						});
					}//end if
					//next check to see if drag student is coming from a seat then swap
					if($dragParent.hasClass('seat')){
						var $pWrapper = $dropSeat.closest('div.desk-wrapper');
						var $cloneWrapper = $('<div id="clone"></div>');
						$cloneWrapper.css({overFlow:'visible', width:'4em', height:'8em',
							position:'absolute', left:$pWrapper.css('left'), top:$pWrapper.css('top')})
							.appendTo('.floorPlan');
						$rosStudent.appendTo($cloneWrapper);
						$rosStudent.find('.counterRotate').css('transform', 'rotate(0.0rad)');
						$cloneWrapper.animate({left:'+=' +($dragParent.offset().left - $pWrapper.offset().left), 
												top:'+=' + ($dragParent.offset().top - $pWrapper.offset().top)},
												350, 'swing',
												function(){
													$rosStudent.appendTo($dragParent);
													$cloneWrapper.remove();
													var stuDesk = $dragParent.closest('div.desk-wrapper').data('desk');
													console.log('student desk of the swapped is: ');
													console.log(stuDesk);
														if($dragParent.hasClass('pos1')){
															stuDesk.seats[0].student = $rosStudent.attr('id');
														}//end if
														else{
															stuDesk.seats[1].student = $rosStudent.attr('id');
														}//end else
															$rosStudent.find('.counterRotate').css('transform',
																	'rotate('+ (-stuDesk.rotate)+'rad)');
												});//end animate
						
					}//end if swapping
				}//end check to see if seat is occupied
				//now place the drop student in the target seat
				$draggable.appendTo($dropSeat);
				if($dragParent.children().length <1 && $dragParent.is('li')){
					$dragParent.hide();
				}
				var stuDesk =$dropSeat.closest('div.desk-wrapper').data('desk');
				if($dropSeat.hasClass('pos1')){
					stuDesk.seats[0].student = $draggable.attr('id');
				}else{
					stuDesk.seats[1].student = $draggable.attr('id');
				}
				$draggable.find('.counterRotate').css('transform',
						'rotate('+ (-stuDesk.rotate)+'rad)');
			}
			});//end droppable
	
};// end edit student
function doneEditStudent(){
	$('.rosterStudent').draggable('destroy');
	$('td >div.seat', '.floorPlan').droppable('destroy');
};
function sortStudentList(a,b){
	//console.log('sort stuent list called')
	/*a and b are list items find student */
	if(sortByLastName){
			if($(a).find('.last').text() < $(b).find('.last').text())return -1;
			if($(a).find('.last').text() > $(b).find('.last').text())return 1;
			return 0;
	}else{
		if($(a).find('.first').text() < $(b).find('.first').text())return -1;
		if($(a).find('.first').text() > $(b).find('.first').text())return 1;
		return 0;
	}
}

function editGroup(){
	var activeGroup = '';/*store group id for group here*/
	console.log('edit group called');
	editState = 'group';
	
	//first check to see if there are any groups;
	var $emptyGroupPanel = $('div#empty-group-panel');
	var $editGroupList = $('ul#editable-group-list');
	//incase of populattion emty children from edit-group-list
	$editGroupList.children().remove();
	//if not show empty else activate  panel
	if(curChart.groups.length < 1){ 
		$emptyGroupPanel.show();
		
	}
	else{
	// hide empty group panel
	$emptyGroupPanel.hide();
	// first group is active group
	for(var i = 0; i < curChart.groups.length ; i++){
		//create an li to add to the  
		var $item = EditGroupItem.create(curChart.groups[i]);
		if(i == 0){
			$item.addClass('active');
		}
		$item.data('data',curChart.groups[i] );
		$item.attr('id',curChart.groups[i].gid );
		$editGroupList.append($item);
		$item.find('a.edit-group-item-btn').click(function(){
			$(this).siblings('form').show().find('input').focus();
			
		});
		
		//add members to the group /////
		//check if group has members ////
		if(curChart.groups[i].members.length > 0){
		for(var j = 0; j < curChart.groups[i].members.length; j++){
			
			var mem = MemberItem.create(curChart.groups[i].members[j]);
			$item.find('ul.edit-group-member-list').append(mem);
		}
		} else{ $item.find('div.empty-group-members').show(); 
				$item.find('ul.edit-group-member-list').hide();}//end if groups has memebers
	}
	
	$('ul#editable-group-list.collapsible').collapsible(
			{accordian:true,
			onCloseStart:function(li){
			var $li = $(li);
			$li.find('form')[0].reset();
			$li.find('form').hide();
			},
			
			onOpenStart:function(li){
				var $li = $(li);
				$li.find('input').attr('placeholder', $li.data('data').title);
				$li.find('textarea').attr('placeholder', $li.data('data').description);
			}
			
			}); //end collapsible
	
	$('a.edit-group-item-btn').click(function(){
		var $this = $(this);
		$this.closest('form').css('display', 'block');
	});
	
	
	//student in active group are excluded
	//make students selectable
	$floorPlan.selectable({filter:'.student'});
	
	//if studen belongs to another group then confirm move
	
	}
	
};

function doneEditGroup(){
};

function editProc(){
	editState = 'proc';
};
function doneEditProc(){};

function editInfo(){
	editState = 'info';
};
function doneEditInfo(){};
//end editing functions ------//////

//View functions ---------//////////

function studentView(){
	/*TODO:add click functions to students
	for showing studentActionPanel
*/
};
function doneStudentView(){
/* remove the click function */
};



/*Group Function -- Start Here ------ */
function updateGroupPanels(){
	//console.log('update group Panels called');
	if(curChart.groups != null && curChart.groups.length > 0){
		for(var i = 0; i < curChart.groups.length; i++){
			var $group = StudentGroupPanel.create(curChart.groups[i]);
			//append to groupList
			$group.appendTo($groupList).wrap('<li class="collection-item"></li>');
		}
	}else{
	
	}
}

function groupView(){
	//add color to students by group membership
	//update the icons and roles
	
	//add hover to group panel to dim non members
	
};
function doneGroupView(){
	//get rid of color style
	
	//get rid of icons and roles
	
	//remove hover from group panels
};

/* -- Group Functions End Here -----*/

/*--Procedure Functions Start ---*/

function updateProceduresPanels(){
	console.log('update procedures panel called');
	if(curChart.procedures != null && curChart.procedures.length > 0 ){
		for(var i = 0; i < curChart.procedures.length; i++){
			var $proc = ProcedurePanel.create(curChart.procedures[i]);
			$proc.appendTo($procList).wrap('<li class="collection-item"></li>');
		}//end for
	}//end if
	
}
function procView(){};
function doneProcView(){};


/* --- Procedure Functions End ---- */



function stationView(){};
function doneStationView(){};
function infoView(){};
function doneInfoView(){};

//End View function ----------- /////

//Check functions hw & attendance //////
function hwCheck(){};
function doneHwCheck(){};
function submitHwCheck(){};
function cancelHwCheck(){};
function attendanceCheck(){};
function doneAttendanceCheck(){};
function submitAttendance(){};
function cancelAttendance(){};
//end Check functions /////////////////

//ajax functions - routine
function saveRoutine(routine){};
function cancelSaveRoutine(){};
function deleteRoutine(routineId){};
function cancelDeleteRoutine(){};


function getRoutine(routineId){};
function printRoutine(){};
function newRoutine(){};
function copyRoutine(){};

//ajax functions - groups

//ajax functions - procs

//TODO:ajax functions - stations

 ////ajax functions - attendance
 
 //ajax functions - assignment