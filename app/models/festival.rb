class Festival < ApplicationRecord
  validates :start_date, presence: true
  validates :end_date, presence: true, date: { after: :start_date, same_year: :start_date }
  validates :year, uniqueness: { conditions: -> { with_year } }

  # Adds a fake year column so we can query on it
  def self.with_year
    from <<~SQL.squish
      (SELECT *, EXTRACT(YEAR FROM start_date) AS year FROM #{table_name}) AS #{table_name}
    SQL
  end

  def self.by_year(year)
    date = Date.new(year.to_i, 1, 1)
    where(start_date: date...(date + 1.year))
  end

  def self.upcoming
    where('start_date > ?', Time.zone.today)
  end

  def self.finished
    where('end_date < ?', Time.zone.today)
  end

  def self.happening
    where('start_date <= ? AND end_date >= ?', Time.zone.today, Time.zone.today)
  end

  delegate :year, to: :start_date

  alias to_param year

  def state
    return :upcoming if start_date.future?
    return :finished if end_date.past?

    :happening
  end
end
