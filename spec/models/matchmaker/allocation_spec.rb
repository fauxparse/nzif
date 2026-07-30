require 'rails_helper'

RSpec.describe Matchmaker::Allocation do
  subject(:allocation) { build_allocation(sessions:, registrations:).allocate! }

  let(:sessions) do
    [
      session_json(id: 'A', capacity: 1),
      session_json(id: 'B', capacity: 1),
    ]
  end

  let(:registrations) do
    [
      registration_json(id: 'R1', preferences: { MatchmakerHelper::SLOT_AM => { 1 => 'A', 2 => 'B' } }),
      registration_json(id: 'R2', preferences: { MatchmakerHelper::SLOT_AM => { 1 => 'A', 2 => 'B' } }),
    ]
  end

  it 'never exceeds a session’s capacity' do
    allocation.sessions.each_value do |session|
      expect(session.placements.size).to be <= session.capacity
    end
  end

  it 'places every registration in at most one session per slot' do
    allocation.registrations.each_value do |registration|
      by_slot = registration.placements.group_by { |slot, _| slot }
      expect(by_slot.values).to all(satisfy(&:one?))
    end
  end

  it 'places or waitlists every registration that expressed a preference' do
    requested = allocations_with_preferences(allocation)

    allocation.sessions.values.group_by(&:starts_at).each_value do |group|
      allocated = Set.new(group.flat_map { |s| s.placements.map(&:id) + s.waitlist.map(&:id) })
      expect(allocated).to include(*requested[group.first.slots.first])
    end
  end

  it 'does not place a registration in a session they did not prefer' do
    allocation.sessions.each_value do |session|
      expect(session.placements).to all(prefer(session))
    end
  end

  it 'never has the same registration placed and waitlisted in the same session' do
    allocation.sessions.each_value do |session|
      placed = Set.new(session.placements.map(&:id))
      waitlisted = Set.new(session.waitlist.map(&:id))
      expect(placed.intersection(waitlisted)).to be_empty
    end
  end

  describe '.dump/.load' do
    subject(:round_tripped) { described_class.load(described_class.dump(allocation)) }

    it 'preserves the placements and waitlists of every session' do
      allocation.sessions.each_value do |session|
        reloaded = round_tripped.sessions[session.id]
        expect(reloaded.placements.map(&:id)).to eq(session.placements.map(&:id))
        expect(reloaded.waitlist.map(&:id)).to eq(session.waitlist.map(&:id))
      end
    end

    it 'preserves the preferences of every registration' do
      allocation.registrations.each_value do |registration|
        reloaded = round_tripped.registrations[registration.id]
        expect(reloaded.preferences).to eq(registration.preferences)
      end
    end
  end

  describe '#score' do
    subject(:score) { allocation.score }

    it { is_expected.to be_between(0, 1) }
  end

  private

  def allocations_with_preferences(allocation)
    allocation
      .registrations
      .values
      .flat_map { |r| r.preferences.keys.map { |slot| [slot, r.id] } }
      .group_by(&:first)
      .transform_values { |pairs| pairs.map(&:last) }
  end
end
