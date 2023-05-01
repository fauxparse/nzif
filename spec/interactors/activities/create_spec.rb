require 'rails_helper'

RSpec.describe Activities::Create, type: :interactor do
  let(:festival) { create(:festival) }

  let(:activity_type) { Show }

  let(:attributes) { { name: 'The History Boy' } }

  let(:context) { { festival:, activity_type:, attributes: } }

  describe '.call' do
    context 'with valid attributes' do
      it { is_expected.to be_success }

      it 'creates a new show' do
        expect { result }.to change(festival.shows, :count).by(1)
      end
    end
  end
end
