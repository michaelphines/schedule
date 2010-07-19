require 'spec_helper'

describe "time_tables/show.html.erb" do
  before(:each) do
    assign(:time_table, @time_table = stub_model(TimeTable,
      :key => "MyString",
      :name => "MyString"
    ))
  end

  it "renders attributes in <p>" do
    render
    response.should contain("MyString")
    response.should contain("MyString")
  end
end
