require 'rails_helper'

RSpec.describe SMS::StandardisePhoneNumber do
  let(:context) { { phone_number: } }

  context 'with a New Zealand number' do
    let(:phone_number) { '027 368 3595' }

    its(:phone_number) { is_expected.to eq('+64273683595') }
  end

  context 'with an American number' do
    let(:phone_number) { '+1 (919) 360-2699' }

    its(:phone_number) { is_expected.to eq('+19193602699') }
  end
end
