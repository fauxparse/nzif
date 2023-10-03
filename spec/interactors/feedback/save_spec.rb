require 'rails_helper'

RSpec.describe Feedback::Save do
  let(:session) { create(:session, :with_workshop, :with_participants) }
  let(:registration) { session.placements.first.registration }
  let(:current_user) { registration.user }
  let(:context) { { session:, registration:, attributes: } }
  let(:attributes) do
    { rating: 5, positive: 'Great!', constructive: 'None', testimonial: 'Great!' }
  end

  it { is_expected.to be_success }

  it 'saves the feedback' do
    expect { result }.to change(Feedback, :count).by(1)
  end

  context 'when feedback was already recorded' do
    before do
      create(:feedback, registration:, session:)
    end

    it 'does not create a new record' do
      expect { result }.not_to change(Feedback, :count)
    end
  end

  context 'when the user is not in the workshop' do
    let(:registration) { create(:registration, festival: session.festival) }

    it 'raises an error' do
      expect { result }.to raise_error(ActionPolicy::Unauthorized)
    end
  end
end
