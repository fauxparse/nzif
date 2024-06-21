require 'rails_helper'

RSpec.describe Calendar::Show, type: :interactor do
  let(:context) { { session:, user: } }
  let(:session) { create(:session, :with_show) }
  let(:user) { create(:user) }

  it 'does nothing' do
    expect { result }
      .not_to change(user.hidden_sessions, :count)
  end

  context 'when the session is hidden' do
    before do
      user.hidden_sessions.create!(session:)
    end

    it 'shows the session' do
      expect { result }
        .to change(user.hidden_sessions, :count)
        .by(-1)
    end
  end

  describe 'when not logged in' do
    let(:user) { nil }

    it 'raises an error' do
      expect { result }
        .to raise_error(Calendar::Show::NotLoggedInError)
    end
  end
end
