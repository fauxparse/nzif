FactoryBot.define do
  factory :allocation do
    festival factory: %i[festival with_workshops]

    after :create do |allocation|
      allocation.update!(data: Matchmaker.allocate(festival: allocation.festival))
    end
  end
end
