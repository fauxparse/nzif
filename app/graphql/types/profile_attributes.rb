module Types
  class ProfileAttributes < PersonAttributes
    argument :email, String, required: false
  end
end
