require 'rails_helper'

RSpec.describe Preferences::Preference do
  subject(:preference) { User.preferences[name] }

  let(:name) { :show_indigenous_names }
  let(:user) { create(:user) }

  describe '#read_from' do
    subject(:value) { preference.read_from(user) }

    context 'when the user has no preference set' do
      it { is_expected.to eq preference.default }
    end

    context 'when the user has a preference set' do
      before { user.update!(preferences: { name => false }) }

      it { is_expected.to be false }
    end
  end

  describe '#to_graphql_object_for' do
    subject(:object) { preference.to_graphql_object_for(user) }

    it 'has the required keys' do
      expect(object).to match a_hash_including(
        id: name,
        type: :boolean,
        description: preference.description,
        value: true,
      )
    end
  end
end
