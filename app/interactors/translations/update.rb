module Translations
  class Update < ApplicationInteractor
    delegate :id, :name, :traditional_name, :country, to: :context

    def call
      update_translations

      I18n.backend.backends.first.reload!

      context[:translation] = Hashie::Mash.new({ id:, name:, traditional_name:, country: })
    end

    def update_translations
      PlaceNameTranslation.locales(country).each do |locale|
        translation = PlaceNameTranslation.find_by(key: id, locale:)
        next unless translation

        authorize! translation, to: :create?
        translation.update!(value: locale == 'en' ? name : traditional_name)
      end
    end
  end
end
