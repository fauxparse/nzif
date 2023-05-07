FactoryBot.define do
  factory :social_event do
    festival
    sequence :name do |n|
      "Social event #{n}"
    end
  end
end
