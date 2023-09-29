module Messages
  class Send < ApplicationInteractor
    delegate :message, to: :context
    delegate :messageable, to: :message

    def call
      authorize! messageable, to: :message?

      return if recipients.empty?

      SessionMailer.custom(message:, recipients:).deliver_later
      message.create_snapshot!(user: current_user)
    end

    def recipients
      context.recipients ||=
        begin
          _, children = previous_snapshot&.fetch_reified_items || [nil, {}]
          sent_ids = Set.new(children[:recipients]&.pluck(:id) || [])
          messageable.message_recipients.reject { |r| sent_ids.include?(r.id) }
        end
    end

    private

    def previous_snapshot
      @previous_snapshot ||= message.snapshots.last
    end
  end
end
