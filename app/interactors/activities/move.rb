module Activities
  class Move < ApplicationInteractor
    delegate :activity, :slug, to: :context

    def call
      authorize! activity, to: :update?
      activity.update!(slug:)
    end
  end
end
