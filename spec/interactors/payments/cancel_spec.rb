require 'rails_helper'

RSpec.describe Payments::Cancel, type: :interactor do
  let(:registration) { create(:registration) }
  let!(:payment) { create(:credit_card_payment, registration:) }

  let(:context) { { payment: } }

  its(:payment) { is_expected.to be_cancelled }

  it 'does not delete the payment' do
    expect { result }.not_to change(registration.payments, :count)
  end
end
