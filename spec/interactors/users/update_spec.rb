require 'rails_helper'

RSpec.describe Users::Update, type: :interactor do
  describe '.call' do
    subject(:result) { described_class.call(current_user:, user:, attributes:) }

    let(:user) { create(:user) }

    let(:current_user) { create(:user, :admin) }

    context 'with valid attributes' do
      let(:attributes) { { name: 'Spicy Beef' } }

      it { is_expected.to be_success }
    end

    context 'with invalid attributes' do
      let(:attributes) { { name: 'Shakira' } }

      it 'raises an error' do
        expect { result }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end

    context 'when a user is updating themself' do
      let(:user) { create(:user, :admin) }

      let(:current_user) { user }

      let(:attributes) { { roles: [] } }

      it 'ignores changes to roles' do
        expect { result }.not_to(change { user.reload.role_names })
      end
    end

    context 'when a non-admin user is updating someone' do
      let(:user) { create(:user) }

      let(:current_user) { create(:user) }

      let(:attributes) { { name: 'Snorty Piss-Warts' } }

      it 'raises an error' do
        expect { result }.to raise_error(ActionPolicy::Unauthorized)
      end
    end
  end
end
