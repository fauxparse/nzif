require 'rails_helper'

describe Users::UpdatePreference, type: :interactor do
  let(:user) { create(:user) }

  let(:current_user) { create(:user, :admin) }

  describe '.call' do
    subject(:call) { described_class.call(user:, id:, value:, current_user:) }

    context 'with a valid preference' do
      let(:id) { :show_traditional_names }
      let(:value) { false }

      it 'stores the new value' do
        expect { call }.to change(user, :show_traditional_names).from(true).to(false)
      end

      context 'when the user has an existing setting' do
        let(:user) { create(:user, show_traditional_names: false) }
        let(:value) { true }

        it 'stores the new value' do
          expect { call }.to change(user, :show_traditional_names).from(false).to(true)
        end
      end
    end

    context 'with a non-existent preference' do
      let(:id) { :non_existent_preference }
      let(:value) { 'some value' }

      it 'fails' do
        expect { call }.to raise_error(ActiveModel::UnknownAttributeError)
      end
    end
  end
end
