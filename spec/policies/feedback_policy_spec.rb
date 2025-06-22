# rubocop:disable RSpec/ScatteredSetup

require 'rails_helper'

RSpec.describe FeedbackPolicy, type: :policy do
  let(:user) { create(:user) }
  let(:session) { create(:session) }
  let(:registration) { create(:registration, user: user, festival: session.festival) }
  let(:record) { build_stubbed(:feedback, registration: registration, session: session) }

  let(:context) { { user: nil } }

  describe_rule :save? do
    failed 'when user is not logged in'

    context 'when user is logged in' do
      let(:context) { { user: user } }

      failed 'when the registration is not for the current user' do
        before do
          record.registration = create(:registration, festival: session.festival)
        end
      end

      failed 'when the user was not placed in the session'

      succeed 'when the user was placed in the session' do
        before do
          create(:placement, registration: registration, session: session)
        end
      end
    end
  end
end

# rubocop:enable RSpec/ScatteredSetup
