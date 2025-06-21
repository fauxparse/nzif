module Profiles
  class Merge < ApplicationInteractor
    delegate :profiles, to: :context

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

    def attributes
      context[:attributes] ||= merged_attributes
    end

    private

    def validate!
      context.fail!(error: 'requires multiple profiles') \
        unless profiles.many?

      context.fail!(error: 'multiple profiles have users attached') \
        if profiles.many?(&:user_id?)

      authorize! profile, to: :update?
    end

    def transformed_attributes
      attributes
        .merge(
          user_id: profiles.find(&:user_id?)&.user_id,
          picture: profiles.map(&:picture).detect(&:present?),
          bio: profiles.map(&:bio).detect(&:present?),
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
          .where(profile_id: profiles.map(&:id))
          .find_each { |record| record.update!(profile_id: profile.id) }
      end
    end

    def delete_old_profiles
      profiles.reject { |p| p.id == profile.id }.each(&:destroy!)
    end

    ATTRIBUTES_TO_MERGE = %i[name pronouns city country phone].freeze

    def merged_attributes
      ATTRIBUTES_TO_MERGE.index_with do |attribute|
        profiles.map { |p| p.send(attribute) }.compact_blank.first
      end
    end
  end
end
