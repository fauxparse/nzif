module Activities
  class Create < ApplicationInteractor
    include Interactor

    delegate :activity_type, :festival, :slot, to: :context

    validates :activity_type, inclusion: { in: Activity.descendants }

    def call
      authorize! activity, to: :create?
      activity.save!
      slot&.update!(activity:)
    end

    def activity
      @context[:activity] ||= activity_type.new(festival:, **attributes)
    end

    def attributes
      ActionController::Parameters
        .new(context[:attributes].to_h)
        .permit(:name, :slug, :description)
    end
  end
end
