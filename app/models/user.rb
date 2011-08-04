class User
  include Mongoid::Document
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable

  embeds_many :authentications

  field :avatar_url, :type => String
  field :name, :type => String
  field :role, :type => String, :default => "user"
  ROLES = %w[admin user]

  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :trackable, :validatable

  def password_required?
    false
  end
  
  def email_required?
    false
  end

  def auth_type
    auth = self.authentications
    return auth.collect{|x| x.provider}
  end

  def apply_omniauth(omniauth)
    # self.email = omniauth['user_info']['email'] if email.blank?
    authentications.build(
      :provider => omniauth['provider'],
      :uid => omniauth['uid'],
      :token => omniauth['credentials']['token'],
    :secret => omniauth['credentials']['secret'])
    if omniauth['provider'] == 'twitter'
      self.avatar_url = omniauth['user_info']['image'] if avatar_url.blank?

    elsif omniauth['provider'] == 'facebook'
      p 'facebook. zomg.'
      if not self.avatar_url
        fb_user = FbGraph::User.me(omniauth['credentials']['token']).fetch
        self.avatar_url = fb_user.picture
      end
    end
  end
end
