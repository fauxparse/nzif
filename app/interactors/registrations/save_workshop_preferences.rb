module Registrations
  class SaveWorkshopPreferences < ApplicationInteractor
    delegate :registration, :preferences, to: :context

    def call
      authorize! registration, to: :update?

      registration.transaction do
        delete_old_preferences
        build_new_preferences
        registration.save!

        Finalise.call!(registration:, current_user:) unless registration.completed?
      end
    end

    private

    def delete_old_preferences
      registration.preferences.each do |pref|
        pref.mark_for_destruction unless new_session_ids.include?(pref.session_id)
      end
    end

    def build_new_preferences
      new_preferences.each do |p|
        preference = registration.preferences.find do |pref|
          pref.session_id == p.session_id
        end || registration.preferences.build(session_id: p.session_id)
        preference.position = p.position
      end
    end

    def old_session_ids
      @old_session_ids ||= Set.new(old_preferences.map(&:session_id))
    end

    def new_preferences
      @new_preferences ||= preferences.map do |pref|
        Hashie::Mash.new(session_id: Session.decode_id(pref[:session_id]),
          position: pref[:position])
      end
    end

    def new_session_ids
      @new_session_ids ||= Set.new(new_preferences.map(&:session_id))
    end
  end
end
