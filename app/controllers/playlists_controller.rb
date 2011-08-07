class PlaylistsController < ActionController::Base
  
  def show
    
    p 'show playlist'
    @playlist = Playlist.find(params[:id])
    respond_to do |format|
      format.html
    end
    
  end
  
end