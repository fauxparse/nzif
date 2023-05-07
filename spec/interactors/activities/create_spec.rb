require 'rails_helper'

RSpec.describe Activities::Create, type: :interactor do
  let(:festival) { create(:festival) }

  let(:activity_type) { Show }

  let(:profile) { create(:profile) }

  let(:attributes) { { name: 'The History Boy', profile_ids: [profile.to_param] } }

  let(:context) { { festival:, activity_type:, attributes: } }

  let(:activity) { result.activity }

  describe '.call' do
    context 'with valid attributes' do
      it { is_expected.to be_success }

      it 'creates a new show' do
        expect { result }.to change(festival.shows, :count).by(1)
      end

      it 'assigns the cast' do
        expect(activity.directors.map(&:profile)).to eq [profile]
      end
    end
  end
end
