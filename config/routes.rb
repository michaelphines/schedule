Schedule::Application.routes.draw do
  resources :events, :only => [:show, :new, :create] do
    resources :time_tables, :only => [:edit, :create, :update]
  end
  root :to => "events#new"
end
