module Types
  class FeedbackAttributes < BaseInputObject
    argument :constructive, String, required: false
    argument :positive, String, required: false
    argument :rating, Integer, required: false
    argument :testimonial, String, required: false
  end
end
