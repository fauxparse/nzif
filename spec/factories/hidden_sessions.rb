FactoryBot.define do
  factory :hidden_session do
    session { nil }
    user { nil }
  end
end
