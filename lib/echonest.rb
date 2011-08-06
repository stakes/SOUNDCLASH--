require 'httparty'

class Echonest
  
  include HTTParty
  format :json
  
  API_KEY = 'VDALNBGDIEHQVTULZ'
  
end