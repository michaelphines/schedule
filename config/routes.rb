Schedule::Application.routes.draw do |map|
  resources :events, :only => [:show, :new, :create] do
    resources :time_tables, :only => [:edit, :create, :update]
  end
  root :to => "events#new"
end
