module Profiles
  class Merge < ApplicationInteractor
    delegate :attributes, to: :context

    def call
      validate!

      Profile.transaction do
        profile.update!(transformed_attributes)
        update_references
        delete_old_profiles
      end
    end

    def profile
      context[:profile] ||= Profile.new
    end

    def profiles
      @profiles ||= context[:profiles].index_by(&:to_param)
    end

    private

    def validate!
      context.fail!(error: 'requires multiple profiles') \
        unless profiles.many?

      context.fail!(error: 'multiple profiles have users attached') \
        if profiles.values.many?(&:user_id?)

      authorize! profile, to: :update?
    end

    def transformed_attributes
      attributes
        .to_h { |key, value| [key, profiles[value].send(key)] }
        .merge(
          user_id: profiles.values.find(&:user_id?)&.user_id,
          picture: profiles.values.map(&:picture).detect(&:present?),
          bio: profiles.values.map(&:bio).detect(&:present?),
        )
    end

    def models_to_update
      [
        Cast,
      ]
    end

    def update_references
      models_to_update.each do |model|
        model
          .where(profile_id: profiles.values.map(&:id))
          .find_each { |record| record.update!(profile_id: profile.id) }
      end
    end

    def delete_old_profiles
      profiles.values.reject { |p| p.id == profile.id }.each(&:destroy!)
    end
  end
end
