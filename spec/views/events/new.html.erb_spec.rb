require 'spec_helper'

describe "events/new.html.erb" do
  before(:each) do
    assign(:event, stub_model(Event,
      :new_record? => true,
      :key => "MyString",
      :title => "MyString",
      :email => "MyString"
    ))
  end

  it "renders new event form" do
    render

    response.should have_selector("form", :action => events_path, :method => "post") do |form|
      form.should have_selector("input#event_key", :name => "event[key]")
      form.should have_selector("input#event_title", :name => "event[title]")
      form.should have_selector("input#event_email", :name => "event[email]")
    end
  end
end
