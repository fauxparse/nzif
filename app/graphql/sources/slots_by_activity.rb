module Sources
  class SlotsByActivity < BaseSource
    def fetch(activity_ids)
      records = Slot.where(activity_id: activity_ids)
      activity_ids.map { |id| records.select { |r| r.activity_id == id } }
    end
  end
end
