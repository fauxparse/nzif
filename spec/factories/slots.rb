FactoryBot.define do
  factory :slot do
    festival
    starts_at { '2023-10-09 10:00:00' }
    ends_at { '2023-10-09 13:00:00' }
    venue
    activity_type { Workshop }
  end
end
