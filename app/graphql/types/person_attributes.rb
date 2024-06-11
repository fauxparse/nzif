module Types
  class PersonAttributes < BaseInputObject
    argument :bio, String, required: false
    argument :city, CityAttributes, required: false
    argument :name, String, required: false
    argument :phone, String, required: false
    argument :picture, ApolloUploadServer::Upload, required: false
    argument :pronouns, String, required: false
  end
end
