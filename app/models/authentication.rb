class Authentication
  include Mongoid::Document
  embedded_in :user
  
  field :provider, :type => String
  field :uid, :type => String
  field :token, :type => String
  field :secret, :type => String
    
  
  
  def provider_name
    if provider == 'open_id'
      "OpenID"
    else
      provider.titleize
    end
  end
    
    
  class << self
     def twitter_auth
       where(:provider => 'twitter')
     end
   end
end
