require 'rails_helper'

RSpec.describe Preferences::Create, type: :interactor do
  let(:festival) { create(:festival) }
  let(:registration) { create(:registration, festival:, user: current_user) }
  let(:session) { create(:session, :with_workshop, festival:) }
  let(:context) { { registration:, session: } }

  describe '.call' do
    it { is_expected.to be_success }

    it 'creates the preference' do
      expect { result }.to change { registration.preferences.count }.by(1)
    end
  end
end
