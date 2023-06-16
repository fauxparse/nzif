module Activities
  class Create < ApplicationInteractor
    delegate :activity_type, :festival, :session, to: :context

    validates :activity_type, inclusion: { in: Activity.descendants }

    def call
      authorize! activity, to: :create?
      assign_cast
      activity.save!
      session&.update!(activity:)
    end

    def activity
      @context[:activity] ||= activity_type.new(festival:, **attributes.except(:profile_ids))
    end

    def attributes
      @attributes ||= ActionController::Parameters
        .new(context[:attributes].to_h)
        .permit(:name, :slug, :description, profile_ids: [])
    end

    def assign_cast
      return if attributes[:profile_ids].blank?

      role = activity.valid_cast_roles.first
      Profile.find(attributes[:profile_ids]).each do |profile|
        activity.cast.build(profile:, role:)
      end
    end
  end
end
