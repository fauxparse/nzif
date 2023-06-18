class Festival < ApplicationRecord
  has_many :activities, dependent: :destroy
  has_many :sessions, dependent: :destroy
  has_many :slots # rubocop:disable Rails/HasManyOrHasOneDependent

  Activity.descendants.each do |activity_type|
    has_many :"#{activity_type.name.underscore.pluralize}",
      -> { by_type(activity_type) },
      class_name: activity_type.name.to_s,
      dependent: :destroy,
      inverse_of: :festival
  end

  validates :start_date, presence: true
  validates :end_date, presence: true, date: { after: :start_date, same_year: :start_date }
  validates :year, uniqueness: { conditions: -> { with_year } }

  def self.find(year)
    by_year(year).first!
  end

  # Adds a fake year column so we can query on it
  def self.with_year
    from <<~SQL.squish
      (SELECT *, EXTRACT(YEAR FROM start_date) AS year FROM #{table_name}) AS #{table_name}
    SQL
  end

  def self.by_year(year)
    with_year.where(year:)
  end

  def self.upcoming
    where('end_date > ?', Time.zone.today).order(start_date: :asc)
  end

  def self.finished
    where('end_date < ?', Time.zone.today)
  end

  def self.happening
    where('start_date <= ? AND end_date >= ?', Time.zone.today, Time.zone.today)
  end

  delegate :year, to: :start_date

  def to_param
    year.to_s
  end

  def state
    return :upcoming if start_date.future?
    return :finished if end_date.past?

    :happening
  end
end
