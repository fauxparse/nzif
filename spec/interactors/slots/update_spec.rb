require 'rails_helper'

RSpec.describe Slots::Update, type: :interactor do
  describe '.call' do
    let(:slot) { create(:slot) }

    let(:festival) { slot.festival }

    let(:attributes) { { starts_at: slot.starts_at - 1.hour } }

    let(:context) do
      {
        slot:,
        attributes:,
      }
    end

    context 'as an admin' do
      it { is_expected.to be_success }

      it 'updates the slot' do
        expect { result }.to change { slot.reload.starts_at }.by(-1.hour)
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
