require 'spec_helper'

describe EventsController do

  def mock_event(stubs={})
    @mock_event ||= mock_model(Event, stubs).as_null_object
  end

  def mock_time_table(stubs={})
    @mock_event ||= mock_time_table(TimeTable, stubs).as_null_object
  end

  describe "GET show" do
    it "assigns the requested event as @event" do
      Event.stub(:find).with("37") { mock_event }
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
        Event.stub(:new).with({'these' => 'params'}) { mock_event(:save => true) }
        post :create, :event => {'these' => 'params'}
        assigns(:event).should be(mock_event)
      end

      it "assigns a newly created time_table as @time_table" do
        TimeTable.stub(:new).with({'these' => 'params'}) { mock_event(:save => true) }
        post :create, :event => {'these' => 'params'}
        assigns(:time_table).should be(mock_event)
      end

      it "redirects to the created event" do
        Event.stub(:new) { mock_event(:save => true) }
        post :create, :event => {}
        response.should redirect_to(event_url(mock_event))
      end
    end

    describe "with invalid params" do
      it "assigns a newly created but unsaved event as @event" do
        Event.stub(:new).with({'these' => 'params'}) { mock_event(:save => false) }
        post :create, :event => {'these' => 'params'}
        assigns(:event).should be(mock_event)
      end

      it "re-renders the 'new' template" do
        Event.stub(:new) { mock_event(:save => false) }
        post :create, :event => {}
        response.should render_template("new")
      end
    end

  end
end
