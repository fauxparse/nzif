class Slot < ApplicationRecord
  belongs_to :festival
  belongs_to :venue, optional: true

  validates :starts_at, :ends_at,
    presence: true,
    date: {
      on_or_after: -> { festival.start_date },
      on_or_before: -> { festival.end_date },
    }
  validates :ends_at, time: { after: :starts_at }
  validates :activity_type, inclusion: { in: Activity.descendants }

  def activity_type
    super.constantize
  rescue NameError
    nil
  end
end
