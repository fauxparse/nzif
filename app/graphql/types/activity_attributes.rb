module Types
  class ActivityAttributes < BaseInputObject
    argument :attached_activity_id, ID, required: false
    argument :booking_link, String, required: false
    argument :description, String, required: false
    argument :name, String, required: false
    argument :picture, ApolloUploadServer::Upload, required: false
    argument :picture_alt_text, String, required: false
    argument :profile_ids, [ID], required: false
    argument :quotes, String, required: false
    argument :slug, String, required: false
    argument :suitability, String, required: false
    argument :uploaded_picture, Types::UploadedFile, required: false
  end
end
