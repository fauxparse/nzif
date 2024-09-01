require 'rails_helper'

RSpec.describe Registrations::Update do
  let(:context) { { registration:, attributes:, current_user: } }
  let(:registration) { create(:registration) }
  let(:current_user) { registration.user }
  let(:attributes) do
    { code_of_conduct_accepted: true, donate_discount: true, photo_permission: true }
  end

  it 'updates the registration' do
    expect { result.registration.reload }
      .to change(registration, :code_of_conduct_accepted?).to(true)
      .and change(registration, :donate_discount?).to(true)
      .and change(registration, :photo_permission).to(true)
  end

  context 'with a bad attribute' do
    let(:other_user) { create(:user) }
    let(:attributes) do
      { user_id: other_user.id }
    end

    it 'does not change the registration' do
      expect { result.registration.reload }
        .not_to change(registration, :user_id)
    end
  end
end
