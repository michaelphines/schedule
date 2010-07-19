require 'spec_helper'

describe "events/index.html.erb" do
  before(:each) do
    assign(:events, [
      stub_model(Event,
        :key => "MyString",
        :title => "MyString",
        :email => "MyString"
      ),
      stub_model(Event,
        :key => "MyString",
        :title => "MyString",
        :email => "MyString"
      )
    ])
  end

  it "renders a list of events" do
    render
    response.should have_selector("tr>td", :content => "MyString".to_s, :count => 2)
    response.should have_selector("tr>td", :content => "MyString".to_s, :count => 2)
    response.should have_selector("tr>td", :content => "MyString".to_s, :count => 2)
  end
end
