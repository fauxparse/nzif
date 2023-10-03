class Feedback
  class Save < ApplicationInteractor
    delegate :registration, :session, to: :context

    def call
      authorize! feedback, to: :save?
      feedback.update!(attributes)
    end

    def feedback
      context.feedback ||=
        Feedback.find_or_initialize_by(
          registration:,
          session:,
        )
    end

    def attributes
      @attributes ||=
        ActionController::Parameters.new(context.attributes)
          .permit(:rating, :positive, :constructive, :testimonial)
    end
  end
end
