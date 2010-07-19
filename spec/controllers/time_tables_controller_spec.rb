require 'spec_helper'

describe TimeTablesController do

  def mock_time_table(stubs={})
    @mock_time_table ||= mock_model(TimeTable, stubs).as_null_object
  end

  describe "GET index" do
    it "assigns all time_tables as @time_tables" do
      TimeTable.stub(:all) { [mock_time_table] }
      get :index
      assigns(:time_tables).should eq([mock_time_table])
    end
  end

  describe "GET show" do
    it "assigns the requested time_table as @time_table" do
      TimeTable.stub(:find).with("37") { mock_time_table }
      get :show, :id => "37"
      assigns(:time_table).should be(mock_time_table)
    end
  end

  describe "GET new" do
    it "assigns a new time_table as @time_table" do
      TimeTable.stub(:new) { mock_time_table }
      get :new
      assigns(:time_table).should be(mock_time_table)
    end
  end

  describe "GET edit" do
    it "assigns the requested time_table as @time_table" do
      TimeTable.stub(:find).with("37") { mock_time_table }
      get :edit, :id => "37"
      assigns(:time_table).should be(mock_time_table)
    end
  end

  describe "POST create" do

    describe "with valid params" do
      it "assigns a newly created time_table as @time_table" do
        TimeTable.stub(:new).with({'these' => 'params'}) { mock_time_table(:save => true) }
        post :create, :time_table => {'these' => 'params'}
        assigns(:time_table).should be(mock_time_table)
      end

      it "redirects to the created time_table" do
        TimeTable.stub(:new) { mock_time_table(:save => true) }
        post :create, :time_table => {}
        response.should redirect_to(time_table_url(mock_time_table))
      end
    end

    describe "with invalid params" do
      it "assigns a newly created but unsaved time_table as @time_table" do
        TimeTable.stub(:new).with({'these' => 'params'}) { mock_time_table(:save => false) }
        post :create, :time_table => {'these' => 'params'}
        assigns(:time_table).should be(mock_time_table)
      end

      it "re-renders the 'new' template" do
        TimeTable.stub(:new) { mock_time_table(:save => false) }
        post :create, :time_table => {}
        response.should render_template("new")
      end
    end

  end

  describe "PUT update" do

    describe "with valid params" do
      it "updates the requested time_table" do
        TimeTable.should_receive(:find).with("37") { mock_time_table }
        mock_time_table.should_receive(:update_attributes).with({'these' => 'params'})
        put :update, :id => "37", :time_table => {'these' => 'params'}
      end

      it "assigns the requested time_table as @time_table" do
        TimeTable.stub(:find) { mock_time_table(:update_attributes => true) }
        put :update, :id => "1"
        assigns(:time_table).should be(mock_time_table)
      end

      it "redirects to the time_table" do
        TimeTable.stub(:find) { mock_time_table(:update_attributes => true) }
        put :update, :id => "1"
        response.should redirect_to(time_table_url(mock_time_table))
      end
    end

    describe "with invalid params" do
      it "assigns the time_table as @time_table" do
        TimeTable.stub(:find) { mock_time_table(:update_attributes => false) }
        put :update, :id => "1"
        assigns(:time_table).should be(mock_time_table)
      end

      it "re-renders the 'edit' template" do
        TimeTable.stub(:find) { mock_time_table(:update_attributes => false) }
        put :update, :id => "1"
        response.should render_template("edit")
      end
    end

  end

  describe "DELETE destroy" do
    it "destroys the requested time_table" do
      TimeTable.should_receive(:find).with("37") { mock_time_table }
      mock_time_table.should_receive(:destroy)
      delete :destroy, :id => "37"
    end

    it "redirects to the time_tables list" do
      TimeTable.stub(:find) { mock_time_table(:destroy => true) }
      delete :destroy, :id => "1"
      response.should redirect_to(time_tables_url)
    end
  end

end
