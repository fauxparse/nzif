require 'rails_helper'

RSpec.describe Session do
  subject(:session) { build(:session, festival:, venue:) }

  let(:festival) { create(:festival) }
  let(:venue) { create(:venue) }

  it { is_expected.to be_valid }

  describe '#activity_type' do
    subject(:activity_type) { session.activity_type }

    it { is_expected.to eq Workshop }
  end

  context 'when the start time is before the start date of the festival' do
    before do
      session.starts_at = (session.festival.start_date - 1.day).beginning_of_day
    end

    it { is_expected.not_to be_valid }
  end

  context 'when the end time is after the end date of the festival' do
    before do
      session.ends_at = (session.festival.end_date + 2.days).beginning_of_day
    end

    it { is_expected.not_to be_valid }
  end

  context 'with a bad activity type' do
    it 'raises an error' do
      expect { session.activity_type = 'Prank' }.to raise_error(/not a valid activity_type/)
    end
  end

  context 'when there is another activity overlapping' do
    before do
      create(
        :session,
        festival:,
        venue:,
        activity_type: Workshop,
        starts_at: session.starts_at - 1.hour,
        ends_at: session.ends_at - 1.hour,
      )
    end

    it { is_expected.not_to be_valid }
  end

  context 'with an activity' do
    subject(:session) { build(:session, festival:, venue:, activity:) }

    let(:activity) { create(:workshop, festival:) }

    it { is_expected.to be_valid }

    context 'when the activity type doesn’t match the session' do
      let(:activity) { create(:show, festival:) }

      it { is_expected.not_to be_valid }
    end

    context 'when the activity is set to nil' do
      before do
        session.save!
      end

      it 'nullifies the activity' do
        expect { session.update!(activity: nil) }.to change { session.reload.activity }.to(nil)
      end

      it 'does not nullify the activity type' do
        expect { session.update!(activity: nil) }.not_to change { session.reload.activity_type }
      end
    end

    context 'when the activity is deleted' do
      before do
        session.save!
      end

      it 'nullifies the activity' do
        expect { activity.destroy! }.to change { session.reload.activity }.to(nil)
      end

      it 'does not nullify the activity type' do
        expect { activity.destroy! }.not_to change { session.reload.activity_type }
      end
    end
  end

  describe '.activity_type_values' do
    subject(:activity_type_values) { described_class.activity_type_values }

    it { is_expected.to eq %i[Workshop Show SocialEvent] }
  end
end
