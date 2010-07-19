class TimeTable < BaseModel
  include Mongoid::Document
  include Permalinkable
  
  field :times, :type => Array
  field :email, :type => String
  
  embedded_in :event, :inverse_of => :time_tables

  validates :email,
            :presence => true,
            :format => { :with => /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i }

end
