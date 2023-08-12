module Types
  class WorkshopStatType < BaseObject
    field :counts, [Integer], null: false
    field :id, ID, null: false
  end
end
