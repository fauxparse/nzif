class Festival < ApplicationRecord
  has_many :activities, dependent: :destroy
  has_many :sessions, dependent: :destroy
  has_many :slots # rubocop:disable Rails/HasManyOrHasOneDependent
  has_many :registrations, dependent: :destroy
  has_many :payments, through: :registrations

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

  after_commit :clear_current_cache, on: %i[create update destroy]

  def self.current
    Rails.cache.fetch(current_cache_key) do
      find(ENV['CURRENT_FESTIVAL'] || Time.zone.today.year)
    end
  end

  def self.find(year)
    by_year(year).first!
  end

  # Adds a fake year column so we can query on it.
  # Only used for the uniqueness validator on the (virtual) `year` attribute;
  # the read path (`by_year`/`find`/`current`) uses a sargable date range
  # so the `start_date` index can be used.
  def self.with_year
    from <<~SQL.squish
      (SELECT *, EXTRACT(YEAR FROM start_date) AS year FROM #{table_name}) AS #{table_name}
    SQL
  end

  def self.by_year(year)
    year = year.to_i
    where(start_date: Date.new(year, 1, 1)..Date.new(year, 12, 31))
  end

  def self.current_cache_key
    "festivals/current/#{ENV['CURRENT_FESTIVAL'] || Time.zone.today.year}"
  end

  def self.upcoming
    where("end_date > date_trunc('year', now())").order(start_date: :asc)
  end

  def self.finished
    where(end_date: ...Time.zone.today)
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

  def registration_phase
    return :pending if earlybird_opens_at&.future?
    return :earlybird if earlybird_closes_at&.future?
    return :paused unless general_opens_at&.past?
    return :general if (end_date + 1.day).future?

    :closed
  end

  def earlybird?
    registration_phase == :earlybird
  end

  def general?
    %i[general closed].include?(registration_phase)
  end

  private

  def clear_current_cache
    Rails.cache.delete(self.class.current_cache_key)
  end
end
