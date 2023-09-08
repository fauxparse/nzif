require 'rails_helper'

RSpec.describe Registrations::ConfirmWorkshopAllocation, type: :interactor do
  let(:context) { { allocation: } }
  let(:allocation) { create(:allocation, festival:) }
  let!(:festival) do
    create(:festival, :with_workshops, :with_registrations, workshop_days: 3)
  end

  it { is_expected.to be_success }

  it 'creates placements' do
    expected_placement_count = allocation.data.sessions.values.sum { |s| s.placements.size }
    expect { result }.to change(Placement, :count).by(expected_placement_count)
  end

  it 'creates waitlists' do
    expected_waitlist_count = allocation.data.sessions.values.sum { |s| s.waitlist.size }
    expect { result }.to change(Waitlist, :count).by(expected_waitlist_count)
  end

  # it 'sends an email to each participant' do
  #   expected_email_count = allocation.data.registrations.size
  #   allow(ParticipantMailer).to receive(:workshop_confirmation).and_call_original
  #   result
  #   expect(ParticipantMailer)
  #     .to have_received(:workshop_confirmation).exactly(expected_email_count).times
  # end
end
