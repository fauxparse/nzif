module Activities
  class Update < ApplicationInteractor
    delegate :activity, to: :context

    def call
      authorize! activity, to: :update?
      activity.transaction do
        Rails.logger.info attributes.inspect
        assign_attributes
        activity.save!
      end
    end

    def attributes
      @attributes ||= context[:attributes].to_h
    end

    private

    def assign_attributes
      assign_cast(attributes.delete(:profile_ids)) if attributes.key?(:profile_ids)
      if attributes.key?(:attached_activity_id)
        assign_attached_activity(attributes.delete(:attached_activity_id))
      end
      activity.assign_attributes(attributes)
    end

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

    def assign_attached_activity(id)
      return unless activity.respond_to?(:show_workshop)

      activity.show_workshop&.destroy

      return if id.blank?

      case activity
      when Show then activity.create_show_workshop!(workshop: Workshop.find(id))
      when Workshop then activity.create_show_workshop!(show: Show.find(id))
      end
    end
  end
end
