require 'rails_helper'

RSpec.describe Registrations::Finalise, type: :interactor do
  let(:registration) { create(:registration, :with_user) }
  let(:context) { { registration: } }

  describe '.call' do
    pending 'doesn’t send an email yet'
    # it 'sends an email' do
    #   allow(ParticipantMailer).to receive(:registration_confirmation).and_call_original
    #   result
    #   expect(ParticipantMailer).to have_received(:registration_confirmation).with(registration)
    # end
  end
end
