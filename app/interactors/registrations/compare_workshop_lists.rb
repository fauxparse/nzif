module Registrations
  class CompareWorkshopLists < ApplicationInteractor
    delegate :registration, to: :context

    def call
      skip_authorization!

      context.added = differences[:added]
      context.removed = differences[:removed]
    end

    def snapshots
      @snapshots ||= registration
        .snapshots
        .order(created_at: :desc)
        .limit(2)
        .map do |snapshot|
          _, children = snapshot.fetch_reified_items
          children[:sessions] || []
        end
        .reverse
    end

    def differences
      @differences ||=
        case snapshots.length
        when 0 then { added: [], removed: [] }
        when 1 then { added: snapshots.first, removed: [] }
        else difference_between(snapshots.first, snapshots.second)
        end
    end

    def difference_between(old, new)
      old_ids = Set.new(old.map(&:id))
      new_ids = Set.new(new.map(&:id))
      {
        added: new.reject { |placement| old_ids.include?(placement.id) },
        removed: old.reject { |placement| new_ids.include?(placement.id) },
      }
    end
  end
end
