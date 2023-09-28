require 'rails_helper'

RSpec.describe Sessions::AddCast do
  let(:context) { { session:, profile:, role: } }
  let(:session) { create(:session, :with_show) }
  let(:profile) { create(:profile) }
  let(:role) { :performer }

  context 'when the current user is the director' do
    let(:current_user) { create(:user, profile: session.activity.cast.first.profile) }

    it 'adds the cast member' do
      expect { result }.to change(session.cast, :count).by(1)
    end

    context 'when the cast member already exists' do
      before do
        session.cast.create!(profile:, role:)
      end

      it 'raises an error' do
        expect { result }.to raise_error(Sessions::AddCast::AlreadyCast)
      end
    end
  end

  context 'when the current user is an admin' do
    let(:current_user) { create(:admin) }

    it 'adds the cast member' do
      expect { result }.to change(session.cast, :count).by(1)
    end
  end

  context 'when the current user is some random' do
    let(:current_user) { create(:user) }

    it 'raises an error' do
      expect { result }.to raise_error(ActionPolicy::Unauthorized)
    end
  end

  context 'when the current user is a cast member' do
    let(:current_user) { create(:user, :with_profile) }

    before do
      session.cast.create!(profile: current_user.profile, role: :performer)
    end

    it 'raises an error' do
      expect { result }.to raise_error(ActionPolicy::Unauthorized)
    end
  end
end
