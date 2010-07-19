class Event < BaseModel
  include Mongoid::Document
  include Permalinkable

  field :title, :type => String
  field :email, :type => String
  
  embeds_many :time_tables  

  validates :title, :presence => true 
  validates :email,
            :presence => true,
            :format => { :with => /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i }

  def availability
    map = <<-MAP
      function() {
        if (this._id == '#{id}' && this.time_tables) {
          this.time_tables.forEach(function(time_table) {
            var result = { 
              count: 1, 
              emails: [time_table.email]
            };

            if (time_table.times) time_table.times.forEach(function(time) {
              emit(time, result)
            });
          });
        }
      }
    MAP

    reduce = <<-REDUCE
      function(key, values) {
        var result = { 
          count: 0,
          emails: [] 
        };
        
        values.forEach(function(value) {
          result.count += value.count;
          result.emails = result.emails.concat(value.emails)
        });
        
        return result;
      };
    REDUCE

    collection.map_reduce(map, reduce).find().collect do |hash| 
      {
        :time => hash['_id'], 
        :count => hash['value']['count'],
        :emails => hash['value']['emails']
      }
    end
  end
  
  def max_attendance
    availability.max { |a,b| a[:count] <=> b[:count] }
  end
  
end
