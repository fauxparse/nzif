require 'rails_helper'

RSpec.describe Translations::Destroy, type: :interactor do
  let!(:placename) { FactoryBot.create(:placename, english: 'Bad', traditional: 'Bad') }

  let(:context) { { id: placename.id } }

  it { is_expected.to be_success }

  it 'deletes the placename' do
    expect { result }.to change(Placename, :count).by(-1)
  end
end
