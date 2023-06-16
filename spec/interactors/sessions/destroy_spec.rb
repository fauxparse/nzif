require 'rails_helper'

RSpec.describe Sessions::Destroy, type: :interactor do
  describe '.call' do
    let!(:session) { create(:session) }

    let(:context) { { session: } }

    context 'as an admin' do
      it { is_expected.to be_success }

      it 'destroys the session' do
        expect { result }.to change(Session, :count).by(-1)
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
