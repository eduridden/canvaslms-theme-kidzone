
$(document).ready(function(){ 

//Start Progress Bar
$(function(){
    console.log("canvas-show-course-progress-on-dashboard.js");

    console.log("  Checking if user is on Dashboard...");
    if(window.location.pathname == "/") {

        console.log("  User is on dashboard, continuing...");
        var domain = window.location.hostname;
        var currentProgressJsonURL = "https://" + domain + ":443/api/v1/courses?include[]=course_progress&enrollment_type=student";
        var progressData = {};
        var currentProgress = null;
        var expectedProgress = null;

        var toPercent = function(value) {
            console.log("  Converting value " + value + " to percentage.");
            if(value < 1) {
                var percentage = value * 100;
            } else {
                console.log("  Value is > 1, returning original value.");
            }
            console.log("  Returning converted percentage " + percentage);
            return percentage;
        }

        var insertCurrentProgress = function(course, progress) {
            var currentProgressMeter = '<div id="progressbar"><div class="progress--current"></div></div>';
            var currentProgressColor = "#0c0";
            var courseID = course;
            var progress = toPercent(progress);
            var currentProgressAsPercent = progress.toFixed() + "%";

            console.log("  Adding current progress meter to course " + courseID + " tile.");
            $('div[data-reactid=".0.$' + courseID + '"]').append(currentProgressMeter);

            console.log("  Hiding bottom border on course " + courseID + " tile.");
            $('div[data-reactid=".0.$' + courseID + '"]').css({
                'border-bottom-color': '#fff',
            });

            console.log("  Styling progress meters container.");
            $('#progressbar').css({
                'height': '0px'
            });

            console.log("  Styling current progress bar.");
            $('.progress--current').css({
                'width': currentProgressAsPercent,
                'height': '4px',
                'background-color': currentProgressColor,
            }).attr({
                'title': 'Current progress: ' + currentProgressAsPercent,
                'data-tooltip': '{"tooltipClass":"popover popover-padded", "position":"bottom"}',
            });

            console.log("  Adding current progress hover events.");
            /* TODO: fix hover states
            $('.progress--current').hover(function(){
                $(this).css({
                    'height': '8px',
                    'bottom': '8px',
                });
            },
            function(){
                $(this).css({
                    'height': '4px',
                    'bottom': '0px',
                });
            });
            */

        }

        var insertExpectedProgress = function(course, progress) {
            var expectedProgressMeter = '<div class="progress--expected"></div>';
            var expectedProgressColor = "#ccc";
            var progress = toPercent(progress);
            var courseID = course;
            var expectedProgressAsPercent = progress + "%";

            console.log("  Adding expected progress meter.");
            $('.progress--current').before(expectedProgressMeter);

            console.log("  Styling expected progress meter.");
            $('.progress--expected').css({
                'width': expectedProgressAsPercent,
                'height': '4px',
                'position': 'relative',
                'bottom': '0px',
                'background-color': expectedProgressColor,
            }).attr({
                'title': 'Expected progress: ' + expectedProgressAsPercent,
                'data-tooltip': '{"tooltipClass":"popover popover-padded", "position":"bottom"}',
            });

            console.log("  Adding expected progress hover events.");
            /* TODO: fix hover states
            $('.progress--expected').hover(function(){
                $(this).css({
                    'height': '8px',
                    'bottom': '4px',
                });
            },
            function(){
                $(this).css({
                    'height': '4px',
                    'bottom': '0px',
                });
            });
            */

        }

        var calculateExpectedProgress = function(start, end) {

            var startTime = Date.parse(start);
            var startTimeMS = startTime.getTime();

            var endTime = Date.parse(end);
            var endTimeMS = endTime.getTime();

            var now = new Date();
            var nowMS = now.getTime();

            console.log("  Calculating expected progress.");
            var progress = (nowMS - startTimeMS) / (endTimeMS - startTimeMS);
            console.log(progress);

            if(progress >= 0) {
                return progress;
            } else {
                console.log("  Course dates error, not displaying expected progress.");
                /* TODO: fix positioning
                console.log("repositoning current progress bar");
                $('.progress--current').addClass("without_expected--progress");
                $('.progress--current.without_expected--progress').css({
                    'bottom': '0px',
                });
                $('.progress--current.without_expected--progress').hover(function(){
                    $(this).css({
                        'height': '8px',
                        'bottom': '4px',
                    });
                },
                function(){
                    $(this).css({
                        'height': '4px',
                        'bottom': '0px',
                    });
                });
                */

                return 0;
            }
        }

        console.log("  Getting course progress information...");
        var getCurrentProgress = $.getJSON(currentProgressJsonURL, function(data) {
            progressData = data;
            console.log(progressData);
        });

        getCurrentProgress.success(function(){
            console.log("  Course progress data received, checking Current and Expected progress...");
            if(progressData.length > 0) {
                $.each(progressData, function(idx, course){

                    console.log("  Checking if course " + course.id + " has progress...");
                    currentProgress = course.course_progress.requirement_completed_count / course.course_progress.requirement_count;

                    if(isNaN(currentProgress)) {
                        console.log("  Course Progress not enabled for current course (" + course.id + "), skipping...");
                    } else {
                        console.log("  Course " + course.id + " has progress, adding current progress...");
                        console.log(course);
                        insertCurrentProgress(course.id, currentProgress);

                        console.log("  Checking if course " + course.id + " has start/end dates...");
                        if(course.hasOwnProperty("start_at") && course.hasOwnProperty("end_at") && course.start_at != null && course.end_at != null) {
                            console.log("  Course " + course.id + " has start/end dates, checking expected progress...");
                            expectedProgress = calculateExpectedProgress(course.start_at, course.end_at);

                            console.log("  Inserting expected progress...");
                            insertExpectedProgress(course.id, expectedProgress);
                        } else {
                            console.log("  Course does not have start/end dates, won't add expected progress.");
                        }
                    }
                });
            } else {
                console.log("  No courses found with progress data, exiting.");
            }
        });

        getCurrentProgress.error(function(){
            console.log(" Error getting course progress data, exiting.");
        });

    } else {
        console.log("  User not on dashboard, exiting.");
    }
});
//End Progress Bar

// Start Login Video
$('body.ic-Login-Body .ic-app').prepend('<video autoplay loop id="bgvid"><source src="http://www.eduridden.com/themes/kidzone/video/kindergarten.webm" type="video/webm"><source src="http://www.eduridden.com/themes/kidzone/video/kindergarten.mp4" type="video/mp4"></video><div class="video-dottedoverlay"></div>');
// End Login Video

// change Inbox icon
$('a#global_nav_dashboard_link  div.menu-item-icon-container').prepend('<div id="kz_icon_dashboard"></div>');

// change Help icon
$('a.support_url.help_dialog_trigger.ic-app-header__menu-list-link').prepend('<div id="kz_icon_help"></div>');

// Start Change Menu icons
var obj = { 
	Login: 'kz_icon_login',
	Admin: 'kz_icon_admin',
	Account: 'kz_icon_account',
	Dashboard: 'kz_icon_dashboard',
	Groups: 'kz_icon_groups',
	Courses: 'kz_icon_courses',
	Calendar: 'kz_icon_calendar',
	Conversations: 'kz_icon_inbox',
	Inbox: 'kz_icon_inbox',
	Arc: 'kz_icon_arc',
	Commons: 'kz_icon_commons',
	Help: 'kz_icon_help',
};

var getProperty = function (propertyName) {
	return obj[propertyName];
};


$('ul.ic-app-header__menu-list > li.ic-app-header__menu-list-item').each(function(index,elm){
	thisText = $('a',elm).text().trim().split('®').join('');

	$('a', elm).prepend('<div class="kz_main-menu-icon" id="' + getProperty(thisText) + '" > </div>')
});

// End Change Menu icons


// Start Change Course icons
var obj = { 
	Home: 'kz_icon_home',
	Announcements: 'kz_icon_announcements',
	Collaborations: 'kz_icon_collaborations',
	Marks: 'kz_icon_marks',
	Grades: 'kz_icon_marks',
	People: 'kz_icon_people',
	Modules: 'kz_icon_modules',
	Pages: 'kz_icon_pages',
	Assignments: 'kz_icon_assignments',
	Discussions: 'kz_icon_discussions',
	Files: 'kz_icon_files',
	Outcomes: 'kz_icon_outcomes',
	Syllabus: 'kz_icon_syllabus',
	Quizzes: 'kz_icon_quizzes',
	Conferences: 'kz_icon_conferences',
	Settings: 'kz_icon_settings',
	Chat: 'kz_icon_chat',
	SCORM:'kz_icon_scorm',
	Attendance: 'kz_icon_attendance',
	Bookshelf: 'kz_icon_bookshelf',
	'Class Notebook': 'kz_icon_onenote',
	'Office Mix': 'kz_icon_officemix',
	Courses: 'kz_icon_courses',
	Users: 'kz_icon_users',
	Statistics: 'kz_icon_statistics',
	Permissions: 'kz_icon_permissions',
	Rubrics: 'kz_icon_rubrics',
	Grading: 'kz_icon_grading',
	'Question Banks': 'kz_icon_questionbanks',
	'Sub-Accounts': 'kz_icon_subaccounts',
	'Faculty Journal': 'kz_icon_facultyjournal',
	Terms: 'kz_icon_terms',
	Authentication: 'kz_icon_authentication',
	'SIS Imports': 'kz_icon_sisimports',
	Themes: 'kz_icon_themes',
	'Developer Keys': 'kz_icon_developerkeys',
	'Canvas Data Portal': 'kz_icon_canvasdata',
	'Arc Media Library': 'kz_icon_arcmedia',
	'Google Drive': 'kz_icon_googledrive',
	'Office 365': 'kz_icon_office365',
	'Admin Tools': 'kz_icon_admintools'
	
};

var getProperty = function (propertyName) {
	return obj[propertyName];
};


$('ul#section-tabs > li.section').each(function(index,elm){
	thisText = $('a',elm).text().trim().split('®').join('');

	$('a', elm).prepend('<div class="kz_course-menu-icon" id="' + getProperty(thisText) + '" > </div>')
});
// End Change Course icons


// Start Sample Screen Reader
$(function(){
  var path = window.location.pathname.split( '/' );
  if(path[3] == "pages") {

    var say = function(toSpeak) {
      var stageSpeech = new SpeechSynthesisUtterance(toSpeak);
      window.speechSynthesis.speak(stageSpeech);
    }

    var pageContent = document.querySelector('#wiki_page_show .show-content');
    $(pageContent).before('<button type="button" id="playSpeech">Play</button>')

    $('#playSpeech').click(function(){
      say(pageContent.textContent);
    });

  }
});

});
