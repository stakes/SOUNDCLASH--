require 'httparty'

class Rdio
  
  include HTTParty
  format :json
  
  API_KEY = 'ns4d9bprmp8gcz3rzxy4v3a7'
  API_SECRET = 'qxcEdW8Wsd'
  
end