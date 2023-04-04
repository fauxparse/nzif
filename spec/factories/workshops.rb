FactoryBot.define do
  factory :workshop do
    festival
    sequence :name do |n|
      "Workshop #{n}"
    end
  end
end
