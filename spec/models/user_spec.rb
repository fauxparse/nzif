require 'rails_helper'

RSpec.describe User do
  subject(:user) { build(:user) }

  context 'when a single name is given' do
    subject(:user) { build(:user, name: 'Shakira') }

    before { user.validate }

    it { is_expected.not_to be_valid }

    it 'requires a full name' do
      expect(user.errors[:name]).to include(/full.*name/)
    end
  end

  describe '#roles' do
    subject(:roles) { user.roles }

    it { is_expected.to be_empty }

    context 'for an admin user' do
      let(:user) { build_stubbed(:admin) }

      it { is_expected.not_to be_empty }

      it 'has the admin role' do
        expect(roles).to include(:admin)
      end
    end

    it 'allows << with a symbol' do
      user.roles << :admin
      expect(user.roles).to include(:admin)
    end

    it 'allows << with a string' do
      user.roles << 'admin'
      expect(user.roles).to include(:admin)
    end
  end

  describe '#roles=' do
    let(:user) { create(:admin) }

    it 'can add roles' do
      user.roles = %i[admin participant_liaison]
      expect(user.roles).to include(:admin).and include(:participant_liaison)
    end

    it 'can remove roles' do
      user.update!(roles: [])
      expect(user.roles).to be_empty
    end
  end

  describe '#admin?' do
    subject(:admin?) { user.role?(:admin) }

    it { is_expected.to be false }

    context 'for an admin user' do
      let(:user) { build_stubbed(:admin) }

      it { is_expected.to be true }
    end
  end

  describe '#profile' do
    subject(:profile) { user.profile }

    before { user.save! }

    it { is_expected.to be_present }
  end

  describe '.search' do
    before do
      create(:user, name: 'Thom Yorke', email: 'bungeye@head.radio')
      create(:user, name: 'Jonny Greenwood', email: 'weirdo@head.radio')
      create(:user, name: 'Colin Greenwood', email: 'lownotes@head.radio')
      create(:user, name: 'Ed O’Brien', email: 'backup@head.radio')
      create(:user, name: 'Phil Selway', email: 'sticks@head.radio')
    end

    context 'by name' do
      subject(:results) { described_class.search('greenwood') }

      it 'returns partial matches' do
        expect(results).to contain_exactly(
          an_object_having_attributes(name: 'Colin Greenwood'),
          an_object_having_attributes(name: 'Jonny Greenwood'),
        )
      end
    end

    context 'by email' do
      subject(:results) { described_class.search('bungeye') }

      it 'returns partial matches' do
        expect(results).to contain_exactly(
          an_object_having_attributes(name: 'Thom Yorke'),
        )
      end
    end
  end
end
