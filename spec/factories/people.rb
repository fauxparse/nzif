FactoryBot.define do
  factory :director, class: 'Person' do
    activity { create(:show) }
    role { :director }
  end

  factory :performer, class: 'Person' do
    activity { create(:show) }
    role { :performer }
  end

  factory :muso, class: 'Person' do
    activity { create(:show) }
    role { :muso }
  end

  factory :operator, class: 'Person' do
    activity { create(:show) }
    role { :operator }
  end

  factory :tutor, class: 'Person' do
    activity { create(:workshop) }
    role { :tutor }
  end

  factory :organiser, class: 'Person' do
    activity { create(:social_event) }
    role { :organiser }
  end
end
