require 'rails_helper'

RSpec.describe Profiles::Create, type: :interactor do
  let(:attributes) do
    {
      name: 'Lauren Ipsum',
      bio:
        <<~BIO.squish,
          Strata of cigarette smoke rose from the tiers,
          drifting until it struck currents set up
          by the blowers and the robot gardener.
        BIO
      city: 'Wellington',
      country: ISO3166::Country['NZ'],
    }
  end

  let(:context) { { attributes: } }

  describe '.call' do
    context 'with valid attributes' do
      context 'as an admin user' do
        it { is_expected.to be_success }

        it do
          expect(current_user).to be_admin
        end

        it 'creates a new profile' do
          expect { result }.to change(Profile, :count).by(1)
        end
      end
    end
  end
end
