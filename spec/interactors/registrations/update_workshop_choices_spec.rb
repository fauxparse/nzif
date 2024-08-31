require 'rails_helper'

RSpec.describe Registrations::UpdateWorkshopChoices do
  let(:festival) { create(:festival) }
  let(:registration) { create(:registration, festival:) }
  let(:context) { { registration:, session_ids:, waitlist_ids: } }
  let(:session_ids) { [] }
  let(:waitlist_ids) { [] }

  let(:sessions) do
    [
      create(:session, :full_day, :with_workshop, festival:),
      create(:session, :morning, :with_workshop, festival:),
      create(:session, :morning, :with_workshop, festival:),
      create(:session, :morning, :with_workshop, festival:),
      create(:session, :afternoon, :with_workshop, festival:),
      create(:session, :afternoon, :with_workshop, festival:),
      create(:session, :afternoon, :with_workshop, festival:),
    ]
  end

  context 'when a registration has no previous choices' do
    let(:session_ids) { [sessions[1].to_param, sessions[4].to_param] }
    let(:waitlist_ids) { [sessions[0].to_param] }

    it { is_expected.to be_success }

    it 'adds the new choices' do
      expect { result }.to change(registration.placements, :count).by(2)
    end
  end

  context 'when the user is already in workshops' do
    let(:session_ids) { [sessions[0].to_param] }

    before do
      Placement.create!(registration:, session: sessions[1])
      Placement.create!(registration:, session: sessions[4])
    end

    it 'removes the old sessions' do
      expect { result }.to change(registration.placements, :count).by(-1)
    end

    it 'removes the user from both old sessions' do
      expect { result }
        .to change { sessions[1].reload.placements.count }.by(-1)
        .and change { sessions[4].reload.placements.count }.by(-1)
    end

    context 'and someone else is waiting for their place' do
      let(:other_registration) { create(:registration, festival:) }

      before do
        other_registration.waitlist.create!(session: sessions[1])
      end

      it 'moves the waitlisted user into the workshop' do
        expect { result }
          .to change(other_registration.placements, :count).by(1)
          .and change(other_registration.waitlist, :count).by(-1)
      end
    end
  end

  context 'when the user is on a waitlist' do
    before do
      registration.waitlist.create!(session: sessions[0])
    end

    it 'removes the user from the waitlist' do
      expect { result }.to change(registration.waitlist, :count).by(-1)
    end
  end
end
