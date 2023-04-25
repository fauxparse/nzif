require 'rails_helper'

RSpec.describe Slots::Destroy, type: :interactor do
  describe '.call' do
    let!(:slot) { create(:slot) }

    let(:context) { { slot: } }

    context 'as an admin' do
      it { is_expected.to be_success }

      it 'destroys the slot' do
        expect { result }.to change(Slot, :count).by(-1)
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
