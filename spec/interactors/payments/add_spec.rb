require 'rails_helper'

RSpec.describe Payments::Add, type: :interactor do
  let(:registration) { create(:registration) }

  let(:context) { { registration:, amount: Money.from_cents(100_00), type: CreditCardPayment } }

  it 'adds a payment' do
    expect { result }.to change(registration.payments, :count).by(1)
  end

  its(:payment) { is_expected.to be_approved }

  it 'has the right payment amount' do
    expect(result.payment.amount).to eq Money.from_cents(100_00)
  end
end
