['The Stage', 'The Dome', 'The Studio', 'Lumen Bar'].each do |room|
  Venue.seed(:room, :building) do |v|
    v.room = room
    v.building = 'BATS Theatre'
    v.address = '1 Kent Tce'
    v.latitude = '-41.2921901197085'.to_d
    v.longitude = '174.7858539802915'.to_d
  end
end
