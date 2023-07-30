require 'rails_helper'

RSpec.describe Registrations::CalculateCartTotals, type: :interactor do
  let(:festival) { create(:festival, :with_workshops) }

  let(:context) { { registration: } }

  let(:registration) { create(:registration, festival:, user: current_user) }

  context 'with no workshops' do
    its(:workshops_count) { is_expected.to be_zero }

    its(:value) { is_expected.to be_zero }

    its(:total) { is_expected.to be_zero }

    its(:discount) { is_expected.to be_zero }
  end

  context 'during earlybird' do
    around do |example|
      travel_to(festival.earlybird_opens_at + 1.week) do
        example.call
      end
    end

    before do
      registration.preferences.create!(session: festival.sessions.first)
      registration.preferences.create!(session: festival.sessions.second)
    end

    its(:workshops_count) { is_expected.to eq 1 }

    its(:value) { is_expected.to eq 60_00 }

    its(:total) { is_expected.to eq 60_00 }

    its(:discount) { is_expected.to be_zero }
  end

  context 'during general registration' do
    around do |example|
      travel_to(festival.general_opens_at + 1.week) do
        example.call
      end
    end

    before do
      registration.placements.create!(session: festival.sessions.second)
    end

    its(:workshops_count) { is_expected.to eq 1 }

    its(:value) { is_expected.to eq 60_00 }

    its(:total) { is_expected.to eq 60_00 }

    its(:discount) { is_expected.to be_zero }
  end
end
