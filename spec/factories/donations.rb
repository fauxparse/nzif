FactoryBot.define do
  factory :donation do
    name { 'Lauren Ipsum' }
    email { 'test@example.com' }
    amount_cents { 100_00 }
  end
end
