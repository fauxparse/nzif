require 'rails_helper'

RSpec.describe Matchmaker::SortedList do
  subject(:list) { session.placements }

  let(:allocation) do
    build_allocation(
      sessions: [session_json(id: 'A', capacity: 5)],
      registrations: [
        registration_json(id: 'R1', preferences: { MatchmakerHelper::SLOT_AM => { 1 => 'A' } }),
        registration_json(id: 'R2', preferences: { MatchmakerHelper::SLOT_AM => { 1 => 'A' } }),
      ],
    )
  end

  let(:session) { allocation.sessions['A'] }
  let(:r1) { allocation.registrations['R1'] }
  let(:r2) { allocation.registrations['R2'] }

  before do
    session.place(r1)
    session.place(r2)
  end

  describe '#pop' do
    it 'removes and returns the highest-scoring registration' do
      # Both are first choices and score equally, so ordering falls back to id.
      popped = list.pop
      remaining = list.map(&:id)
      expect([popped.id] + remaining).to contain_exactly('R1', 'R2')
    end

    it 'shrinks the list' do
      expect { list.pop }.to change { list.size }.by(-1)
    end
  end

  describe '#delete' do
    it 'removes a registration matched by id' do
      expect { list.delete(r1) }.to change { list.map(&:id) }.from(%w[R1 R2]).to(%w[R2])
    end
  end
end
