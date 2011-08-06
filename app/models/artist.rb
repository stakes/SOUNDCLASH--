class Artist
  include Mongoid::Document
  embedded_in :playlist
end