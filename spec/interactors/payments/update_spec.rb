require 'rails_helper'

RSpec.describe Payments::Update, type: :interactor do
  let(:payment) { create(:internet_banking_payment, :pending) }

  let(:context) { { payment:, attributes: } }

  let(:current_user) { create(:admin) }

  describe '.call' do
    let(:attributes) { { state: :approved } }

    context 'as an admin' do
      it { is_expected.to be_success }

      it 'updates the payment' do
        expect { result }.to change(payment, :state).to('approved')
      end
    end

    context 'as a user' do
      let(:current_user) { create(:user) }

      it 'fails' do
        expect { result }.to raise_error(ActionPolicy::Unauthorized)
      end
    end
  end
end
