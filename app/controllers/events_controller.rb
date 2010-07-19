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
    
    respond_to do |format|
      if @event.save
        flash[:email] = @event.email
        flash[:alert] = "Bookmark this page, and send it to your friends, it's the only way to get here!"
        format.html { redirect_to(@event, :notice => 'Event was successfully created.') }
        format.xml  { render :xml => @event, :status => :created, :location => @event }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @event.errors, :status => :unprocessable_entity }
      end
    end
  end
  
end
