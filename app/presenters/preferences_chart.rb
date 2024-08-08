class PreferencesChart
  attr_reader :festival

  def initialize(festival)
    @festival = festival
  end

  def as_json
    data.map do |row|
      {
        id: Session.encode_id(row.id),
        name: row.name,
        counts: row.counts.to_h,
      }
    end
  end

  private

  def data
    @data ||= WorkshopPreference.joins(:session).where(sessions: { festival_id: festival.id }).all
  end
end
