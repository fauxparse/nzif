class Allocation < ApplicationRecord
  belongs_to :festival

  serialize :data, Matchmaker::Allocation

  def completed?
    completed_at?
  end
end
