module Activities
  class Rename < ApplicationInteractor
    delegate :activity, :name, to: :context

    def call
      authorize! activity, to: :update?
      assign_name
      activity.save!
    end

    def assign_name
      activity.name = name
      activity.slug = name.to_url if activity.slug == activity.name_was.to_url
    end
  end
end
