require 'rails_helper'

RSpec.describe Waitlists::Add, type: :interactor do
  let(:festival) { create(:festival) }
  let(:session) { create(:session, festival:) }
  let(:registration) { create(:registration, festival:) }

  let(:context) { { session:, registration: } }

  it "adds the registration to the session's waitlist" do
    expect { result }.to change(session.waitlist, :count).by(1)
  end

  context 'when the registration is already on the waitlist' do
    before do
      create(:waitlist, session:, registration:)
    end

    it "does not add the registration to the session's waitlist" do
      expect { result }.not_to change(session.waitlist, :count)
    end
  end

  context 'when the user isn’t authorized' do
    let(:current_user) { create(:user) }

    it 'fails' do
      expect { result }.to raise_error(ActionPolicy::Unauthorized)
    end
  end
end
