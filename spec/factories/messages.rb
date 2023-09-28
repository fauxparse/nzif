FactoryBot.define do
  factory :message do
    messageable { nil }
    subject { "MyString" }
    content { "MyText" }
  end
end
