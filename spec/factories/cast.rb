FactoryBot.define do
  factory :director, class: 'Cast' do
    activity { create(:show) }
    role { :director }
    profile
  end

  factory :tutor, class: 'Cast' do
    activity { create(:workshop) }
    role { :tutor }
    profile
  end

  factory :organiser, class: 'Cast' do
    activity { create(:social_event) }
    role { :organiser }
    profile
  end
end
