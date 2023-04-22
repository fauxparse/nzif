FactoryBot.define do
  factory :venue do
    room { 'The Stage' }
    building { 'BATS Theatre' }
    address { '1 Kent Tce, Wellington' }
    # latitude { '-41.2921901197085'.to_d }
    # longitude { '174.7858539802915'.to_d }
  end
end
