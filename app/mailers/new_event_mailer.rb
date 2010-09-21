class NewEventMailer < ActionMailer::Base
  default :from => "schedulebutler@michaelphines.net"
  
  def created_event(event, time_table)  
    @event = event
    @time_table = time_table
    mail(:to => event.email, :subject => "You've created '#{event.title}'")
  end
  
  def joined_event(event, time_table)  
    @event = event
    @time_table = time_table
    mail(:to => time_table.email, :subject => "Thanks for joining '#{event.title}'")
  end
end
