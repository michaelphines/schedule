require 'spec_helper'

describe "events/edit.html.erb" do
  before(:each) do
    assign(:event, @event = stub_model(Event,
      :new_record? => false,
      :key => "MyString",
      :title => "MyString",
      :email => "MyString"
    ))
  end

  it "renders the edit event form" do
    render

    response.should have_selector("form", :action => event_path(@event), :method => "post") do |form|
      form.should have_selector("input#event_key", :name => "event[key]")
      form.should have_selector("input#event_title", :name => "event[title]")
      form.should have_selector("input#event_email", :name => "event[email]")
    end
  end
end
