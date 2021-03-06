class EventsController < ApplicationController

  def show
    @event = Event.from_param(params[:id])
    @time_table = TimeTable.new
    
    respond_to do |format|
      format.html
      format.xml  { render :xml => @event }
    end
  end

  def new
    @event = Event.new

    respond_to do |format|
      format.html
      format.xml  { render :xml => @event }
    end
  end

  def create
    @event = Event.new(params[:event])
    @time_table = TimeTable.new(:email => params[:event][:email])
    @event.time_tables << @time_table
    
    respond_to do |format|
      if @event.valid? && @time_table.save
        flash[:new_event] = true
        format.html { redirect_to(edit_event_time_table_url(@event.permalink, @time_table.permalink)) }
        format.xml  { render :xml => @event, :status => :created, :location => @event }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @event.errors, :status => :unprocessable_entity }
      end
    end
  end
  
end
