class Allocation < ApplicationRecord
  belongs_to :festival

  serialize :data, coder: Matchmaker::Allocation

  def completed?
    completed_at?
  end
end
