FactoryBot.define do
  factory :show do
    festival
    sequence :name do |n|
      "Show #{n}"
    end
  end
end
