Rails.application.config.middleware.use OmniAuth::Builder do  
  provider :twitter, ENV["TWITTER_CONSUMER_KEY"], ENV["TWITTER_CONSUMER_SECRET"]
  provider :facebook, ENV["FACEBOOK_APP_ID"], ENV["FACEBOOK_APP_SECRET"], {:scope => 'publish_stream,email,user_about_me'}
end