require 'rails_helper'

RSpec.describe Settings::Setting do
  subject(:setting) { User.settings[name] }

  let(:name) { :show_traditional_names }
  let(:user) { create(:user) }

  describe '#read_from' do
    subject(:value) { setting.read_from(user) }

    context 'when the user has no setting set' do
      it { is_expected.to eq setting.default }
    end

    context 'when the user has a setting set' do
      before { user.update!(settings: { name => false }) }

      it { is_expected.to be false }
    end
  end

  describe '#to_graphql_object_for' do
    subject(:object) { setting.to_graphql_object_for(user) }

    it 'has the required keys' do
      expect(object).to match a_hash_including(
        id: name,
        type: :boolean,
        description: setting.description,
        value: true,
      )
    end
  end
end
