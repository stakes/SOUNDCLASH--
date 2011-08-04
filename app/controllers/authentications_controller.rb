class AuthenticationsController < ApplicationController
  before_filter :authenticate_user!, :except => [:create]
  
  
  def index
    @authentications = current_user.authentications if current_user
  end
  
  def create
    omniauth = request.env["omniauth.auth"]
    authentication = User.where("authentications.uid" => omniauth['uid'], "authentications.provider" => omniauth['provider']).first

    if authentication

      flash[:notice] = "Signed in successfully"
      sign_in_and_redirect(user, :remember_me => true)
    elsif current_user
      current_user.authentications.create!(
      :provider => omniauth['provider'], 
      :uid => omniauth['uid'],
      :token => omniauth['credentials']['token'],
      :secret => omniauth['credentials']['secret'])
      
      flash[:notice] = "Authentication Successful"
      redirect_to authentications_url
    else
      user = User.new
      user.apply_omniauth(omniauth)
      if user.save
        flash[:notice] = "Signed in Successfully"
        sign_in_and_redirect(user, :remember_me => true)
      else
        session[:omniauth] = omniauth.except('extra')
      
        redirect_to new_user_registration_url
      end
    end
  end
  
  def destroy
    @authentication = current_user.authentications.find(params[:id])
    @authentication.destroy
    flash[:notice] = "Successfully destroyed authentication."
    redirect_to [@authentication]
  end
end