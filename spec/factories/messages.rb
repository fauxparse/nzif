FactoryBot.define do
  factory :message do
    messageable factory: %i[session with_workshop with_participants]
    sender factory: :user
    subject { 'Special alert' }
    content { 'This workshop might flip you out' }
  end
end
