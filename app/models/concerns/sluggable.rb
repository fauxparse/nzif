module Sluggable
  extend ActiveSupport::Concern

  module ClassMethods
    def random_deduplicator
      Enumerator.new { |enum| loop { enum.yield rand(10_000..99_999) } }
    end

    def sluggable(name = :name, **options)
      acts_as_url name, sluggable_options
      auto_strip_attributes name
      validates name, :slug, presence: true
      after_validation :ensure_unique_url, if: :slug?

      acts_as_url name, sluggable_options.merge(options)
    end

    def sluggable_options
      {
        url_attribute: :slug,
        limit: 32,
        only_when_blank: true,
        duplicate_sequence: random_deduplicator,
      }
    end
  end
end
