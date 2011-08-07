class PlaylistsController < ActionController::Base
  
  layout 'playlist'
  
  def show
    
    @playlist = Playlist.find(params[:id])
    respond_to do |format|
      format.html
    end
    
  end
  
end