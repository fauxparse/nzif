class Allocation < ApplicationRecord
  belongs_to :festival

  def completed?
    completed_at?
  end
end
