require 'spec_helper'

describe "events/show.html.erb" do
  before(:each) do
    assign(:event, @event = stub_model(Event,
      :key => "MyString",
      :title => "MyString",
      :email => "MyString"
    ))
  end

  it "renders attributes in <p>" do
    render
    response.should contain("MyString")
    response.should contain("MyString")
    response.should contain("MyString")
  end
end
