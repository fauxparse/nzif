module Sources
  class Slots < BaseSource
    def fetch(ids)
      models = ::Slot.where(starts_at: ids).all.index_by(&:to_param)
      ids.map { |id| models[Time.zone.parse(id.to_s).iso8601] }
    end
  end
end
