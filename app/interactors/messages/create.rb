module Messages
  class Create < ApplicationInteractor
    delegate :messageable, :subject, :content, to: :context

    def call
      authorize! messageable, to: :message?
      context.message =
        messageable.messages.create!(sender: current_user, subject:, content:)
    end
  end
end
