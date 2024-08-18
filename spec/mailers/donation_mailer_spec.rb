require 'rails_helper'

RSpec.describe DonationMailer do
  let(:donation) { build(:donation) }

  describe 'notification' do
    subject(:mail) { described_class.notification(donation) }

    its(:subject) { is_expected.to eq('Donation from Lauren Ipsum') }
    its(:to) { is_expected.to eq(['directors@improvfest.nz']) }
    its(:from) { is_expected.to eq(['registrations@improvfest.nz']) }

    it 'renders the body' do
      expect(mail.body.encoded).to match('Hi')
    end
  end
end
