require 'rails_helper'

RSpec.describe Users::MatchProfiles, type: :interactor do
  let(:admin) { create(:user, :admin) }

  describe '.call' do
    subject(:result) { described_class.call(user: admin) }

    describe '#possible_matches' do
      subject(:possible_matches) { result.possible_matches }

      context 'when there is a profile without a user' do
        let!(:user) { create(:user, name: 'Anne Murn') }
        let!(:profile) { create(:profile, name: 'Anne Murn') }

        it { is_expected.not_to be_empty }

        it { is_expected.to eq [profile] }

        it 'matches the profile' do
          expect(possible_matches.first.user_id).to eq(user.id)
        end
      end

      context 'when there are no matching users' do
        before do
          create(:profile, name: 'Anne Murn')
        end

        it { is_expected.to be_empty }
      end

      context 'when there are multiple matching users' do
        before do
          create(:profile, name: 'Anne Murn')
          create(:user, name: 'Anne Murn')
          create(:user, name: 'Ann Murn')
        end

        it { is_expected.to have_exactly(2).items }
      end
    end
  end
end
