require 'rails_helper'

RSpec.describe Donations::Create do
  let(:context) { { attributes: } }

  let(:attributes) do
    attributes_for(:donation)
  end

  let(:customer) { instance_double(Stripe::Customer) }

  before do
    allow(customer).to receive(:[]).with('id').and_return('cus_123')
    allow(Stripe::Customer).to receive(:create).and_return(customer)
    allow(Newsletter::Subscribe).to receive(:call).and_return(true)
  end

  it 'creates a donation' do
    expect { result }.to change(Donation, :count).by(1)
  end

  it 'does not subscribe to the newsletter by default' do
    expect(Newsletter::Subscribe).not_to have_received(:call)
  end

  context 'when newsletter is requested' do
    let(:attributes) do
      attributes_for(:donation, :newsletter)
    end

    it 'subscribes to the newsletter' do
      result

      expect(Newsletter::Subscribe)
        .to have_received(:call)
        .with(email: attributes[:email], name: attributes[:name])
    end
  end
end
