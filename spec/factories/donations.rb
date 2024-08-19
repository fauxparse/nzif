FactoryBot.define do
  factory :donation do
    name { 'Lauren Ipsum' }
    email { 'test@example.com' }
    amount_cents { 100_00 }

    trait :anonymous do
      anonymous { true }
    end

    trait :newsletter do
      newsletter { true }
    end

    trait :with_message do
      message do
        <<~MESSAGE.strip
          The two surviving Founders of Zion were old men,
          old with the movement of the train, their high
          heels like polished hooves against the gray metal
          of the Flatline as a construct, a hardwired ROM
          cassette replicating a dead man’s skills, obsessions,
          kneejerk responses.
        MESSAGE
      end
    end
  end
end
