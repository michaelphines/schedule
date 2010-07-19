function getDaysFromCalendar(calendar) {
	var week = calendar.children("ul").first();
	return week.children("li")
}

function getDateFromCalendar(calendar) {
	var currentDateDiv = calendar.find("div.title span.currentDate");
	var currentDate = new Date(currentDateDiv.text())
	return currentDate;
}

var calendar;

beforeEach(function() {
	calendar = $('<div>');
});

describe('appearance', function() {
	it('shows date of the current week', function() {
		var startDate = new Date(1987,1,8); //This date was a Sunday
		calendar.calendarSelect({ startDate: startDate });
		var currentDate = getDateFromCalendar(calendar);
		expect(currentDate).toEqual(startDate);
	});

	it('adds previous and next week links', function() {
		calendar.calendarSelect();
		linkTexts = 
			calendar.children("a").map(function() {
				return $(this).text().toLowerCase();
			}).toArray();
		expect(linkTexts).toContain('next week');
		expect(linkTexts).toContain('previous week');
	});
});

describe('selecting times', function() {
  it('has 24 hours in the day to select', function() {
		calendar.calendarSelect();

		var firstDay = getDaysFromCalendar(calendar).first();
		var hours = firstDay.find("ul li");
		expect(hours.length).toEqual(24);
  });
  
  it('starts at 12 AM', function() {
		calendar.calendarSelect();

		var firstDay  = getDaysFromCalendar(calendar).first();
		var firstHour = firstDay.find("ul li").first();
		expect(firstHour.text()).toEqual("12a");
  });
  
  it('should allow selecting hours', function() {
    spyOn($.fn, "selectable");
    calendar.calendarSelect();
    expect($.fn.selectable).wasCalled();
  });
});

describe('week changing functions', function() {
  var startDate;
  
  beforeEach(function() {
		startDate = new Date(1987,1,8); //This date was a Sunday
		calendar.calendarSelect({ startDate: startDate });
  });
  
	it('goes to the previous week when previous week is clicked', function() {
    calendar.children("a.previous").click();
		var sundayListItem = getDaysFromCalendar(calendar).first();
		expect(sundayListItem.children("span.date").text()).toEqual('1');
	});
	
	it('changes the date when previous week is clicked', function() {
		calendar.children("a.previous").click();
		var currentDate = getDateFromCalendar(calendar);
		expect(currentDate).toEqual(new Date(1987,1,1));
	});
  
	it('goes to the next week when next week is clicked', function() {
		calendar.children("a.next").click();
		var sundayListItem = getDaysFromCalendar(calendar).first();
		expect(sundayListItem.children("span.date").text()).toEqual('15');
	});
	
	it('changes the date when next week is clicked', function() {
		calendar.children("a.next").click();
		var currentDate = getDateFromCalendar(calendar);
		expect(currentDate).toEqual(new Date(1987,1,15));
	});
});

describe('calendar select options', function() {
	var myBirthday;
	
	beforeEach(function() {
		myBirthday = new Date(1987,1,11); 
	});
	
	it('selects dates when given a value', function() {
	  selectDateText = "February 11, 1987 10:00 AM";
	  selectDate = new Date(selectDateText);
	  calendar.calendarSelect({ value: [selectDateText], startDate: selectDate });
    selectedDate = calendar.find(".ui-selected").first();
    expect(selectedDate.data("time").valueOf()).toEqual(selectDate.valueOf());
	});
	
  it('creates a week with 7 days', function() {
		calendar.calendarSelect();
		var days = getDaysFromCalendar(calendar);
		
		expect(days.length).toEqual(7);
	});
	
	it('starts the days on the sunday of the specified startDate', function() {
		calendar.calendarSelect({ startDate: myBirthday });
		var sundayListItem = getDaysFromCalendar(calendar).first();
		
		// The 11th was a Wednesday, so the previous Sunday was the 8th.
		expect(sundayListItem.children("span.date").text()).toEqual('8');
	});
	
	it('uses today as the start date if no date is specified', function() {
		var todaysDate = new Date().getDate().toString();

		calendar.calendarSelect();
		var dayNumbers = 
			getDaysFromCalendar(calendar).map(function() {
				return $(this).children("span.date").text();
			}).toArray();
		
		expect(dayNumbers).toContain(todaysDate);
	});
});