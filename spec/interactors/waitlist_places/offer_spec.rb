require 'rails_helper'

RSpec.describe WaitlistPlaces::Offer, type: :interactor do
  let(:waitlist) { create(:waitlist) }
  let(:context) { { waitlist: } }

  before do
    freeze_time
  end

  after do
    unfreeze_time
  end

  its(:short_url) { is_expected.to match %r{\Ahttps://nzif\.in/\w+\z} }

  it 'updates the offered_at' do
    expect { result }.to change { waitlist.reload.offered_at }.from(nil).to(Time.zone.now)
  end
end
