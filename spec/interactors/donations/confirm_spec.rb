require 'rails_helper'

RSpec.describe Donations::Confirm do
  let(:context) { { donation: } }

  let(:donation) { create(:donation) }

  before do
    allow(DonationMailer).to receive(:notification).and_call_original
    allow(DonationMailer).to receive(:receipt).and_call_original
  end

  it 'confirms the donation' do
    expect { result }
      .to change { donation.reload.state }
      .from('pending')
      .to('approved')
  end

  it 'sends a notification' do
    result
    expect(DonationMailer).to have_received(:notification).with(donation)
  end

  it 'sends a receipt' do
    result
    expect(DonationMailer).to have_received(:receipt).with(donation)
  end
end
