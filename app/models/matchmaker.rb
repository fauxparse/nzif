require_relative 'matchmaker/allocation'
require_relative 'matchmaker/candidate'
require_relative 'matchmaker/registration'
require_relative 'matchmaker/session'

module Matchmaker
  def self.allocate(festival:, seed: Random.new_seed, capacity: nil)
    Allocation.from_festival(festival).allocate!
  end
end
