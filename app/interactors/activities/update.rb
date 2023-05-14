module Activities
  class Update < ApplicationInteractor
    delegate :activity, to: :context

    def call
      authorize! activity, to: :update?
      activity.transaction do
        assign_cast(attributes.delete(:profile_ids)) if attributes.key?(:profile_ids)
        activity.assign_attributes(attributes)
        activity.save!
      end
    end

    def attributes
      @attributes ||= ActionController::Parameters
        .new(context[:attributes].to_h)
        .permit(:name, :slug, :description, profile_ids: [])
    end

    private

    def assign_cast(ids)
      ids = Profile.decode_id(ids, fallback: true)
      add_new_cast(ids)
      delete_old_cast(ids)
    end

    def add_new_cast(ids)
      role = activity.valid_cast_roles.first
      ids.each do |profile_id|
        activity.cast.create_or_find_by(profile_id:, role:)
      end
    end

    def delete_old_cast(ids)
      activity.cast.where.not(profile_id: ids).destroy_all
    end
  end
end
