require 'httparty'

class EchonestApi
  
  include HTTParty
  format :json
  
  API_ROOT = 'http://developer.echonest.com/api/v4/'
  API_KEY = 'api_key=VDALNBGDIEHQVTULZ'
  FORMAT = '&format=json'
  RDIO = '&bucket=id:rdio-us-streaming'
  
  
  def self.get_artists(options={})
    !options[:results].blank? ? results = '&results='+options[:results] : results = '&results=10'
    if !options[:artist].blank?
      get (API_ROOT+'artist/search?'+API_KEY+FORMAT+'&name='+options[:artist]+results)
    elsif !options[:desc].blank?
      get (API_ROOT+'artist/search?'+API_KEY+FORMAT+'&description='+options[:desc]+results)
    end
  end
  
  def self.get_similar_to(options={})
    !options[:results].blank? ? results = '&results='+options[:results] : results = '&results=10'
    get (API_ROOT+'artist/similar?'+API_KEY+FORMAT+RDIO+'&name='+options[:artist]+results)
  end
  
end