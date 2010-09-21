describe('ScheduleButler', function() {
  beforeEach(function() {
    //jasmine doesn't reset the DOM after each test
    $('body').html('');
  });
  describe('.createCalendar', function() {
    describe('new calendar', function() {
      it('calls it a new schedule if maxAttendance is 0', function () {
        $('body').append($('<div id="example"></div>'));
        spyOn(ScheduleButler, 'parseAllFields').andReturn({ maxAttendance: {count: 0} });      

        ScheduleButler.createCalendar("#example")
        expect($("#example").hasClass("newSchedule")).toBeTruthy;
      });
    });

    describe('standard options', function() {
      var myBirthday;
      beforeEach(function() {
        myBirthday = new Date(1987,1,11);
        var bestDay = { 
          count: 1, 
          emails: ['john@mrdoe.com'], 
          time: myBirthday
        };
        spyOn(ScheduleButler, 'parseAllFields').andReturn({
          times: [myBirthday.valueOf()],
          availability: [bestDay],
          maxAttendance: bestDay
        });        
      });
      
      it('starts on the day with the best attendance', function() {
        spyOn($.fn, 'calendarSelect').andCallFake(function(object) {
          expect(object.startDate).toEqual(myBirthday);
        });
        ScheduleButler.createCalendar("#bogus")
        expect($.fn.calendarSelect).wasCalled();
      });
      
      it('is static if called with true', function() {
        spyOn($.fn, 'calendarSelect').andCallFake(function(object) {
          expect(object.static).toBeTruthy();
        });
        ScheduleButler.createCalendar("#bogus", true)
        expect($.fn.calendarSelect).wasCalled();
      });
      
      it('is not static by default', function() {
        spyOn($.fn, 'calendarSelect').andCallFake(function(object) {
          expect(object.static).toBeFalsy();
        });
        ScheduleButler.createCalendar("#bogus")
        expect($.fn.calendarSelect).wasCalled();
      });
    });
  });
  
  describe(".parseField", function() {
    beforeEach(function() {
      $('body').append($('<input id="example" value="[1234]" />'));
    });
    
    it("puts the JSON parsed data in the 'value' data store", function() {
      ScheduleButler.parseField("#example");
      expect($("#example").data("value")).toEqual([1234]);
    });
    
    it("doesn't parse again if not forced", function() {
      $("#example").data("value", "test");
      ScheduleButler.parseField("#example");
      expect($("#example").data("value")).toEqual("test");
    });
    
    it("parses again if forced", function() {
      $("#example").data("value", "test");
      ScheduleButler.parseField("#example", true);
      expect($("#example").data("value")).toEqual([1234]);
    });
  });

  describe('.parseAllFields', function() {
    describe('parsing', function() {
      beforeEach(function() {
        spyOn(ScheduleButler, 'parseField').andCallThrough();
      });

      it('parses the times field', function() {
        ScheduleButler.parseAllFields(false);
        expect(ScheduleButler.parseField).wasCalledWith("#time_table_times", false);
      });

      it('parses the availability field', function() {
        ScheduleButler.parseAllFields(false);
        expect(ScheduleButler.parseField).wasCalledWith("#availability", false);
      });

      it('parses the maxAttendance field', function() {
        ScheduleButler.parseAllFields(false);
        expect(ScheduleButler.parseField).wasCalledWith("#max_attendance", false);
      });
    });

    describe('return values', function() {
      it('returns all the fields in an object', function() {
        spyOn(ScheduleButler, 'parseField').andCallFake(function(selector) {
          return selector;
        });
        var fields = ScheduleButler.parseAllFields(false);
        expect(fields).toEqual({
          times: "#time_table_times",
          availability: "#availability",
          maxAttendance: "#max_attendance"
        });
      });
    });
    
  });
});