# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
Schedule::Application.initialize!

ActionMailer::Base.smtp_settings = {  
  :address              => "smtp.gmail.com",
  :port                 => 587,
  :domain               => "michaelphines.net", 
  :user_name            => "schedulebutler@michaelphines.net",
  :password             => "qae31dzc",
  :authentication       => "plain",
  :enable_starttls_auto => true
}