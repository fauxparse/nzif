FactoryBot.define do
  factory :director, class: 'Cast' do
    activity factory: :show
    role { :director }
    profile
  end

  factory :tutor, class: 'Cast' do
    activity factory: :workshop
    role { :tutor }
    profile
  end

  factory :organiser, class: 'Cast' do
    activity factory: :social_event
    role { :organiser }
    profile
  end
end
