FactoryBot.define do
  factory :payment do
    registration
    amount_cents { 100_00 }
    state { :pending }

    factory :credit_card_payment, class: 'CreditCardPayment'

    factory :internet_banking_payment, class: 'InternetBankingPayment'

    factory :voucher, class: 'Voucher' do
      workshops { 5 }
    end

    trait :pending do
      state { :pending }
    end

    trait :approved do
      state { :approved }
    end

    trait :cancelled do
      state { :cancelled }
    end

    trait :failed do
      state { :failed }
    end
  end
end
