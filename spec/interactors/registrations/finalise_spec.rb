require 'rails_helper'

RSpec.describe Registrations::Finalise do
  let(:registration) { create(:registration, user: current_user) }
  let(:context) { { registration: } }

  # it 'sends an email' do
  #   allow(ParticipantMailer).to receive(:registration_confirmation).and_call_original
  #   result
  #   expect(ParticipantMailer).to have_received(:registration_confirmation).with(registration)
  # end

  it 'completes the registration' do
    result
    expect(registration).to be_completed
  end

  it 'broadcasts a message' do
    channel = "graphql-event::registrations:year:#{registration.festival.to_param}"
    message = { count: 1, __sym_keys__: [:count] }.to_json

    expect { result }.to have_broadcasted_to(channel).with(message)
  end

  it 'creates a snapshot of the registration' do
    expect { result }.to change { registration.snapshots.count }.by(1)
  end
end
