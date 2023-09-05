require 'rails_helper'

RSpec.describe Allocation do
  subject(:allocation) { create(:allocation, festival:) }

  let!(:festival) do
    create(:festival, :with_workshops, :with_registrations, workshop_days: 3)
  end

  it 'doesn’t put people on the waitlist for a session they’re in' do
    allocation.data.sessions.each_value do |session|
      placements = session.placements.map(&:id)
      waitlist = session.waitlist.map(&:id)
      expect(placements.intersection(waitlist)).to be_empty
    end
  end
end
