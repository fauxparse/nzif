require 'rails_helper'

RSpec.describe Translations::Update, type: :interactor do
  let!(:placename) { create(:placename) }

  let(:context) do
    {
      id: placename.id,
      name:,
      traditional_name:,
    }
  end

  let(:name) { 'Wellington' }
  let(:traditional_name) { 'Pōneke' }

  it { is_expected.to be_success }

  it 'does not create extra placenames' do
    expect { result }.not_to change(Placename, :count)
  end

  it 'updates the existing translations' do
    expect do
      result
      placename.reload
    end
      .to change(placename, :traditional)
      .from('Te Whanganui-a-Tara')
      .to('Pōneke')
  end
end
