require 'rails_helper'

RSpec.describe Payments::Approve, type: :interactor do
  let(:registration) { create(:registration) }
  let!(:payment) { create(:credit_card_payment, registration:) }

  let(:context) { { payment: } }

  its(:payment) { is_expected.to be_approved }
end
