$(function() {
  ScheduleButler.createCalendar('#calendarSelect', true);
  ScheduleButler.createTooltips();

  $("#showPreview").click(function(event) {
    $("#preview").show();
    $(this).hide();
    event.preventDefault();
  });
});
