class Playlist
  include Mongoid::Document
  embeds_many :artists
end