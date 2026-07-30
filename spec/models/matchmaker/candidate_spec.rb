require 'rails_helper'

RSpec.describe Matchmaker::Candidate do
  subject(:candidate) { registration.candidates[MatchmakerHelper::SLOT_AM] }

  let(:allocation) do
    build_allocation(
      sessions: [
        session_json(id: 'A', capacity: 5),
        session_json(id: 'B', capacity: 5),
      ],
      registrations: [
        registration_json(id: 'R1', preferences: { MatchmakerHelper::SLOT_AM => { 1 => 'A', 2 => 'B' } }),
      ],
    )
  end

  let(:registration) { allocation.registrations['R1'] }
  let(:session_a) { allocation.sessions['A'] }
  let(:session_b) { allocation.sessions['B'] }

  its(:session_id) { is_expected.to eq('A') }
  its(:slot) { is_expected.to eq(MatchmakerHelper::SLOT_AM) }

  describe '#next_session' do
    it 'returns the highest-ranked session by default' do
      expect(candidate.next_session).to eq(session_a)
    end

    context 'when bumped off the first choice' do
      before { candidate.bump(session_a) }

      it 'moves on to the next preference' do
        expect(candidate.next_session).to eq(session_b)
      end
    end
  end

  describe '#bump' do
    it 'advances to the next preference for the given session' do
      expect { candidate.bump(session_a) }
        .to change(candidate, :session_id).from('A').to('B')
    end

    it 'returns nil when there are no further preferences' do
      candidate.bump(session_a)
      expect(candidate.bump(session_b)).to be_nil
    end

    it 'is unaffected by bumping a different session' do
      expect { candidate.bump(session_b) }.not_to change(candidate, :session_id)
    end
  end
end
