class Artist
  include Mongoid::Document
  embedded_in :playlist

  field :artist_name, :type => String
  field :track_name, :type => String
  field :tid, :type => Integer
  field :aid, :type => Integer
  field :image, :type => String

end