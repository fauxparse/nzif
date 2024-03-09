module Types
  class ActivityCountType < Types::BaseObject
    field :count, Integer, null: false
    field :id, Types::ActivityTypeType, null: false, hash_key: :type

    def count
      dataloader
        .with(Sources::ActivityCounts, context:, festival: object[:festival])
        .load(object[:type])
    end
  end
end
