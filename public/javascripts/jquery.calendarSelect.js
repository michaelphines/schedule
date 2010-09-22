(function($){
  var defaultSettings = { 
    startDate: new Date(),
    value: [],
    animate: false,
    static: false,
    maxAttendance: 0,
    availability: []
  }
  
  $.fn.calendarSelect = function(options) {
    var settings = $.extend({}, defaultSettings, options)
    var calendar = new Calendar(settings);
    calendar.init(this);
  }
  
  function Calendar(settings) {
    this.settings = settings;
    this.domObject = undefined;
    this.unselecting = false;
    this.currentDate = dayOf(settings.startDate, 0);
    this.availability = {};
    this.emails = {};

    this.init = function(domObject) {
      this.domObject = $(domObject);
      this.selectedTimes({});
      this.loadData();
      this.createContent();
    };

    this.loadData = function() {
      try {
        this.startDate = new Date(this.settings.startDate)
        
        var selectedTimes = this.selectedTimes();
        $(this.settings.value).each(function(index, value) {
          if (value) {
            date = new Date(value).valueOf();
            selectedTimes[date] = date;
          }
        });

        var availability = this.availability;
        var emails = this.emails;
        var maxAttendance = this.settings.maxAttendance;
        $(this.settings.availability).each(function(index, value) {
          if (value) {
            date = new Date(value.time).valueOf();
            if (maxAttendance != 0) availability[date] = value.count/maxAttendance;
            emails[date] = value.emails;
          }
        });
      } catch(e) {
        this.startDate = new Date();
        this.availability = {};
        this.emails = {}
        this.selectedTimes({});
      }
    };
    
    this.createContent = function() {
      this.domObject.html('').append(this.drawWeek(settings.startDate));
      this.addNextAndPreviousLinks();
      this.addTitle(settings.startDate);
      this.makeSelectable();
    };

    this.makeSelectable = function() {
      if (!this.settings.static) {
        this.domObject.find("ul.days").selectable({
          filter: 'li.hour', 
          start: onStartSelection(this),
          selecting: onSelecting(this),
          selected: onSelected(this),
          unselected: onUnselected(this),
          stop: onStopSelection(this)
        });
      }
    };

    this.selectedTimes = function(value) {
      if (value != undefined) {
        this.domObject.data('calendarSelect', value);
        return this.domObject;
      } else {
        return this.domObject.data('calendarSelect');
      }
    };
    
    this.addNextAndPreviousLinks = function() {
      var calendar = this;
      
      $('<a class="previous" href="#">Previous Week</a>')
          .click(function(e) { calendar.switchWeek(-1); e.preventDefault(); })
          .prependTo(this.domObject);
              
      $('<a class="next" href="#">Next Week</a>')
          .click(function(e) { calendar.switchWeek(1); e.preventDefault(); })
          .appendTo(this.domObject);
    };

    this.switchWeek = function(weeks) {
      var nextDate  = addDays(this.currentDate, weeks * 7);
      var thisWeek  = this.domObject.children("ul").first();
      var nextWeek  = this.drawWeek(nextDate);
      var direction = weeks > 0 ? "down" : "up"

      nextWeek.hide();
      thisWeek.before(nextWeek)
              .remove();
      
      if (this.settings.animate) {
        nextWeek.show('slide', { direction: direction });
      } else {
        nextWeek.show();        
      }
      
      this.domObject.find("div.title span.currentDate").text(dateString(nextDate));
      this.currentDate = nextDate;
      this.makeSelectable();
    };

    this.drawWeek = function(date) {
      var week = $('<ul class="days">');
      for (var i = 0; i < 7; i++) {
        var dayItem  = $('<li class="day">');
        var dateSpan = $('<span class="date">');
        var thisDate = dayOf(date, i);
        dateSpan.text(dayString(thisDate.getDay()) + " " + thisDate.getDate());
        dayItem.data(thisDate)
               .append(dateSpan)
               .append(this.drawHours(thisDate))
               .appendTo(week);
      }
      return week
    };

    this.drawHours = function(date) {
      var thisTime = new Date(date);  
      var list = $('<ul class="hours">');
      for (var i = 0; i < 24; i++) {
        thisTime.setHours(i);

        var hour = (11 + i) % 12 + 1;
        var meridiem = i < 12 ? 'a' : 'p';
        
        var item = $('<li class="hour">');
        if (this.selectedTimes()[thisTime.valueOf()]) {
          item.addClass("ui-selected")
              .addClass("selected")
              .data("selected", true);
        }
        
        this.colorHour(item, thisTime);

        var emails = this.emails[thisTime.valueOf()];
        item.data("emails", emails);
        item.text(hour + meridiem)
            .data("time", thisTime.valueOf())
            .appendTo(list);
      };

      return list;
    };
    
    this.colorHour = function(item, time) {
      var availability = this.availability[time.valueOf()];
      if (!availability || availability < .33) {
        item.addClass('cold')
      } else if (availability < .66) {
        item.addClass('warm')
      } else {
        item.addClass('hot')
      }
    };

    this.addTitle = function(date) {
      var titleDiv = $('<div class="title">Week of </div>');
      var dateSpan = $('<span class="currentDate">');
      var dateText = dateString(dayOf(date, 0));
      dateSpan.text(dateText)
              .appendTo(titleDiv);

      this.domObject.prepend(titleDiv);
    };

    function onStartSelection(calendar) {
      return function(event, ui) {
        calendar.unselecting = $(event.originalTarget).data("selected");
        if (calendar.unselecting) calendar.domObject.addClass("cs-unselecting");
      }
    }

    function onSelecting(calendar) {
      return function(event, ui) {}
    }

    function onSelected(calendar) {
      return function(event, ui) {
        calendar.domObject.data('modified', true);
        
        var unselecting = calendar.unselecting;
        var selectedTimes = calendar.selectedTimes();

        var item = $(ui.selected);
        var itemTime = item.data("time");

        if (unselecting) {
          item.data("selected", false)
              .removeClass("ui-selected");

          delete selectedTimes[itemTime.valueOf()];
        } else {
          item.data("selected", true);
          selectedTimes[itemTime.valueOf()] = itemTime.valueOf();
        }
      }
    }

    function onUnselected(calendar) {
      return function(event, ui) {
        $(ui.unselected).addClass("ui-selected"); 
      }
    }
        
    function onStopSelection(calendar) {
      return function(event, ui) {
        calendar.domObject.removeClass("cs-unselecting");
      }
    }
    
    // Gets the date for a given day of the week
    // date: any date in the week
    // day: the day to get the date from, 0 is Sunday
    function dayOf(date, day) {
      var days = day - date.getDay();
      var newDate = new Date(date);
      newDate.setHours(0);
      newDate.setMinutes(0);
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
      newDate.setDate(date.getDate() + days);
      return newDate;
    }

    function addDays(today, days) {
      var newDate = new Date(today);
      newDate.setDate(today.getDate() + days);
      return newDate;   
    }

    function dateString(date) {
      return monthString(date.getMonth()) + ' '
               + date.getDate() + ', '
               + date.getFullYear();    
    }

    function monthString(n) {
      var months = ['January', 'February', 'March', 
        'April', 'May', 'June', 'July', 'August', 
        'September', 'October', 'November', 'December']
      return months[n];
    }

    function dayString(n) {
      var months = ['Sun', 'Mon', 'Tue',
      'Wed', 'Thu', 'Fri', 'Sat']
      return months[n];
    }
    
  }
})(jQuery);