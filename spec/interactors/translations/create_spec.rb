require 'rails_helper'

RSpec.describe Translations::Create, type: :interactor do
  let(:context) do
    {
      name:,
      traditional_name:,
    }
  end

  let(:name) { 'New Zealand' }
  let(:traditional_name) { 'Aotearoa' }

  it { is_expected.to be_success }

  it 'creates a placename' do
    expect { result }.to change(Placename, :count).by(1)
  end
end
