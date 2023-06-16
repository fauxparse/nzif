module Types
  class TimetableType < Types::BaseObject
    field :id, ID, null: false
    field :sessions, [SessionType], null: false
  end
end
