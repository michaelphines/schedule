$(function() {
  ScheduleButler.createCalendar('#calendarSelect', true);
  ScheduleButler.createTooltips();
  $('#calendarSelect .next, #calendarSelect .previous').click(ScheduleButler.createTooltips);

  $("#showPreview").click(function(event) {
    $("#preview").show();
    $(this).hide();
    event.preventDefault();
  });
});
