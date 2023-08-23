FactoryBot.define do
  factory :short_url do
    sequence(:url) { |n| "https://#{Domains::Main::DOMAIN}/page-#{n}" }
  end
end
