require_relative 'matchmaker/allocation'
require_relative 'matchmaker/candidate'
require_relative 'matchmaker/registration'
require_relative 'matchmaker/session'

module Matchmaker
  def self.allocate(festival:, _seed: Random.new_seed, _capacity: nil)
    Allocation.from_festival(festival).allocate!
  end
end
