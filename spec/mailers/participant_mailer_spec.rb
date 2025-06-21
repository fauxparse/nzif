require 'rails_helper'

RSpec.describe ParticipantMailer do
  let(:festival) { create(:festival, :with_workshops, workshop_days: 3) }

  let!(:registration) do
    create(:registration, festival:).tap do |registration|
      festival.sessions.slice(0, 6).each do |session|
        create(:preference, registration:, session:)
      end
    end
  end

  describe '#registration_confirmation' do
    subject(:mail) { described_class.registration_confirmation(registration:) }

    its(:subject) { is_expected.to eq("Your NZIF #{festival.year} registration") }
    its(:to) { is_expected.to eq([registration.user.email]) }
    its(:from) { is_expected.to eq(['registrations@improvfest.nz']) }
  end

  describe '#workshop_confirmation' do
    subject(:mail) { described_class.workshop_confirmation(registration:) }

    before do
      create(:placement, registration:, session: registration.preferences.first.session)
    end

    its(:subject) { is_expected.to eq("Your NZIF #{festival.year} workshop schedule") }
    its(:to) { is_expected.to eq([registration.user.email]) }
    its(:from) { is_expected.to eq(['registrations@improvfest.nz']) }
  end

  describe '#added' do
    subject(:mail) { described_class.added(registration:, session:, removed:) }

    let(:session) { registration.preferences.first.session }
    let(:removed) { [registration.preferences.second.session.id] }

    before do
      create(:placement, registration:, session:)
    end

    its(:subject) { is_expected.to eq("NZIF #{festival.year}: added to #{session.activity.name}") }
    its(:to) { is_expected.to eq([registration.user.email]) }
    its(:from) { is_expected.to eq(['registrations@improvfest.nz']) }
  end

  describe '#removed' do
    subject(:mail) { described_class.removed(registration:, session:) }

    let!(:session) { registration.preferences.first.session }

    its(:subject) { is_expected.to eq("NZIF #{festival.year}: removed from #{session.activity.name}") }
    its(:to) { is_expected.to eq([registration.user.email]) }
    its(:from) { is_expected.to eq(['registrations@improvfest.nz']) }
  end

  describe '#feedback_reminder' do
    subject(:mail) { described_class.feedback_reminder(registration:, session:) }

    let!(:registration) { create(:registration, :with_placements, festival:) }
    let!(:session) { registration.placements.first.session }

    its(:subject) { is_expected.to eq("Workshop feedback: #{session.activity.name}") }
    its(:to) { is_expected.to eq([registration.user.email]) }
    its(:from) { is_expected.to eq(['registrations@improvfest.nz']) }
  end
end
