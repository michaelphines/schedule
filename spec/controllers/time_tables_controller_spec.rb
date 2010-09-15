require 'spec_helper'

describe TimeTablesController do

  before(:each) do
    @mock_time_table = mock_model(TimeTable, :times => [], :save => true).as_null_object
    @time_tables = [@mock_time_table]
    @mock_event = mock_model(Event, :time_tables => @time_tables, :save => true, :update_attributes => true).as_null_object
    @time_tables.stub(:where).and_return([@mock_time_table])
    Event.stub(:from_param).with("1").and_return(@mock_event)
  end

  describe "GET edit" do
    it "assigns the requested time_table as @time_table" do
      @mock_event.stub(:time_tables).and_return(mock(:where => [@mock_time_table]))
      Event.stub(:from_param).and_return(@mock_event)

      get :edit, :id => "37", :event_id => "1"
      assigns(:time_table).should be(@mock_time_table)
    end
  end

  describe "POST create" do

    describe "with valid params" do
      it "assigns a newly created time_table as @time_table" do
        TimeTable.stub(:new).with({'these' => 'params'}).and_return(@mock_time_table)
        post :create, :time_table => {'these' => 'params'}, :event_id => "1"
        assigns(:time_table).should be(@mock_time_table)
      end

      it "redirects to the created time_table" do
        TimeTable.stub(:new).and_return(@mock_time_table)
        post :create, :time_table => {}, :event_id => "1"
        response.should redirect_to(edit_event_time_table_url(@mock_event, @mock_time_table))
      end
    end

    describe "with invalid params" do
      it "assigns a newly created but unsaved time_table as @time_table" do
        TimeTable.stub(:new).with({'these' => 'params'}).and_return(@mock_time_table)
        post :create, :time_table => {'these' => 'params'}, :event_id => "1"
        assigns(:time_table).should be(@mock_time_table)
      end

      it "redirects to the 'event" do
        TimeTable.stub(:new).and_return(@mock_time_table)
        @mock_time_table.stub(:save).and_return(false)
        post :create, :time_table => {}, :event_id => "1"
        response.should redirect_to(@mock_event)
      end
    end

  end

  describe "PUT update" do

    describe "with valid params" do
      it "updates the requested time_table" do
        @time_tables.stub(:where).with(:permalink => "37").and_return([@mock_time_table])
        @mock_time_table.should_receive(:update_attributes).with({'these' => 'params'})
        put :update, :id => "37", :time_table => {'these' => 'params'}, :event_id => "1"
      end

      it "assigns the requested time_table as @time_table" do
        @mock_time_table.stub(:update_attributes).and_return(true)
        TimeTable.stub(:find).and_return(@mock_time_table)
        put :update, :id => "1", :event_id => "1"
        assigns(:time_table).should be(@mock_time_table)
      end

      it "redirects to edit the time_table" do
        put :update, :id => "1", :event_id => "1"
        response.should redirect_to(edit_event_time_table_url(@mock_event, @mock_time_table))
      end
    end

    describe "with invalid params" do
      it "assigns the time_table as @time_table" do
        TimeTable.stub(:find).and_return(@mock_time_table)
        put :update, :id => "1", :event_id => "1"
        assigns(:time_table).should be(@mock_time_table)
      end

      it "redirects back to the edit page" do
        @mock_time_table.stub(:update_attributes).and_return(false)
        TimeTable.stub(:find).and_return(@mock_time_table)
        put :update, :id => "1", :event_id => "1", :time_table => {:times => "not a times array"}
        response.should redirect_to(edit_event_time_table_url(@mock_event, @mock_time_table))
      end
    end

  end
end
