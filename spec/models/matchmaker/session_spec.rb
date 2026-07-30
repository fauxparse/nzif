require 'rails_helper'

RSpec.describe Matchmaker::Session do
  subject(:session) { allocation.sessions['A'] }

  let(:allocation) do
    build_allocation(
      sessions: [
        session_json(id: 'A', capacity: 1),
        session_json(id: 'B', capacity: 1),
      ],
      registrations: [
        registration_json(id: 'R1', preferences: { MatchmakerHelper::SLOT_AM => { 1 => 'A', 2 => 'B' } }),
        registration_json(id: 'R2', preferences: { MatchmakerHelper::SLOT_AM => { 1 => 'A', 2 => 'B' } }),
      ],
    )
  end

  let(:first_registration) { allocation.registrations['R1'] }
  let(:second_registration) { allocation.registrations['R2'] }

  describe '#place' do
    it 'places a registration within capacity' do
      session.place(first_registration)
      expect(session.placements.map(&:id)).to eq(['R1'])
    end

    it 'removes the registration from the waitlist when placed' do
      session.waitlist << first_registration
      session.place(first_registration)
      expect(session.waitlist).to be_empty
    end

    it 'is a no-op when the registration is already placed' do
      session.place(first_registration)
      expect { session.place(first_registration) }.not_to(change { session.placements.map(&:id) })
    end

    context 'when the session is over capacity' do
      before do
        session.place(first_registration)
        session.place(second_registration)
      end

      it 'keeps only `capacity` placements' do
        expect(session.placements.size).to eq(session.capacity)
      end

      it 'moves the bumped registration onto the waitlist' do
        bumped = first_registration.id == session.placements.first.id ? second_registration : first_registration
        expect(session.waitlist.map(&:id)).to contain_exactly(bumped.id)
      end
    end
  end

  describe '#remove' do
    before { session.place(first_registration) }

    it 'removes the registration from the session' do
      expect { session.remove(first_registration) }
        .to change { session.placements.map(&:id) }.from(['R1']).to([])
    end

    it 'lets the registration be placed again afterwards' do
      session.remove(first_registration)
      expect { session.place(first_registration) }
        .to change { session.placements.map(&:id) }.to(['R1'])
    end
  end

  describe '#conflicts_with?' do
    let(:other) { allocation.sessions['B'] }

    it { is_expected.to be_conflicts_with(other) }

    context 'with a session in a different slot' do
      let(:allocation) do
        build_allocation(
          sessions: [
            session_json(id: 'A', capacity: 1, slots: [MatchmakerHelper::SLOT_AM]),
            session_json(id: 'B', capacity: 1, slots: [MatchmakerHelper::SLOT_PM],
              starts_at: MatchmakerHelper::STARTS_AT_PM),
          ],
          registrations: [
            registration_json(id: 'R1', preferences: { MatchmakerHelper::SLOT_AM => { 1 => 'A' } }),
          ],
        )
      end

      it { is_expected.not_to be_conflicts_with(other) }
    end
  end
end
