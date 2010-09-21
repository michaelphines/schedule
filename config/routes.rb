Schedule::Application.routes.draw do
  resources :events, :only => [:show, :new, :create] do
    resources :time_tables, :only => [:edit, :create, :update] do
      member do
        post :send_created_event
        post :send_joined_event
      end
    end
  end
  root :to => "events#new"
end
