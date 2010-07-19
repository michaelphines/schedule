require 'spec_helper'

describe "time_tables/index.html.erb" do
  before(:each) do
    assign(:time_tables, [
      stub_model(TimeTable,
        :key => "MyString",
        :name => "MyString"
      ),
      stub_model(TimeTable,
        :key => "MyString",
        :name => "MyString"
      )
    ])
  end

  it "renders a list of time_tables" do
    render
    response.should have_selector("tr>td", :content => "MyString".to_s, :count => 2)
    response.should have_selector("tr>td", :content => "MyString".to_s, :count => 2)
  end
end
