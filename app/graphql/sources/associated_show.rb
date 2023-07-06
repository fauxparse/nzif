module Sources
  class AssociatedShow < BaseSource
    def fetch(workshop_ids)
      records = ShowWorkshop
        .includes(:show)
        .where(workshop_id: workshop_ids)
        .to_h { |sw| [sw.workshop_id, sw.show] }

      workshop_ids.map { |id| records[id] }
    end
  end
end
