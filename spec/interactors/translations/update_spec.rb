require 'rails_helper'

RSpec.describe Translations::Update, type: :interactor do
  let(:context) do
    {
      id: 'wellington',
      name:,
      traditional_name:,
      country:,
    }
  end

  let(:name) { 'Wellington' }
  let(:traditional_name) { 'Pōneke' }
  let(:country) { ISO3166::Country.new('NZ') }

  before do
    Translations::Create.call(
      current_user:,
      name:,
      traditional_name: 'Te Whanganui-a-Tara',
      country:,
    )
  end

  it { is_expected.to be_success }

  it 'does not create extra translations' do
    expect { result }.not_to change(PlaceNameTranslation, :count)
  end

  it 'updates the existing translations' do
    expect { result }
      .to change { I18n.t('wellington', locale: :mi) }
      .from('Te Whanganui-a-Tara')
      .to('Pōneke')
  end
end
