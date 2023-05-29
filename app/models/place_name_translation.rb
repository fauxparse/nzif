class PlaceNameTranslation < ApplicationRecord
  self.table_name = 'translations'

  serialize :value

  class << self
    def available_locales
      pluck(:locale).uniq
    end

    def key_for(name)
      name.to_url(replace_whitespace_with: '_')
    end

    def locales(country)
      country.languages_spoken.dup.tap do |locales|
        locales << "en-#{country.alpha2}" unless locales.many?
      end
    end
  end
end
