require 'rails_helper'

RSpec.describe Registrations::UpdateUserDetails, type: :interactor do
  let(:context) { { registration:, attributes: } }
  let(:registration) { create(:registration) }
  let(:profile) { registration.profile }
  let(:user) { registration.user }
  let(:attributes) do
    {
      name: 'New Name',
      email: 'new@example.com',
      pronouns: 'xhe/xher',
      city: 'New City',
      country: 'FR',
      phone: '1234567890',
      code_of_conduct_accepted_at: Time.zone.now,
    }
  end

  around do |example|
    freeze_time do
      example.call
    end
  end

  def update
    result
    registration.reload
    profile.reload
    user.reload
  end

  describe '.call' do
    context 'when not logged in' do
      let(:registration) { create(:registration) }

      let(:current_user) { nil }

      it 'is unauthorized' do
        expect { update }.to be_unauthorized
      end
    end

    context 'when logged in as the registered user' do
      let(:current_user) { registration.user }

      it { is_expected.to be_success }

      it 'updates the user details' do
        expect { update }
          .to change(user, :name).to('New Name')
          .and change(user, :email).to('new@example.com')
      end

      it 'updates the profile details' do
        expect { update }
          .to change(profile, :name).to('New Name')
          .and change(profile, :pronouns).to('xhe/xher')
          .and change(profile, :city).to('New City')
          .and change(profile, :country).to(ISO3166::Country['FR'])
          .and change(profile, :phone).to('1234567890')
      end

      it 'updates the registration details' do
        expect { update }
          .to change(registration, :code_of_conduct_accepted_at).to(Time.zone.now)
      end
    end

    context 'when logged in as a registration manager' do
      let(:current_user) { create(:user, permissions: %i[registrations]) }

      it { is_expected.to be_success }
    end

    context 'when logged in as an admin' do
      let(:current_user) { create(:admin) }

      it { is_expected.to be_success }
    end
  end
end
