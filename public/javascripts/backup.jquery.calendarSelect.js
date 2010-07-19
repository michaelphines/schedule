(function($){
  var defaultSettings = { 
    startDate: new Date(),
    value: []
  }
  
  $.fn.calendarSelect = function(options) {
    var settings = $.extend({}, defaultSettings, options)
    var calendar = new Calendar(settings);
    calendar.init(this);
  }
  
  function Calendar(settings) {
    this.settings = settings;
    this.domObject = undefined;
    this.currentDate = settings.startDate;
    this.selectedTimes = {};
    this.unselecting = false;

    this.init = function(domObject) {
      this.domObject = $(domObject);
      this.loadData(this.settings.value);
      this.createContent();
    };

    this.loadData = function(data) {
      var selectedTimes = this.selectedTimes;
      $(data).each(function() {
        date = Date.parse(this);
        selectedTimes[date] = date;
      });
    };
    
    this.createContent = function() {
      this.domObject.html('');
      this.drawWeek(settings.startDate);
      this.addNextAndPreviousLinks();
      this.drawTitle(settings.startDate);
      this.makeSelectable();
    };

    this.makeSelectable = function() {
      this.domObject.find("ul.days").selectable({
        filter: 'li.hour', 
        start: onStartSelection(this),
        selecting: onSelecting(this),
        selected: onSelected(this),
        unselected: onUnselected(this),
        stop: onStopSelection(this)
      });
    };
    
    this.addNextAndPreviousLinks = function() {
      var klass = this;
      var calendar = this.domObject;
      var previous = $('<a class="previous" href="#">Previous Week</a>');
      var next     = $('<a class="next" href="#">Next Week</a>');
      $(calendar).prepend(previous);
      $(calendar).append(next);

      previous.click(function(e) { klass.switchWeek(-1); e.preventDefault(); });
      next.click(function(e) { klass.switchWeek(1); e.preventDefault(); });
    }

    this.switchWeek = function(weeks) {
      var calendar = this.domObject;
      var startDate = this.currentDate;
      var nextDate  = addDays(startDate, weeks * 7);
      var thisWeek  = $(calendar).children("ul").first();
      var nextWeek  = this.drawWeek(nextDate);

      calendar.find("div.title span.currentDate").text(dateString(nextDate));
      this.currentDate = nextDate;
      thisWeek.before(nextWeek);
      thisWeek.remove();

      this.makeSelectable();
    }

    //date.getDay() returns the number of days today is from sunday
    this.drawWeek = function(date) {
      var calendar = this.domObject;
      var week = $('<ul class="days">');
      for (var i = 0; i < 7; i++) {
        var dayItem  = $('<li class="day">');
        var dateSpan = $('<span class="date">');
        var thisDate = addDays(date, i - date.getDay());
        dateSpan.text(thisDate.getDate());

        dayItem.data(thisDate);
        dayItem.append(dateSpan);
        dayItem.append(this.drawHours(thisDate));
        week.append(dayItem);
      }
      this.domObject.append(week);
    }

    this.drawHours = function(date) {
      var calendar = this.domObject;
      var thisTime = new Date(date);  
      var list = $('<ul class="hours">');
      for (var i = 0; i < 24; i++) {
        thisTime = new Date(thisTime.setHours(i));

        var item = $('<li class="hour">');
        var hour = (11 + i) % 12 + 1;
        var meridiem = i < 12 ? 'a' : 'p';
        var selectedTimes = this.selectedTimes;
        if (selectedTimes[thisTime.valueOf()]) {
          item.addClass("ui-selected")
          item.addClass("selected")
        }

        item.text(hour + meridiem);
        item.data("time", thisTime.valueOf());
        list.append(item);
      }

      return list;
    }

    this.drawTitle = function(date) {
      var titleDiv = $('<div class="title">Week of </div>');
      var dateSpan = $('<span class="currentDate">');
      var dateText = dateString(date);
      dateSpan.text(dateText);

      titleDiv.append(dateSpan);
      this.domObject.prepend(titleDiv);
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

    function onStartSelection = function(calendar) {
      return function(event, ui) {
        calendar.unselecting = $(event.originalTarget).data("selected");
      }
    }

    function onSelecting = function(calendar) {
      var unselecting = calendar.unselecting

      return function(event, ui) {
        var item = $(ui.selecting);
        if (unselecting) {
          calendar.addClass("cs-unselecting");
        }
      }
    }

    function onSelected = function(calendar) {
      var unselecting = calendar.unselecting;
      var selectedTimes = calendar.selectedTimes;

      return function(event, ui) {
        var item = $(ui.selected);
        var itemTime = item.data("time");

        if (unselecting) {
          item.data("selected", false);
          item.removeClass("ui-selected");

          delete selectedTimes[itemTime.valueOf()];
        } else {
          item.data("selected", true);
          selectedTimes[itemTime.valueOf()] = itemTime.valueOf();
        }
      }
    }

    function onUnselected = function(calendar) {
      return function(event, ui) {
        $(ui.unselected).addClass("ui-selected"); 
      }
    }
        
    function onStopSelection = function(calendar) {
      return function(event, ui) {
        calendar.removeClass("cs-unselecting");
      }
    }
    
    
  }
})(jQuery);