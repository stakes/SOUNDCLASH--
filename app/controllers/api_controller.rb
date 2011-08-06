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
  
  def tracks_by_artist
    aid = params[:aid]
    resp = RdioApi.get_tracks_for(:artist_id => aid)
    render :json => resp
  end
  
end