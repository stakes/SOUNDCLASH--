Template::Application.routes.draw do
  
  devise_for :users, :controllers => {:registrations => 'registrations'}
  
  
  match '/auth/:provider/callback', :to => 'authentications#create'
  match '/auth/failure', :to => 'authentications#index'
  resources :authentications

  root :to => "home#landing"

end
