require 'rails_helper'

RSpec.describe Waitlists::Promote do
  let(:festival) { create(:festival, :with_workshops) }
  let(:session) { festival.sessions.first }
  let(:registrations) { create_list(:registration, 10, festival:) }
  let(:context) { { session:, registration: } }

  context 'when the user is on the waitlist' do
    let(:registration) { registrations.first }

    before do
      session.waitlist.create_or_find_by!(registration:)
    end

    it { is_expected.to be_success }

    it 'moves the user off the waitlist' do
      expect { result }.to change(session.waitlist, :count).by(-1)
    end

    it 'moves the user into the session' do
      expect { result }.to change(session.placements, :count).by(1)
    end

    context 'when this workshop is the user’s first choice' do
      before do
        festival.sessions.each do |s|
          registration.preferences.create!(session: s)
          registration.waitlist.create_or_find_by!(session: s)
        end
      end

      it 'removes the user from other waitlists' do
        expect { result }.to change(registration.waitlist, :count).by(-3)
      end
    end

    context 'when this workshop is the user’s third choice' do
      let(:session) do |_p|
        festival.sessions.order(starts_at: :asc).each do |s|
          registration.preferences.create!(session: s)
          registration.waitlist.create_or_find_by!(session: s)
        end

        registration.preferences.find { |p| p.position == 3 }.session
      end

      it 'does not removes the user from other waitlists' do
        expect { result }.to change(registration.waitlist, :count).by(-1)
      end
    end

    context 'when the user is in another session' do
      let(:other_session) { session.slot.sessions.where.not(id: session.id).first }

      before do
        registration.placements.create!(session: other_session)
      end

      it 'removes the user from the other session' do
        expect { result }.to change(other_session.placements, :count).by(-1)
      end
    end
  end

  context 'when the user is not on the waitlist' do
    let(:registration) { create(:registration, festival: session.festival) }

    it 'raises an error' do
      expect { result }.to raise_error(Waitlists::Promote::NotOnWaitlist)
    end
  end
end
