require 'rails_helper'

RSpec.describe Calendar::Hide, type: :interactor do
  let(:context) { { session:, user: } }
  let(:session) { create(:session, :with_show) }
  let(:user) { create(:user) }

  it 'hides the session' do
    expect { result }
      .to change(user.hidden_sessions, :count)
      .by(1)
  end

  context 'when the session is already hidden' do
    before do
      user.hidden_sessions.create!(session:)
    end

    it 'does not create a new record' do
      expect { result }
        .not_to change(user.hidden_sessions, :count)
    end
  end

  context 'when not logged in' do
    let(:user) { nil }

    it 'raises an error' do
      expect { result }
        .to raise_error(Calendar::Hide::NotLoggedInError)
    end
  end
end
