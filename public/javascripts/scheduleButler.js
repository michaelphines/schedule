ScheduleButler = {
  currentEvent: function() {
    return location.href.match(/\/events\/([^\/?]+)/)[1]
  },

  currentTimeTable: function() {
    return location.href.match(/\/time_tables\/([^\/?]+)/)[1]
  },
  
  currentPageRange: function() {
    first = $('#calendarSelect .hour').first().data('time');
    last = $('#calendarSelect .hour').last().data('time');
    return [first, last];
  },
  
  parseAllFields: function(force) {
    return {
      times: ScheduleButler.parseField('#time_table_times', force),
      availability: ScheduleButler.parseField('#availability', force),
      maxAttendance: ScheduleButler.parseField('#max_attendance', force)
    };
  },
  
  parseField: function(fieldSelector, force) {
    var field = $(fieldSelector);
    if (!field.data('value') || force) {
      try { 
        field.data('value', JSON.parse(field.val())); 
      } catch(e) {
        return null;
      }
    }
    return field.data('value');
  },
  
  createCalendar: function(calendarSelector, static) {
    var fields = ScheduleButler.parseAllFields();
    
    if (fields.maxAttendance) {
      var maxAttendanceCount = fields.maxAttendance.count;
      var startDate = new Date(fields.maxAttendance.time);
    } else {
      var maxAttendanceCount = 0;
      var startDate = new Date();
    }

    if (maxAttendanceCount == 0) $(calendarSelector).addClass('newSchedule');

    $(calendarSelector).calendarSelect({ 
      value: fields.times,
      static: static,
      animate: true,
      startDate: startDate, 
      availability: fields.availability, 
      maxAttendance: maxAttendanceCount
    });
  },
  
  extractHoursFromEvent: function(event, googleEvents) {
    var start = event.getTimes()[0].getStartTime().getDate();
    var end = event.getTimes()[0].getEndTime().getDate();
    start.setMinutes(0);
    start.setSeconds(0);
    start.setMilliseconds(0);

    for(var hour = start; start < end; start.setHours(start.getHours()+1)) {
      if (!googleEvents[hour.valueOf()]) googleEvents[hour.valueOf()] = [];
      googleEvents[hour.valueOf()].push(event.getTitle().getText());
    }
    return googleEvents;
  },
  
  createTooltips: function() {
    $('#calendarSelect .hour').each(function(index, value) {
      var googleEvents = $(value).data('googleEvents');
      var emails = $(value).data('emails');

      var eventTitle = "";
      if (googleEvents) eventTitle += "<b>Google Calendar Events:</b><br />" + googleEvents.join("<br />");
      if (googleEvents && emails) eventTitle += "<hr />";
      if (emails) eventTitle += "<b>Available people:</b><br />" + emails.join("<br />");

      $(value).attr('title', eventTitle).tipTip();
    });
  },
  
  injectGoogleData: function(callback, errorCallback) {
    ScheduleButler.getEventsFromAllCalendars(function(result) {
      var events = result.feed.getEntries();
      var googleEvents = {};
      
      for (var i = 0; i < events.length; i++) {
        googleEvents = ScheduleButler.extractHoursFromEvent(events[i], googleEvents);
      }
      
      $('#calendarSelect .hour').each(function(index, value) {
        var hour = $(value).data('time');
        var events = googleEvents[hour];
        if (events) {
          $(value).addClass('google');
          var currentEvents = $(value).data('googleEvents') || [];
          
          $(value).data('googleEvents', currentEvents.concat(events));
        }
      });
      
      if(callback) callback(events);
      
    }, errorCallback)
  },
  
  getEventsFromAllCalendars: function(callback, errorCallback) {
    var calendarService = new google.gdata.calendar.CalendarService('schedule-butler');
    calendarService.getAllCalendarsFeed('https://www.google.com/calendar/feeds/default/allcalendars/full', function(result) {
      var calendars = result.feed.entry;
      for (var i = 0; i < calendars.length; i++) {
        var feedUri = calendars[i].getEventFeedLink().getHref();
        var query = ScheduleButler.googleRangeQuery(feedUri, ScheduleButler.currentPageRange())
        calendarService.getEventsFeed(query, callback, errorCallback);
      }
    }, errorCallback);    
  },
  
  googleRangeQuery: function(feedUri, range) {
    var query = new google.gdata.calendar.CalendarEventQuery(feedUri);
    query.setMinimumStartTime(new google.gdata.DateTime(new Date(range[0])));
    query.setMaximumStartTime(new google.gdata.DateTime(new Date(range[1])));
    return query;
  }
};