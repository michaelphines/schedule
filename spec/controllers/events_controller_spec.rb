require 'spec_helper'

describe EventsController do

  def mock_event(stubs={})
    @mock_event ||= mock_model(Event, stubs).as_null_object
  end

  def mock_time_table(stubs={})
    @mock_time_table ||= mock_model(TimeTable, stubs).as_null_object
  end

  describe "GET show" do
    it "assigns the requested event as @event" do
      Event.stub(:from_param).with("37") { mock_event }
      get :show, :id => "37"
      assigns(:event).should be(mock_event)
    end
  end

  describe "GET new" do
    it "assigns a new event as @event" do
      Event.stub(:new) { mock_event }
      get :new
      assigns(:event).should be(mock_event)
    end
  end

  describe "POST create" do

    describe "with valid params" do
      it "assigns a newly created event as @event" do
        Event.stub(:new) { mock_event(:save => true) }
        TimeTable.stub(:new) { mock_time_table(:save => true) }
        post :create, :event => {'these' => 'params'}
        assigns(:event).should be(mock_event)
      end

      it "assigns a newly created time_table as @time_table" do
        Event.stub(:new) { mock_event(:save => true, :time_tables => []) }
        TimeTable.should_receive(:new) { mock_time_table(:save => true) }
        post :create, :event => {'these' => 'params'}
        assigns(:time_table).should be(mock_time_table)
      end

      it "redirects to edit a new TimeTable in the event" do
        email = "john@mrdoe.com"
        time_tables = []
        Event.stub(:new) { mock_event(:save => true, :time_tables => time_tables) }

        TimeTable.should_receive(:new).with(:email => email).and_return(mock_time_table)
        time_tables.should_receive(:<<).with(mock_time_table)
        post :create, :event => {:email => email}
        response.should redirect_to(edit_event_time_table_url(mock_event, mock_time_table))
      end
      
      it "flashes a new_event dialog" do
        Event.stub(:new) { mock_event(:save => true) }
        TimeTable.stub(:new) { mock_time_table(:save => true) }
        post :create, :event => {'these' => 'params'}

        flash[:new_event].should == true
      end
    end

    describe "with invalid params" do
      it "assigns a newly created but unsaved event as @event" do
        Event.stub(:new) { mock_event(:save => false) }
        TimeTable.stub(:new) { mock_time_table(:save => false) }
        post :create, :event => {'these' => 'params'}
        assigns(:event).should be(mock_event)
      end

      it "re-renders the 'new' template" do
        Event.stub(:new) { mock_event(:save => false) }
        TimeTable.stub(:new) { mock_time_table(:save => false) }
        post :create, :event => {}
        response.should render_template("new")
      end
    end

  end
end
