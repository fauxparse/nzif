require 'rails_helper'

RSpec.describe Waitlist do
  subject(:waitlist) { build(:waitlist) }

  let(:session) { waitlist.session }
  let(:registration) { waitlist.registration }

  it { is_expected.to be_valid }

  context 'when the user is already on the waitlist' do
    before do
      create(:waitlist, session:, registration:)
    end

    it 'isn’t valid' do
      expect { waitlist.save! }.to raise_error(ActiveRecord::RecordNotUnique)
    end
  end

  context 'when the user is already in the workshop' do
    before do
      create(:placement, session:, registration:)
    end

    it { is_expected.not_to be_valid }
  end

  describe '#move_to' do
    subject(:waitlist) { waitlists[from - 1] }

    let(:session) { create(:session, :with_workshop) }
    let(:registrations) { create_list(:registration, 10, festival: session.festival) }
    let!(:waitlists) { registrations.map { |r| create(:waitlist, session:, registration: r) } }

    def move
      waitlist.move_to(to)
    end

    def ordering(*order)
      order.flat_map { |a| Array(a).map { |i| waitlists[i - 1] } }
    end

    context 'moving from 1 to 5' do
      let(:from) { 1 }
      let(:to) { 5 }

      it 'places the items in the correct order' do
        expect { move }
          .to change { session.waitlist.reload.all }
          .from(ordering(1..10))
          .to(ordering(2..5, 1, 6..10))
      end
    end

    context 'moving from 10 to 6' do
      let(:from) { 10 }
      let(:to) { 6 }

      it 'places the items in the correct order' do
        expect { move }
          .to change { session.waitlist.reload.all }
          .from(ordering(1..10))
          .to(ordering(1..5, 10, 6..9))
      end
    end

    context 'moving from 5 to 5' do
      let(:from) { 5 }
      let(:to) { 5 }

      it 'doesn’t move anything' do
        expect { move }.not_to change { session.waitlist.reload.all.map(&:id) }
      end
    end
  end
end
