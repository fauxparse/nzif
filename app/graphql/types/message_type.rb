# frozen_string_literal: true

module Types
  class MessageType < Types::BaseObject
    field :content, String
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :id, ID, null: false
    field :sender, Types::UserType, null: false
    field :subject, String

    def sender
      dataloader
        .with(Sources::Simple, context:, model: User)
        .load(object.sender_id)
    end
  end
end
