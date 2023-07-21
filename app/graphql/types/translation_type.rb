module Types
  class TranslationType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false, method: :english
    field :traditional_name, String, null: false, method: :traditional

    delegate :id, to: :object
  end
end
