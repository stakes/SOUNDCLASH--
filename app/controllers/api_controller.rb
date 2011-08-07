class ApiController < ActionController::Base
  
  def similar_artists
    astr = params[:astr]
    if params[:type] == 'artist'
      resp = EchonestApi.get_similar_to(:artist => astr)
    else
      resp = EchonestApi.get_similar_to(:desc => astr)
    end
    render :json => resp
  end
  
  def similar_artists_with_rdio
    if params[:astr].blank?
      astr = params[:artists_array]
    else
      astr = params[:astr]
    end
    if params[:type] == 'artist'
      resp = EchonestApi.get_similar_to(:artist => astr)
    elsif params[:type] == 'artist_string'
      resp = EchonestApi.get_similar_to(:artists => astr)
    else
      resp = EchonestApi.get_similar_to(:desc => astr)
    end
    arr = []
    p resp.inspect
    if resp['response']['status']['code'] != 0
      finalresp = {:error => 'error'}
    else
      resp['response']['artists'][0,2].each do |r|
        begin
          str = r['foreign_ids'][0]['foreign_id']
        rescue
          str = nil
        end
        arr.push(str.split(':')[2]) unless str.blank?
      end
      finalresp = []
      arr.each do |aid|
        trackresp = RdioApi.get_tracks_for(:artist_id => aid)
        artist = []
        trackresp[0,3].each do |r|
          hash = {}
          hash['aid'] = r.artist_key
          hash['tid'] = r.key
          hash['image'] = r.icon
          hash['name'] = r.artist.name
          hash['track_name'] = r.name
          artist.push(hash)
        end
        finalresp.push(artist)
      end
    end
    render :json => finalresp
  end
  
  def desc_artists_with_rdio
    p 'YES!'
    astr = params[:desc]
    resp = EchonestApi.get_artists(:desc => astr)
    p resp.inspect
    arr = []
    if resp['response']['status']['code'] != 0
      finalresp = {:error => 'error'}
    else
      resp['response']['artists'][0,2].each do |r|
        begin
          str = r['foreign_ids'][0]['foreign_id']
        rescue
          str = nil
        end
        arr.push(str.split(':')[2]) unless str.blank?
      end
      finalresp = []
      arr.each do |aid|
        trackresp = RdioApi.get_tracks_for(:artist_id => aid)
        artist = []
        trackresp[0,3].each do |r|
          hash = {}
          hash['aid'] = r.artist_key
          hash['tid'] = r.key
          hash['image'] = r.icon
          hash['name'] = r.artist.name
          hash['track_name'] = r.name
          artist.push(hash)
        end
        finalresp.push(artist)
      end
    end
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
    render :json => arr
  end
  
end