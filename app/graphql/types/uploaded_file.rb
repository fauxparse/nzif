module Types
  class UploadedFile < BaseInputObject
    argument :filename, String, required: true
    argument :id, String, required: true
    argument :mime_type, String, required: false
    argument :size, Integer, required: true
  end
end
