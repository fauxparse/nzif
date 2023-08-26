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

    its(:value) { is_expected.to eq Money.from_cents(70_00) }

    its(:total) { is_expected.to eq Money.from_cents(70_00) }

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

    its(:value) { is_expected.to eq Money.from_cents(70_00) }

    its(:total) { is_expected.to eq Money.from_cents(70_00) }

    its(:discount) { is_expected.to be_zero }

    context 'when some money has been paid' do
      before do
        create(:credit_card_payment, registration:, amount: Money.from_cents(70_00))
      end

      its(:paid) { is_expected.to eq Money.from_cents(70_00) }

      its(:outstanding) { is_expected.to be_zero }
    end
  end

  context 'when passed payments' do
    # rubocop:disable RSpec/AnyInstance
    before do
      travel_to(festival.general_opens_at + 1.week)
      allow_any_instance_of(described_class).to receive(:authorize!).and_return(true)
      allow_any_instance_of(described_class).to receive(:authorized?).and_return(true)
    end
    # rubocop:enable RSpec/AnyInstance

    let(:context) { super().merge(payments:) }

    let(:registration) do
      instance_double(
        Registration,
        sessions: [festival.sessions.second],
        festival:,
        payments: [],
      )
    end

    let(:payments) do
      [CreditCardPayment.new(amount: Money.from_cents(70_00))]
    end

    its(:paid) { is_expected.to eq Money.from_cents(70_00) }

    its(:outstanding) { is_expected.to be_zero }

    it 'does not reload the payments' do
      result
      expect(registration).not_to have_received(:payments)
    end
  end
end
