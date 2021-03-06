module Types
  module Activity
    include Types::BaseInterface

    field :id, ID, null: false
    field :name, String, null: false
    field :type, ActivityType, null: false
    field :slug, String, null: false
    field :description, String, null: true
    field :festival, Types::Festival, null: false
    field :url, String, null: false
    field :associated, [Types::Activity], null: false
    field :sessions, [Types::Session], null: false
    field :presenters, [Types::User], null: false
    field :image, ActivityImage, null: true

    def resolve_type(object, context)
      case object
      when Workshop then Types::Workshop.graphql_definition
      when Show then Types::Show.graphql_definition
      when SocialEvent then Types::SocialEvent.graphql_definition
      when Forum then Types::Forum.graphql_definition
      else
        raise "Unexpected object: #{object.inspect}"
      end
    end

    def id
      object.id
    end

    def presenters
      object.presenters.includes(:user).map(&:user)
    end

    def image
      object.image.attached? ? AttachedImage.new(object.image) : nil
    end

    def sessions
      object.sessions.includes(:venue).order(starts_at: :asc)
    end
  end
end
