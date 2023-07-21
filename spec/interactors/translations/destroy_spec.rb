require 'rails_helper'

RSpec.describe Translations::Destroy, type: :interactor do
  let!(:placename) { create(:placename) }

  let(:context) { { id: placename.id } }

  it { is_expected.to be_success }

  it 'deletes the placename' do
    expect { result }.to change(Placename, :count).by(-1)
  end
end
