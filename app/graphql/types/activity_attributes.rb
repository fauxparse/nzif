module Types
  class ActivityAttributes < BaseInputObject
    argument :attached_activity_id, ID, required: false
    argument :description, String, required: false
    argument :name, String, required: false
    argument :picture, ApolloUploadServer::Upload, required: false
    argument :profile_ids, [ID], required: false
    argument :slug, String, required: false
    argument :suitability, String, required: false
  end
end
