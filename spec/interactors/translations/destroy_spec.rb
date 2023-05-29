require 'rails_helper'

RSpec.describe Translations::Destroy, type: :interactor do
  let(:context) do
    {
      id: 'wellington',
    }
  end

  before do
    Translations::Create.call(
      current_user:,
      name: 'Wellington',
      traditional_name: 'Te Whanganui-a-Tara',
      country: ISO3166::Country['NZ'],
    )
  end

  it { is_expected.to be_success }

  it 'deletes translations' do
    expect { result }.to change(Translation, :count).by(-2)
  end
end
