require 'rails_helper'

RSpec.describe Profiles::Merge, type: :interactor do
  describe '.call' do
    let(:context) { { profiles:, attributes: } }

    let(:first) do
      create(:profile, :with_user, name: 'First', country: 'NZ', city: 'wellington')
    end

    let(:second) do
      create(:profile, name: 'Second', city: 'Te Whanganui-a-Tara', pronouns: 'he/him')
    end

    let(:profiles) { [first, second] }

    let(:attributes) do
      {
        name: first.to_param,
        country: first.to_param,
        city: second.to_param,
        pronouns: second.to_param,
      }
    end

    it { is_expected.to be_success }

    it 'deletes the old profiles' do
      expect { result }
        .to change { Profile.where(id: profiles.map(&:id)).count }
        .by(-2)
    end

    it 'creates a new profile' do
      expect { result }
        .to change { Profile.where.not(id: profiles.map(&:id)).count }
        .by(1)
    end

    it 'assigns the user' do
      expect(result.profile.user).to eq(first.user)
    end

    describe '#profile' do
      subject(:profile) { result.profile }

      its(:name) { is_expected.to eq(first.name) }
      its(:country) { is_expected.to eq(first.country) }
      its(:city) { is_expected.to eq(second.city) }
      its(:pronouns) { is_expected.to eq(second.pronouns) }
    end

    context 'with only one profile to merge' do
      let(:profiles) { [first] }

      let(:attributes) do
        {
          name: first.to_param,
          country: first.to_param,
          city: first.to_param,
          pronouns: first.to_param,
        }
      end

      it { is_expected.to be_failure }
    end

    context 'when both profiles have users' do
      before do
        second.update!(user: create(:user))
      end

      it { is_expected.to be_failure }
    end

    context 'when all the values are from the same profile' do
      let(:attributes) do
        {
          name: second.to_param,
          country: second.to_param,
          city: second.to_param,
          pronouns: second.to_param,
        }
      end

      let(:user) { first.user }

      let!(:cast) { create(:director, profile: first) }

      it 'still updates all the references' do
        result
        cast.reload
        expect(cast.profile).to eq result.profile
      end
    end
  end
end
