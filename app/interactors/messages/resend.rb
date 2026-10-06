module Messages
  class Resend < ApplicationInteractor
    delegate :message, to: :context
    delegate :messageable, to: :message

    def call
      authorize! messageable, to: :message?

      perform(
        Messages::Send,
        message:,
        recipients: messageable.message_recipients,
      )
    end
  end
end
