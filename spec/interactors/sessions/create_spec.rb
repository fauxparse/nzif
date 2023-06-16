require 'rails_helper'

RSpec.describe Sessions::Create, type: :interactor do
  describe '.call' do
    let(:festival) { create(:festival) }

    let(:venue) { create(:venue) }

    let(:attributes) { { venue:, activity_type: Workshop, starts_at:, ends_at: } }

    let(:starts_at) { (festival.start_date + 2.days).beginning_of_day + 10.hours }

    let(:ends_at) { starts_at + 3.hours }

    let(:context) do
      {
        festival:,
        attributes:,
      }
    end

    context 'as an admin' do
      it { is_expected.to be_success }

      it 'creates a session' do
        expect { result }.to change(Session, :count).by(1)
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
