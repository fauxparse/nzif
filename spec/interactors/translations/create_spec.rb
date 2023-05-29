require 'rails_helper'

RSpec.describe Translations::Create, type: :interactor do
  let(:context) do
    {
      name:,
      traditional_name:,
      country:,
    }
  end

  let(:name) { 'New Zealand' }
  let(:traditional_name) { 'Aotearoa' }
  let(:country) { ISO3166::Country.new('NZ') }

  it { is_expected.to be_success }

  it 'creates translations' do
    expect { result }.to change(PlaceNameTranslation, :count).by(2)
  end
end
