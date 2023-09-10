require 'rails_helper'

RSpec.describe Waitlists::Remove, type: :interactor do
  let(:festival) { create(:festival) }
  let(:session) { create(:session, festival:) }
  let(:registration) { create(:registration, festival:) }
  let!(:waitlist) { create(:waitlist, session:, registration:) } # rubocop:disable RSpec/LetSetup
  let(:context) { { session:, registration: } }

  it "removes the registration from the session's waitlist" do
    expect { result }.to change(session.waitlist, :count).by(-1)
  end

  context 'when the registration is not on the waitlist' do
    let(:waitlist) { nil }

    it "does not remove the registration from the session's waitlist" do
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
