# frozen_string_literal: true

module Types
  class FeedbackType < Types::BaseObject
    field :id, ID, null: false
    field :registration, RegistrationType, null: false
    field :session, SessionType, null: false

    field :constructive, String, null: false
    field :positive, String, null: false
    field :rating, Integer, null: true
    field :testimonial, String, null: false

    def registration
      dataloader
        .with(Sources::Simple, context:, model: Registration)
        .load(object.registration_id)
    end

    def session
      dataloader
        .with(Sources::Simple, context:, model: Session)
        .load(object.session_id)
    end

    def positive
      object.positive || ''
    end

    def constructive
      object.constructive || ''
    end

    def testimonial
      object.testimonial || ''
    end
  end
end
