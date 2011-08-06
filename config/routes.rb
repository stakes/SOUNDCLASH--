Template::Application.routes.draw do
  
  devise_for :users, :controllers => {:registrations => 'registrations'}
  
  
  match '/auth/:provider/callback', :to => 'authentications#create'
  match '/auth/failure', :to => 'authentications#index'
  resources :authentications
  
  match '/api/similar/:astr', :to => 'api#similar_artists'
  match '/api/tracks/:aid', :to => 'api#tracks_by_artist'

  root :to => "home#landing"

end
