require 'rails_helper'

RSpec.describe Donations::Create do
  let(:context) { { attributes: } }

  let(:attributes) do
    {
      name: 'Lauren Ipsum',
      email: 'test@example.com',
      amount: 100,
    }
  end

  let(:payment_intent) { instance_double(Stripe::PaymentIntent) }

  before do
    allow(Stripe::PaymentIntent).to receive(:create).and_return(payment_intent)
  end

  it 'creates a donation' do
    expect { result }.to change(Donation, :count).by(1)
  end

  it 'gives the right metadata to the payment intent' do
    result
    expect(Stripe::PaymentIntent)
      .to have_received(:create)
      .with(a_hash_including(metadata: { donation_id: result.donation.to_param }))
  end
end
