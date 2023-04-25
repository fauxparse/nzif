module Slots
  class Destroy < ApplicationInteractor
    def call
      authorize! slot, to: :destroy?

      slot.destroy!
    end

    delegate :slot, to: :context
  end
end
