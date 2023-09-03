require 'rails_helper'

RSpec.describe Payments::AddVoucher, type: :interactor do
  let(:registration) { create(:registration) }

  let(:context) { { registration:, workshops: 5 } }

  it 'adds a voucher' do
    expect { result }.to change(registration.payments, :count).by(1)
  end

  its(:voucher) { is_expected.to be_approved }
end
