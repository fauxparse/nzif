module Types
  class ActivityPictureType < Types::BaseObject
    field :blurhash, String, null: false
    field :id, GraphQL::Types::ID, null: false

    ActivityPictureUploader::SIZES.each do |size, (width, height)|
      field size, String, null: false, description: "#{width}x#{height}"

      define_method size do
        object.picture(size).url
      end
    end
  end
end
