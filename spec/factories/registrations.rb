FactoryBot.define do
  factory :registration do
    user factory: %i[user with_profile]
    festival

    trait :code_of_conduct_accepted do
      code_of_conduct_accepted_at { Time.zone.now }
    end

    trait :completed do
      completed_at { Time.zone.now }
    end

    trait :with_preferences do
      after(:create) do |registration, _evaluator|
        sessions = registration.festival.sessions.includes(:slot).where(activity_type: 'Workshop')
        sessions = sessions.sample(rand(sessions.size).floor)
        sessions.each do |session|
          create(
            :preference,
            registration:,
            session:,
            slot: session.slot,
          )
        end
      end
    end

    trait :with_placements do
      after(:create) do |registration, _evaluator|
        slots = registration.festival.slots.includes(:sessions).references(:sessions)
          .where(sessions: { activity_type: 'Workshop' })

        slots.each do |slot|
          registration.placements.create!(session: slot.sessions.sample)
        end
      end
    end
  end
end
