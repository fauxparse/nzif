# frozen_string_literal: true

module Types
  class WorkshopType < Types::BaseObject
    implements Types::ActivityType

    description 'A workshop'
  end
end
