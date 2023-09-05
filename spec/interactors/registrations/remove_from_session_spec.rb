require 'rails_helper'

RSpec.describe Registrations::RemoveFromSession, type: :interactor do
  let(:festival) { create(:festival) }
  let(:session) { create(:session, festival:) }
  let(:registration) { create(:registration, festival:) }
  let!(:placement) { create(:placement, session:, registration:) } # rubocop:disable RSpec/LetSetup
  let(:context) { { session:, registration: } }

  it 'removes the registration from the session' do
    expect { result }.to change(session.placements, :count).by(-1)
  end

  context 'when the registration is not in the session' do
    let(:placement) { nil }

    it 'does not remove the registration' do
      expect { result }.to raise_error(ActiveRecord::RecordNotFound)
    end
  end

  context 'when the user isn’t authorized' do
    let(:current_user) { create(:user) }

    it 'fails' do
      expect { result }.to raise_error(ActionPolicy::Unauthorized)
    end
  end
end
