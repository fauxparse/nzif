require 'rails_helper'

RSpec.describe Registrations::CompareWorkshopLists do
  let(:festival) { create(:festival, :with_workshops) }

  let(:registration) { create(:registration, festival:) }
  let(:context) { { registration: } }

  def create_snapshot
    Registrations::CreateSnapshot.call(registration:, current_user:)
    travel 1.second
  end

  context 'when there are no snapshots' do
    its(:added) { is_expected.to be_empty }
    its(:removed) { is_expected.to be_empty }
  end

  context 'when there is one snapshot' do
    before do
      create(:placement, registration:, session: festival.sessions.first)
      create_snapshot
    end

    its(:added) { is_expected.to have_exactly(1).item }
    its(:removed) { is_expected.to be_empty }
  end

  context 'when there are two or more snapshots' do
    let(:registration) { create(:registration, :with_placements, festival:) }
    let(:old_placement) { registration.placements.first }
    let(:old_session) { old_placement.session }
    let(:new_session) { old_session.slot.sessions.where.not(id: old_session.id).first }

    before do
      create_snapshot
      old_placement.destroy!
      create(:placement, registration:, session: new_session)
      create_snapshot
    end

    its(:added) { is_expected.to eq [new_session] }
    its(:removed) { is_expected.to eq [old_session] }
  end
end
