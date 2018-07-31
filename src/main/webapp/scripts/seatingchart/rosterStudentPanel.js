/**
 * roster student panel
 */
let rosStudentTemplate =`<div class="rosterStudent"
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
let $rosStudentPanel = $(rosStudentTemplate);
let student;

function RosterStudentPanel(stud){
	setStudent(stud);
	$rosStudentPanel.find('.first').text(student.name_first);
	$rosStudentPanel.find('.last').text(student.name_last);
	$rosStudentPanel.find('img.studentImg').attr('src', student.picture_url);
	$rosStudentPanel.find('div.rosterStudent').attr('id',student.uid);
	return $rosStudentPanel;
};
function getPanel(){
	return $rosStudentPanel;
	}

 function setStudent(stu){
	student = stu;
}

function getStudent(){
	return student;
}
/*
end roster student panel
*/