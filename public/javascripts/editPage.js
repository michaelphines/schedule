$(function() {
  $('form').submit(function(e) {
    var timesObj = $('#calendarSelect').data('calendarSelect');
    var timesArray = [];
    for (time in timesObj) {
      timesArray.push(timesObj[time]);
    }
    $('#time_table_times').val(JSON.stringify(timesArray));
  });

  $('#newDialog').dialog();

  ScheduleButler.createCalendar('#calendarSelect');
});