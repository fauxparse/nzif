module Sources
  class AssociatedWorkshop < BaseSource
    def fetch(show_ids)
      records = ShowWorkshop
        .includes(:workshop)
        .where(show_id: show_ids)
        .to_h { |sw| [sw.show_id, sw.workshop] }

      show_ids.map { |id| records[id] }
    end
  end
end
