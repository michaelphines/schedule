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
    @time_table.times = @time_table.times.to_json
  end

  # POST /time_tables
  # POST /time_tables.xml
  def create
    @event = Event.from_param(params[:event_id])
    @time_table = TimeTable.new(params[:time_table])
    @event.time_tables << @time_table

    respond_to do |format|
      if @time_table.save
        flash[:alert] = "Bookmark this page now, it's the only way to edit your changes!"
        format.html { redirect_to(edit_event_time_table_path(@event, @time_table), :notice => 'Time table was successfully created.') }
        format.xml  { render :xml => @time_table, :status => :created, :location => @time_table }
      else
        format.html { render :action => '/events/show', :id => @event }
        format.xml  { render :xml => @time_table.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /time_tables/1
  # PUT /time_tables/1.xml
  def update
    @event = Event.from_param(params[:event_id])
    @time_table = @event.time_tables.where(:permalink => params[:id]).first
    params[:time_table][:times] = JSON.parse(params[:time_table][:times])

    respond_to do |format|
      if @time_table.update_attributes(params[:time_table])
        format.html { redirect_to(edit_event_time_table_path(@event, @time_table), :notice => 'Time table was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render @time_table }
        format.xml  { render :xml => @time_table.errors, :status => :unprocessable_entity }
      end
    end
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
end
