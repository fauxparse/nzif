require 'rails_helper'

RSpec.describe Registrations::AddToSession, type: :interactor do
  let(:festival) { create(:festival) }
  let(:session) { create(:session, festival:) }
  let(:registration) { create(:registration, festival:) }

  let(:context) { { session:, registration: } }

  it 'adds the registration to the session' do
    expect { result }.to change(session.placements, :count).by(1)
  end

  context 'when the user is on the waitlist' do
    before do
      session.waitlist.create!(registration:)
    end

    it 'removes the registration from the waitlist' do
      expect { result }
        .to change { session.waitlist.exists?(registration_id: registration.id) }
        .from(true).to(false)
    end
  end

  context 'when the registration is already in the session' do
    before do
      create(:placement, session:, registration:)
    end

    it 'does not add the registration to the session' do
      expect { result }.not_to change(session.placements, :count)
    end
  end

  context 'when the user isn’t authorized' do
    let(:current_user) { create(:user) }

    it 'fails' do
      expect { result }.to raise_error(ActionPolicy::Unauthorized)
    end
  end
end
