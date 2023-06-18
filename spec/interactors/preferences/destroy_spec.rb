require 'rails_helper'

RSpec.describe Preferences::Destroy, type: :interactor do
  let(:festival) { create(:festival) }
  let(:registration) { create(:registration, festival:, user: current_user) }
  let(:session) { create(:session, festival:) }
  let(:context) { { registration:, session: } }

  describe '.call' do
    before do
      registration.preferences.create!(session:)
    end

    it { is_expected.to be_success }

    it 'destroys the preference' do
      expect { result }.to change { registration.preferences.count }.by(-1)
    end
  end
end
