class TimeTablesController < ApplicationController
  # GET /time_tables/new
  # GET /time_tables/new.xml
  def new
    @time_table = TimeTable.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @time_table }
    end
  end

  # GET /time_tables/1/edit
  def edit
    @event = Event.from_param(params[:event_id])
    @time_table = @event.time_tables.where(:permalink => params[:id]).first
    @times = @time_table.times.to_json
  end

  # POST /time_tables
  # POST /time_tables.xml
  def create
    @event = Event.from_param(params[:event_id])
    @time_table = TimeTable.new(params[:time_table])
    @event.time_tables << @time_table

    respond_to do |format|
      if @time_table.save
        flash[:new_time_table] = true
        format.html { redirect_to(edit_event_time_table_path(@event, @time_table), :notice => 'Time table was successfully created.') }
        format.xml  { render :xml => @time_table, :status => :created, :location => @time_table }
      else
        flash[:email] = params[:time_table][:email]
        format.html { redirect_to(@event) }
        format.xml  { render :xml => @time_table.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /time_tables/1
  # PUT /time_tables/1.xml
  def update
    @event = Event.from_param(params[:event_id])
    @time_table = @event.time_tables.where(:permalink => params[:id]).first
    success = params[:time_table] && params[:time_table][:times] && 
              @time_table.update_attributes(:times => JSON.parse(params[:time_table][:times]))
    success ? update_success : update_failure
  rescue JSON::ParserError
    update_failure
  end

  # DELETE /time_tables/1
  # DELETE /time_tables/1.xml
  def destroy
    @time_table = TimeTable.find(params[:id])
    @time_table.destroy

    respond_to do |format|
      format.html { redirect_to(time_tables_url) }
      format.xml  { head :ok }
    end
  end

  def send_created_event
    event = Event.from_param(params[:event_id])
    time_table = event.time_tables.where(:permalink => params[:id]).first
    NewEventMailer.created_event(event, time_table).deliver
    render :text => '"OK"'
  end
  
  def send_joined_event
    event = Event.from_param(params[:event_id])
    time_table = event.time_tables.where(:permalink => params[:id]).first
    NewEventMailer.joined_event(event, time_table).deliver
    render :text => '"OK"'
  end

private
  
  def update_failure
    respond_to do |format|
      format.html { redirect_to(edit_event_time_table_path(@event, @time_table), :notice => 'Time table was successfully updated.') }
      format.xml  { head :ok }
    end
  end
  
  def update_success
    respond_to do |format|
      format.html { redirect_to(edit_event_time_table_path(@event, @time_table), :error => 'Error updating time table.') }
      format.xml  { render :xml => @time_table.errors, :status => :unprocessable_entity }
    end
  end


end
