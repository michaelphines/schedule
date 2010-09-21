ScheduleButler = {
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
    
    $('#calendarSelect .hour').tipTip();
  }
};