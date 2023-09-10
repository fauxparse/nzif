require 'rails_helper'

RSpec.describe Registrations::RemoveFromOtherSessions, type: :interactor do
  let(:festival) { create(:festival, :with_workshops) }
  let(:session) { festival.sessions.first }
  let(:other_session) { festival.sessions.second }
  let(:registration) { create(:registration, festival:) }
  let(:context) { { session:, registration: } }

  before do
    create(:placement, session: other_session, registration:)
  end

  its(:sessions) { is_expected.to eq([other_session]) }

  it 'removes the registration from the other session' do
    expect { result }.to change(other_session.placements, :count).by(-1)
  end
end
