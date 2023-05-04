FactoryBot.define do
  factory :profile do
    user { nil }
    name { 'Lauren Ipsum' }
    city { 'Wellington' }
    country { 'New Zealand' }
    bio do
      <<~BIO
        Now this quiet courtyard, Sunday afternoon, this girl with a luminous digital display wired
        to a kind of central stage, a raised circle ringed with a ritual lack of urgency through the
        arcs and passes of their dance, point passing point, as the men waited for an opening.
        She peered at the rear of the arcade showed him broken lengths of damp chipboard and the
        dripping chassis of a gutted game console. Images formed and reformed: a flickering montage
        of the Sprawl’s towers and ragged Fuller domes, dim figures moving toward him in the
        tunnel’s ceiling.
      BIO
    end

    trait :with_user do
      user
    end
  end
end
