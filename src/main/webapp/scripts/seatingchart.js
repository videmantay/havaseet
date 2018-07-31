
/**
 * roster student panel
 */
function RosterStudentPanel(){
	/*html only return inner html so must set a wrapper*/
this.template =`<div class="im_a_wrapper" ><div class="rosterStudent"
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
</div></div>`;
this.$rosStudentPanel = $(this.template);
this.student;
 this.getPanel = function(){return this.$rosStudentPanel.html()};
 this.setStudent = function(stu){
	this.student = stu;
	this.$rosStudentPanel.find('.first').text(stu.name_first);
	this.$rosStudentPanel.find('.last').text(stu.name_last);
	this.$rosStudentPanel.find('img.studentImg').attr('src', stu.picture_url);
	this.$rosStudentPanel.find('div.rosterStudent').attr('id',stu.uid);
};

this.getStudent = function(){ return this.student};
};
/*
end roster student panel
*/


