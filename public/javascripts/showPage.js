$(function() {

  var availabilityField = $('#availability')
  var maxAttendanceField = $('#max_attendance')
  var calendar = $('#calendarSelect');
  
  try {
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
  
  calendar.calendarSelect({ value: times,
                            static: true,
                            animate: true,
                            startDate: startDate, 
                            availability: availability, 
                            maxAttendance: maxAttendance });
});
