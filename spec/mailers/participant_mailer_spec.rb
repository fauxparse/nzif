require 'rails_helper'

RSpec.describe ParticipantMailer do
  describe 'registration_confirmation' do
    subject(:mail) { described_class.registration_confirmation(registration) }

    let(:registration) { create(:registration, :with_user) }

    its(:subject) { is_expected.to eq('Your NZIF 2023 registration') }
    its(:to) { is_expected.to eq([registration.user.email]) }
    its(:from) { is_expected.to eq(['registrations@improvfest.nz']) }
  end
end