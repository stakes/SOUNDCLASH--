Template::Application.routes.draw do
  
  devise_for :users, :controllers => {:registrations => 'registrations'}
  
  
  match '/auth/:provider/callback', :to => 'authentications#create'
  match '/auth/failure', :to => 'authentications#index'
  resources :authentications
  
  match '/api/similar_with_tracks', :to => 'api#similar_artists_with_rdio'
  match '/api/similar', :to => 'api#similar_artists'
  match '/api/tracks', :to => 'api#tracks_by_artist'
  match '/api/search', :to => 'api#desc_artists_with_rdio'
  match '/api/save', :to => 'api#save_playlist'
  
  match '/playlist/:id', :to => 'playlists#show'

  root :to => "home#landing"

end
