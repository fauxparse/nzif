require 'rails_helper'

RSpec.describe Matchmaker::Registration do
  subject(:registration) { allocation.registrations['R1'] }

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

  let(:session_a) { allocation.sessions['A'] }
  let(:session_b) { allocation.sessions['B'] }

  describe '#score' do
    it 'is zero before any placements' do
      expect(registration.score).to eq(0)
    end

    it 'is one when every placement is a first choice' do
      session_a.place(registration)
      expect(registration.score).to eq(1)
    end

    it 'is less than one when placed in a lower preference' do
      session_b.place(registration)
      expect(registration.score).to be < 1
    end
  end

  describe '#preference_for' do
    it 'returns the position for a preferred session' do
      expect(registration.preference_for(session_a)).to eq(1)
      expect(registration.preference_for(session_b)).to eq(2)
    end

    it 'is nil for a session the registration did not rank' do
      unranked = allocation.sessions['A']
      registration.preferences[MatchmakerHelper::SLOT_AM].delete(1)
      expect(registration.preference_for(unranked)).to be_nil
    end
  end

  describe '#prefers?' do
    it 'is true for ranked sessions and false otherwise' do
      expect(registration).to prefer(session_a)
      expect(registration).to prefer(session_b)
    end
  end

  describe '#candidates' do
    it 'builds one candidate per slot' do
      expect(registration.candidates.keys).to contain_exactly(MatchmakerHelper::SLOT_AM)
    end
  end

  describe '#placed_in / #bump_from' do
    it 'records and clears a placement' do
      expect { registration.placed_in(session_a) }
        .to change { registration.placements.key?(MatchmakerHelper::SLOT_AM) }.from(false).to(true)

      expect { registration.bump_from(session_a) }
        .to change { registration.placements.key?(MatchmakerHelper::SLOT_AM) }.from(true).to(false)
    end
  end

  describe '#<=>' do
    subject(:order) { [r_low, r_high].sort }

    let(:r_high) { allocation.registrations['R1'] }
    let(:r_low) { allocation.registrations['R2'] }

    let(:allocation) do
      build_allocation(
        sessions: [
          session_json(id: 'A', capacity: 5),
          session_json(id: 'B', capacity: 5),
        ],
        registrations: [
          registration_json(id: 'R1', preferences: { MatchmakerHelper::SLOT_AM => { 1 => 'A', 2 => 'B' } }),
          registration_json(id: 'R2', preferences: { MatchmakerHelper::SLOT_AM => { 1 => 'A', 2 => 'B' } }),
        ],
      )
    end

    before do
      # R1 lands a first choice (score 1); R2 only a second choice (score < 1).
      allocation.sessions['A'].place(r_high)
      allocation.sessions['B'].place(r_low)
    end

    it 'ranks higher-scoring registrations last (so #pop removes them)' do
      expect(order).to eq([r_low, r_high])
    end
  end
end
