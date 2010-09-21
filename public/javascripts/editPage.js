$(function() {

  var timesField = $('#time_table_times');
  var availabilityField = $('#availability')
  var maxAttendanceField = $('#max_attendance')
  var calendar = $('#calendarSelect');
  
  try {
    var times = JSON.parse(timesField.val());
    var availability = JSON.parse(availabilityField.val());
    var bestDay = JSON.parse(maxAttendanceField.val());
    if (bestDay) {
      var maxAttendance = bestDay.count;
      var startDate = new Date(bestDay.time);
    } else {
      var maxAttendance = 0;
      var startDate = new Date();
    }
  } catch(e) {
    var times = [];
    var availability = [];
    var maxAttendance = 0;
    var startDate = new Date();
  }
  
  if (maxAttendance == 0)
    calendar.addClass('newSchedule');
  
  $('form').submit(function(e) {
    var timesObj = calendar.data('calendarSelect');
    var timesArray = [];
    for (time in timesObj) {
      timesArray.push(timesObj[time]);
    }
    timesField.val(JSON.stringify(timesArray));
  });

  $('#newDialog').dialog();

  calendar.calendarSelect({ value: times,
                            animate: true,
                            startDate: startDate, 
                            availability: availability, 
                            maxAttendance: maxAttendance });
});