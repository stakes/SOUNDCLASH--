require 'httparty'

class RdioApi
  
  include HTTParty
  include Rdio
  format :json
  
  API_KEY = 'ns4d9bprmp8gcz3rzxy4v3a7'
  API_SECRET = 'qxcEdW8Wsd'
  API_ROOT = 'http://api.rdio.com/1/'
  
  def self.get_tracks_for(options={})
    !options[:results].blank? ? results = '&count='+options[:results] : results = '&results=10'
    Rdio.init(API_KEY, API_SECRET)
    Rdio.api.getTracksForArtist('r46088')
  end
  
end