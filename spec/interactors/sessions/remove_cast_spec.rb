require 'rails_helper'

RSpec.describe Sessions::RemoveCast do
  let(:context) { { session:, profile:, role: } }
  let(:session) { create(:session, :with_show) }
  let(:profile) { create(:profile) }
  let(:role) { :performer }
  let!(:cast) { session.cast.create!(profile:, role:) } # rubocop:disable RSpec/LetSetup

  context 'when the current user is the director' do
    let(:current_user) { create(:user, profile: session.activity.cast.first.profile) }

    it 'removes the cast member' do
      expect { result }.to change(session.cast, :count).by(-1)
    end

    context 'when the cast member does not exist' do
      let(:cast) { nil }

      it 'raises an error' do
        expect { result }.to raise_error(Sessions::RemoveCast::NotCast)
      end
    end
  end

  context 'when the current user is an admin' do
    let(:current_user) { create(:admin) }

    it 'adds the cast member' do
      expect { result }.to change(session.cast, :count).by(-1)
    end
  end

  context 'when the current user is some random' do
    let(:current_user) { create(:user) }

    it 'raises an error' do
      expect { result }.to raise_error(ActionPolicy::Unauthorized)
    end
  end
end
