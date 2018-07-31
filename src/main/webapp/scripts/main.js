/**
 * 
 */

import {RosterStudentPanel} from 'seatingchart/rosterStudentPanel';
var store = new Vuex.Store({
	state:{
		rosters:[],
		currentRoster:null,
		students:null,
		incidents:null,
		routines:null,
		colorBtnIconText:''
	},
	getters:{
		getCurrentRoster(state){
			return state.currentRoster;
		},
		getRosters(state){
			return state.rosters;
		}
	},
	mutations:{
		setCurrentRoster(state, roster){
			state.currentRoster = roster;
		},
		setRosters(state,rosters){
			state.rosters = rosters;
		},
		addRoster(state, roster){
			state.rosters.push(roster);
		},
		removeRoster(state, roster){
			console.log('rosters list size is '+ state.rosters.length +' before cut');
			//loop and rid
			for(let i = 0; i < state.rosters.length; i++){
				if(roster.id == state.rosters[i].id){
					state.rosters.splice(i, 1);
			console.log('rosters list size is ' + state.rosters.length+ ' afer cut');
					break;
				}//end if
			}//end for
		}
		
	},
	actions:{
		loadRosters:function(context){
			$.getJSON('/roster', data => context.commit('setRosters',data));
		},
		removeRosterAsync(context, roster){
			$.ajax({
				method:'delete',
				url:'/roster/'+roster.id,
				contentType:'application/json',
			}).done(
					function(){
						console.log('called remove roster from store');
						context.commit('removeRoster',roster);
						this.$emit('deletesuccess');
					}
			);
		}
	}
});

var rosterColorPicker ={
	name:'roster-color-picker',
	template:'<div class="roster-color-picker" style="background-color:SmokeWhite">\
		<v-container  fluid grid-list-md>\
		<v-layout  row-xs column justify-center wrap>\
		<v-flex xs4 style="overflow:hidden">\
		<v-btn style="width:2em;height:2em" @click.native="setColor" class="red ma-1 pa-1" name="red"></v-btn>\
		</v-flex>\
		<v-flex xs4 style="overflow:hidden">\
		<v-btn style="width:2em;height:2em" @click.native="setColor" class="red darken-1 ma-1 pa-1" name="red darken-1"></v-btn>\
		</v-flex>\
		<v-flex xs4 style="overflow:hidden">\
		<v-btn style="width:2em;height:2em"  @click.native="setColor" class="red accent-1 ma-1 pa-1" name="red accent-1"></v-btn>\
		</v-flex>\
		<v-flex xs4 style="overflow:hidden">\
		<v-btn style="width:2em;height:2em" @click.native="setColor" class="amber ma-1 pa-1" name="amber"></v-btn>\
		</v-flex>\
		<v-flex xs4 style="overflow:hidden">\
		<v-btn style="width:2em;height:2em"  @click.native="setColor" class="amber darken-1 ma-1 pa-1" name="amber darken-1"></v-btn>\
		</v-flex>\
		<v-flex xs4 style="overflow:hidden">\
		<v-btn style="width:2em;height:2em"  @click.native="setColor" class="amber accent-1 ma-1 pa-1" name="amber accent-1"></v-btn>\
		</v-flex>\
		</v-layout>\
		</v-container>\
		</div>',
	methods:{
		setColor(event){
			console.log('a color was selected');
			console.log(event.target)
			let color = $(event.target).parent().attr('name');
			console.log(color);
			this.$emit('rostercolorselected',color);
		}
	}
	
};

var rosterPanel ={
		name:'roster-panel',
		data(){
			return{
				colorPicker:false
			};
		},
		components:{'roster-color-picker':rosterColorPicker},
		props:{roster:{type:Object, required:true}},
		methods:{
			rosterColorSelected(color){
				console.log('setting roster color from panel')
				this.roster.color = color;
				for(let i = 0; i < this.$store.getters.getRosters.length; i++){
					if(this.$store.getters.getRosters[i].id == this.roster.id){
						this.$store.getters.getRosters[i].color = color;
						//ajax update the roster
						$.ajax({url:'/roster/'+this.roster.id, data:JSON.stringify(this.$store.getters.getRosters[i]), dataType:'json',
								method:'post',contentType:'application/json'});
						}
					}
				},
				deleteRoster(){
					console.log('delete roster called from roster panel');
					console.log('the roster is : ');
					console.log(this.roster);
					this.$emit('deleteroster', this.roster);
				}
			
		},
		template:'<div class="roster-panel ma-2">\
					<v-card>\
						<v-card-title :class="roster.color"><h4>{{roster.name}}</h4>\
						<v-spacer></v-spacer>\
						<v-menu  offset-y v-model="colorPicker">\
						<v-icon slot="activator" class="white--text" @click.native.stop="colorPicker = true">more_vert</v-icon>\
						<v-list style="width:9em">\
						<v-list-tile><v-list-tile @click.native="updateRoster">Update<v-icon right>update</v-icon></v-list-tile></v-list-tile>\
						<v-list-tile><v-list-tile @click.native="deleteRoster">Remove<v-icon right>delete</v-icon></v-list-tile></v-list-tile>\
						</v-list>\
						<hr/>\
						<roster-color-picker v-on:rostercolorselected="rosterColorSelected" style="width:8em"></roster-color-picker>\
						</v-menu>\
						</v-card-title>\
						<v-card-text>\
			{{roster.description}}</v-card-text>\
					</v-card></div>'
};

var landingPage = Vue.component('landing-page',{
	data(){return {
		rosters:[],
		roster:{ rosterInfo:{name:'General Class',
							description:'a typical elementary school class, managed by RoutineLee',		
							roomNum:'33',
							startDate:null,
							endDate:null,
							specialDates:[],
							teacherInfo:{
								name:'',
								grade:'',
								picUrl:''
							}},
				calendarId:null,
				taskListId:null,
				id:null,		
				gid:null,		
				color:'red darken-4'},				
		deleteRoster:{type:Object, required:false},
		deleteDialog:false,
		deleteSuccess:false,
		showForm:false,
		showColor:false,
		showLoader:false,
		showCalendarList:false,
		colorBtnIconText:'',
		calendarList:null
	}},
	components:{
		'roster-color-picker':rosterColorPicker,
		'roster-panel':rosterPanel
	},
	methods:{
		saveRoster(){
			let url = '/roster';
			if(this.roster.id){
				url += '/'+id;
			}
			$.ajax({url:url,method:'post', data:JSON.stringify(this.roster),dataType:'json',contentType:'application/json'})
				.done(data => {this.$store.commit('addRoster',data);
									this.roster = {};});
			this.showForm = false;
			this.showLoader = true;
		},
		setColorBtnIcon(color){
			console.log('set color icon called');
			console.log(color);
			let str = color.split(' ');
			console.log(str)
			this.colorBtnIconText=str[0]+'--text';
			if(str[1]){
				this.colorBtnIconText+=' text--'+str[1];
			}
		},
		showDeleteDialog(roster){
			console.log('show delete dialog called')
			this.deleteRoster = roster;
			this.deleteDialog = true;
		},
		deleteRosterAsync(){
			console.log('delete roster called from main');
			this.$store.dispatch('removeRosterAsync', this.deleteRoster).then(this.showLoader = false);
			this.deleteRoster = null;
			this.deleteDialog = false;
			this.showLoader = true;
		},
		rosterColorSelect(color){
			console.log(color);
			this.setColorBtnIcon(color);
			this.roster.color = color;
			
		},
		selectCalendar(event){
			let id = event.target.id;
			console.log(event.target);
			this.roster.calendarId = id;
			this.showCalendarList = false;
		},
		showCalendar(){
			this.showCalendarList = true;
			
		}
	},
	template:'<v-app>\
		<v-progress-circular indeterminate v-show="showLoader"></v-progress-circular>\
		<div v-if="$store.getters.getRosters.length < 1" id="emptyRosterList" style="margin-left:auto;marign-right:auto; margin-top:20%; width:500px">\
	<h2>Your Roster List appears to be empty!</h2>\
	<h4>Create a roster by pressing the add button</h4>\
</div>\
	<v-layout row-sm column justify-space-around>\
	<v-flex  sm12 md4 lg3 v-for="roster in $store.getters.getRosters">\
		<roster-panel v-on:deleteroster="showDeleteDialog"  :roster="roster"></roster-panel>\
	</v-flex>\
	</v-layout>\
		 <v-dialog v-model="showForm" lazy absolute>\
	      <v-btn fab fixed bottom right slot="activator"><v-icon>add</v-icon></v-btn>\
	      <v-card>\
	        <v-card-title>\
	        	<h5>Roster Form</h5>\
	        </v-card-title>\
	        <form style="padding:2em" v-show="!showCalendarList">\
	        <v-text-field v-model="roster.rosterInfo.name" label="Name"></v-text-field>\
	        <v-text-field v-model="roster.rosterInfo.description" label="Description" multi-line></v-text-field>\
			<v-text-field v-model="roster.rosterInfo.roomNum" label="Room number"></v-text-field>\
				<v-btn flat >Color<v-icon id="colorBtnIcon" :class="colorBtnIconText">color_lens</v-icon></v-btn>\
				<roster-color-picker v-on:rostercolorselected="rosterColorSelect"></roster-color-picker>\
				<v-btn flat @click="showCalendar()">Calendar<v-icon>event</v-icon></v-btn>\
			</form>\
		<v-card v-show="showCalendarList"><v-card-title>Available Calendars</v-card-title>\
		<v-list><v-list-tile @click.native.stop="selectCalendar" v-for="cal in calendarList.items">\
				<v-list-tile-content>\
				<v-list-tile-title><h5 :id="cal.id">{{cal.summary}}</h5></v-list-tile-title>\
				<v-list-tile-subtitle><p>{{cal.description}}</p></v-list-title-subtitle>\
		</v-list-tile-content>\
		</v-list-tile>\
		</v-list>\
		</v-card-title>\
	       <v-card-actions>\
	          <v-btn class="green--text darken-1" flat="flat" @click.native="showForm = false">Cancel</v-btn>\
	          <v-btn class="green--text darken-1" flat="flat" @click.native="saveRoster()">Save</v-btn>\
	        </v-card-actions>\
	      </v-card>\
	    </v-dialog>\
		<v-dialog v-model="deleteDialog">\
		<v-card><v-card-title>Delete Roster</v-card-title><v-card-text>Are you sure you want to remove this roster?</v-card-text>\
		<v-card-text><v-btn @click="deleteRosterAsync">Delete</v-btn><v-btn @click="deleteDialog=false">Cancel</v-btn></v-card-text></v-card>\
		</v-dialog>\</v-app>',
mounted(){
			this.setColorBtnIcon(this.roster.color);
			
			},
created(){
				$.getJSON('/roster/googlecal').then(data => this.calendarList = data);
			}
														}
													);
var vm = new Vue({
	store,
	el:'div#app',
	created(){
		store.dispatch('loadRosters');
	},
	mounted(){
		$('#loader').remove();
	}
	
});

