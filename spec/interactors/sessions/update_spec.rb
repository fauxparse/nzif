require 'rails_helper'

RSpec.describe Sessions::Update, type: :interactor do
  describe '.call' do
    let(:session) { create(:session) }

    let(:festival) { session.festival }

    let(:attributes) { { starts_at: session.starts_at - 1.hour, venue_id: venue.to_param } }

    let(:venue) { create(:venue) }

    let(:context) do
      {
        session:,
        attributes:,
      }
    end

    context 'as an admin' do
      it { is_expected.to be_success }

      it 'updates the session' do
        expect { result }.to change { session.reload.starts_at }.by(-1.hour)
      end

      it 'updates the venue' do
        expect { result }.to change { session.reload.venue }.to(venue)
      end
    end

    context 'as a normal user' do
      let(:current_user) { create(:user) }

      it 'raises an error' do
        expect { result }.to raise_error(ActionPolicy::Unauthorized)
      end
    end
  end
end
