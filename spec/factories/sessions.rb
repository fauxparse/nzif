FactoryBot.define do
  factory :session do
    festival
    starts_at { Time.zone.parse('2023-10-09 10:00:00') }
    ends_at { starts_at + 3.hours }
    venue
    activity_type { Workshop }
    capacity { 5 }

    trait :with_workshop do
      activity { create(:workshop, :with_tutor, festival:) } # rubocop:disable FactoryBot/FactoryAssociationWithStrategy
    end

    trait :with_show do
      activity_type { Show }
      activity { create(:show, :with_director, festival:) } # rubocop:disable FactoryBot/FactoryAssociationWithStrategy
    end
  end
end
