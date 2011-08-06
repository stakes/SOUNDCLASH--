class ApiController < ActionController::Base
  
  def similar_artists
    astr = params[:astr]
    if params[:type] == 'artist'
      resp = EchonestApi.get_similar_to(:artist => astr)
    else
      resp = EchonestApi.get_similar_to(:desc => astr)
    end
    p resp.inspect
    render :json => resp
  end
  
  def similar_artists_with_rdio
    astr = params[:astr]
    if params[:type] == 'artist'
      resp = EchonestApi.get_similar_to(:artist => astr)
    else
      resp = EchonestApi.get_similar_to(:desc => astr)
    end
    arr = []
    resp['response']['artists'][0,2].each do |r|
      str = r['foreign_ids'][0]['foreign_id']
      arr.push(str.split(':')[2])
    end
    finalresp = []
    arr.each do |aid|
      trackresp = RdioApi.get_tracks_for(:artist_id => aid)
      artist = []
      trackresp[0,3].each do |r|
        hash = {}
        hash['image'] = r.icon
        hash['name'] = r.artist.name
        hash['track_name'] = r.name
        artist.push(hash)
      end
      finalresp.push(artist)
    end
    p '*'*10
    p finalresp.inspect
    render :json => finalresp
  end
  
  def tracks_by_artist
    aid = params[:aid]
    resp = RdioApi.get_tracks_for(:artist_id => aid)
    arr = []
    resp[0,3].each do |r|
      hash = {}
      hash['image'] = r.icon
      hash['name'] = r.artist.name
      arr.push(hash)
    end
    p arr.inspect
    render :json => arr
  end
  
end