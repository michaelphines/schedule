require 'spec_helper'

describe "time_tables/new.html.erb" do
  before(:each) do
    assign(:time_table, stub_model(TimeTable,
      :new_record? => true,
      :key => "MyString",
      :name => "MyString"
    ))
  end

  it "renders new time_table form" do
    render

    response.should have_selector("form", :action => time_tables_path, :method => "post") do |form|
      form.should have_selector("input#time_table_key", :name => "time_table[key]")
      form.should have_selector("input#time_table_name", :name => "time_table[name]")
    end
  end
end
