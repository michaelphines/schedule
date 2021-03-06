$(function() {
  ScheduleButler.createCalendar('#calendarSelect');
  
  $('form').submit(function(e) {
    var timesObj = $('#calendarSelect').data('calendarSelect');
    var timesArray = [];
    for (time in timesObj) {
      timesArray.push(timesObj[time]);
    }
    $('#time_table_times').val(JSON.stringify(timesArray));
    $('#calendarSelect').data('modified', false);
  });

  $('#showRespondentsDialog').click(function() {
    $('#respondentsDialog').dialog();
  });
  
  $('#newDialog').dialog();
  
  base_uri = 'http://' + location.host + 
             '/events/' + ScheduleButler.currentEvent() + 
             '/time_tables/' + ScheduleButler.currentTimeTable();
  
  $('#newEventEmail').click(function() {
    $.post(base_uri + '/send_created_event');
    $('#newDialog').dialog('close');
  });

  $('#newTimeTableEmail').click(function() {
    $.post(base_uri + '/send_joined_event');
    $('#newDialog').dialog('close');
  });

  window.onbeforeunload = function() {
    if ($('#calendarSelect').data('modified')) {
      return "Your changes have not been saved yet.";
    } else {
      return null;
    }
  }

  var calendarScope = "https://www.google.com/calendar/feeds/";

  $('#googleCalendarConnect').click(function() {
    google.accounts.user.login(calendarScope);
  });

  $('#googleCalendarDisconnect').click(function() {
    google.accounts.user.logout();
    $('#googleCalendarConnect').show();
    $('#googleCalendarDisconnect').hide();
  });

  if (google.accounts.user.checkLogin(calendarScope)) {
    $('#googleCalendarConnect').hide();
    $('#googleCalendarDisconnect').show();
  } else {
    $('#googleCalendarConnect').show();
    $('#googleCalendarDisconnect').hide();
  }

  var connectContext = function() {
    if (google.accounts.user.checkLogin(calendarScope)) {
      ScheduleButler.injectGoogleData(function() {
        ScheduleButler.createTooltips()
        ScheduleButler.createContextMenu();
      });
    } else {
      ScheduleButler.createTooltips();
    }
  }
  
  $('#calendarSelect .next, #calendarSelect .previous').click(connectContext);
  connectContext();


});