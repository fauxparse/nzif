module Messages
  class SendExisting < ApplicationInteractor
    delegate :messageable, to: :context

    def call
      authorize! messageable, to: :message?

      messageable.messages.each do |message|
        perform(Messages::Send, message:)
      end
    end
  end
end
